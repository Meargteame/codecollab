"""API v1 routes"""

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.contact import router as contact_router
from app.api.v1.billing import router as billing_router
from app.api.v1.teams import router as teams_router

__all__ = ["auth_router", "users_router", "contact_router", "billing_router", "teams_router"]
