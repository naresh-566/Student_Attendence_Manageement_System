/**
 * AttendEase - Main Express Server Application
 * Demonstrates: NRD Lab Experiment 9 (Node.js Server) & 10 (Express REST API)
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { dbInitPromise, getMode } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (NRD Lab requirement)
app.use(morgan('dev'));

// Static files for XML/DTD/XSD inspection
app.use('/xml-assets', express.static(path.join(__dirname, '..', 'database')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    application: 'AttendEase - Student Attendance Management System',
    version: '1.0.0',
    database_mode: getMode(),
    timestamp: new Date().toISOString()
  });
});

// Register REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Start server after database initialization check
dbInitPromise.then(() => {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 AttendEase Backend Server is running on port ${PORT}`);
    console.log(`📡 Base URL: http://localhost:${PORT}`);
    console.log(`🗄️  Database Active Mode: ${getMode().toUpperCase()}`);
    console.log(`🧪 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}).catch(err => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});

module.exports = app;
