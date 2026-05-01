"""Authentication API endpoints — /api/v1/auth"""

import structlog
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_audit_context, get_current_user, get_redis
from app.schemas.auth import (
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    TokenPair,
    TokenPayload,
)
from app.schemas.user import UserResponse
from app.services.audit_service import AuditContext, AuditService
from app.services.auth_service import AuthError, AuthService
from app.services.user_service import UserService
from redis.asyncio import Redis
from uuid import UUID

router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = structlog.get_logger()


# ---------------------------------------------------------------------------
# Dependency helpers
# ---------------------------------------------------------------------------

async def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    """Provide a request-scoped AuthService."""
    return AuthService(db=db)


async def get_audit_service(db: AsyncSession = Depends(get_db)) -> AuditService:
    """Provide a request-scoped AuditService."""
    return AuditService(db=db)


async def get_user_service(
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
) -> UserService:
    """Provide a request-scoped UserService."""
    return UserService(db=db, redis=redis)


def _auth_error_to_http(exc: AuthError) -> HTTPException:
    """Map AuthError messages to appropriate HTTP status codes."""
    msg = str(exc)
    if "already registered" in msg.lower():
        return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=msg)
    if "not active" in msg.lower() or "inactive" in msg.lower():
        return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=msg)
    # Invalid credentials — always 401, never reveal which field was wrong
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=msg,
        headers={"WWW-Authenticate": "Bearer"},
    )


# ---------------------------------------------------------------------------
# POST /api/v1/auth/register
# ---------------------------------------------------------------------------

@router.post(
    "/register",
    response_model=TokenPair,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
    responses={
        409: {"description": "Email already registered"},
    },
)
async def register(
    payload: RegisterRequest,
    ctx: AuditContext = Depends(get_audit_context),
    svc: AuthService = Depends(get_auth_service),
    audit_svc: AuditService = Depends(get_audit_service),
) -> TokenPair:
    """Create a new user account and return an access + refresh token pair.

    - Password is hashed with bcrypt (cost factor 12).
    - New accounts start on the free tier with the `user` role.
    - Email is not verified at this point — call `/users/me/resend-verification`
      to trigger the verification flow.
    """
    try:
        tokens = await svc.register(payload)
    except AuthError as exc:
        raise _auth_error_to_http(exc)

    # Audit the registration — user_id comes from decoding the returned token
    from app.utils.jwt import decode_token
    claims = decode_token(tokens.access_token)
    await audit_svc.log(
        action="auth.registered",
        resource_type="user",
        resource_id=UUID(claims["sub"]),
        actor_id=UUID(claims["sub"]),
        details={"email": payload.email},
        ctx=ctx,
    )

    return tokens


# ---------------------------------------------------------------------------
# POST /api/v1/auth/login
# ---------------------------------------------------------------------------

@router.post(
    "/login",
    response_model=TokenPair,
    summary="Login with email and password",
    responses={
        401: {"description": "Invalid credentials"},
        403: {"description": "Account is not active"},
    },
)
async def login(
    payload: LoginRequest,
    ctx: AuditContext = Depends(get_audit_context),
    svc: AuthService = Depends(get_auth_service),
    audit_svc: AuditService = Depends(get_audit_service),
) -> TokenPair:
    """Authenticate with email and password and receive a token pair.

    - Access token expires in 1 hour.
    - Refresh token expires in 30 days.
    - Use `POST /auth/refresh` to rotate tokens before expiry.
    """
    try:
        tokens = await svc.login(payload)
    except AuthError as exc:
        raise _auth_error_to_http(exc)

    from app.utils.jwt import decode_token
    claims = decode_token(tokens.access_token)
    await audit_svc.log(
        action="auth.login",
        resource_type="user",
        resource_id=UUID(claims["sub"]),
        actor_id=UUID(claims["sub"]),
        ctx=ctx,
    )

    return tokens


# ---------------------------------------------------------------------------
# POST /api/v1/auth/refresh
# ---------------------------------------------------------------------------

@router.post(
    "/refresh",
    response_model=TokenPair,
    summary="Refresh access token",
    responses={
        401: {"description": "Invalid or expired refresh token"},
        403: {"description": "Account is not active"},
    },
)
async def refresh(
    payload: RefreshRequest,
    ctx: AuditContext = Depends(get_audit_context),
    svc: AuthService = Depends(get_auth_service),
    audit_svc: AuditService = Depends(get_audit_service),
) -> TokenPair:
    """Exchange a valid refresh token for a new access + refresh token pair.

    Refresh tokens are rotated on every call — store the new pair and
    discard the old one. The previous refresh token cannot be reused.
    """
    try:
        tokens = await svc.refresh(payload.refresh_token)
    except AuthError as exc:
        raise _auth_error_to_http(exc)

    from app.utils.jwt import decode_token
    claims = decode_token(tokens.access_token)
    await audit_svc.log(
        action="auth.token_refreshed",
        resource_type="user",
        resource_id=UUID(claims["sub"]),
        actor_id=UUID(claims["sub"]),
        ctx=ctx,
    )

    return tokens


# ---------------------------------------------------------------------------
# POST /api/v1/auth/logout
# ---------------------------------------------------------------------------

@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Logout and revoke all sessions",
    responses={
        401: {"description": "Not authenticated"},
    },
)
async def logout(
    current_user: TokenPayload = Depends(get_current_user),
    ctx: AuditContext = Depends(get_audit_context),
    user_svc: UserService = Depends(get_user_service),
    audit_svc: AuditService = Depends(get_audit_service),
) -> None:
    """Revoke all active sessions for the current user.

    Sets a Redis flag that invalidates all previously issued tokens
    (both access and refresh) for this account. The flag TTL matches
    the refresh token lifetime (30 days) and then self-expires.

    The client should discard stored tokens after calling this endpoint.
    """
    user_id = UUID(current_user.sub)

    # Reuse UserService's session revocation — it writes the Redis key
    await user_svc._revoke_all_sessions(user_id)

    await audit_svc.log(
        action="auth.logout",
        resource_type="user",
        resource_id=user_id,
        actor_id=user_id,
        ctx=ctx,
    )


# ---------------------------------------------------------------------------
# GET /api/v1/auth/me
# ---------------------------------------------------------------------------

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user from token",
    responses={
        401: {"description": "Not authenticated"},
        404: {"description": "User not found"},
    },
)
async def get_me(
    current_user: TokenPayload = Depends(get_current_user),
    user_svc: UserService = Depends(get_user_service),
) -> UserResponse:
    """Return the full user profile for the currently authenticated user.

    Convenience endpoint — equivalent to `GET /users/me` but accessible
    without knowing the users prefix.
    """
    from app.services.user_service import UserError
    try:
        user = await user_svc.get_by_id(UUID(current_user.sub))
    except UserError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserResponse.model_validate(user)
