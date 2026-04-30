"""JWT token creation and validation utilities"""

from datetime import datetime, timedelta, timezone
from typing import Literal
from uuid import UUID

from jose import JWTError, jwt

from app.config import get_settings

settings = get_settings()

# Token type literal for type safety
TokenType = Literal["access", "refresh"]

# Claims included in every token
_REQUIRED_CLAIMS = {"sub", "email", "role", "tier", "type"}


def create_access_token(
    user_id: UUID | str,
    email: str,
    role: str,
    tier: str,
) -> str:
    """Create a short-lived JWT access token (1 hour).

    Args:
        user_id: The user's UUID.
        email: The user's email address.
        role: The user's role (e.g. "user", "admin").
        tier: The user's subscription tier (e.g. "free", "pro", "enterprise").

    Returns:
        Signed JWT access token string.
    """
    return _create_token(
        user_id=user_id,
        email=email,
        role=role,
        tier=tier,
        token_type="access",
        expires_delta=timedelta(minutes=settings.jwt_access_token_expire_minutes),
    )


def create_refresh_token(
    user_id: UUID | str,
    email: str,
    role: str,
    tier: str,
) -> str:
    """Create a long-lived JWT refresh token (30 days).

    Args:
        user_id: The user's UUID.
        email: The user's email address.
        role: The user's role.
        tier: The user's subscription tier.

    Returns:
        Signed JWT refresh token string.
    """
    return _create_token(
        user_id=user_id,
        email=email,
        role=role,
        tier=tier,
        token_type="refresh",
        expires_delta=timedelta(days=settings.jwt_refresh_token_expire_days),
    )


def decode_token(token: str) -> dict:
    """Decode and validate a JWT token.

    Validates signature, expiration, and presence of required claims.

    Args:
        token: The raw JWT string.

    Returns:
        The decoded claims payload as a dict.

    Raises:
        JWTError: If the token is invalid, expired, or missing required claims.
    """
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
    except JWTError:
        raise

    # Verify all required claims are present
    missing = _REQUIRED_CLAIMS - payload.keys()
    if missing:
        raise JWTError(f"Token missing required claims: {missing}")

    # Explicit expiration check (jose already does this, but be explicit)
    exp = payload.get("exp")
    if exp is None or datetime.fromtimestamp(exp, tz=timezone.utc) < datetime.now(tz=timezone.utc):
        raise JWTError("Token has expired")

    return payload


def decode_refresh_token(token: str) -> dict:
    """Decode and validate a refresh token specifically.

    Same as decode_token but also asserts the token type is "refresh".

    Args:
        token: The raw JWT refresh token string.

    Returns:
        The decoded claims payload.

    Raises:
        JWTError: If invalid, expired, or not a refresh token.
    """
    payload = decode_token(token)
    if payload.get("type") != "refresh":
        raise JWTError("Token is not a refresh token")
    return payload


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _create_token(
    user_id: UUID | str,
    email: str,
    role: str,
    tier: str,
    token_type: TokenType,
    expires_delta: timedelta,
) -> str:
    """Build and sign a JWT with the standard CodeCollab claims."""
    now = datetime.now(tz=timezone.utc)
    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "tier": tier,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
