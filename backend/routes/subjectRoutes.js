/**
 * AttendEase - Subject Routes
 * Demonstrates: Express RESTful Routes & Role-Based Authorization
 */

const express = require('express');
const router = express.Router();
const SubjectController = require('../controllers/subjectController');
const AttendanceController = require('../controllers/attendanceController');
const authenticateJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(authenticateJWT);

router.get('/', authorizeRoles('admin', 'faculty', 'student'), SubjectController.getAll);
router.get('/:id', authorizeRoles('admin', 'faculty', 'student'), SubjectController.getById);
router.get('/:id/students', authorizeRoles('admin', 'faculty'), SubjectController.getSubjectStudents);

router.post('/', authorizeRoles('admin'), SubjectController.create);
router.put('/:id', authorizeRoles('admin'), SubjectController.update);
router.delete('/:id', authorizeRoles('admin'), SubjectController.delete);

router.get('/:id/attendance', authorizeRoles('admin', 'faculty'), AttendanceController.getSubjectAttendance);
router.get('/:id/attendance-summary', authorizeRoles('admin', 'faculty'), SubjectController.getAttendanceSummary);

module.exports = router;
