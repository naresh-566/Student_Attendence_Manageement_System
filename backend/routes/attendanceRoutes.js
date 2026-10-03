/**
 * AttendEase - Attendance Routes
 * Demonstrates: Express RESTful Attendance APIs, Analytics & Exports
 */

const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/attendanceController');
const authenticateJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(authenticateJWT);

// Dashboard statistics
router.get('/statistics', AttendanceController.getStatistics);

// Check if attendance already recorded for date
router.get('/check', authorizeRoles('admin', 'faculty'), AttendanceController.checkExisting);

// Exports
router.get('/export/xml', authorizeRoles('admin', 'faculty'), AttendanceController.exportXml);
router.get('/export/csv', AttendanceController.exportCsv);

// CRUD
router.get('/', AttendanceController.getAll);
router.get('/:id', AttendanceController.getById);
router.post('/', authorizeRoles('admin', 'faculty'), AttendanceController.recordBatch);
router.put('/:id', authorizeRoles('admin', 'faculty'), AttendanceController.update);
router.delete('/:id', authorizeRoles('admin'), AttendanceController.delete);

module.exports = router;
