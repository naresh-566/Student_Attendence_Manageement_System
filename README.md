🎓 AttendEase – Student Attendance Management System
A full-stack Student Attendance Management System developed to simplify student, faculty, and attendance management through a web-based application.

The system provides role-based access for Administrators, Faculty, and Students, allowing attendance to be recorded, managed, and viewed efficiently.

📌 Table of Contents
Project Overview

Features

Technology Stack

Project Structure

Prerequisites

Installation

Database Setup

Environment Configuration

Running the Project

Application Workflow

Screenshots / Output

Team Contribution

Git Workflow for Team Members

Troubleshooting

Future Enhancements

License

📖 Project Overview
AttendEase is a web-based Student Attendance Management System designed to digitize the process of managing student attendance.

The system uses a React frontend, Node.js + Express backend, and MySQL database.

It allows authorized users to:

Manage student information

Manage faculty information

Manage subjects

Record student attendance

View attendance records

Calculate attendance statistics

Manage users according to their roles

Display attendance information through dashboards and reports

The database contains tables for users, students, faculty, subjects, attendance sessions, and attendance records.

✨ Features
🔐 Authentication
User login

JWT-based authentication

Role-based access

Secure password storage using bcrypt

Session/token expiration

👨‍💼 Admin
Administrators can manage the major components of the system, including:

Students

Faculty

Subjects

Attendance

User accounts

Dashboard information

👨‍🏫 Faculty
Faculty members can:

View assigned subjects

View students

Mark attendance

Update attendance records

View attendance information

👨‍🎓 Student
Students can:

View their profile

View attendance records

Check attendance percentage

Monitor their attendance status

📊 Dashboard & Reports
The application provides:

Attendance statistics

Student information

Attendance summaries

Charts and visual reports

Subject-wise attendance information

🛠 Technology Stack
Frontend
React 18

Vite

React Router

Axios

Bootstrap 5

Bootstrap Icons

Chart.js

React Chart.js 2

Backend
Node.js

Express.js

JWT

bcryptjs

CORS

Morgan

dotenv

MySQL2

Database
MySQL

SQL

Development Tools
Git

GitHub

Visual Studio Code

npm

📂 Project Structure
Student_Attendence_Manageement_System/
│
├── backend/
│   ├── scripts/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── database/
│   └── schema.sql
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

⚙️ Prerequisites
Before running the project, install the following software.

1. Node.js
Install Node.js version 18 or later.

Check the installation:

node --version
npm --version

2. MySQL
Install MySQL Server 8.0+ and make sure the MySQL service is running.

Check MySQL:

mysql --version

3. Git
Install Git.

Check the installation:

git --version

4. Code Editor
Recommended:

Visual Studio Code
