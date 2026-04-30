"""Pydantic schemas for user management requests and responses"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserResponse(BaseModel):
    """Public user profile returned by the API."""

    id: UUID
    email: EmailStr
    full_name: str | None
    avatar_url: str | None
    email_verified: bool
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    """Fields the user may update on their own profile."""

    full_name: str | None = Field(default=None, max_length=255)
    avatar_url: str | None = Field(default=None)


class ChangePasswordRequest(BaseModel):
    """Payload for changing the authenticated user's password."""

    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


class AdminUserUpdate(BaseModel):
    """Fields an admin may update on any user account."""

    full_name: str | None = Field(default=None, max_length=255)
    avatar_url: str | None = Field(default=None)
    status: str | None = Field(default=None, pattern="^(active|deactivated)$")


class VerifyEmailRequest(BaseModel):
    """Payload carrying the email verification token."""

    token: str


class RequestPasswordResetRequest(BaseModel):
    """Payload for requesting a password reset email."""

    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Payload for completing a password reset."""

    token: str
    new_password: str = Field(min_length=8, max_length=128)
