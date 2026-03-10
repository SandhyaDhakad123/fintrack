import sqlite3
import os

def reset_db():
    db_path = 'd:/test antigravity/backend/finance.db'
    if os.path.exists(db_path):
        print(f"Removing existing database at {db_path}...")
        try:
            # We need to be careful if the server is running and holding a lock
            # But usually on Windows, os.remove will fail if locked.
            os.remove(db_path)
            print("Database removed successfully.")
        except Exception as e:
            print(f"Error removing database: {e}")
            print("Please stop the backend server and try again.")
            return

    print("The database will be recreated automatically when you start the backend server.")
    print("All transactions, budgets, goals, and users have been cleared.")

if __name__ == "__main__":
    reset_db()
