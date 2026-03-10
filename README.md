# 💰 FinTrack – Personal Finance Tracker

FinTrack is a full-stack personal finance management application that allows users to track income, expenses, budgets, and savings goals in one place.

The application focuses on secure authentication, user-level data isolation, and real-time financial insights to help users manage their finances effectively.

---

## 🚀 Live Demo

🌐 Live App  
https://finetrackerapp.netlify.app

💻 GitHub Repository  
https://github.com/SandhyaDhakad123/fintrack

---

## ✨ Features
• Secure User Authentication (JWT + Refresh Tokens)
• Add, edit, and delete transactions
• Track income and expenses
• Monthly budget management
• Savings goals tracking
• Financial dashboard overview
• Transaction history with filters
• User data isolation (each user sees only their data)
• Responsive UI (desktop & mobile)
• Audit logging for security

---

## 🛠️ Tech Stack

Frontend
• React (Vite)
• Axios
• CSS
• React Toastify

Backend
• FastAPI
• Python
• SQLAlchemy ORM
• JWT Authentication

Database
• SQLite (Development)
• PostgreSQL Ready

Deployment
• Netlify – Frontend
• Render – Backend

---

## ⚙️ Installation (Run Locally)

### Clone the repository
git clone https://github.com/SandhyaDhakad123/fintrack.git


### Backend Setup
cd backend
python -m venv .venv
..venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

Backend will run on:
http://127.0.0.1:8000


### Frontend Setup
cd frontend
npm install
npm run dev

Frontend will run on:
http://localhost:5173

---

## 📌 Future Improvements

• Export transactions to CSV
• AI-based spending insights
• Email monthly financial report
• Dark mode support
• Bank API integration

---

## 👩‍💻 Author

Sandhya Dhakad

GitHub  
https://github.com/SandhyaDhakad123

LinkedIn  
https://www.linkedin.com/in/sandhya-dhakad-2055822b4/
---

## 📂 Project Structure

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
