"""API v1 routes"""

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router

__all__ = ["auth_router", "users_router"]

# TODO: Import routers as they are created
# from app.api.v1 import projects, ai, search, billing
