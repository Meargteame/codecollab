"""Billing service — Stripe integration"""

import asyncio
import structlog
from datetime import datetime, timezone
from uuid import UUID

import stripe
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.subscription import Subscription
from app.models.user import User

logger = structlog.get_logger()
settings = get_settings()

stripe.api_key = settings.stripe_api_key

# Map plan names to Stripe price IDs
PLAN_PRICE_MAP = {
    "pro": settings.stripe_pro_price_id,
    "enterprise": settings.stripe_enterprise_price_id,
}


class BillingError(Exception):
    pass


class BillingService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    # ------------------------------------------------------------------
    # Subscription
    # ------------------------------------------------------------------

    async def get_subscription(self, user_id: UUID) -> Subscription | None:
        """Return the active subscription for a user, or None."""
        result = await self._db.execute(
            select(Subscription)
            .where(Subscription.user_id == user_id)
            .where(Subscription.status == "active")
            .order_by(Subscription.created_at.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()

    # ------------------------------------------------------------------
    # Checkout
    # ------------------------------------------------------------------

    async def create_checkout_session(
        self,
        user_id: UUID,
        plan: str,
        success_url: str,
        cancel_url: str,
    ) -> str:
        """Create a Stripe Checkout session and return the URL."""
        if plan not in PLAN_PRICE_MAP:
            raise BillingError(f"Invalid plan: {plan}")

        price_id = PLAN_PRICE_MAP[plan]
        if not price_id:
            raise BillingError(f"Stripe price ID not configured for plan: {plan}")

        user = await self._db.get(User, user_id)
        if not user:
            raise BillingError("User not found")

        # Get or create Stripe customer
        customer_id = await self._get_or_create_customer(user)

        def _create() -> str:
            session = stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=["card"],
                line_items=[{"price": price_id, "quantity": 1}],
                mode="subscription",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={"user_id": str(user_id), "plan": plan},
            )
            return session.url

        url = await asyncio.get_event_loop().run_in_executor(None, _create)
        logger.info("checkout_session_created", user_id=str(user_id), plan=plan)
        return url

    # ------------------------------------------------------------------
    # Customer portal
    # ------------------------------------------------------------------

    async def create_portal_session(self, user_id: UUID, return_url: str) -> str:
        """Create a Stripe billing portal session and return the URL."""
        sub = await self.get_subscription(user_id)
        if not sub or not sub.stripe_customer_id:
            raise BillingError("No active subscription found")

        customer_id = sub.stripe_customer_id

        def _create() -> str:
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=return_url,
            )
            return session.url

        url = await asyncio.get_event_loop().run_in_executor(None, _create)
        logger.info("portal_session_created", user_id=str(user_id))
        return url

    # ------------------------------------------------------------------
    # Invoices
    # ------------------------------------------------------------------

    async def list_invoices(self, user_id: UUID) -> list[dict]:
        """Return invoice history for the user from Stripe."""
        sub = await self.get_subscription(user_id)
        if not sub or not sub.stripe_customer_id:
            return []

        customer_id = sub.stripe_customer_id

        def _list() -> list[dict]:
            invoices = stripe.Invoice.list(customer=customer_id, limit=20)
            return [
                {
                    "id": inv.id,
                    "amount_paid": inv.amount_paid,
                    "currency": inv.currency,
                    "status": inv.status,
                    "created": datetime.fromtimestamp(inv.created, tz=timezone.utc),
                    "invoice_pdf": inv.invoice_pdf,
                    "hosted_invoice_url": inv.hosted_invoice_url,
                    "description": inv.description,
                }
                for inv in invoices.auto_paging_iter()
            ]

        invoices = await asyncio.get_event_loop().run_in_executor(None, _list)
        return invoices

    # ------------------------------------------------------------------
    # Webhook handler
    # ------------------------------------------------------------------

    async def handle_webhook(self, payload: bytes, sig_header: str) -> None:
        """Verify and process a Stripe webhook event."""
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.stripe_webhook_secret
            )
        except stripe.error.SignatureVerificationError as exc:
            raise BillingError(f"Invalid webhook signature: {exc}") from exc

        event_type = event["type"]
        data = event["data"]["object"]

        if event_type in ("customer.subscription.created", "customer.subscription.updated"):
            await self._upsert_subscription(data)
        elif event_type == "customer.subscription.deleted":
            await self._cancel_subscription(data)
        elif event_type == "invoice.payment_succeeded":
            logger.info("invoice_payment_succeeded", invoice_id=data.get("id"))
        else:
            logger.debug("unhandled_webhook_event", event_type=event_type)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    async def _get_or_create_customer(self, user: User) -> str:
        """Return existing Stripe customer ID or create a new one."""
        # Check if user already has a customer ID in any subscription row
        result = await self._db.execute(
            select(Subscription)
            .where(Subscription.user_id == user.id)
            .where(Subscription.stripe_customer_id.isnot(None))
            .limit(1)
        )
        existing = result.scalar_one_or_none()
        if existing and existing.stripe_customer_id:
            return existing.stripe_customer_id

        def _create() -> str:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.full_name or user.email,
                metadata={"user_id": str(user.id)},
            )
            return customer.id

        return await asyncio.get_event_loop().run_in_executor(None, _create)

    async def _upsert_subscription(self, data: dict) -> None:
        """Create or update a subscription row from a Stripe subscription object."""
        stripe_sub_id = data["id"]
        customer_id = data["customer"]
        status = data["status"]
        plan = data.get("metadata", {}).get("plan", "pro")
        period_start = datetime.fromtimestamp(data["current_period_start"], tz=timezone.utc)
        period_end = datetime.fromtimestamp(data["current_period_end"], tz=timezone.utc)

        # Find the subscription row by stripe_subscription_id
        result = await self._db.execute(
            select(Subscription).where(Subscription.stripe_subscription_id == stripe_sub_id)
        )
        sub = result.scalar_one_or_none()

        if sub:
            sub.status = status
            sub.plan = plan
            sub.current_period_start = period_start
            sub.current_period_end = period_end
        else:
            # Find user by customer ID
            result2 = await self._db.execute(
                select(Subscription).where(Subscription.stripe_customer_id == customer_id).limit(1)
            )
            existing = result2.scalar_one_or_none()
            user_id = existing.user_id if existing else None

            if user_id:
                sub = Subscription(
                    user_id=user_id,
                    plan=plan,
                    status=status,
                    stripe_subscription_id=stripe_sub_id,
                    stripe_customer_id=customer_id,
                    current_period_start=period_start,
                    current_period_end=period_end,
                )
                self._db.add(sub)

        await self._db.commit()
        logger.info("subscription_upserted", stripe_sub_id=stripe_sub_id, status=status)

    async def _cancel_subscription(self, data: dict) -> None:
        """Mark a subscription as cancelled."""
        stripe_sub_id = data["id"]
        result = await self._db.execute(
            select(Subscription).where(Subscription.stripe_subscription_id == stripe_sub_id)
        )
        sub = result.scalar_one_or_none()
        if sub:
            sub.status = "canceled"
            sub.plan = "free"
            await self._db.commit()
            logger.info("subscription_cancelled", stripe_sub_id=stripe_sub_id)
