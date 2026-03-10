"""
Migration: add user_id column to transactions, budgets, and saving_goals.
Supports both SQLite and PostgreSQL via SQLAlchemy.
Run: python migrate_user_id.py
"""
import os
from sqlalchemy import create_engine, text
from database import SQLALCHEMY_DATABASE_URL

def migrate():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    tables = ["transactions", "budgets", "saving_goals"]
    
    with engine.begin() as conn:
        for table in tables:
            # Check if column exists
            try:
                # This check varies by DB, but a simple SELECT will tell us
                conn.execute(text(f"SELECT user_id FROM {table} LIMIT 1"))
                print(f"[{table}] user_id column already exists, skipping.")
            except Exception:
                print(f"[{table}] Adding user_id column...")
                # Add column
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN user_id INTEGER REFERENCES users(id)"))
                # Back-fill (assuming user 1 exists)
                conn.execute(text(f"UPDATE {table} SET user_id = 1 WHERE user_id IS NULL"))
                print(f"[{table}] Backfilled existing rows with user_id=1")

    print("\nMigration complete.")

if __name__ == "__main__":
    migrate()
