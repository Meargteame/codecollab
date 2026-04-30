"""FastAPI dependencies for dependency injection"""

from typing import AsyncGenerator

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db

settings = get_settings()
security = HTTPBearer()


async def get_redis() -> AsyncGenerator[Redis, None]:
    """
    Dependency for getting Redis connection.
    
    Yields:
        Redis: Redis connection
    """
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


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Dependency for getting current authenticated user.
    
    Args:
        credentials: HTTP Bearer token
        db: Database session
        
    Returns:
        dict: User information from JWT token
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    # TODO: Implement JWT token validation
    # from app.utils.jwt import decode_token
    # try:
    #     payload = decode_token(credentials.credentials)
    #     return payload
    # except Exception:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Invalid authentication credentials",
    #         headers={"WWW-Authenticate": "Bearer"},
    #     )
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Authentication not yet implemented",
    )


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Dependency for requiring admin role.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        dict: User information
        
    Raises:
        HTTPException: If user is not an admin
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
