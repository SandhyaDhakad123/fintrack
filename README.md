# 💰 FinTrack – Personal Finance Tracker

FinTrack is a full-stack personal finance management web application that helps users track income, expenses, budgets, and savings goals in one place.

Users can easily manage their financial activities and get a clear overview of their spending and savings.

---

## 🚀 Live Demo

🌐 Live App  
https://finetrackerapp.netlify.app

💻 GitHub Repository  
https://github.com/SandhyaDhakad123/fintrack

---

## ✨ Features

• User Authentication (Sign Up / Sign In)  
• Add and manage transactions  
• Track income and expenses  
• Monthly budget management  
• Savings goals tracking  
• Financial dashboard overview  
• Transaction history  
• Responsive UI (works on desktop & mobile)

---

## 🛠️ Tech Stack

### Frontend
React  
Vite  
CSS  
React Toastify  

### Backend
FastAPI  
Python  
SQLAlchemy  
JWT Authentication  

### Database
SQLite

### Deployment
Netlify (Frontend)  
Render (Backend)


fintrack
│
├── backend
│ ├── main.py
│ ├── models.py
│ ├── database.py
│ ├── auth.py
│ └── requirements.txt
│
├── frontend
│ ├── src
│ ├── public
│ ├── package.json
│ └── vite.config.js

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

---

## 👩‍💻 Author
Sandhya Dhakad

GitHub  
https://github.com/SandhyaDhakad123

LinkedIn  
https://www.linkedin.com/in/sandhya-dhakad-2055822b4/
---

## 📂 Project Structure
