-- ====================================================================
-- AttendEase – Student Attendance Management System
-- Seed Data (MySQL)
-- Database Name: attendance_management
-- Default Passwords:
--   Admin: Admin@123
--   Faculty: Faculty@123
--   Student: Student@123
-- ====================================================================

USE attendance_management;

-- Clear previous data
DELETE FROM attendance;
DELETE FROM attendance_sessions;
DELETE FROM subjects;
DELETE FROM faculty;
DELETE FROM students;
DELETE FROM users;

-- Reset Auto Increments
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE students AUTO_INCREMENT = 1;
ALTER TABLE faculty AUTO_INCREMENT = 1;
ALTER TABLE subjects AUTO_INCREMENT = 1;
ALTER TABLE attendance AUTO_INCREMENT = 1;

-- --------------------------------------------------------------------
-- 1. Insert Users
-- Passwords hashed using bcrypt (cost factor: 10)
-- Admin@123   -> $2a$10$cHQVo/QuTXiRlAni3cI/Re6orH/OTrO9WzVNINkS.2isbZYGAeAfe
-- Faculty@123 -> $2a$10$Eg.ssvHsmWqW0IfS9DFJ9.b4/.1fpvxkYK.HuMfxltftxGf.svTHa
-- Student@123 -> $2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa
-- --------------------------------------------------------------------

-- Admin (id: 1)
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'System Administrator', 'admin@attendease.com', '$2a$10$cHQVo/QuTXiRlAni3cI/Re6orH/OTrO9WzVNINkS.2isbZYGAeAfe', 'admin');

-- Faculty (id: 2, 3, 4)
INSERT INTO users (id, name, email, password, role) VALUES
(2, 'Dr. Ramesh Kumar', 'faculty1@attendease.com', '$2a$10$Eg.ssvHsmWqW0IfS9DFJ9.b4/.1fpvxkYK.HuMfxltftxGf.svTHa', 'faculty'),
(3, 'Prof. Sunita Sharma', 'faculty2@attendease.com', '$2a$10$Eg.ssvHsmWqW0IfS9DFJ9.b4/.1fpvxkYK.HuMfxltftxGf.svTHa', 'faculty'),
(4, 'Dr. Arvind Verma', 'faculty3@attendease.com', '$2a$10$Eg.ssvHsmWqW0IfS9DFJ9.b4/.1fpvxkYK.HuMfxltftxGf.svTHa', 'faculty');

