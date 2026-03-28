# GatorGrind

This project is a full-stack web application with authentication (Sign Up / Login).

## Tech Stack

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB Atlas

---

## How to Run the Project

### 1. Clone the repo

git clone https://github.com/ErrianaT/GatorGrind.git
cd GatorGrind

---

## Backend Setup

cd backend
npm install

Create a `.env` file inside `/backend`:

PORT=5001
MONGO_URI=your_mongodb_connection_string

Run backend:
npm run dev

You should see:
Server running on port 5001
MongoDB connected

---

## Frontend Setup

Open a new terminal:

cd frontend
npm install
npm run dev

Then open:
http://localhost:5173

---

## Features Implemented

- User Sign Up
- User Login
- Password hashing (bcrypt)
- MongoDB database integration
- Form validation (frontend + backend)
- Error handling

---

## Tested Cases

- Successful signup
- Duplicate user signup
- Successful login
- Wrong password
- User not found

---

## Notes

- Do NOT push `.env` file
- Make sure backend is running before testing frontend
