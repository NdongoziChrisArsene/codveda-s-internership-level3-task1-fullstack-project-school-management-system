# School Management System — Full-Stack PERN Application

A fully functional full-stack web application built with PostgreSQL, 
Express.js, React, and Node.js (PERN stack), featuring authentication, 
role-based access control, and complete CRUD operations.

## Features

- JWT-based authentication with bcrypt password hashing
- Role-based access control with three roles: Admin, Teacher, and Student
- Admin can manage users, create and delete courses, and enroll students
- Teachers can view courses and assign grades to enrolled students
- Students can browse available courses, enroll, and view their grades
- Protected routes on both frontend and backend
- RESTful API with proper error handling and data validation
- Responsive UI built with React and React Router

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express.js
- Database: PostgreSQL with Prisma ORM
- Authentication: JSON Web Tokens (JWT) + bcryptjs

## Getting Started

### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev
