import sqlite3
import os

def check_db():
    db_path = 'd:/test antigravity/backend/finance.db'
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    with open('d:/test antigravity/backend/debug_output.txt', 'w') as f:
        tables = ['transactions', 'budgets', 'saving_goals', 'users']
        
        for table in tables:
            f.write(f"\n--- Table: {table} ---\n")
            try:
                cursor.execute(f"PRAGMA table_info({table})")
                columns = [info[1] for info in cursor.execute(f"PRAGMA table_info({table})").fetchall()]
                f.write(f"Columns: {columns}\n")
                
                cursor.execute(f"SELECT * FROM {table}")
                rows = cursor.fetchall()
                f.write(f"Total rows: {len(rows)}\n")
                
                if len(rows) > 0 and 'user_id' in columns:
                    user_id_idx = columns.index('user_id')
                    cursor.execute(f"SELECT user_id, COUNT(*) FROM {table} GROUP BY user_id")
                    distribution = cursor.fetchall()
                    f.write(f"User ID Distribution: {distribution}\n")
                    
                    # Show a few sample rows
                    cursor.execute(f"SELECT * FROM {table} LIMIT 10")
                    samples = cursor.fetchall()
                    for row in samples:
                        f.write(f"{row}\n")
                elif table == 'users':
                    for row in rows:
                        f.write(f"{row}\n")
            except Exception as e:
                f.write(f"Error checking table {table}: {e}\n")

    conn.close()

if __name__ == "__main__":
    check_db()
