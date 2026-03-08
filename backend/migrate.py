import sqlite3
import os

db_path = 'd:/test antigravity/backend/finance.db'

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if category column exists
        cursor.execute("PRAGMA table_info(transactions)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'category' not in columns:
            print("Adding category column to transactions table...")
            cursor.execute("ALTER TABLE transactions ADD COLUMN category TEXT DEFAULT 'Others'")
            print("Success.")
        else:
            print("Category column already exists.")
            
        conn.commit()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()
else:
    print("Database file not found. SQLAlchemy will create it from scratch.")
