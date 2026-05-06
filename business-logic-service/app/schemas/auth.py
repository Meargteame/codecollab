"""Pydantic schemas for authentication requests and responses"""

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """Payload for user registration."""

    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


class LoginRequest(BaseModel):
    """Payload for user login."""

    email: EmailStr
    password: str


class TokenPair(BaseModel):
    """Access + refresh token pair returned after login or token refresh."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    """Payload for refreshing an access token."""

    refresh_token: str


class TokenPayload(BaseModel):
    """Decoded JWT claims exposed to the application layer."""

    sub: str          # user UUID
    email: str
    role: str
    tier: str
    type: str         # "access" or "refresh"