-- Students (id: 5 to 22)
INSERT INTO users (id, name, email, password, role) VALUES
(5, 'Rahul Sharma', 'student1@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(6, 'Priya Patel', 'student2@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(7, 'Amit Verma', 'student3@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(8, 'Sneha Reddy', 'student4@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(9, 'Karan Malhotra', 'student5@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(10, 'Ananya Iyer', 'student6@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(11, 'Rohan Gupta', 'student7@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(12, 'Pooja Joshi', 'student8@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(13, 'Vikram Singh', 'student9@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(14, 'Neha Rao', 'student10@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(15, 'Siddharth Jain', 'student11@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(16, 'Divya Nair', 'student12@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(17, 'Manish Chawla', 'student13@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(18, 'Kavita Das', 'student14@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(19, 'Aditya Saxena', 'student15@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(20, 'Meera Menon', 'student16@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(21, 'Arjun Pillai', 'student17@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student'),
(22, 'Ritu Kulkarni', 'student18@attendease.com', '$2a$10$7ZsIFDYNg8kflm5pEEnpJuxkQPU.7iECdVdgBP6rY/S5EY5BIH7wa', 'student');

-- --------------------------------------------------------------------
-- 2. Insert Faculty Profiles
-- --------------------------------------------------------------------
INSERT INTO faculty (id, user_id, employee_id, name, email, department, phone) VALUES
(1, 2, 'FAC-CSE-001', 'Dr. Ramesh Kumar', 'faculty1@attendease.com', 'Computer Science & Engineering', '9876543210'),
(2, 3, 'FAC-CSE-002', 'Prof. Sunita Sharma', 'faculty2@attendease.com', 'Computer Science & Engineering', '9876543211'),
(3, 4, 'FAC-CSE-003', 'Dr. Arvind Verma', 'faculty3@attendease.com', 'Computer Science & Engineering', '9876543212');

-- --------------------------------------------------------------------
-- 3. Insert Students Profiles
-- --------------------------------------------------------------------
INSERT INTO students (id, user_id, roll_number, name, email, phone, department, year, section) VALUES
(1, 5, '21CS101', 'Rahul Sharma', 'student1@attendease.com', '9123456701', 'Computer Science & Engineering', 3, 'A'),
(2, 6, '21CS102', 'Priya Patel', 'student2@attendease.com', '9123456702', 'Computer Science & Engineering', 3, 'A'),
(3, 7, '21CS103', 'Amit Verma', 'student3@attendease.com', '9123456703', 'Computer Science & Engineering', 3, 'A'),
(4, 8, '21CS104', 'Sneha Reddy', 'student4@attendease.com', '9123456704', 'Computer Science & Engineering', 3, 'A'),
(5, 9, '21CS105', 'Karan Malhotra', 'student5@attendease.com', '9123456705', 'Computer Science & Engineering', 3, 'A'),
(6, 10, '21CS106', 'Ananya Iyer', 'student6@attendease.com', '9123456706', 'Computer Science & Engineering', 3, 'A'),
(7, 11, '21CS107', 'Rohan Gupta', 'student7@attendease.com', '9123456707', 'Computer Science & Engineering', 3, 'A'),
(8, 12, '21CS108', 'Pooja Joshi', 'student8@attendease.com', '9123456708', 'Computer Science & Engineering', 3, 'A'),
(9, 13, '21CS109', 'Vikram Singh', 'student9@attendease.com', '9123456709', 'Computer Science & Engineering', 3, 'A'),
(10, 14, '21CS110', 'Neha Rao', 'student10@attendease.com', '9123456710', 'Computer Science & Engineering', 3, 'A'),
(11, 15, '21CS111', 'Siddharth Jain', 'student11@attendease.com', '9123456711', 'Computer Science & Engineering', 3, 'A'),
(12, 16, '21CS112', 'Divya Nair', 'student12@attendease.com', '9123456712', 'Computer Science & Engineering', 3, 'A'),
(13, 17, '21CS113', 'Manish Chawla', 'student13@attendease.com', '9123456713', 'Computer Science & Engineering', 3, 'A'),
(14, 18, '21CS114', 'Kavita Das', 'student14@attendease.com', '9123456714', 'Computer Science & Engineering', 3, 'A'),
(15, 19, '21CS115', 'Aditya Saxena', 'student15@attendease.com', '9123456715', 'Computer Science & Engineering', 3, 'A'),
(16, 20, '21CS116', 'Meera Menon', 'student16@attendease.com', '9123456716', 'Computer Science & Engineering', 3, 'A'),
(17, 21, '21CS117', 'Arjun Pillai', 'student17@attendease.com', '9123456717', 'Computer Science & Engineering', 3, 'A'),
(18, 22, '21CS118', 'Ritu Kulkarni', 'student18@attendease.com', '9123456718', 'Computer Science & Engineering', 3, 'A');

-- --------------------------------------------------------------------
-- 4. Insert Subjects
-- --------------------------------------------------------------------
INSERT INTO subjects (id, subject_code, subject_name, department, year, semester, section, faculty_id) VALUES
(1, 'CS501', 'Web Technologies', 'Computer Science & Engineering', 3, 5, 'A', 1),
(2, 'CS502', 'Database Management Systems', 'Computer Science & Engineering', 3, 5, 'A', 2),
(3, 'CS503', 'Java & NRD Application Lab', 'Computer Science & Engineering', 3, 5, 'A', 1),
(4, 'CS504', 'Computer Networks', 'Computer Science & Engineering', 3, 5, 'A', 3),
(5, 'CS505', 'Software Engineering', 'Computer Science & Engineering', 3, 5, 'A', 2);

-- --------------------------------------------------------------------
-- 5. Insert Attendance Sessions & Records
-- Generating realistic attendance across 10 session dates
-- Dates: 2026-09-01 to 2026-09-28
-- --------------------------------------------------------------------

-- Subject 1 (Web Tech) - Sessions
INSERT INTO attendance_sessions (id, subject_id, faculty_id, attendance_date, session_time) VALUES
(1, 1, 1, '2026-09-01', '09:00 AM'),
(2, 1, 1, '2026-09-03', '09:00 AM'),
(3, 1, 1, '2026-09-08', '09:00 AM'),
(4, 1, 1, '2026-09-10', '09:00 AM'),
(5, 1, 1, '2026-09-15', '09:00 AM'),
(6, 1, 1, '2026-09-17', '09:00 AM'),
(7, 1, 1, '2026-09-22', '09:00 AM'),
(8, 1, 1, '2026-09-24', '09:00 AM');

-- Subject 2 (DBMS) - Sessions
INSERT INTO attendance_sessions (id, subject_id, faculty_id, attendance_date, session_time) VALUES
(9, 2, 2, '2026-09-02', '10:00 AM'),
(10, 2, 2, '2026-09-04', '10:00 AM'),
(11, 2, 2, '2026-09-09', '10:00 AM'),
(12, 2, 2, '2026-09-11', '10:00 AM'),
(13, 2, 2, '2026-09-16', '10:00 AM'),
(14, 2, 2, '2026-09-18', '10:00 AM'),
(15, 2, 2, '2026-09-23', '10:00 AM'),
(16, 2, 2, '2026-09-25', '10:00 AM');

-- Subject 3 (Java Lab) - Sessions
INSERT INTO attendance_sessions (id, subject_id, faculty_id, attendance_date, session_time) VALUES
(17, 3, 1, '2026-09-05', '02:00 PM'),
(18, 3, 1, '2026-09-12', '02:00 PM'),
(19, 3, 1, '2026-09-19', '02:00 PM'),
(20, 3, 1, '2026-09-26', '02:00 PM');

-- Populate Attendance Records
-- Web Tech (Subject 1) Date 1
INSERT INTO attendance (student_id, subject_id, faculty_id, attendance_date, status) VALUES
(1, 1, 1, '2026-09-01', 'Present'), (2, 1, 1, '2026-09-01', 'Present'),
(3, 1, 1, '2026-09-01', 'Absent'),  (4, 1, 1, '2026-09-01', 'Present'),
(5, 1, 1, '2026-09-01', 'Absent'),  (6, 1, 1, '2026-09-01', 'Present'),
(7, 1, 1, '2026-09-01', 'Present'), (8, 1, 1, '2026-09-01', 'Present'),
(9, 1, 1, '2026-09-01', 'Present'), (10, 1, 1, '2026-09-01', 'Present'),
(11, 1, 1, '2026-09-01', 'Present'), (12, 1, 1, '2026-09-01', 'Present'),
(13, 1, 1, '2026-09-01', 'Absent'), (14, 1, 1, '2026-09-01', 'Present'),
(15, 1, 1, '2026-09-01', 'Present'), (16, 1, 1, '2026-09-01', 'Present'),
(17, 1, 1, '2026-09-01', 'Present'), (18, 1, 1, '2026-09-01', 'Present');

-- Web Tech Date 2
INSERT INTO attendance (student_id, subject_id, faculty_id, attendance_date, status) VALUES
(1, 1, 1, '2026-09-03', 'Present'), (2, 1, 1, '2026-09-03', 'Present'),
(3, 1, 1, '2026-09-03', 'Absent'),  (4, 1, 1, '2026-09-03', 'Present'),
(5, 1, 1, '2026-09-03', 'Absent'),  (6, 1, 1, '2026-09-03', 'Present'),
(7, 1, 1, '2026-09-03', 'Present'), (8, 1, 1, '2026-09-03', 'Present'),
(9, 1, 1, '2026-09-03', 'Present'), (10, 1, 1, '2026-09-03', 'Present'),
(11, 1, 1, '2026-09-03', 'Present'), (12, 1, 1, '2026-09-03', 'Present'),
(13, 1, 1, '2026-09-03', 'Present'), (14, 1, 1, '2026-09-03', 'Present'),
(15, 1, 1, '2026-09-03', 'Present'), (16, 1, 1, '2026-09-03', 'Present'),
(17, 1, 1, '2026-09-03', 'Present'), (18, 1, 1, '2026-09-03', 'Present');

-- Web Tech Date 3
INSERT INTO attendance (student_id, subject_id, faculty_id, attendance_date, status) VALUES
(1, 1, 1, '2026-09-08', 'Present'), (2, 1, 1, '2026-09-08', 'Present'),
(3, 1, 1, '2026-09-08', 'Present'), (4, 1, 1, '2026-09-08', 'Present'),
(5, 1, 1, '2026-09-08', 'Absent'),  (6, 1, 1, '2026-09-08', 'Present'),
(7, 1, 1, '2026-09-08', 'Present'), (8, 1, 1, '2026-09-08', 'Present'),
(9, 1, 1, '2026-09-08', 'Absent'),  (10, 1, 1, '2026-09-08', 'Present'),
(11, 1, 1, '2026-09-08', 'Present'), (12, 1, 1, '2026-09-08', 'Present'),
(13, 1, 1, '2026-09-08', 'Present'), (14, 1, 1, '2026-09-08', 'Present'),
(15, 1, 1, '2026-09-08', 'Present'), (16, 1, 1, '2026-09-08', 'Present'),
(17, 1, 1, '2026-09-08', 'Present'), (18, 1, 1, '2026-09-08', 'Present');

-- Web Tech Date 4
INSERT INTO attendance (student_id, subject_id, faculty_id, attendance_date, status) VALUES
(1, 1, 1, '2026-09-10', 'Present'), (2, 1, 1, '2026-09-10', 'Present'),
(3, 1, 1, '2026-09-10', 'Absent'),  (4, 1, 1, '2026-09-10', 'Present'),
(5, 1, 1, '2026-09-10', 'Absent'),  (6, 1, 1, '2026-09-10', 'Present'),
(7, 1, 1, '2026-09-10', 'Present'), (8, 1, 1, '2026-09-10', 'Present'),
(9, 1, 1, '2026-09-10', 'Present'), (10, 1, 1, '2026-09-10', 'Present'),
(11, 1, 1, '2026-09-10', 'Present'), (12, 1, 1, '2026-09-10', 'Present'),
(13, 1, 1, '2026-09-10', 'Present'), (14, 1, 1, '2026-09-10', 'Present'),
(15, 1, 1, '2026-09-10', 'Present'), (16, 1, 1, '2026-09-10', 'Present'),
(17, 1, 1, '2026-09-10', 'Present'), (18, 1, 1, '2026-09-10', 'Present');

-- Web Tech Date 5
INSERT INTO attendance (student_id, subject_id, faculty_id, attendance_date, status) VALUES
(1, 1, 1, '2026-09-15', 'Present'), (2, 1, 1, '2026-09-15', 'Present'),
(3, 1, 1, '2026-09-15', 'Absent'),  (4, 1, 1, '2026-09-15', 'Present'),
(5, 1, 1, '2026-09-15', 'Absent'),  (6, 1, 1, '2026-09-15', 'Present'),
(7, 1, 1, '2026-09-15', 'Present'), (8, 1, 1, '2026-09-15', 'Present'),
(9, 1, 1, '2026-09-15', 'Present'), (10, 1, 1, '2026-09-15', 'Present'),
(11, 1, 1, '2026-09-15', 'Present'), (12, 1, 1, '2026-09-15', 'Present'),
(13, 1, 1, '2026-09-15', 'Present'), (14, 1, 1, '2026-09-15', 'Present'),
(15, 1, 1, '2026-09-15', 'Present'), (16, 1, 1, '2026-09-15', 'Present'),
(17, 1, 1, '2026-09-15', 'Present'), (18, 1, 1, '2026-09-15', 'Present');

-- Web Tech Date 6
INSERT INTO attendance (student_id, subject_id, faculty_id, attendance_date, status) VALUES
(1, 1, 1, '2026-09-17', 'Present'), (2, 1, 1, '2026-09-17', 'Present'),
(3, 1, 1, '2026-09-17', 'Present'), (4, 1, 1, '2026-09-17', 'Present'),
(5, 1, 1, '2026-09-17', 'Absent'),  (6, 1, 1, '2026-09-17', 'Present'),
(7, 1, 1, '2026-09-17', 'Present'), (8, 1, 1, '2026-09-17', 'Present'),
(9, 1, 1, '2026-09-17', 'Present'), (10, 1, 1, '2026-09-17', 'Present'),
(11, 1, 1, '2026-09-17', 'Present'), (12, 1, 1, '2026-09-17', 'Present'),
(13, 1, 1, '2026-09-17', 'Present'), (14, 1, 1, '2026-09-17', 'Present'),
(15, 1, 1, '2026-09-17', 'Present'), (16, 1, 1, '2026-09-17', 'Present'),
(17, 1, 1, '2026-09-17', 'Present'), (18, 1, 1, '2026-09-17', 'Present');

-- DBMS (Subject 2) Attendance for Date 1 & 2
INSERT INTO attendance (student_id, subject_id, faculty_id, attendance_date, status) VALUES
(1, 2, 2, '2026-09-02', 'Present'), (2, 2, 2, '2026-09-02', 'Present'),
(3, 2, 2, '2026-09-02', 'Absent'),  (4, 2, 2, '2026-09-02', 'Present'),
(5, 2, 2, '2026-09-02', 'Absent'),  (6, 2, 2, '2026-09-02', 'Present'),
(7, 2, 2, '2026-09-02', 'Present'), (8, 2, 2, '2026-09-02', 'Present'),
(9, 2, 2, '2026-09-02', 'Present'), (10, 2, 2, '2026-09-02', 'Present'),
(11, 2, 2, '2026-09-02', 'Present'), (12, 2, 2, '2026-09-02', 'Present'),
(13, 2, 2, '2026-09-02', 'Present'), (14, 2, 2, '2026-09-02', 'Present'),
(15, 2, 2, '2026-09-02', 'Present'), (16, 2, 2, '2026-09-02', 'Present'),
(17, 2, 2, '2026-09-02', 'Present'), (18, 2, 2, '2026-09-02', 'Present');

INSERT INTO attendance (student_id, subject_id, faculty_id, attendance_date, status) VALUES
(1, 2, 2, '2026-09-04', 'Present'), (2, 2, 2, '2026-09-04', 'Present'),
(3, 2, 2, '2026-09-04', 'Absent'),  (4, 2, 2, '2026-09-04', 'Present'),
(5, 2, 2, '2026-09-04', 'Present'), (6, 2, 2, '2026-09-04', 'Present'),
(7, 2, 2, '2026-09-04', 'Present'), (8, 2, 2, '2026-09-04', 'Present'),
(9, 2, 2, '2026-09-04', 'Present'), (10, 2, 2, '2026-09-04', 'Present'),
(11, 2, 2, '2026-09-04', 'Present'), (12, 2, 2, '2026-09-04', 'Present'),
(13, 2, 2, '2026-09-04', 'Present'), (14, 2, 2, '2026-09-04', 'Present'),
(15, 2, 2, '2026-09-04', 'Present'), (16, 2, 2, '2026-09-04', 'Present'),
(17, 2, 2, '2026-09-04', 'Present'), (18, 2, 2, '2026-09-04', 'Present');

-- Java Lab (Subject 3) Attendance
INSERT INTO attendance (student_id, subject_id, faculty_id, attendance_date, status) VALUES
(1, 3, 1, '2026-09-05', 'Present'), (2, 3, 1, '2026-09-05', 'Present'),
(3, 3, 1, '2026-09-05', 'Absent'),  (4, 3, 1, '2026-09-05', 'Present'),
(5, 3, 1, '2026-09-05', 'Absent'),  (6, 3, 1, '2026-09-05', 'Present'),
(7, 3, 1, '2026-09-05', 'Present'), (8, 3, 1, '2026-09-05', 'Present'),
(9, 3, 1, '2026-09-05', 'Present'), (10, 3, 1, '2026-09-05', 'Present'),
(11, 3, 1, '2026-09-05', 'Present'), (12, 3, 1, '2026-09-05', 'Present'),
(13, 3, 1, '2026-09-05', 'Present'), (14, 3, 1, '2026-09-05', 'Present'),
(15, 3, 1, '2026-09-05', 'Present'), (16, 3, 1, '2026-09-05', 'Present'),
(17, 3, 1, '2026-09-05', 'Present'), (18, 3, 1, '2026-09-05', 'Present');
