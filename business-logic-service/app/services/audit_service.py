"""Audit logging service — centralised write and query for audit_logs table."""

import structlog
from uuid import UUID

from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit_log import AuditLog

logger = structlog.get_logger()


class AuditContext:
    """Carries HTTP request metadata extracted at the API layer.

    Passed down into services so audit entries include ip_address and
    user_agent without the service layer depending on FastAPI's Request.
    """

    __slots__ = ("ip_address", "user_agent")

    def __init__(
        self,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> None:
        self.ip_address = ip_address
        self.user_agent = user_agent

    @classmethod
    def empty(cls) -> "AuditContext":
        """Return an empty context (used in tests / background tasks)."""
        return cls()


class AuditService:
    """Centralised audit logging service.

    All user-management operations funnel through here so every audit entry
    consistently captures: user_id, action, resource_type, resource_id,
    details (JSONB), ip_address, user_agent, and created_at.
    """

    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    # ------------------------------------------------------------------
    # Write
    # ------------------------------------------------------------------

    async def log(
        self,
        *,
        action: str,
        resource_type: str,
        resource_id: UUID | None = None,
        actor_id: UUID | None = None,
        details: dict | None = None,
        ctx: AuditContext | None = None,
    ) -> AuditLog:
        """Append one audit log entry.

        Args:
            action: Dot-namespaced action string, e.g. ``"user.profile_updated"``.
            resource_type: The type of resource affected, e.g. ``"user"``.
            resource_id: UUID of the affected resource (optional).
            actor_id: UUID of the user who performed the action (optional for
                      anonymous/system actions).
            details: Arbitrary JSON-serialisable dict stored in the JSONB column.
            ctx: HTTP request context carrying ip_address and user_agent.

        Returns:
            The persisted AuditLog ORM instance (flushed, not yet committed).
        """
        ctx = ctx or AuditContext.empty()

        entry = AuditLog(
            user_id=actor_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ctx.ip_address,
            user_agent=ctx.user_agent,
        )
        self._db.add(entry)
        await self._db.flush()  # populate entry.id and created_at

        logger.info(
            "audit_log_written",
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            actor_id=str(actor_id) if actor_id else None,
            ip_address=ctx.ip_address,
        )
        return entry

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    async def count_for_user(self, user_id: UUID) -> int:
        """Return the total number of audit log entries for a user.

        Args:
            user_id: UUID of the actor to count entries for.

        Returns:
            Integer count of matching rows.
        """
        from sqlalchemy import func as sa_func
        result = await self._db.execute(
            select(sa_func.count()).select_from(AuditLog).where(AuditLog.user_id == user_id)
        )
        return result.scalar_one()

    async def get_for_user(
        self,
        user_id: UUID,
        *,
        limit: int = 50,
        offset: int = 0,
    ) -> list[AuditLog]:
        """Return audit log entries where the actor is the given user.

        Args:
            user_id: UUID of the actor to filter by.
            limit: Maximum number of rows to return (default 50, max 200).
            offset: Pagination offset.

        Returns:
            List of AuditLog rows ordered by created_at descending.
        """
        limit = min(limit, 200)
        result = await self._db.execute(
            select(AuditLog)
            .where(AuditLog.user_id == user_id)
            .order_by(desc(AuditLog.created_at))
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())

    async def get_for_resource(
        self,
        resource_type: str,
        resource_id: UUID,
        *,
        limit: int = 50,
        offset: int = 0,
    ) -> list[AuditLog]:
        """Return audit log entries for a specific resource.

        Args:
            resource_type: The resource type to filter by (e.g. ``"user"``).
            resource_id: UUID of the resource.
            limit: Maximum rows to return.
            offset: Pagination offset.

        Returns:
            List of AuditLog rows ordered by created_at descending.
        """
        limit = min(limit, 200)
        result = await self._db.execute(
            select(AuditLog)
            .where(
                AuditLog.resource_type == resource_type,
                AuditLog.resource_id == resource_id,
            )
            .order_by(desc(AuditLog.created_at))
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())
