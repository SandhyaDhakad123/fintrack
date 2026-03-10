"""
Migration: Add refresh_tokens and audit_logs tables.
Supports both SQLite and PostgreSQL via SQLAlchemy.
Run: python migrate_security.py
"""
from sqlalchemy import create_engine, text
from database import SQLALCHEMY_DATABASE_URL

def migrate():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    with engine.begin() as conn:
        print("Creating refresh_tokens table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                token TEXT NOT NULL UNIQUE,
                expires_at DATETIME NOT NULL,
                revoked BOOLEAN DEFAULT 0
            )
        """))

        print("Creating audit_logs table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                action TEXT NOT NULL,
                target_id INTEGER,
                target_type TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                details TEXT
            )
        """))

    print("Security migration complete.")

if __name__ == "__main__":
    migrate()
