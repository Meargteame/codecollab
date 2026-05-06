"""Pydantic schemas for audit log responses"""

from datetime import datetime
from ipaddress import IPv4Address, IPv6Address
from uuid import UUID

from pydantic import BaseModel, field_validator


class AuditLogResponse(BaseModel):
    """Single audit log entry returned by the API."""

    id: UUID
    user_id: UUID | None
    action: str
    resource_type: str
    resource_id: UUID | None
    details: dict | None
    ip_address: str | None
    user_agent: str | None
    created_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("ip_address", mode="before")
    @classmethod
    def coerce_ip_address(cls, v: object) -> str | None:
        """SQLAlchemy INET returns IPv4Address/IPv6Address — coerce to str."""
        if v is None:
            return None
        if isinstance(v, (IPv4Address, IPv6Address)):
            return str(v)
        return v


class AuditLogPage(BaseModel):
    """Paginated list of audit log entries."""

    items: list[AuditLogResponse]
    total: int
    limit: int
    offset: int
