"""FastAPI application entry point"""

import structlog
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app

from app.config import get_settings
from app.database import close_db, init_db

# Import routers
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.contact import router as contact_router
from app.api.v1.billing import router as billing_router
from app.api.v1.teams import router as teams_router

settings = get_settings()
logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("Starting CodeCollab Business Logic Service", version=settings.app_version)

    # Import all models so SQLAlchemy's metadata is populated before create_all
    import app.models  # noqa: F401

    if settings.is_development:
        await init_db()
        logger.info("Database initialized")

    yield

    logger.info("Shutting down CodeCollab Business Logic Service")
    await close_db()
    logger.info("Database connections closed")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Business Logic Service for CodeCollab - Authentication, Projects, AI, Billing, Search",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

# Mount Prometheus metrics endpoint
if settings.enable_metrics:
    metrics_app = make_asgi_app()
    app.mount("/metrics", metrics_app)


@app.get("/health")
async def health_check():
    """
    Health check endpoint for load balancers and monitoring.
    
    Returns:
        dict: Health status with service information
    """
    return {
        "status": "healthy",
        "version": settings.app_version,
        "environment": settings.environment,
        "service": "business-logic",
    }


@app.get("/")
async def root():
    """
    Root endpoint with service information.
    
    Returns:
        dict: Service information
    """
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs" if settings.is_development else "disabled",
    }


app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(contact_router, prefix="/api/v1")
app.include_router(billing_router, prefix="/api/v1")
app.include_router(teams_router, prefix="/api/v1")
