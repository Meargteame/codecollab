"""Contact form endpoint — POST /api/v1/contact"""

import asyncio
import structlog
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

from app.config import get_settings
from app.services.email_service import EmailService

router = APIRouter(prefix="/contact", tags=["contact"])
logger = structlog.get_logger()


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


@router.post("", status_code=status.HTTP_200_OK)
async def send_contact_message(payload: ContactRequest) -> dict:
    """Receive a contact form submission and forward it via email.

    No authentication required — this is a public endpoint.
    """
    settings = get_settings()
    recipient = settings.smtp_user

    body = (
        f"Name:    {payload.name}\n"
        f"Email:   {payload.email}\n"
        f"Subject: {payload.subject}\n"
        f"\n{payload.message}"
    )

    def _send() -> None:
        EmailService().send(
            to=recipient,
            subject=f"[Contact] {payload.subject}",
            body=body,
        )

    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _send)
    except RuntimeError as exc:
        logger.error("contact_smtp_not_configured", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Email service is not configured.",
        )
    except Exception as exc:
        logger.error("contact_send_failed", error=str(exc), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send message: {exc}",
        )

    return {"detail": "Message sent successfully."}
