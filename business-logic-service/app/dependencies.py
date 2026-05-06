"""FastAPI dependencies for dependency injection"""

from typing import AsyncGenerator

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.schemas.auth import TokenPayload
from app.services.audit_service import AuditContext
from app.utils.jwt import decode_token

settings = get_settings()
security = HTTPBearer()


async def get_redis() -> AsyncGenerator[Redis, None]:
    """Dependency for getting Redis connection."""
    redis = Redis.from_url(
        settings.redis_url,
        max_connections=settings.redis_max_connections,
        socket_timeout=settings.redis_socket_timeout,
        socket_connect_timeout=settings.redis_socket_connect_timeout,
        decode_responses=True,
    )
    try:
        yield redis
    finally:
        await redis.close()


def get_audit_context(request: Request) -> AuditContext:
    """Extract IP address and User-Agent from the incoming request.

    Respects X-Forwarded-For when the service sits behind a proxy/load balancer.

    Args:
        request: The current FastAPI Request object.

    Returns:
        AuditContext populated with ip_address and user_agent.
    """
    # Prefer the leftmost address in X-Forwarded-For (original client IP)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        ip_address = forwarded_for.split(",")[0].strip()
    else:
        ip_address = request.client.host if request.client else None

    user_agent = request.headers.get("User-Agent")
    return AuditContext(ip_address=ip_address, user_agent=user_agent)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
) -> TokenPayload:
    """Validate the Bearer token and return the decoded claims.

    Also checks Redis for a session revocation flag — set when a user
    deactivates their account, changes password, or explicitly logs out.

    Raises:
        HTTPException 401: If the token is missing, invalid, expired,
                           or the session has been revoked.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(credentials.credentials)
        if payload.get("type") != "access":
            raise credentials_exception
        token_payload = TokenPayload(**payload)
    except (JWTError, Exception):
        raise credentials_exception

    # Check Redis revocation flag — covers deactivation, password change, logout
    revoke_key = f"revoked_user:{token_payload.sub}"
    if await redis.exists(revoke_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return token_payload


async def require_admin(current_user: TokenPayload = Depends(get_current_user)) -> TokenPayload:
    """Require the current user to have the admin role.

    Raises:
        HTTPException 403: If the user is not an admin.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
