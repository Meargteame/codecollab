"""User management service — CRUD, deactivation, deletion, email verification"""

import structlog
from datetime import datetime, timezone
from uuid import UUID

from itsdangerous import BadSignature, SignatureExpired
from redis.asyncio import Redis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.user import User
from app.schemas.user import AdminUserUpdate, ChangePasswordRequest, UserUpdate
from app.services.audit_service import AuditContext, AuditService
from app.utils.email_token import (
    generate_verification_token,
    verify_verification_token,
    generate_password_reset_token,
    verify_password_reset_token,
)
from app.utils.security import hash_password, verify_password

settings = get_settings()
logger = structlog.get_logger()

_SESSION_REVOKE_KEY = "revoked_user:{user_id}"


class UserError(Exception):
    """Raised for user-management domain errors."""


class UserService:
    """User management service.

    Responsibilities:
    - CRUD operations on user accounts
    - Email uniqueness validation
    - User deactivation with Redis session revocation
    - Soft-delete with data anonymisation (GDPR)
    - Email verification via signed tokens
    - Password change and reset flows

    Every mutating operation writes a structured audit log entry via
    AuditService, capturing actor_id, ip_address, and user_agent.
    """

    def __init__(self, db: AsyncSession, redis: Redis) -> None:
        self._db = db
        self._redis = redis
        self._audit_svc = AuditService(db)

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    async def get_by_id(self, user_id: UUID) -> User:
        """Fetch a user by primary key.

        Args:
            user_id: The user's UUID.

        Returns:
            The User ORM object.

        Raises:
            UserError: If the user does not exist.
        """
        user = await self._db.get(User, user_id)
        if user is None:
            raise UserError("User not found")
        return user

    async def get_by_email(self, email: str) -> User:
        """Fetch a user by email address.

        Args:
            email: The email to look up.

        Returns:
            The User ORM object.

        Raises:
            UserError: If no user with that email exists.
        """
        result = await self._db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if user is None:
            raise UserError("User not found")
        return user

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    async def update_profile(
        self,
        user_id: UUID,
        payload: UserUpdate,
        *,
        actor_id: UUID | None = None,
        ctx: AuditContext | None = None,
    ) -> User:
        """Update a user's own profile fields.

        Args:
            user_id: UUID of the user to update.
            payload: Fields to update (full_name, avatar_url).
            actor_id: UUID of the user performing the action (for audit log).

        Returns:
            The updated User object.

        Raises:
            UserError: If the user does not exist.
        """
        user = await self.get_by_id(user_id)

        update_data = payload.model_dump(exclude_none=True)
        for field, value in update_data.items():
            setattr(user, field, value)

        await self._audit(
            action="user.profile_updated",
            resource_id=user_id,
            actor_id=actor_id or user_id,
            details=update_data,
            ctx=ctx,
        )
        logger.info("user_profile_updated", user_id=str(user_id))
        return user

    async def admin_update(
        self,
        user_id: UUID,
        payload: AdminUserUpdate,
        *,
        actor_id: UUID,
        ctx: AuditContext | None = None,
    ) -> User:
        """Admin-level update — can also change status.

        Args:
            user_id: UUID of the target user.
            payload: Fields to update.
            actor_id: UUID of the admin performing the action.

        Returns:
            The updated User object.

        Raises:
            UserError: If the user does not exist.
        """
        user = await self.get_by_id(user_id)

        update_data = payload.model_dump(exclude_none=True)
        for field, value in update_data.items():
            setattr(user, field, value)

        await self._audit(
            action="admin.user_updated",
            resource_id=user_id,
            actor_id=actor_id,
            details=update_data,
            ctx=ctx,
        )
        logger.info("admin_user_updated", user_id=str(user_id), actor_id=str(actor_id))
        return user

    async def change_password(
        self,
        user_id: UUID,
        payload: ChangePasswordRequest,
        *,
        ctx: AuditContext | None = None,
    ) -> None:
        """Change the authenticated user's password.

        Verifies the current password before applying the new hash.
        All active sessions are revoked after a successful change.

        Args:
            user_id: UUID of the user.
            payload: Current and new password.

        Raises:
            UserError: If the current password is wrong or user not found.
        """
        user = await self.get_by_id(user_id)

        if not verify_password(payload.current_password, user.password_hash):
            raise UserError("Current password is incorrect")

        user.password_hash = hash_password(payload.new_password)

        # Revoke all sessions so existing tokens can't be reused
        await self._revoke_all_sessions(user_id)

        await self._audit(
            action="user.password_changed",
            resource_id=user_id,
            actor_id=user_id,
            ctx=ctx,
        )
        logger.info("user_password_changed", user_id=str(user_id))

    # ------------------------------------------------------------------
    # Email uniqueness validation
    # ------------------------------------------------------------------

    async def assert_email_unique(self, email: str, exclude_user_id: UUID | None = None) -> None:
        """Assert that an email address is not already in use.

        Args:
            email: The email to check.
            exclude_user_id: Optionally exclude a specific user (for updates).

        Raises:
            UserError: If the email is already taken.
        """
        query = select(User).where(User.email == email)
        if exclude_user_id is not None:
            query = query.where(User.id != exclude_user_id)

        result = await self._db.execute(query)
        if result.scalar_one_or_none() is not None:
            raise UserError("Email address is already in use")

    # ------------------------------------------------------------------
    # Deactivation (reversible)
    # ------------------------------------------------------------------

    async def deactivate(self, user_id: UUID, *, actor_id: UUID, ctx: AuditContext | None = None) -> User:
        """Deactivate a user account and revoke all active sessions.

        The account can be reactivated later. All JWT tokens issued before
        deactivation are immediately invalidated via Redis.

        Args:
            user_id: UUID of the user to deactivate.
            actor_id: UUID of the admin or user initiating the action.

        Returns:
            The updated User object.

        Raises:
            UserError: If the user does not exist or is already deactivated.
        """
        user = await self.get_by_id(user_id)

        if user.status == "deactivated":
            raise UserError("User is already deactivated")
        if user.status == "deleted":
            raise UserError("Cannot deactivate a deleted user")

        user.status = "deactivated"

        # Revoke all active sessions in Redis
        await self._revoke_all_sessions(user_id)

        await self._audit(
            action="user.deactivated",
            resource_id=user_id,
            actor_id=actor_id,
            ctx=ctx,
        )
        logger.info("user_deactivated", user_id=str(user_id), actor_id=str(actor_id))
        return user

    async def reactivate(self, user_id: UUID, *, actor_id: UUID, ctx: AuditContext | None = None) -> User:
        """Reactivate a previously deactivated user account.

        Args:
            user_id: UUID of the user to reactivate.
            actor_id: UUID of the admin initiating the action.

        Returns:
            The updated User object.

        Raises:
            UserError: If the user does not exist or is not deactivated.
        """
        user = await self.get_by_id(user_id)

        if user.status != "deactivated":
            raise UserError("User is not deactivated")

        user.status = "active"

        await self._audit(
            action="user.reactivated",
            resource_id=user_id,
            actor_id=actor_id,
            ctx=ctx,
        )
        logger.info("user_reactivated", user_id=str(user_id), actor_id=str(actor_id))
        return user

    # ------------------------------------------------------------------
    # Deletion with data anonymisation (GDPR soft-delete)
    # ------------------------------------------------------------------

    async def delete(self, user_id: UUID, *, actor_id: UUID, ctx: AuditContext | None = None) -> None:
        """Soft-delete a user and anonymise their PII.

        The row is retained for referential integrity but all personally
        identifiable information is scrubbed:
        - email → anonymised placeholder (non-reversible)
        - full_name → None
        - avatar_url → None
        - password_hash → unusable sentinel value
        - status → "deleted"
        - deleted_at → now

        All active sessions are revoked before anonymisation.

        Args:
            user_id: UUID of the user to delete.
            actor_id: UUID of the admin or user initiating the deletion.

        Raises:
            UserError: If the user does not exist or is already deleted.
        """
        user = await self.get_by_id(user_id)

        if user.status == "deleted":
            raise UserError("User is already deleted")

        # Revoke sessions first so no tokens work during/after anonymisation
        await self._revoke_all_sessions(user_id)

        # Anonymise PII — use a deterministic but non-reversible placeholder
        # so the unique constraint on email is preserved without leaking data.
        anon_email = f"deleted_{user_id}@anonymised.invalid"
        user.email = anon_email
        user.full_name = None
        user.avatar_url = None
        # Replace hash with an invalid sentinel (bcrypt hashes start with $2b$)
        user.password_hash = "DELETED"
        user.email_verified = False
        user.status = "deleted"
        user.deleted_at = datetime.now(tz=timezone.utc)

        await self._audit(
            action="user.deleted",
            resource_id=user_id,
            actor_id=actor_id,
            details={"anonymised": True},
            ctx=ctx,
        )
        logger.info("user_deleted_anonymised", user_id=str(user_id), actor_id=str(actor_id))

    # ------------------------------------------------------------------
    # Email verification
    # ------------------------------------------------------------------

    async def send_verification_email(self, user_id: UUID) -> str:
        """Generate an email verification token for the given user.

        In production this token would be embedded in a link and sent via
        SMTP. Here we return it so the caller (API layer / email service)
        can dispatch it.

        Args:
            user_id: UUID of the user who needs to verify their email.

        Returns:
            The signed verification token string.

        Raises:
            UserError: If the user does not exist or email is already verified.
        """
        user = await self.get_by_id(user_id)

        if user.email_verified:
            raise UserError("Email is already verified")

        token = generate_verification_token(str(user_id))

        logger.info("verification_email_token_generated", user_id=str(user_id))
        return token

    async def verify_email(self, token: str) -> User:
        """Mark a user's email as verified using a signed token.

        Args:
            token: The signed token from the verification link.

        Returns:
            The updated User object.

        Raises:
            UserError: If the token is invalid, expired, or user not found.
        """
        try:
            user_id_str = verify_verification_token(token)
        except SignatureExpired:
            raise UserError("Verification link has expired. Please request a new one.")
        except BadSignature:
            raise UserError("Invalid verification token.")

        user = await self.get_by_id(UUID(user_id_str))

        if user.email_verified:
            raise UserError("Email is already verified")

        user.email_verified = True

        await self._audit(
            action="user.email_verified",
            resource_id=user.id,
            actor_id=user.id,
            ctx=None,  # public endpoint — no request context
        )
        logger.info("user_email_verified", user_id=user_id_str)
        return user

    # ------------------------------------------------------------------
    # Password reset
    # ------------------------------------------------------------------

    async def request_password_reset(self, email: str) -> str | None:
        """Generate a password reset token for the given email.

        Returns None (silently) if the email is not found to prevent
        user enumeration. The caller should always respond with a
        generic success message.

        Args:
            email: The email address to send the reset link to.

        Returns:
            The signed reset token, or None if the email is unknown.
        """
        result = await self._db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if user is None or user.status != "active":
            # Return None silently — don't reveal whether the email exists
            return None

        token = generate_password_reset_token(str(user.id))
        logger.info("password_reset_token_generated", user_id=str(user.id))
        return token

    async def reset_password(self, token: str, new_password: str) -> None:
        """Complete a password reset using a signed token.

        All active sessions are revoked after a successful reset.

        Args:
            token: The signed reset token from the email link.
            new_password: The new plain-text password.

        Raises:
            UserError: If the token is invalid, expired, or user not found.
        """
        try:
            user_id_str = verify_password_reset_token(token)
        except SignatureExpired:
            raise UserError("Password reset link has expired. Please request a new one.")
        except BadSignature:
            raise UserError("Invalid password reset token.")

        user = await self.get_by_id(UUID(user_id_str))

        if user.status != "active":
            raise UserError("Account is not active")

        user.password_hash = hash_password(new_password)

        # Revoke all sessions so old tokens can't be reused
        await self._revoke_all_sessions(user.id)

        await self._audit(
            action="user.password_reset",
            resource_id=user.id,
            actor_id=user.id,
            ctx=None,
        )
        logger.info("user_password_reset", user_id=user_id_str)

    # ------------------------------------------------------------------
    # Session revocation helpers
    # ------------------------------------------------------------------

    async def is_session_revoked(self, user_id: UUID) -> bool:
        """Check whether all sessions for a user have been revoked.

        Used by the auth middleware to reject tokens issued before a
        deactivation or password change event.

        Args:
            user_id: The user's UUID.

        Returns:
            True if the user's sessions are revoked.
        """
        key = _SESSION_REVOKE_KEY.format(user_id=str(user_id))
        return await self._redis.exists(key) == 1

    async def _revoke_all_sessions(self, user_id: UUID) -> None:
        """Set a Redis flag that invalidates all tokens for a user.

        The flag TTL matches the refresh token lifetime so it auto-expires
        once all tokens would have naturally expired anyway.

        Args:
            user_id: The user whose sessions should be revoked.
        """
        key = _SESSION_REVOKE_KEY.format(user_id=str(user_id))
        ttl_seconds = settings.jwt_refresh_token_expire_days * 86400
        await self._redis.setex(key, ttl_seconds, "1")
        logger.info("sessions_revoked", user_id=str(user_id))

    # ------------------------------------------------------------------
    # Audit logging (delegates to AuditService)
    # ------------------------------------------------------------------

    async def _audit(
        self,
        action: str,
        resource_id: UUID,
        actor_id: UUID,
        details: dict | None = None,
        ctx: AuditContext | None = None,
    ) -> None:
        """Write one audit log entry via AuditService."""
        await self._audit_svc.log(
            action=action,
            resource_type="user",
            resource_id=resource_id,
            actor_id=actor_id,
            details=details,
            ctx=ctx,
        )
