from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Numeric
import uuid

class Base(DeclarativeBase):
    pass

class Component(Base):
    __tablename__ = "components"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    sku: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    price: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    asset_uri: Mapped[str | None] = mapped_column(String, nullable=True)