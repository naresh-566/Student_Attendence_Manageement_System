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

🚀 Installation
Step 1 – Clone the Repository
git clone https://github.com/naresh-566/Student_Attendence_Manageement_System.git

Move into the project directory:

cd Student_Attendence_Manageement_System

Step 2 – Install Dependencies
Install the root dependencies:

npm install

Install backend dependencies:

cd backend
npm install
cd ..

Install frontend dependencies:

cd frontend
npm install
cd ..

🗄️ Database Setup
The project uses MySQL.

The database schema is provided in:

database/schema.sql

The schema creates the database:

attendance_management

and tables including:

users

students

faculty

subjects

attendance_sessions

attendance

Step 1 – Open MySQL
You can use:

MySQL Workbench

MySQL Command Line

phpMyAdmin

Step 2 – Import the Database
Using MySQL command line:

mysql -u root -p < database/schema.sql

Enter your MySQL password when prompted.

Alternatively, open database/schema.sql in MySQL Workbench and execute it.

Step 3 – Verify Database
Run:

SHOW DATABASES;

You should see:

attendance_management

Select the database:

USE attendance_management;

Then:

SHOW TABLES;

You should see tables such as:

users
students
faculty
subjects
attendance_sessions
attendance

🔑 Environment Configuration
Create a .env file in the root directory.

You can copy the example configuration:

cp .env.example .env

On Windows, you can simply copy:

.env.example

and rename the copy to:

.env

Configure the database settings:

PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=attendance_management

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=24h

ATTENDANCE_THRESHOLD=75

Important
Replace:

DB_PASSWORD=your_mysql_password

with your actual MySQL password.

Do not commit your .env file to GitHub.

▶️ Running the Project
There are two ways to run the application.

Method 1 – Run Frontend and Backend Together
From the project root:

npm run dev

This starts:

Backend server

Frontend Vite development server

The backend runs on:

http://localhost:5000

The frontend normally runs on a Vite development URL such as:

http://localhost:5173

Open the frontend URL in your browser.

Method 2 – Run Separately
Start Backend
Open Terminal 1:

cd backend
npm run dev

The backend will start on:

http://localhost:5000

Start Frontend
Open Terminal 2:

cd frontend
npm run dev

Open the URL displayed by Vite in the terminal.

🌱 Seed Data
If the project contains the configured seed script, sample database data can be generated using:

npm run seed

This executes the backend seed runner.

After seeding, use the generated/sample credentials provided by the project data to log into the application.

🧪 Building the Frontend
To create a production build:

npm run build

The frontend build is generated using Vite.

To preview the production build:

cd frontend
npm run preview

🔄 Application Workflow
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      + Vite         │
                    └──────────┬──────────┘
                               │
                         HTTP / Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Express Backend    │
                    │     REST API        │
                    └──────────┬──────────┘
                               │
                     Authentication
                        + Business Logic
                               │
                               ▼
                    ┌─────────────────────┐
                    │    MySQL Database   │
                    └─────────────────────┘

📸 Screenshots / Output
Add the project screenshots to a folder named:

screenshots/

Recommended structure:

screenshots/
├── 01-login.png
├── 02-admin-dashboard.png
├── 03-student-management.png
├── 04-faculty-management.png
├── 05-subject-management.png
├── 06-mark-attendance.png
├── 07-attendance-report.png
└── 08-student-dashboard.png

Then add them to this README using:

Login Page
Admin Dashboard
Student Management
Faculty Management
Subject Management
Mark Attendance
Attendance Report
Student Dashboard
Note: Take screenshots from the running application and save them as PNG files using the names above. This keeps the README clean and makes the project output easy to evaluate.

👥 Team Contribution – 4 Members
The project can be divided into four major responsibilities so that every member has a clear contribution.

👨‍💻 Member 1 – Frontend & UI
Responsibility
Work on the React frontend and user interface.

Tasks
React components

Pages

Navigation

Login/register UI

Dashboard UI

Bootstrap styling

Responsive design

Student interface

