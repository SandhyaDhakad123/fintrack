import sqlite3
import os

db_path = 'finance.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    print("Checking transactions...")
    cursor.execute("SELECT DISTINCT type, category FROM transactions")
    data = cursor.fetchall()
    print("Current data types/categories:", data)
    
    print("Standardizing types to UPPERCASE...")
    cursor.execute("UPDATE transactions SET type = 'CREDIT' WHERE type LIKE 'credit%'")
    cursor.execute("UPDATE transactions SET type = 'DEBIT' WHERE type LIKE 'debit%'")
    
    print("Standardizing categories to UPPERCASE...")
    cursor.execute("UPDATE transactions SET category = UPPER(category)")
    
    conn.commit()
    print("Database standardization complete.")
except Exception as e:
    print(f"Error: {e}")
    conn.rollback()
finally:
    conn.close()
