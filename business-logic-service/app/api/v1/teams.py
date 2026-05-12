"""Team endpoints"""

import structlog
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.team import Team, TeamMember
from app.models.user import User
from app.schemas.auth import TokenPayload
from app.schemas.team import (
    AddMemberRequest,
    CreateTeamRequest,
    TeamMemberResponse,
    TeamResponse,
    UpdateRoleRequest,
)

router = APIRouter(prefix="/teams", tags=["teams"])
logger = structlog.get_logger()

VALID_ROLES = {"owner", "admin", "member", "viewer"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _get_team_or_404(team_id: UUID, db: AsyncSession) -> Team:
    team = await db.get(Team, team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    return team


async def _require_admin(team_id: UUID, user_id: UUID, db: AsyncSession) -> None:
    """Raise 403 if the user is not owner or admin of the team."""
    result = await db.execute(
        select(TeamMember)
        .where(TeamMember.team_id == team_id)
        .where(TeamMember.user_id == user_id)
    )
    member = result.scalar_one_or_none()
    if not member or member.role not in ("owner", "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")


async def _build_member_response(tm: TeamMember, db: AsyncSession) -> TeamMemberResponse:
    user = await db.get(User, tm.user_id)
    return TeamMemberResponse(
        id=tm.id,
        team_id=tm.team_id,
        user_id=tm.user_id,
        role=tm.role,
        joined_at=tm.joined_at,
        email=user.email if user else None,
        full_name=user.full_name if user else None,
        avatar_url=user.avatar_url if user else None,
    )


# ---------------------------------------------------------------------------
# POST /teams  — create a team
# ---------------------------------------------------------------------------

@router.post("", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    body: CreateTeamRequest,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    team = Team(name=body.name, owner_id=UUID(current_user.sub))
    db.add(team)
    await db.flush()

    # Add creator as owner member
    db.add(TeamMember(team_id=team.id, user_id=UUID(current_user.sub), role="owner"))
    await db.commit()
    await db.refresh(team)
    logger.info("team_created", team_id=str(team.id), owner=str(current_user.sub))
    return team


# ---------------------------------------------------------------------------
# GET /teams  — list teams the current user belongs to
# ---------------------------------------------------------------------------

@router.get("", response_model=list[TeamResponse])
async def list_teams(
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Team)
        .join(TeamMember, TeamMember.team_id == Team.id)
        .where(TeamMember.user_id == UUID(current_user.sub))
        .order_by(Team.created_at.desc())
    )
    return result.scalars().all()


# ---------------------------------------------------------------------------
# GET /teams/{team_id}/members  — list members
# ---------------------------------------------------------------------------

@router.get("/{team_id}/members", response_model=list[TeamMemberResponse])
async def list_members(
    team_id: UUID,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_team_or_404(team_id, db)

    result = await db.execute(
        select(TeamMember)
        .where(TeamMember.team_id == team_id)
        .order_by(TeamMember.joined_at)
    )
    members = result.scalars().all()
    return [await _build_member_response(m, db) for m in members]


# ---------------------------------------------------------------------------
# POST /teams/{team_id}/members  — add a member by email
# ---------------------------------------------------------------------------

@router.post("/{team_id}/members", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
async def add_member(
    team_id: UUID,
    body: AddMemberRequest,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_team_or_404(team_id, db)
    await _require_admin(team_id, UUID(current_user.sub), db)

    if body.role not in VALID_ROLES or body.role == "owner":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")

    # Resolve user by email
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No user found with that email")

    # Check not already a member
    existing = await db.execute(
        select(TeamMember)
        .where(TeamMember.team_id == team_id)
        .where(TeamMember.user_id == user.id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User is already a member")

    tm = TeamMember(team_id=team_id, user_id=user.id, role=body.role, added_by=UUID(current_user.sub))
    db.add(tm)
    await db.commit()
    await db.refresh(tm)
    logger.info("team_member_added", team_id=str(team_id), user_id=str(user.id), role=body.role)
    return await _build_member_response(tm, db)


# ---------------------------------------------------------------------------
# PATCH /teams/{team_id}/members/{user_id}  — change role
# ---------------------------------------------------------------------------

@router.patch("/{team_id}/members/{member_user_id}", response_model=TeamMemberResponse)
async def update_member_role(
    team_id: UUID,
    member_user_id: UUID,
    body: UpdateRoleRequest,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_team_or_404(team_id, db)
    await _require_admin(team_id, UUID(current_user.sub), db)

    if body.role not in VALID_ROLES or body.role == "owner":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")

    result = await db.execute(
        select(TeamMember)
        .where(TeamMember.team_id == team_id)
        .where(TeamMember.user_id == member_user_id)
    )
    tm = result.scalar_one_or_none()
    if not tm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")

    if tm.role == "owner":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot change owner role")

    tm.role = body.role
    await db.commit()
    await db.refresh(tm)
    logger.info("team_member_role_updated", team_id=str(team_id), user_id=str(member_user_id), role=body.role)
    return await _build_member_response(tm, db)


# ---------------------------------------------------------------------------
# DELETE /teams/{team_id}/members/{user_id}  — remove member
# ---------------------------------------------------------------------------

@router.delete("/{team_id}/members/{member_user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_member(
    team_id: UUID,
    member_user_id: UUID,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_team_or_404(team_id, db)

    # Allow admins to remove others, or members to remove themselves
    if member_user_id != UUID(current_user.sub):
        await _require_admin(team_id, UUID(current_user.sub), db)

    result = await db.execute(
        select(TeamMember)
        .where(TeamMember.team_id == team_id)
        .where(TeamMember.user_id == member_user_id)
    )
    tm = result.scalar_one_or_none()
    if not tm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")

    if tm.role == "owner":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot remove the team owner")

    await db.delete(tm)
    await db.commit()
    logger.info("team_member_removed", team_id=str(team_id), user_id=str(member_user_id))


# ---------------------------------------------------------------------------
# DELETE /teams/{team_id}  — delete the team (owner only)
# ---------------------------------------------------------------------------

@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(
    team_id: UUID,
    current_user: TokenPayload = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    team = await _get_team_or_404(team_id, db)

    if team.owner_id != UUID(current_user.sub):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the team owner can delete the team")

    await db.delete(team)
    await db.commit()
    logger.info("team_deleted", team_id=str(team_id), owner=str(current_user.sub))
