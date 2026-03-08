from sqlalchemy import Column, Integer, String, Float, Date, Enum as SQLEnum, Boolean, UniqueConstraint
from database import Base
import enum

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

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    type = Column(SQLEnum(TransactionType), nullable=False)
    category = Column(SQLEnum(Category), nullable=False, default=Category.OTHERS)
    date = Column(Date, nullable=False)
    description = Column(String, index=True)

class Budget(Base):
    __tablename__ = "budgets"
    __table_args__ = (UniqueConstraint('category', 'month', 'year', name='_category_month_year_uc'),)

    id = Column(Integer, primary_key=True, index=True)
    category = Column(SQLEnum(Category), nullable=False)
    monthly_limit = Column(Float, nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)

class SavingGoal(Base):
    __tablename__ = "saving_goals"

    id = Column(Integer, primary_key=True, index=True)
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
