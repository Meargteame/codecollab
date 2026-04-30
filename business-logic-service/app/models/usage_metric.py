"""Usage metric model"""

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import String, DateTime, ForeignKey, func, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class UsageMetric(Base):
    """Usage metric model for tracking resource consumption"""

    __tablename__ = "usage_metrics"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    metric_type: Mapped[str] = mapped_column(
        String(100), nullable=False
    )  # storage, api_requests, ai_requests
    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    period_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    def __repr__(self) -> str:
        return f"<UsageMetric(id={self.id}, user_id={self.user_id}, metric_type={self.metric_type}, amount={self.amount})>"
