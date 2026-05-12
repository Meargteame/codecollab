"""Billing endpoints — Stripe integration"""

import structlog
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.auth import TokenPayload
from app.schemas.billing import (
    CheckoutRequest,
    CheckoutResponse,
    InvoiceItem,
    PortalResponse,
    SubscriptionResponse,
)
from app.services.billing_service import BillingError, BillingService

router = APIRouter(prefix="/billing", tags=["billing"])
logger = structlog.get_logger()


def _svc(db: AsyncSession) -> BillingService:
    return BillingService(db)


# ---------------------------------------------------------------------------
# GET /billing/subscription
# ---------------------------------------------------------------------------

@router.get("/subscription", response_model=SubscriptionResponse | None)
async def get_subscription(
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return the current user's active subscription, or null if on free plan."""
    return await _svc(db).get_subscription(current_user.sub)


# ---------------------------------------------------------------------------
# POST /billing/checkout
# ---------------------------------------------------------------------------

@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(
    body: CheckoutRequest,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a Stripe Checkout session for upgrading to a paid plan."""
    try:
        url = await _svc(db).create_checkout_session(
            user_id=current_user.sub,
            plan=body.plan,
            success_url=body.success_url,
            cancel_url=body.cancel_url,
        )
    except BillingError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        logger.error("checkout_failed", error=str(exc), exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create checkout session")
    return CheckoutResponse(checkout_url=url)


# ---------------------------------------------------------------------------
# POST /billing/portal
# ---------------------------------------------------------------------------

@router.post("/portal", response_model=PortalResponse)
async def create_portal(
    request: Request,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a Stripe billing portal session for managing/cancelling subscription."""
    return_url = str(request.base_url) + "settings?section=billing"
    try:
        url = await _svc(db).create_portal_session(
            user_id=current_user.sub,
            return_url=return_url,
        )
    except BillingError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        logger.error("portal_failed", error=str(exc), exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create portal session")
    return PortalResponse(portal_url=url)


# ---------------------------------------------------------------------------
# GET /billing/invoices
# ---------------------------------------------------------------------------

@router.get("/invoices", response_model=list[InvoiceItem])
async def list_invoices(
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return invoice history for the current user."""
    try:
        return await _svc(db).list_invoices(current_user.sub)
    except Exception as exc:
        logger.error("invoices_failed", error=str(exc), exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch invoices")


# ---------------------------------------------------------------------------
# POST /billing/webhook  (no auth — Stripe calls this directly)
# ---------------------------------------------------------------------------

@router.post("/webhook", status_code=status.HTTP_200_OK)
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Receive and process Stripe webhook events."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        await _svc(db).handle_webhook(payload, sig_header)
    except BillingError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        logger.error("webhook_failed", error=str(exc), exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Webhook processing failed")

    return {"received": True}
