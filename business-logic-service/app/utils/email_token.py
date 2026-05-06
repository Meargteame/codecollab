"""Signed token utilities for email verification and password reset.

Uses itsdangerous TimestampSigner so tokens are:
- Cryptographically signed (tamper-proof)
- Time-limited (expire after a configurable window)
- Stateless (no DB storage required)
"""

from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from app.config import get_settings

settings = get_settings()

# Separate salts so a verification token can't be reused as a reset token
_VERIFY_SALT = "email-verification"
_RESET_SALT = "password-reset"


def _serializer() -> URLSafeTimedSerializer:
    return URLSafeTimedSerializer(settings.jwt_secret)


# ---------------------------------------------------------------------------
# Email verification
# ---------------------------------------------------------------------------

def generate_verification_token(user_id: str) -> str:
    """Generate a signed, time-limited email verification token.

    Args:
        user_id: The user's UUID as a string.

    Returns:
        URL-safe signed token string.
    """
    return _serializer().dumps(user_id, salt=_VERIFY_SALT)


def verify_verification_token(token: str) -> str:
    """Validate an email verification token and return the user_id.

    Args:
        token: The signed token from the verification link.

    Returns:
        The user_id encoded in the token.

    Raises:
        SignatureExpired: Token is valid but has expired.
        BadSignature: Token is invalid or tampered.
    """
    max_age = settings.email_verification_expire_hours * 3600
    return _serializer().loads(token, salt=_VERIFY_SALT, max_age=max_age)


# ---------------------------------------------------------------------------
# Password reset
# ---------------------------------------------------------------------------

def generate_password_reset_token(user_id: str) -> str:
    """Generate a signed, time-limited password reset token.

    Args:
        user_id: The user's UUID as a string.

    Returns:
        URL-safe signed token string.
    """
    return _serializer().dumps(user_id, salt=_RESET_SALT)


def verify_password_reset_token(token: str) -> str:
    """Validate a password reset token and return the user_id.

    Args:
        token: The signed token from the reset link.

    Returns:
        The user_id encoded in the token.

    Raises:
        SignatureExpired: Token is valid but has expired.
        BadSignature: Token is invalid or tampered.
    """
    max_age = settings.password_reset_expire_hours * 3600
    return _serializer().loads(token, salt=_RESET_SALT, max_age=max_age)
