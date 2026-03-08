import sqlite3
from datetime import date

def migrate():
    # Connect
    conn = sqlite3.connect('finance.db')
    cursor = conn.cursor()
    
    # Begin transaction
    cursor.execute('BEGIN TRANSACTION')
    
    try:
        # 1. Rename existing table
        cursor.execute('ALTER TABLE budgets RENAME TO budgets_old')
        
        # 1.5. Drop the old index so we can reuse the name
        cursor.execute('DROP INDEX IF EXISTS ix_budgets_id')
        
        # 2. Create new table (exactly as SQLAlchemy expects it)
        cursor.execute('''
            CREATE TABLE budgets (
                id INTEGER NOT NULL, 
                category VARCHAR(13) NOT NULL, 
                monthly_limit FLOAT NOT NULL, 
                month INTEGER NOT NULL, 
                year INTEGER NOT NULL, 
                PRIMARY KEY (id), 
                CONSTRAINT _category_month_year_uc UNIQUE (category, month, year)
            )
        ''')
        cursor.execute("CREATE INDEX ix_budgets_id ON budgets (id)")
        
        # 3. Copy records over, setting month/year to CURRENT
        current_month = date.today().month
        current_year = date.today().year
        
        cursor.execute(f'''
            INSERT INTO budgets (id, category, monthly_limit, month, year)
            SELECT id, category, monthly_limit, {current_month}, {current_year}
            FROM budgets_old
        ''')
        
        # 4. Drop the old table
        cursor.execute('DROP TABLE budgets_old')
        
        # Commit success
        conn.commit()
        print(f"Successfully migrated budgets to include month ({current_month}) and year ({current_year}).")
        
    except Exception as e:
        conn.rollback()
        print(f"Migration failed: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
