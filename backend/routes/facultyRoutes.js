/**
 * AttendEase - Faculty Routes
 * Demonstrates: Express RESTful Routes & Role-Based Authorization
 */

const express = require('express');
const router = express.Router();
const FacultyController = require('../controllers/facultyController');
const authenticateJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.use(authenticateJWT);

router.get('/', authorizeRoles('admin', 'faculty'), FacultyController.getAll);
router.get('/:id', authorizeRoles('admin', 'faculty'), FacultyController.getById);
router.post('/', authorizeRoles('admin'), FacultyController.create);
router.put('/:id', authorizeRoles('admin'), FacultyController.update);
router.delete('/:id', authorizeRoles('admin'), FacultyController.delete);
router.get('/:id/subjects', authorizeRoles('admin', 'faculty'), FacultyController.getAssignedSubjects);

module.exports = router;
