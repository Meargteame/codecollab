"""Application configuration management"""

from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "CodeCollab Business Logic Service"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = False
    log_level: str = "INFO"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    workers: int = 4

    # Database
    database_url: str = Field(
        default="postgresql+asyncpg://codecollab:password@localhost:5432/codecollab"
    )
    database_pool_size: int = 20
    database_max_overflow: int = 10
    database_pool_timeout: int = 30

    # Redis
    redis_url: str = "redis://localhost:6379/0"
    redis_max_connections: int = 50
    redis_socket_timeout: int = 5
    redis_socket_connect_timeout: int = 5

    # JWT
    jwt_secret: str = Field(default="change-me-in-production")
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60
    jwt_refresh_token_expire_days: int = 30

    # Password Hashing
    bcrypt_rounds: int = 12

    # OpenAI
    openai_api_key: str = Field(default="")
    openai_model: str = "gpt-4"
    openai_timeout: int = 5
    openai_max_retries: int = 3

    # Stripe
    stripe_api_key: str = Field(default="")
    stripe_webhook_secret: str = Field(default="")
    stripe_free_price_id: str = "price_free"
    stripe_pro_price_id: str = "price_pro"
    stripe_enterprise_price_id: str = "price_enterprise"

    # Elasticsearch
    elasticsearch_url: str = "http://localhost:9200"
    elasticsearch_index_prefix: str = "codecollab"
    elasticsearch_timeout: int = 30
    elasticsearch_max_retries: int = 3

    # S3/MinIO
    s3_endpoint: str = "http://localhost:9000"
    s3_access_key: str = "minioadmin"
    s3_secret_key: str = "minioadmin"
    s3_bucket: str = "codecollab-files"
    s3_region: str = "us-east-1"

    # Rate Limiting
    rate_limit_free_tier: int = 100
    rate_limit_pro_tier: int = 1000
    rate_limit_enterprise_tier: int = 0  # 0 = unlimited
    ai_completion_rate_limit: int = 100
    ai_explanation_rate_limit: int = 20
    ai_bug_detection_rate_limit: int = 10

    # Email
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = "noreply@codecollab.com"
    email_verification_expire_hours: int = 24
    password_reset_expire_hours: int = 1

    # CORS
    cors_origins: List[str] = ["http://localhost:3000"]
    cors_allow_credentials: bool = True
    cors_allow_methods: List[str] = ["*"]
    cors_allow_headers: List[str] = ["*"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | List[str]) -> List[str]:
        """Parse CORS origins from comma-separated string or list"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    # Monitoring
    prometheus_port: int = 9090
    enable_metrics: bool = True

    # Feature Flags
    enable_ai_features: bool = True
    enable_search: bool = True
    enable_billing: bool = True

    # File Upload Limits
    max_file_size_mb: int = 50
    max_project_size_gb: int = 50

    # Usage Limits
    free_tier_storage_gb: int = 1
    pro_tier_storage_gb: int = 50
    enterprise_tier_storage_gb: int = 0  # 0 = unlimited

    @property
    def is_production(self) -> bool:
        """Check if running in production environment"""
        return self.environment.lower() == "production"

    @property
    def is_development(self) -> bool:
        """Check if running in development environment"""
        return self.environment.lower() == "development"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
