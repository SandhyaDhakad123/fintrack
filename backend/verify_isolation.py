import requests
import time
import sys

API_URL = "http://127.0.0.1:8000"

def register_user(name, email, password):
    try:
        res = requests.post(f"{API_URL}/auth/register", json={
            "name": name,
            "email": email,
            "password": password
        })
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print(f"Error registering user {email}: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")
        sys.exit(1)

def login_user(email, password):
    try:
        res = requests.post(f"{API_URL}/auth/login", json={
            "email": email,
            "password": password
        })
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print(f"Error logging in user {email}: {e}")
        sys.exit(1)

def test_isolation():
    # 1. Register two users
    timestamp = int(time.time())
    user_a_email = f"user_a_{timestamp}@example.com"
    user_b_email = f"user_b_{timestamp}@example.com"
    password = "Password123!"

    print(f"Registering User A: {user_a_email}")
    user_a = register_user("User A", user_a_email, password)
    token_a = user_a["access_token"]

    print(f"Registering User B: {user_b_email}")
    user_b = register_user("User B", user_b_email, password)
    token_b = user_b["access_token"]
    user_b_id = user_b["user_id"]

    # 2. User A creates a transaction
    print("User A creating a transaction...")
    res = requests.post(f"{API_URL}/transactions/", 
        json={
            "amount": 100.0,
            "type": "DEBIT",
            "category": "FOOD",
            "date": "2024-03-10",
            "description": "User A secret lunch"
        },
        headers={"Authorization": f"Bearer {token_a}"}
    )
    res.raise_for_status()
    transaction_a = res.json()
    transaction_a_id = transaction_a["id"]
    print(f"Created transaction ID: {transaction_a_id}")

    # 3. User B tries to see User A's transaction in the list
    print("User B fetching transactions...")
    res = requests.get(f"{API_URL}/transactions/", 
        headers={"Authorization": f"Bearer {token_b}"}
    )
    res.raise_for_status()
    transactions_b = res.json()
    found = any(t["id"] == transaction_a_id for t in transactions_b)
    if found:
        print("❌ FAILURE: User B can see User A's transaction in the list!")
    else:
        print("✅ SUCCESS: User B cannot see User A's transaction in the list.")

    # 4. User B tries to delete User A's transaction
    print(f"User B attempting to delete User A's transaction {transaction_a_id}...")
    res = requests.delete(f"{API_URL}/transactions/{transaction_a_id}",
        headers={"Authorization": f"Bearer {token_b}"}
    )
    if res.status_code == 404:
        print("✅ SUCCESS: User B received 404/Not Found when trying to delete User A's data.")
    elif res.status_code == 204:
         print("❌ FAILURE: User B successfully deleted User A's data!")
    else:
        print(f"❓ INFO: User B got status {res.status_code} (expected 404).")

    # 5. User A creates a goal
    print("User A creating a saving goal...")
    res = requests.post(f"{API_URL}/goals/", 
        json={
            "name": "User A's Secret Car",
            "target_amount": 20000.0,
            "deadline": "2025-12-31"
        },
        headers={"Authorization": f"Bearer {token_a}"}
    )
    res.raise_for_status()
    goal_a = res.json()
    goal_a_id = goal_a["id"]

    # 6. User B tries to update User A's goal
    print(f"User B attempting to update User A's goal {goal_a_id}...")
    res = requests.put(f"{API_URL}/goals/{goal_a_id}",
        json={
            "name": "User B Hacked Goal",
            "target_amount": 1.0,
            "deadline": "2025-12-31"
        },
        headers={"Authorization": f"Bearer {token_b}"}
    )
    # 7. Test Budget Optimization & Isolation
    print("User A creating a budget...")
    month, year = 3, 2024
    res = requests.post(f"{API_URL}/budgets/",
        json={
            "category": "FOOD",
            "monthly_limit": 500.0,
            "month": month,
            "year": year
        },
        headers={"Authorization": f"Bearer {token_a}"}
    )
    res.raise_for_status()

    # User A has 100 spent on FOOD (from step 2)
    print("User A fetching budgets (should show 100.0 spent)...")
    res = requests.get(f"{API_URL}/budgets/",
        params={"month": month, "year": year},
        headers={"Authorization": f"Bearer {token_a}"}
    )
    res.raise_for_status()
    budgets_a = res.json()
    food_budget_a = next((b for b in budgets_a if b["category"] == "FOOD"), None)
    if food_budget_a and food_budget_a["current_spent"] == 100.0:
        print("✅ SUCCESS: User A's optimized budget query returned correct spent amount (100.0).")
    else:
        spent = food_budget_a["current_spent"] if food_budget_a else "None"
        print(f"❌ FAILURE: User A's budget spent amount is {spent} (expected 100.0).")

    print("User B fetching budgets (should NOT show User A's budget and should show 0 spent if they had one)...")
    res = requests.get(f"{API_URL}/budgets/",
        params={"month": month, "year": year},
        headers={"Authorization": f"Bearer {token_b}"}
    )
    res.raise_for_status()
    budgets_b = res.json()
    if any(b["category"] == "FOOD" for b in budgets_b):
         print("❌ FAILURE: User B can see User A's budget or has a ghost budget!")
    else:
         print("✅ SUCCESS: User B's budget list is empty (isolated).")

import traceback

if __name__ == "__main__":
    try:
        # Wait a bit for server to be ready
        time.sleep(2)
        test_isolation()
    except Exception as e:
        print(f"Unexpected error during testing: {e}")
        traceback.print_exc()