Faculty interface

Main Folder
frontend/

Suggested Commit
git add frontend/
git commit -m "feat: develop frontend user interface"
git push origin member-1-frontend

👨‍💻 Member 2 – Backend & API
Responsibility
Develop the server-side functionality.

Tasks
Express server

REST APIs

Authentication

JWT implementation

Password hashing

Middleware

Student APIs

Faculty APIs

Attendance APIs

Error handling

Main Folder
backend/

Suggested Commit
git add backend/
git commit -m "feat: implement backend REST APIs"
git push origin member-2-backend

👨‍💻 Member 3 – Database
Responsibility
Design and manage the MySQL database.

Tasks
Database creation

Table design

Primary keys

Foreign keys

Relationships

Attendance schema

Sample/seed data

Database testing

Query optimization

Main Folder
database/

Suggested Commit
git add database/
git commit -m "feat: implement MySQL database schema"
git push origin member-3-database

👨‍💻 Member 4 – Testing, Documentation & Integration
Responsibility
Integration, testing, documentation, and project presentation.

Tasks
Test frontend and backend integration

Test login

Test attendance functionality

Test database connectivity

Fix integration bugs

Capture output screenshots

Prepare README

Prepare project documentation

Verify installation instructions

Final GitHub integration

Main Files/Folders
README.md
screenshots/
.env.example

Suggested Commit
git add README.md screenshots/ .env.example
git commit -m "docs: add project documentation and screenshots"
git push origin member-4-docs

🌿 Recommended Git Branch Structure
Each member should work on a separate branch.

main
│
├── member-1-frontend
├── member-2-backend
├── member-3-database
└── member-4-docs

After completing their work, each member creates a Pull Request to main.

🔀 Recommended Git Workflow
First clone the repository:

git clone https://github.com/naresh-566/Student_Attendence_Manageement_System.git
cd Student_Attendence_Manageement_System

Create your branch:

git checkout -b member-1-frontend

Make your changes.

Then:

git add .
git commit -m "feat: implement frontend"
git push origin member-1-frontend

Create a Pull Request on GitHub.

The project owner can review and merge the Pull Request into:

main

📋 Suggested Contribution Distribution
Member	Area	Main Contribution
Member 1	Frontend	React UI, pages, navigation
Member 2	Backend	Express APIs, authentication
Member 3	Database	MySQL schema, relationships, seed data
Member 4	Testing & Documentation	Integration, screenshots, README

This gives each member a clearly identifiable technical contribution.

🐛 Troubleshooting
MySQL Connection Error
Check your .env file:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=attendance_management

Make sure MySQL is running.

Port 5000 Already in Use
Change:

PORT=5000

to another available port, for example:

PORT=5001

Then restart the backend.

Frontend Dependencies Error
Delete node_modules and reinstall:

cd frontend
rm -rf node_modules
npm install

On Windows:

rmdir /s /q node_modules
npm install

Backend Dependencies Error
cd backend
rm -rf node_modules
npm install

On Windows:

rmdir /s /q node_modules
npm install

Database Tables Not Found
Make sure the schema has been imported:

mysql -u root -p < database/schema.sql

Then verify:

USE attendance_management;
SHOW TABLES;

🔮 Future Enhancements
Possible future improvements include:

📱 Mobile application

📧 Email notifications

📊 Advanced attendance analytics

📄 PDF attendance reports

📥 Excel/CSV report export

🔔 Low-attendance notifications

🧑‍💼 Advanced role and permission management

☁️ Cloud deployment

🔐 Two-factor authentication

📅 Calendar-based attendance

🤖 Attendance prediction and analytics

📜 License
This project is licensed under the MIT License.

👨‍👩‍👦‍👦 Team
Student Attendance Management System
Developed as a team project using:

React + Vite + Node.js + Express + MySQL

⭐ Acknowledgement
This project was developed as an academic project to demonstrate the use of modern web technologies for managing student attendance efficiently.

If you find this project useful, consider giving the repository a ⭐ on GitHub.
