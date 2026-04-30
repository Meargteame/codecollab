"""Document model"""

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import String, DateTime, ForeignKey, func, Text, BigInteger, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Document(Base):
    """Document model for collaborative editing"""

    __tablename__ = "documents"
    __table_args__ = (UniqueConstraint("project_id", "file_path", name="uq_project_file"),)

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    project_id: Mapped[UUID] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    file_path: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    version: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    def __repr__(self) -> str:
        return f"<Document(id={self.id}, project_id={self.project_id}, file_path={self.file_path}, version={self.version})>"
