/**
 * AttendEase - Database Connection Manager
 * Demonstrates: NRD Lab Experiment 5 (Database Connectivity & CRUD Operations)
 * 
 * Supports MySQL primary database with automatic embedded fallback for instant portability.
 */

const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let dbMode = 'mysql';
let mysqlPool = null;
let sqliteDb = null;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'attendance_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
};

/**
 * Initialize SQLite fallback database and seed tables if empty
 */
async function initSqliteFallback() {
  dbMode = 'sqlite';
  const dbDir = path.join(__dirname, '..', '..', 'database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, 'attendease_fallback.db');

  return new Promise((resolve, reject) => {
    sqliteDb = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        console.error('❌ Failed to create SQLite fallback DB:', err.message);
        return reject(err);
      }
      console.log('📦 Using embedded fallback database at:', dbPath);

      // Run schema
      sqliteDb.serialize(() => {
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT CHECK(role IN ('admin', 'faculty', 'student')) NOT NULL DEFAULT 'student',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        sqliteDb.run(`CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NULL,
          roll_number TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          phone TEXT,
          department TEXT NOT NULL,
          year INTEGER NOT NULL DEFAULT 3,
          section TEXT NOT NULL DEFAULT 'A',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        sqliteDb.run(`CREATE TABLE IF NOT EXISTS faculty (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NULL,
          employee_id TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          department TEXT NOT NULL,
          phone TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        sqliteDb.run(`CREATE TABLE IF NOT EXISTS subjects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          subject_code TEXT NOT NULL UNIQUE,
          subject_name TEXT NOT NULL,
          department TEXT NOT NULL,
          year INTEGER NOT NULL DEFAULT 3,
          semester INTEGER NOT NULL DEFAULT 1,
          section TEXT NOT NULL DEFAULT 'A',
          faculty_id INTEGER NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE SET NULL
        )`);

        sqliteDb.run(`CREATE TABLE IF NOT EXISTS attendance_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          subject_id INTEGER NOT NULL,
          faculty_id INTEGER NOT NULL,
          attendance_date TEXT NOT NULL,
          session_time TEXT DEFAULT '09:00 AM',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        sqliteDb.run(`CREATE TABLE IF NOT EXISTS attendance (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          subject_id INTEGER NOT NULL,
          faculty_id INTEGER NOT NULL,
          attendance_date TEXT NOT NULL,
          status TEXT CHECK(status IN ('Present', 'Absent')) NOT NULL DEFAULT 'Present',
          remarks TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(student_id, subject_id, attendance_date),
          FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
          FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
          FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
        )`, async () => {
          // Check if seeded
          sqliteDb.get(`SELECT COUNT(*) as count FROM users`, async (err, row) => {
            if (!err && row && row.count === 0) {
              console.log('🌱 Seeding fallback database with demo data...');
              await seedFallbackData();
            }
            resolve();
          });
        });
      });
    });
  });
}

async function seedFallbackData() {
  const hashAdmin = bcrypt.hashSync('Admin@123', 10);
  const hashFaculty = bcrypt.hashSync('Faculty@123', 10);
  const hashStudent = bcrypt.hashSync('Student@123', 10);

  // Admin
  await execute(`INSERT INTO users (id, name, email, password, role) VALUES (1, 'System Administrator', 'admin@attendease.com', ?, 'admin')`, [hashAdmin]);
  // Faculty
  await execute(`INSERT INTO users (id, name, email, password, role) VALUES 
    (2, 'Dr. Ramesh Kumar', 'faculty1@attendease.com', ?, 'faculty'),
    (3, 'Prof. Sunita Sharma', 'faculty2@attendease.com', ?, 'faculty'),
    (4, 'Dr. Arvind Verma', 'faculty3@attendease.com', ?, 'faculty')`, [hashFaculty, hashFaculty, hashFaculty]);

  // Students (18 students)
  const studentsData = [
    [5, 'Rahul Sharma', 'student1@attendease.com', '21CS101'],
    [6, 'Priya Patel', 'student2@attendease.com', '21CS102'],
    [7, 'Amit Verma', 'student3@attendease.com', '21CS103'],
    [8, 'Sneha Reddy', 'student4@attendease.com', '21CS104'],
    [9, 'Karan Malhotra', 'student5@attendease.com', '21CS105'],
    [10, 'Ananya Iyer', 'student6@attendease.com', '21CS106'],
    [11, 'Rohan Gupta', 'student7@attendease.com', '21CS107'],
    [12, 'Pooja Joshi', 'student8@attendease.com', '21CS108'],
    [13, 'Vikram Singh', 'student9@attendease.com', '21CS109'],
    [14, 'Neha Rao', 'student10@attendease.com', '21CS110'],
    [15, 'Siddharth Jain', 'student11@attendease.com', '21CS111'],
    [16, 'Divya Nair', 'student12@attendease.com', '21CS112'],
    [17, 'Manish Chawla', 'student13@attendease.com', '21CS113'],
    [18, 'Kavita Das', 'student14@attendease.com', '21CS114'],
    [19, 'Aditya Saxena', 'student15@attendease.com', '21CS115'],
    [20, 'Meera Menon', 'student16@attendease.com', '21CS116'],
    [21, 'Arjun Pillai', 'student17@attendease.com', '21CS117'],
    [22, 'Ritu Kulkarni', 'student18@attendease.com', '21CS118']
  ];

  for (const s of studentsData) {
    await execute(`INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, 'student')`, [s[0], s[1], s[2], hashStudent]);
  }

  // Insert Faculty Table
  await execute(`INSERT INTO faculty (id, user_id, employee_id, name, email, department, phone) VALUES 
    (1, 2, 'FAC-CSE-001', 'Dr. Ramesh Kumar', 'faculty1@attendease.com', 'Computer Science & Engineering', '9876543210'),
    (2, 3, 'FAC-CSE-002', 'Prof. Sunita Sharma', 'faculty2@attendease.com', 'Computer Science & Engineering', '9876543211'),
    (3, 4, 'FAC-CSE-003', 'Dr. Arvind Verma', 'faculty3@attendease.com', 'Computer Science & Engineering', '9876543212')`);

  // Insert Students Table
  for (let i = 0; i < studentsData.length; i++) {
    const s = studentsData[i];
    await execute(`INSERT INTO students (id, user_id, roll_number, name, email, phone, department, year, section) 
      VALUES (?, ?, ?, ?, ?, ?, 'Computer Science & Engineering', 3, 'A')`,
      [i + 1, s[0], s[3], s[1], s[2], `91234567${(i+1).toString().padStart(2, '0')}`]);
  }

  // Insert Subjects Table
  await execute(`INSERT INTO subjects (id, subject_code, subject_name, department, year, semester, section, faculty_id) VALUES 
    (1, 'CS501', 'Web Technologies', 'Computer Science & Engineering', 3, 5, 'A', 1),
    (2, 'CS502', 'Database Management Systems', 'Computer Science & Engineering', 3, 5, 'A', 2),
    (3, 'CS503', 'Java & NRD Application Lab', 'Computer Science & Engineering', 3, 5, 'A', 1),
    (4, 'CS504', 'Computer Networks', 'Computer Science & Engineering', 3, 5, 'A', 3),
    (5, 'CS505', 'Software Engineering', 'Computer Science & Engineering', 3, 5, 'A', 2)`);

  // Insert Attendance Records for 6 dates
  const dates = ['2026-09-01', '2026-09-03', '2026-09-08', '2026-09-10', '2026-09-15', '2026-09-17'];
  for (const date of dates) {
    for (let stId = 1; stId <= 18; stId++) {
      // Keep student 3 and 5 low attendance for demo alerts
      let status = 'Present';
      if ((stId === 3 || stId === 5) && (date === '2026-09-01' || date === '2026-09-03' || date === '2026-09-10' || date === '2026-09-15')) {
        status = 'Absent';
      } else if (stId === 9 && date === '2026-09-08') {
        status = 'Absent';
      }
      await execute(`INSERT INTO attendance (student_id, subject_id, faculty_id, attendance_date, status) VALUES (?, 1, 1, ?, ?)`,
        [stId, date, status]);
    }
  }

  // Additional DBMS subject records
  const dbmsDates = ['2026-09-02', '2026-09-04', '2026-09-09', '2026-09-11'];
  for (const date of dbmsDates) {
    for (let stId = 1; stId <= 18; stId++) {
      let status = (stId === 3 && (date === '2026-09-02' || date === '2026-09-04')) ? 'Absent' : 'Present';
      await execute(`INSERT INTO attendance (student_id, subject_id, faculty_id, attendance_date, status) VALUES (?, 2, 2, ?, ?)`,
        [stId, date, status]);
    }
  }

  console.log('✅ Fallback database seeded with users, faculty, students, subjects, and attendance!');
}

/**
 * Initialize connection
 */
async function initDatabase() {
  try {
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    mysqlPool = pool;
    dbMode = 'mysql';
    console.log(`✅ Connected to MySQL database [${dbConfig.database}] on ${dbConfig.host}:${dbConfig.port}`);
  } catch (err) {
    console.warn(`⚠️ MySQL connection to ${dbConfig.host}:${dbConfig.port} was not available (${err.code || err.message}).`);
    console.log('💡 Initializing integrated SQLite fallback engine so AttendEase runs with 100% functionality out-of-the-box.');
    await initSqliteFallback();
  }
}

/**
 * Unified Query Execution Method
 * Compatible with parameterized queries (?)
 */
async function execute(sql, params = []) {
  if (dbMode === 'mysql') {
    const [result] = await mysqlPool.execute(sql, params);
    if (Array.isArray(result)) {
      return result;
    }
    return {
      insertId: result.insertId,
      affectedRows: result.affectedRows
    };
  } else {
    // SQLite implementation
    return new Promise((resolve, reject) => {
      const isSelect = /^\s*SELECT/i.test(sql) || /^\s*PRAGMA/i.test(sql);
      if (isSelect) {
        sqliteDb.all(sql, params, (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        });
      } else {
        sqliteDb.run(sql, params, function (err) {
          if (err) return reject(err);
          resolve({
            insertId: this.lastID,
            affectedRows: this.changes
          });
        });
      }
    });
  }
}

/**
 * Start database initialization
 */
const dbInitPromise = initDatabase();

module.exports = {
  execute,
  query: execute,
  getMode: () => dbMode,
  dbInitPromise
};
