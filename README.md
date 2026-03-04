# KODLMS — Learning Management System

KODLMS is a full-stack Learning Management System designed for structured online learning.
Students can enroll in courses, watch lessons sequentially, track progress, and resume videos from the exact timestamp where they stopped.

The platform features a premium dark SaaS interface, JWT authentication, and persistent video progress tracking.

---

# Live Demo

Frontend
https://kod-lms.vercel.app

Backend API
https://kod-lms.onrender.com

---

# Features

Authentication
• Secure JWT login system
• Refresh token rotation
• httpOnly cookie protection

Course Learning System
• Structured course → section → video hierarchy
• Sequential lesson unlocking
• Students progress step-by-step

Video Progress Tracking
• Resume video from last watched timestamp
• Progress stored in database
• Completion tracking per lesson

Dashboard
• Continue learning card
• Course progress overview
• Circular progress indicators

Premium UI
• Dark SaaS design
• Smooth transitions
• Interactive components

---

# Tech Stack

Frontend

React (Vite)
TailwindCSS
Axios
Vimeo Player SDK

Backend

Node.js
Express.js
Sequelize ORM

Database

MySQL (Aiven Cloud)

Deployment

Frontend → Vercel
Backend → Render
Database → Aiven MySQL

---

# System Architecture

Browser (User)
↓
React Frontend (Vercel)
↓
Node.js API (Render)
↓
MySQL Database (Aiven Cloud)

---

# Database Schema

Users

* id
* name
* email
* password
* role
* createdAt
* updatedAt

Subjects

* id
* title
* description

Sections

* id
* title
* subjectId

Videos

* id
* title
* videoUrl
* objectives
* outcomes
* sectionId

Enrollments

* id
* userId
* subjectId

VideoProgress

* id
* userId
* videoId
* completed
* lastWatched

---

# Authentication Flow

User logs in
↓
Backend issues access token (15 min)
↓
Refresh token stored in httpOnly cookie (7 days)
↓
Axios interceptor refreshes access token automatically when expired

---

# Video Resume System

The system tracks video progress using the Vimeo Player SDK.

Process:

1. Player emits time updates
2. Frontend sends timestamp to backend
3. Backend stores progress in database
4. When user returns, player seeks to last watched timestamp

This enables seamless learning continuity.

---

# Sequential Course Progression

Lessons unlock sequentially.

A lesson is accessible if:

• It is already completed
OR
• It is the next lesson in the course sequence

Future lessons remain locked until progress continues.

---

# Installation (Local Development)

Clone the repository

git clone https://github.com/akshay-shastri/KOD_LMS.git

Navigate to project folder

cd KOD_LMS

---

Backend Setup

cd backend

Install dependencies

npm install

Create .env file

PORT=5000
DB_HOST=your_host
DB_PORT=your_port
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret

Start backend

npm start

---

Frontend Setup

cd frontend

Install dependencies

npm install

Create .env file

VITE_API_URL=http://localhost:5000/api

Start frontend

npm run dev

Frontend will run at

http://localhost:5173

---

# Deployment

Backend Deployment (Render)

Root directory: backend

Build command

npm install

Start command

node src/server.js

Environment variables

DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
JWT_SECRET
JWT_REFRESH_SECRET
FRONTEND_URL

---

Frontend Deployment (Vercel)

Root directory: frontend

Build command

npm run build

Output directory

dist

Environment variable

VITE_API_URL=https://kod-lms.onrender.com/api

---

# Future Improvements

Admin dashboard for course creation
Video upload management
Learning analytics dashboard
Course completion certificates
Discussion forums for students

---

# Author

Akshay Shastri

GitHub
https://github.com/akshay-shastri

---

# License

This project is licensed under the MIT License.
