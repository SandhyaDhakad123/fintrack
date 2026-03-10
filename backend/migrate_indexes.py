"""
Migration: Add composite index to transactions table.
Supports both SQLite and PostgreSQL.
Run: python migrate_indexes.py
"""
import os
from sqlalchemy import create_engine, text
from database import SQLALCHEMY_DATABASE_URL

def migrate():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    with engine.begin() as conn:
        print("Adding composite index ix_transactions_user_id_date...")
        try:
            # SQL for index creation is standard across SQLite and PostgreSQL
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_transactions_user_id_date ON transactions (user_id, date)"))
            print("Successfully created index ix_transactions_user_id_date.")
        except Exception as e:
            print(f"Error creating index: {e}")
            print("It might already exist or the database doesn't support IF NOT EXISTS.")
            # Fallback for DBs that don't support IF NOT EXISTS (though SQLite/Postgres do)
            try:
                conn.execute(text("CREATE INDEX ix_transactions_user_id_date ON transactions (user_id, date)"))
                print("Successfully created index ix_transactions_user_id_date (fallback).")
            except Exception as e2:
                 print(f"Index creation failed: {e2}")

    print("\nMigration complete.")

if __name__ == "__main__":
    migrate()
