from sqlalchemy import Column, Integer, String, Float, Date, Enum as SQLEnum, Boolean, UniqueConstraint, ForeignKey, DateTime, Index
from database import Base
import enum
from datetime import datetime

class TransactionType(str, enum.Enum):
    CREDIT = "CREDIT"
    DEBIT = "DEBIT"

class Category(str, enum.Enum):
    FOOD = "FOOD"
    TRAVEL = "TRAVEL"
    BILLS = "BILLS"
    SHOPPING = "SHOPPING"
    ENTERTAINMENT = "ENTERTAINMENT"
    HEALTH = "HEALTH"
    OTHERS = "OTHERS"

class Transaction(Base):
    __tablename__ = "transactions"
    __table_args__ = (
        Index('ix_transactions_user_id_date', 'user_id', 'date'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    type = Column(SQLEnum(TransactionType), nullable=False)
    category = Column(SQLEnum(Category), nullable=False, default=Category.OTHERS)
    date = Column(Date, nullable=False)
    description = Column(String, index=True)

class Budget(Base):
    __tablename__ = "budgets"
    __table_args__ = (UniqueConstraint('user_id', 'category', 'month', 'year', name='_user_category_month_year_uc'),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category = Column(SQLEnum(Category), nullable=False)
    monthly_limit = Column(Float, nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)

class SavingGoal(Base):
    __tablename__ = "saving_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    deadline = Column(Date, nullable=False)

class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    name            = Column(String, nullable=False)
    email           = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    token      = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked    = Column(Boolean, default=False)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id             = Column(Integer, primary_key=True, index=True)
    user_id        = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    action         = Column(String, nullable=False)
    target_id      = Column(Integer, nullable=True) # e.g., transaction_id
    target_type    = Column(String, nullable=True) # e.g., "transaction"
    timestamp      = Column(DateTime, default=datetime.utcnow)
    details        = Column(String, nullable=True)
