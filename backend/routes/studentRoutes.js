/**
 * AttendEase - Student Management Routes
 * Demonstrates: Express RESTful Routes & Role-Based Authorization
 */

const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const AttendanceController = require('../controllers/attendanceController');
const authenticateJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// All student routes require valid JWT
router.use(authenticateJWT);

// GET /api/students
router.get('/', authorizeRoles('admin', 'faculty'), StudentController.getAll);

// GET /api/students/:id
router.get('/:id', authorizeRoles('admin', 'faculty', 'student'), StudentController.getById);

// POST /api/students (Admin & Faculty)
router.post('/', authorizeRoles('admin', 'faculty'), StudentController.create);

// PUT /api/students/:id (Admin & Faculty)
router.put('/:id', authorizeRoles('admin', 'faculty'), StudentController.update);

// DELETE /api/students/:id (Admin only)
router.delete('/:id', authorizeRoles('admin'), StudentController.delete);

// Attendance summaries
router.get('/:id/attendance', authorizeRoles('admin', 'faculty', 'student'), AttendanceController.getStudentAttendance);
router.get('/:id/attendance-summary', authorizeRoles('admin', 'faculty', 'student'), StudentController.getAttendanceSummary);

module.exports = router;
