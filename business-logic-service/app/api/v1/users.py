"""User management API endpoints — /api/v1/users"""

from uuid import UUID

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_audit_context, get_current_user, get_redis, require_admin
from app.schemas.audit_log import AuditLogPage, AuditLogResponse
from app.schemas.auth import TokenPayload
from app.schemas.user import (
    ChangePasswordRequest,
    UserResponse,
    UserUpdate,
    VerifyEmailRequest,
)
from app.services.audit_service import AuditContext, AuditService
from app.services.user_service import UserError, UserService

router = APIRouter(prefix="/users", tags=["Users"])
logger = structlog.get_logger()


# ---------------------------------------------------------------------------
# Request-scoped service dependencies
# ---------------------------------------------------------------------------

async def get_user_service(
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
) -> UserService:
    """Provide a request-scoped UserService instance."""
    return UserService(db=db, redis=redis)


async def get_audit_service(
    db: AsyncSession = Depends(get_db),
) -> AuditService:
    """Provide a request-scoped AuditService instance."""
    return AuditService(db=db)


# ---------------------------------------------------------------------------
# Helper — map UserError → HTTPException
# ---------------------------------------------------------------------------

def _user_error_to_http(exc: UserError) -> HTTPException:
    msg = str(exc)
    if "not found" in msg.lower():
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=msg)
    if "already" in msg.lower() or "in use" in msg.lower():
        return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=msg)
    if "incorrect" in msg.lower() or "invalid" in msg.lower() or "expired" in msg.lower():
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)


# ---------------------------------------------------------------------------
# GET /api/v1/users/me
# ---------------------------------------------------------------------------

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile",
    responses={
        401: {"description": "Not authenticated"},
        404: {"description": "User not found"},
    },
)
async def get_me(
    current_user: TokenPayload = Depends(get_current_user),
    svc: UserService = Depends(get_user_service),
) -> UserResponse:
    """Return the profile of the currently authenticated user."""
    try:
        user = await svc.get_by_id(UUID(current_user.sub))
    except UserError as exc:
        raise _user_error_to_http(exc)
    return UserResponse.model_validate(user)


# ---------------------------------------------------------------------------
# PUT /api/v1/users/me
# ---------------------------------------------------------------------------

@router.put(
    "/me",
    response_model=UserResponse,
    summary="Update current user profile",
    responses={
        400: {"description": "Validation error"},
        401: {"description": "Not authenticated"},
        404: {"description": "User not found"},
    },
)
async def update_me(
    payload: UserUpdate,
    current_user: TokenPayload = Depends(get_current_user),
    svc: UserService = Depends(get_user_service),
    ctx: AuditContext = Depends(get_audit_context),
) -> UserResponse:
    """Update the authenticated user's profile (full_name, avatar_url)."""
    user_id = UUID(current_user.sub)
    try:
        user = await svc.update_profile(user_id, payload, actor_id=user_id, ctx=ctx)
    except UserError as exc:
        raise _user_error_to_http(exc)
    return UserResponse.model_validate(user)


# ---------------------------------------------------------------------------
# PUT /api/v1/users/me/password
# ---------------------------------------------------------------------------

@router.put(
    "/me/password",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Change current user password",
    responses={
        400: {"description": "Current password incorrect"},
        401: {"description": "Not authenticated"},
    },
)
async def change_password(
    payload: ChangePasswordRequest,
    current_user: TokenPayload = Depends(get_current_user),
    svc: UserService = Depends(get_user_service),
    ctx: AuditContext = Depends(get_audit_context),
) -> None:
    """Change the authenticated user's password. Revokes all active sessions."""
    try:
        await svc.change_password(UUID(current_user.sub), payload, ctx=ctx)
    except UserError as exc:
        raise _user_error_to_http(exc)


# ---------------------------------------------------------------------------
# DELETE /api/v1/users/me
# ---------------------------------------------------------------------------

