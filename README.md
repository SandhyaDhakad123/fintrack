# 💰 FinTrack – Personal Finance Tracker

FinTrack is a **full-stack personal finance management web application** that helps users track income, expenses, budgets, and savings goals in one place.

Users can easily manage their financial activities and get a clear overview of their spending and savings.

---

# 🚀 Live Demo

🌐 **Frontend (Netlify)**
https://finetrackerapp.netlify.app

⚙️ **Backend API (Render)**
https://fintrack-pb21.onrender.com

💻 **GitHub Repository**
https://github.com/SandhyaDhakad123/fintrack

---

# ✨ Features

• Secure **User Authentication (Sign Up / Sign In)**
• JWT based authentication system
• Add and manage transactions
• Track income and expenses
• Monthly budget management
• Savings goals tracking
• Financial dashboard overview
• Transaction history
• Weekly and monthly financial reports
• Responsive UI (works on desktop & mobile)

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* CSS
* React Toastify

## Backend

* FastAPI
* Python
* SQLAlchemy
* JWT Authentication

## Database

* SQLite

## Deployment

* Netlify (Frontend)
* Render (Backend)

---

# 📂 Project Structure

```
fintrack
│
├── backend
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── auth.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
```

---

# ⚙️ Installation (Run Locally)

## Clone Repository

```
git clone https://github.com/SandhyaDhakad123/fintrack.git
```

---

## Backend Setup

```
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🔒 Security Features

• Password hashing using **bcrypt**
• JWT based authentication
• Rate limiting for login attempts
• CORS protection
• Secure HTTP headers
• Input validation with Pydantic

---

# 📌 Future Improvements

• Export transactions to CSV
• AI-based spending insights
• Email monthly financial report
• Dark mode support
• PostgreSQL database integration

---

# 👩‍💻 Author

**Sandhya Dhakad**

GitHub
https://github.com/SandhyaDhakad123

LinkedIn
https://www.linkedin.com/in/sandhya-dhakad-2055822b4/
