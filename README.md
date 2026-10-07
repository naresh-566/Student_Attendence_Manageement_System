
#  Student Attendance Management System

A full-stack **Student Attendance Management System** developed to simplify student, faculty, user, subject, and attendance management through a web-based application.

The project provides role-based access for **Administrators, Faculty, and Students**, allowing attendance to be recorded, managed, viewed, and analyzed efficiently.

Repository: https://github.com/naresh-566/Student_Attendence_Manageement_System

---

##  Table of Contents

1. [Project Title](#-project-title)
2. [Development of Problem Statement](#-development-of-problem-statement)
3. [Software Requirement Specification](#-software-requirement-specification)
   - [Introduction](#introduction)
   - [Purpose](#purpose)
   - [Scope](#scope)
   - [Definitions, Acronyms and Abbreviations](#definitions-acronyms-and-abbreviations)
   - [Technologies Used](#technologies-used)
   - [Tools Used](#tools-used)
   - [Overall Description](#overall-description)
   - [Product Perspective](#product-perspective)
   - [Software Interface](#software-interface)
   - [Hardware Interface](#hardware-interface)
   - [System Functions](#system-functions)
   - [User Characteristics](#user-characteristics)
   - [Constraints](#constraints)
   - [Assumptions and Dependencies](#assumptions-and-dependencies)
4. [Software Configuration Management](#-software-configuration-management)
   - [Purpose of SCM](#purpose-of-scm)
   - [Scope](#scope-1)
   - [Configuration Items](#configuration-items)
   - [Change Control Process](#change-control-process)
   - [Roles and Responsibilities](#roles-and-responsibilities)
5. [Risk Management](#-risk-management)
   - [Risk Identification](#risk-identification)
   - [Risk Analysis](#risk-analysis)
   - [Mitigation Strategies](#mitigation-strategies)
   - [Risk Monitoring](#risk-monitoring)
6. [Study and Usage of Design Phase CASE Tool](#-study-and-usage-of-design-phase-case-tool)
   - [Unified Modeling Language (UML)](#unified-modeling-language-uml)
   - [Three Aspects of UML](#three-aspects-of-uml)
   - [Conceptual Model of UML](#conceptual-model-of-uml)
   - [Building Blocks](#building-blocks)
   - [Relationships](#relationships)
   - [Diagrams](#diagrams)
   - [Rules](#rules)
   - [Common Mechanisms](#common-mechanisms)
   - [Extensibility Mechanisms](#extensibility-mechanisms)
   - [CASE Tool Usage](#case-tool-usage)
   - [Advantages of CASE Tools](#advantages-of-case-tools)
7. [Performing the Design Using CASE Tools](#-performing-the-design-using-case-tools)
   - [Use Case Diagram](#use-case-diagram)
   - [Activity Diagram](#activity-diagram)
   - [Class Diagram](#class-diagram)
   - [Sequence Diagram](#sequence-diagram)
   - [Collaboration Diagram](#collaboration-diagram)
   - [Deployment Diagram](#deployment-diagram)
   - [Component Diagram](#component-diagram)
8. [Develop Test Cases for Unit and Integration Testing](#-develop-test-cases-for-unit-and-integration-testing)
   - [Main Modules](#main-modules)
   - [Unit Testing](#unit-testing)
   - [Integration Testing](#integration-testing)
9. [Develop Test Cases for White-Box and Black-Box Testing](#-develop-test-cases-for-white-box-and-black-box-testing)
   - [White-Box Testing](#white-box-testing)
   - [Basis Path Testing](#basis-path-testing)
   - [Condition Testing](#condition-testing)
   - [Black-Box Testing](#black-box-testing)
   - [Equivalence Class Testing](#equivalence-class-testing)
   - [Boundary Value Analysis](#boundary-value-analysis)
   - [Error Guessing](#error-guessing)
10. [Application Features](#-application-features)
11. [Technology Stack](#-technology-stack)
12. [Project Structure](#-project-structure)
13. [Prerequisites](#-prerequisites)
14. [How to Run the Application](#-how-to-run-the-application)
15. [Database Setup](#-database-setup)
16. [Environment Configuration](#-environment-configuration)
17. [Application Workflow](#-application-workflow)
18. [Screenshots / Output](#-screenshots--output)
19. [Troubleshooting](#-troubleshooting)
20. [Future Enhancements](#-future-enhancements)
21. [Conclusion](#-conclusion)
22. [Team](#-team)
23. [Acknowledgement](#-acknowledgement)

---

##  Project Title

**Student Attendance Management System**

The system digitizes the process of maintaining student attendance and provides separate functionality for administrators, faculty members, and students.

---

##  Development of Problem Statement

### Aim

To create an automated web-based system for managing student attendance efficiently.

### Problem Statement

Traditional attendance management can require considerable manual effort and can make it difficult to maintain, update, and analyze attendance records. The proposed Student Attendance Management System automates attendance-related activities through a centralized web application.

The system allows authorized users to manage student and faculty information, maintain subjects, record attendance, view attendance records, and calculate attendance statistics.

### Objectives

- Reduce manual attendance-management effort.
- Maintain student information electronically.
- Maintain faculty and subject information.
- Allow faculty to mark and update attendance.
- Allow students to view their attendance.
- Calculate attendance percentages.
- Provide dashboards and attendance summaries.
- Maintain role-based access to system functions.
- Improve the accuracy and accessibility of attendance information.

---

#  Software Requirement Specification

## Introduction

The Student Attendance Management System is a web application designed to digitize attendance management for an educational environment.

The system combines a frontend interface, backend application services, authentication, and database services.

## Purpose

The purpose of the system is to:

- Automate student attendance management.
- Reduce manual errors.
- Provide role-based access.
- Maintain attendance records electronically.
- Allow faculty to record attendance.
- Allow students to monitor attendance.
- Provide administrators with management functionality.
- Display useful attendance statistics and reports.

## Scope

The system includes:

- User authentication.
- Student management.
- Faculty management.
- Subject management.
- Attendance session management.
- Attendance recording.
- Attendance record viewing.
- Attendance percentage calculation.
- Role-based dashboards.
- User/account management.
- Attendance summaries and reports.

## Definitions, Acronyms and Abbreviations

| Term | Meaning |
|---|---|
| HTML | HyperText Markup Language |
| CSS | Cascading Style Sheets |
| API | Application Programming Interface |
| JWT | JSON Web Token |
| UI | User Interface |
| UML | Unified Modeling Language |
| SCM | Software Configuration Management |
| SQL | Structured Query Language |
| DB | Database |
| CRUD | Create, Read, Update, Delete |

## Technologies Used

The project uses:

- HTML
- CSS
- JavaScript
- React
- Vite
- Node.js
- Express.js
- MySQL
- SQL
- JWT
- Axios
- Bootstrap
- Chart.js

## Tools Used

- Visual Studio Code
- Git
- GitHub
- npm
- MySQL / MySQL Workbench
- StarUML for UML design

---

## Overall Description

The application provides an interface between users and the attendance-management system.

### Product Perspective

The system integrates:

- User authentication
- Student management
- Faculty management
- Subject management
- Attendance management
- Dashboard and reporting
- Database services

### Software Interface

The frontend provides interfaces for:

- Login
- Registration/user access
- Dashboards
- Student management
- Faculty management
- Subject management
- Attendance marking
- Attendance viewing
- Reports and statistics
- Profile management

The backend handles:

- Authentication
- Request processing
- Validation
- Student operations
- Faculty operations
- Subject operations
- Attendance operations
- Database communication

### Hardware Interface

The application can be accessed using:

- Desktop computer
- Laptop
- Tablet/mobile device
- Keyboard/touch interface
- Mouse where applicable
- Network connection
- Modern web browser

### System Functions

Major functions include:

- User authentication
- Role-based authorization
- Student management
- Faculty management
- Subject management
- Attendance session management
- Attendance recording
- Attendance updating
- Attendance viewing
- Attendance percentage calculation
- Dashboard statistics
- Reports and summaries
- Profile management

### User Characteristics

#### Administrator

The administrator manages system-level information such as users, students, faculty, subjects, and attendance-related information.

#### Faculty

Faculty members can:

- View assigned subjects.
- View students.
- Mark attendance.
- Update attendance records.
- View attendance information.

#### Student

Students can:

- View their profile.
- View attendance records.
- Check attendance percentage.
- Monitor their attendance status.

### Constraints

- Users require a suitable device and browser.
- Network connectivity may be required.
- Users must enter valid information.
- Database and backend services must be available.
- Unauthorized access must be prevented.
- Correct environment configuration is required.

### Assumptions and Dependencies

The application depends on:

- Node.js and npm.
- MySQL.
- Correct database configuration.
- Backend availability.
- Frontend development server.
- Correct environment variables.
- Network availability where applicable.

---

#  Software Configuration Management

## Purpose of SCM

Software Configuration Management helps keep source code, configuration files, database scripts, documentation, design models, and test artifacts organized and version-controlled.

## Scope

SCM covers:

- Source code
- Database schema
- Configuration files
- Documentation
- UML/design documents
- Test cases
- User documentation
- Project artifacts

## Configuration Items

| CI | Configuration Item | Format / Tool |
|---|---|---|
| CI-01 | SRS / Project Documentation | Markdown / Word / PDF |
| CI-02 | UML Diagrams | StarUML |
| CI-03 | Source Code | JavaScript / React / Node.js |
| CI-04 | Configuration | ENV / JSON |
| CI-05 | Test Cases | Markdown / Word |
| CI-06 | Database Schema | SQL |
| CI-07 | README / User Documentation | Markdown |

## Change Control Process

1. Identify the required change.
2. Review the change.
3. Modify the appropriate source or design artifact.
4. Save the updated version.
5. Update documentation where required.
6. Test the modified functionality.
7. Commit the approved changes to Git.
8. Push changes to GitHub.

## Roles and Responsibilities

| Role | Responsibility |
|---|---|
| Developer | Develop and maintain source code |
| Designer | Maintain system/UML design |
| Tester | Test functionality and report issues |
| Administrator | Manage authorized system-level information |
| Documentation Member | Maintain README and project documentation |

---

#  Risk Management

## Risk Identification

Typical risks include:

| Risk | Category |
|---|---|
| Delay in attendance modules | Schedule |
| Loss/corruption of attendance records | Technical |
| Incorrect attendance calculations | Quality |
| Unauthorized access | Security |
| Loss of source code | Technical |
| Database connectivity failure | Technical |

## Risk Analysis

Risks should be evaluated using likelihood and impact.

A simple 1–5 scale can be used:

- 1 – Very Low
- 2 – Low
- 3 – Medium
- 4 – High
- 5 – Very High

## Mitigation Strategies

- Maintain regular database backups.
- Use authentication and role-based authorization.
- Validate attendance inputs.
- Test attendance calculations.
- Use Git/GitHub for source-code version control.
- Keep environment configuration documented.
- Test database connectivity before deployment.

## Risk Monitoring

Risk monitoring can include:

- Regular project reviews.
- Monitoring high-priority technical issues.
- Reviewing security concerns.
- Checking database availability.
- Testing application availability.
- Updating mitigation plans when required.
---
##System Architecture
<img width="5113" height="8192" alt="Student Attendance-2026-10-07-052653" src="https://github.com/user-attachments/assets/3f671cea-d8d2-4fbb-b941-94df9af54b65" />

---

#  Develop Test Cases for Unit and Integration Testing

## Main Modules

The main application flow is:

**Login → Dashboard → Student/Faculty/Subject Management → Attendance → Reports**

## Unit Testing

Unit testing verifies individual modules independently.

| ID | Module | Test | Expected Result |
|---|---|---|---|
| UT01 | Login | Valid credentials | Login successful |
| UT02 | Login | Invalid password | Login rejected |
| UT03 | Student | Add valid student | Student created |
| UT04 | Student | Invalid student details | Validation error |
| UT05 | Faculty | Add valid faculty | Faculty created |
| UT06 | Subject | Add valid subject | Subject created |
| UT07 | Attendance | Mark Present | Attendance saved |
| UT08 | Attendance | Mark Absent | Attendance saved |
| UT09 | Attendance | Invalid student/subject | Operation rejected |
| UT10 | Reports | Calculate percentage | Correct percentage displayed |
| UT11 | Profile | Update valid profile | Profile updated |
| UT12 | Authorization | Unauthorized operation | Access denied |

## Integration Testing

| ID | Modules Integrated | Expected Result |
|---|---|---|
| IT01 | Login + Dashboard | Dashboard opens after authentication |
| IT02 | Subject + Student | Correct students shown for subject |
| IT03 | Student + Attendance | Attendance is stored for correct student |
| IT04 | Faculty + Attendance | Faculty can mark attendance |
| IT05 | Attendance + Reports | Reports reflect saved attendance |
| IT06 | Attendance + Database | Records are correctly persisted |
| IT07 | Login + Role Authorization | Correct dashboard/permissions shown |
| IT08 | Complete System | End-to-end attendance workflow works |

---

#  Develop Test Cases for White-Box and Black-Box Testing

## White-Box Testing

White-box testing examines internal program logic and control flow.

For attendance marking:

1. Select subject.
2. Validate subject.
3. Load students.
4. Enter attendance status.
5. Validate attendance.
6. Save attendance.
7. Update attendance information.
8. Display result.

## Basis Path Testing

Independent paths can include:

- Valid subject + valid student + valid attendance → Attendance saved.
- Valid subject + invalid student → Attendance rejected.
- Invalid subject → Operation rejected.
- Valid data + invalid attendance status → Validation error.

## Condition Testing

Example logical condition:

```text
IF user is authenticated AND user role is Faculty
    Allow attendance marking
ELSE
    Reject operation
```

Test cases should cover:

| ID | Authenticated | Faculty Role | Expected Result |
|---|---|---|---|
| CT01 | Yes | Yes | Attendance allowed |
| CT02 | Yes | No | Attendance rejected |
| CT03 | No | Yes | Attendance rejected |
| CT04 | No | No | Attendance rejected |

## Black-Box Testing

Black-box testing checks external system behavior without considering internal implementation.

It can be applied to:

- Login
- Student management
- Faculty management
- Subject management
- Attendance marking
- Attendance reports
- Profile management

## Equivalence Class Testing

Attendance status can be divided into valid and invalid input classes.

Example:

- Valid: Present
- Valid: Absent
- Invalid: Empty
- Invalid: Unsupported status

## Boundary Value Analysis

For an attendance percentage:

- 0% – valid
- 1% – valid
- 74% – valid
- 75% – valid
- 76% – valid
- 100% – valid
- Values below 0% – invalid
- Values above 100% – invalid

## Error Guessing

Possible errors include:

- Empty login credentials.
- Invalid email.
- Incorrect password.
- Invalid student information.
- Invalid faculty information.
- Invalid subject.
- Missing attendance status.
- Duplicate attendance.
- Unauthorized access.
- Database connection failure.
- Server unavailable.
- Network interruption.

---

#  Application Features

##  Authentication

- User login
- JWT-based authentication
- Role-based access
- Password hashing
- Session/token expiration

##  Administrator

Administrators can manage:

- Students
- Faculty
- Subjects
- Attendance
- User accounts
- Dashboard information

##  Faculty

Faculty can:

- View assigned subjects
- View students
- Mark attendance
- Update attendance
- View attendance information

##  Student

Students can:

- View their profile
- View attendance records
- Check attendance percentage
- Monitor attendance status

##  Dashboard & Reports

The application provides:

- Attendance statistics
- Student information
- Attendance summaries
- Charts/visual reports
- Subject-wise attendance information

---

#  Technology Stack

## Frontend

- React 18
- Vite
- React Router
- Axios
- Bootstrap 5
- Bootstrap Icons
- Chart.js
- React Chart.js 2

## Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- CORS
- Morgan
- dotenv
- MySQL2

## Database

- MySQL
- SQL

## Development Tools

- Git
- GitHub
- Visual Studio Code
- npm

---

#  Project Structure

```text
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
```

---

#  Prerequisites

Before running the project, install:

### 1. Node.js

Node.js **18 or later** is recommended.

Check:

```bash
node --version
npm --version
```

### 2. MySQL

Install MySQL Server **8.0+** and make sure the MySQL service is running.

Check:

```bash
mysql --version
```

### 3. Git

Check:

```bash
git --version
```

### 4. Code Editor

Recommended:

- Visual Studio Code

---

#  How to Run the Application

## Step 1 – Clone the Repository

```bash
git clone https://github.com/naresh-566/Student_Attendence_Manageement_System.git
```

Move into the project directory:

```bash
cd Student_Attendence_Manageement_System
```

## Step 2 – Install Dependencies

Install root dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
cd ..
```

Install frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

## Step 3 – Set Up MySQL Database

The database schema is located at:

```text
database/schema.sql
```

Import it using MySQL:

```bash
mysql -u root -p < database/schema.sql
```

Enter your MySQL password when prompted.

Alternatively, open `database/schema.sql` in MySQL Workbench and execute it.

Verify the database:

```sql
SHOW DATABASES;
```

Select it:

```sql
USE attendance_management;
```

Check tables:

```sql
SHOW TABLES;
```

## Step 4 – Configure Environment Variables

Copy `.env.example` to `.env`.

On Windows, copy the file manually and rename it to:

```text
.env
```

Configure the values according to your local MySQL setup:

```env
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
```

Replace:

```env
DB_PASSWORD=your_mysql_password
```

with your actual MySQL password.

**Do not commit `.env` to GitHub.**

## Step 5 – Run the Application

### Method 1 – Run Frontend and Backend Together

From the project root:

```bash
npm run dev
```

The backend normally runs on:

```text
http://localhost:5000
```

The frontend normally runs on:

```text
http://localhost:5173
```

Open the frontend URL shown by Vite in your browser.

### Method 2 – Run Separately

#### Start Backend

Open Terminal 1:

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:5000
```

#### Start Frontend

Open Terminal 2:

```bash
cd frontend
npm run dev
```

Open the URL displayed by Vite.

---

#  Seed Data

If the project contains the configured seed script, run:

```bash
npm run seed
```

This executes the backend seed runner.

Use the sample/generated credentials provided by the project data after seeding.

---

# Building the Frontend

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
cd frontend
npm run preview
```

---

#  Application Workflow

```text
                  ┌──────────────────────┐
                  │        User          │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   React + Vite       │
                  │      Frontend        │
                  └──────────┬───────────┘
                             │
                       HTTP / Axios
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Express Backend    │
                  │       REST API       │
                  └──────────┬───────────┘
                             │
                  Authentication +
                    Business Logic
                             │
                             ▼
                  ┌──────────────────────┐
                  │    MySQL Database    │
                  └──────────────────────┘
```

---

#  Screenshots / Output

Create a folder:

```text
screenshots/
```

Recommended screenshots:

```text
screenshots/
├── 01-login.png
├── 02-admin-dashboard.png
├── 03-student-management.png
├── 04-faculty-management.png
├── 05-subject-management.png
├── 06-mark-attendance.png
├── 07-attendance-report.png
└── 08-student-dashboard.png
```

Add the screenshots to this README after capturing them from the running application.

---

#  Troubleshooting

## MySQL Connection Error

Check `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=attendance_management
```

Also make sure MySQL is running.

## Port 5000 Already in Use

Change:

```env
PORT=5000
```

to another available port, for example:

```env
PORT=5001
```

Then restart the backend.

## Frontend Dependencies Error

On Windows:

```bash
cd frontend
rmdir /s /q node_modules
npm install
```

On Linux/macOS:

```bash
cd frontend
rm -rf node_modules
npm install
```

## Backend Dependencies Error

On Windows:

```bash
cd backend
rmdir /s /q node_modules
npm install
```

On Linux/macOS:

```bash
cd backend
rm -rf node_modules
npm install
```

## Database Tables Not Found

Import the schema again:

```bash
mysql -u root -p < database/schema.sql
```

Then:

```sql
USE attendance_management;
SHOW TABLES;
```

---

#  Future Enhancements

Possible improvements include:

- Mobile application
- Email notifications
- Advanced attendance analytics
- PDF attendance reports
- Excel/CSV report export
- Low-attendance notifications
- Advanced role and permission management
- Cloud deployment
- Two-factor authentication
- Calendar-based attendance
- Attendance prediction and analytics

---
# Output
<img width="1440" height="900" alt="Screenshot (5)" src="https://github.com/user-attachments/assets/a6df41f3-af0b-4e48-923c-96ba460640ac" />
<img width="1440" height="900" alt="Screenshot (6)" src="https://github.com/user-attachments/assets/d39a12c0-f641-4eaf-a38f-5c80890c4c38" />
<img width="1440" height="900" alt="Screenshot (7)" src="https://github.com/user-attachments/assets/4c4c0fb1-57d6-4501-8610-63255b49a2e6" />
<img width="1440" height="900" alt="Screenshot (8)" src="https://github.com/user-attachments/assets/0bb39bfa-3f1b-4bd1-8bc7-9d29c6185fc3" />
<img width="1440" height="900" alt="Screenshot (9)" src="https://github.com/user-attachments/assets/8c709ded-e094-4204-ab58-5799b2238671" />
<img width="1440" height="900" alt="Screenshot (10)" src="https://github.com/user-attachments/assets/b540c3c3-b72c-456e-b1ae-115c97e15914" />
<img width="1440" height="900" alt="Screenshot (11)" src="https://github.com/user-attachments/assets/fb7e2abe-be31-412a-a915-11cb9b5f4c33" />
<img width="1440" height="900" alt="Screenshot (12)" src="https://github.com/user-attachments/assets/e67d2d7a-74aa-4f88-aca0-076578bdbb5d" />
<img width="1440" height="900" alt="Screenshot (13)" src="https://github.com/user-attachments/assets/51137cd1-4638-4634-a22c-d52241e00d1d" />
<img width="1440" height="900" alt="Screenshot (14)" src="https://github.com/user-attachments/assets/56d3071a-30a1-44cd-b08b-4dd4a9307e9e" />
<img width="1440" height="900" alt="Screenshot (15)" src="https://github.com/user-attachments/assets/43fddbc8-3625-4155-bc4f-3af2a0edbf70" />
<img width="1440" height="900" alt="Screenshot (16)" src="https://github.com/user-attachments/assets/9222ef51-a866-44aa-8530-71c4d1ebadd0" />
<img width="1440" height="900" alt="Screenshot (17)" src="https://github.com/user-attachments/assets/e05fe0fe-8658-4030-8818-d044e3d28761" />
<img width="1440" height="900" alt="Screenshot (18)" src="https://github.com/user-attachments/assets/266e91cd-061c-447b-87b7-0856c6054203" />
<img width="1440" height="900" alt="Screenshot (19)" src="https://github.com/user-attachments/assets/93e8efb7-e95d-414d-bb8d-4cc85fe4bcd1" />


#  Conclusion

The Student Attendance Management System provides an automated solution for managing student attendance through a centralized web application.

The system supports authentication, role-based access, student and faculty management, subject management, attendance recording, attendance viewing, attendance calculations, dashboards, and reports.

The project documentation follows the software-engineering structure of problem-statement development, requirements specification, configuration management, risk management, UML/CASE-tool-based design, and multiple testing techniques.

---

#  Team

**Student Attendance Management System**

Developed as an academic full-stack web application using:

**React + Vite + Node.js + Express.js + MySQL**


---

#  Acknowledgement

This project was developed as an academic project to demonstrate the use of web technologies and software-engineering practices for efficient student attendance management.

The documentation structure is adapted from the supplied project documentation reference, while the application-specific details and execution instructions are based on the Student Attendance Management System project.

---

 If you find this project useful, consider giving the repository a star on GitHub.
