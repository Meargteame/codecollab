"""Team schemas"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class TeamResponse(BaseModel):
    id: UUID
    name: str
    owner_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TeamMemberResponse(BaseModel):
    id: UUID
    team_id: UUID
    user_id: UUID
    role: str
    joined_at: datetime
    # Joined from users table
    email: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}


class AddMemberRequest(BaseModel):
    email: str
    role: str = "member"  # admin, member, viewer


class UpdateRoleRequest(BaseModel):
    role: str  # admin, member, viewer


class CreateTeamRequest(BaseModel):
    name: str
