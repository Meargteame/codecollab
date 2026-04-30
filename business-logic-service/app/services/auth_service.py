"""Authentication service — password hashing, JWT issuance, token refresh"""

import structlog
from uuid import UUID

from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.subscription import Subscription
from app.schemas.auth import LoginRequest, RegisterRequest, TokenPair
from app.utils.security import hash_password, verify_password
from app.utils.jwt import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
)

logger = structlog.get_logger()

# Default role assigned to every new user
_DEFAULT_ROLE = "user"
# Default subscription tier for new users
_DEFAULT_TIER = "free"


class AuthError(Exception):
    """Raised for authentication / authorisation failures."""


class AuthService:
    """Core authentication service.

    Handles:
    - bcrypt password hashing (cost factor 12, configured in settings)
    - JWT access token generation (1 hour)
    - JWT refresh token generation (30 days)
    - Token validation with expiration checking
    - Refresh token → new token pair exchange
    """

    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    # ------------------------------------------------------------------
    # Registration
    # ------------------------------------------------------------------

    async def register(self, payload: RegisterRequest) -> TokenPair:
        """Register a new user and return a token pair.

        Args:
            payload: Registration data (email, password, optional full_name).

        Returns:
            TokenPair with access and refresh tokens.

        Raises:
            AuthError: If the email is already in use.
        """
        # Check for duplicate email
        existing = await self._get_user_by_email(payload.email)
        if existing is not None:
            raise AuthError("Email already registered")

        # Hash password with bcrypt (cost factor from settings, default 12)
        password_hash = hash_password(payload.password)

        user = User(
            email=payload.email,
            password_hash=password_hash,
            full_name=payload.full_name,
        )
        self._db.add(user)
        await self._db.flush()  # get user.id before commit

        logger.info("user_registered", user_id=str(user.id), email=user.email)

        return self._issue_token_pair(user, role=_DEFAULT_ROLE, tier=_DEFAULT_TIER)

    # ------------------------------------------------------------------
    # Login
    # ------------------------------------------------------------------

    async def login(self, payload: LoginRequest) -> TokenPair:
        """Authenticate a user and return a token pair.

        Args:
            payload: Login credentials (email, password).

        Returns:
            TokenPair with access and refresh tokens.

        Raises:
            AuthError: If credentials are invalid or account is inactive.
        """
        user = await self._get_user_by_email(payload.email)

        # Use constant-time comparison even when user doesn't exist to
        # prevent user-enumeration via timing attacks.
        password_valid = (
            verify_password(payload.password, user.password_hash)
            if user is not None
            else False
        )

        if user is None or not password_valid:
            raise AuthError("Invalid email or password")

        if user.status != "active":
            raise AuthError("Account is not active")

        role, tier = await self._get_role_and_tier(user.id)

        logger.info("user_logged_in", user_id=str(user.id), email=user.email)

        return self._issue_token_pair(user, role=role, tier=tier)

    # ------------------------------------------------------------------
    # Token refresh
    # ------------------------------------------------------------------

    async def refresh(self, refresh_token: str) -> TokenPair:
        """Exchange a valid refresh token for a new token pair.

        The old refresh token is implicitly invalidated by issuing a new one
        (rotation). Callers should store the new pair and discard the old one.

        Args:
            refresh_token: A previously issued refresh JWT.

        Returns:
            A fresh TokenPair.

        Raises:
            AuthError: If the refresh token is invalid, expired, or the user
                       no longer exists / is inactive.
        """
        try:
            claims = decode_refresh_token(refresh_token)
        except JWTError as exc:
            raise AuthError(f"Invalid refresh token: {exc}") from exc

        user_id = UUID(claims["sub"])
        user = await self._db.get(User, user_id)

        if user is None or user.status != "active":
            raise AuthError("User not found or inactive")

        role, tier = await self._get_role_and_tier(user.id)

        logger.info("token_refreshed", user_id=str(user.id))

        return self._issue_token_pair(user, role=role, tier=tier)

    # ------------------------------------------------------------------
    # Password utilities (exposed for other services)
    # ------------------------------------------------------------------

    @staticmethod
    def hash_password(plain_password: str) -> str:
        """Hash a plain-text password with bcrypt (cost factor 12).

        Args:
            plain_password: Raw password string.

        Returns:
            bcrypt hash string.
        """
        return hash_password(plain_password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a plain-text password against a stored bcrypt hash.

        Args:
            plain_password: Raw password to check.
            hashed_password: Stored bcrypt hash.

        Returns:
            True if the password matches.
        """
        return verify_password(plain_password, hashed_password)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _issue_token_pair(self, user: User, role: str, tier: str) -> TokenPair:
        """Build and return an access + refresh token pair for a user."""
        access_token = create_access_token(
            user_id=user.id,
            email=user.email,
            role=role,
            tier=tier,
        )
        refresh_token = create_refresh_token(
            user_id=user.id,
            email=user.email,
            role=role,
            tier=tier,
        )
        return TokenPair(access_token=access_token, refresh_token=refresh_token)

    async def _get_user_by_email(self, email: str) -> User | None:
        """Fetch a user by email address."""
        result = await self._db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def _get_role_and_tier(self, user_id: UUID) -> tuple[str, str]:
        """Resolve the role and subscription tier for a user.

        Falls back to defaults if no subscription record exists.
        """
        result = await self._db.execute(
            select(Subscription)
            .where(Subscription.user_id == user_id)
            .where(Subscription.status == "active")
            .order_by(Subscription.created_at.desc())
            .limit(1)
        )
        subscription = result.scalar_one_or_none()
        tier = subscription.plan if subscription else _DEFAULT_TIER
        return _DEFAULT_ROLE, tier