@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete current user account",
    responses={
        401: {"description": "Not authenticated"},
        404: {"description": "User not found"},
    },
)
async def delete_me(
    current_user: TokenPayload = Depends(get_current_user),
    svc: UserService = Depends(get_user_service),
    ctx: AuditContext = Depends(get_audit_context),
) -> None:
    """Soft-delete the authenticated user's account with full PII anonymisation.

    All active sessions are revoked immediately. The operation is irreversible.
    """
    user_id = UUID(current_user.sub)
    try:
        await svc.delete(user_id, actor_id=user_id, ctx=ctx)
    except UserError as exc:
        raise _user_error_to_http(exc)


# ---------------------------------------------------------------------------
# GET /api/v1/users/me/audit-logs
# ---------------------------------------------------------------------------

@router.get(
    "/me/audit-logs",
    response_model=AuditLogPage,
    summary="Get audit log for current user",
    responses={
        401: {"description": "Not authenticated"},
    },
)
async def get_my_audit_logs(
    limit: int = Query(default=50, ge=1, le=200, description="Max entries to return"),
    offset: int = Query(default=0, ge=0, description="Pagination offset"),
    current_user: TokenPayload = Depends(get_current_user),
    audit_svc: AuditService = Depends(get_audit_service),
) -> AuditLogPage:
    """Return the audit log for the currently authenticated user.

    Shows all actions performed by or on this account, ordered newest first.
    """
    user_id = UUID(current_user.sub)
    entries = await audit_svc.get_for_user(user_id, limit=limit, offset=offset)
    total = await audit_svc.count_for_user(user_id)
    return AuditLogPage(
        items=[AuditLogResponse.model_validate(e) for e in entries],
        total=total,
        limit=limit,
        offset=offset,
    )


# ---------------------------------------------------------------------------
# POST /api/v1/users/{user_id}/deactivate  (admin only)
# ---------------------------------------------------------------------------

@router.post(
    "/{user_id}/deactivate",
    response_model=UserResponse,
    summary="Deactivate a user account",
    responses={
        400: {"description": "User already deactivated or deleted"},
        401: {"description": "Not authenticated"},
        403: {"description": "Admin access required"},
        404: {"description": "User not found"},
    },
)
async def deactivate_user(
    user_id: UUID,
    current_user: TokenPayload = Depends(require_admin),
    svc: UserService = Depends(get_user_service),
    ctx: AuditContext = Depends(get_audit_context),
) -> UserResponse:
    """Deactivate a user account and immediately revoke all active sessions.

    - Sets account status to `deactivated`.
    - Writes a Redis revocation flag so all existing JWT tokens are rejected.
    - The account can be restored via the reactivate endpoint.
    - Requires admin role.
    """
    try:
        user = await svc.deactivate(user_id, actor_id=UUID(current_user.sub), ctx=ctx)
    except UserError as exc:
        raise _user_error_to_http(exc)
    return UserResponse.model_validate(user)


# ---------------------------------------------------------------------------
# POST /api/v1/users/{user_id}/reactivate  (admin only)
# ---------------------------------------------------------------------------

@router.post(
    "/{user_id}/reactivate",
    response_model=UserResponse,
    summary="Reactivate a deactivated user account",
    responses={
        400: {"description": "User is not deactivated"},
        401: {"description": "Not authenticated"},
        403: {"description": "Admin access required"},
        404: {"description": "User not found"},
    },
)
async def reactivate_user(
    user_id: UUID,
    current_user: TokenPayload = Depends(require_admin),
    svc: UserService = Depends(get_user_service),
    ctx: AuditContext = Depends(get_audit_context),
) -> UserResponse:
    """Restore a previously deactivated user account.

    - Sets account status back to `active`.
    - The Redis revocation flag is NOT cleared — the user must log in
      again to obtain fresh tokens. This is intentional: it forces
      re-authentication after reactivation.
    - Requires admin role.
    """
    try:
        user = await svc.reactivate(user_id, actor_id=UUID(current_user.sub), ctx=ctx)
    except UserError as exc:
        raise _user_error_to_http(exc)
    return UserResponse.model_validate(user)
