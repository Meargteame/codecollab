"""Billing schemas"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class SubscriptionResponse(BaseModel):
    id: UUID
    plan: str
    status: str
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CheckoutRequest(BaseModel):
    plan: str  # "pro" or "enterprise"
    success_url: str
    cancel_url: str


class CheckoutResponse(BaseModel):
    checkout_url: str


class PortalResponse(BaseModel):
    portal_url: str


class InvoiceItem(BaseModel):
    id: str
    amount_paid: int        # in cents
    currency: str
    status: str
    created: datetime
    invoice_pdf: Optional[str] = None
    hosted_invoice_url: Optional[str] = None
    description: Optional[str] = None
