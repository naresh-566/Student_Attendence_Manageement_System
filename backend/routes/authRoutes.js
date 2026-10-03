/**
 * AttendEase - Authentication Routes
 * Demonstrates: Express Routing & JWT Authentication
 */

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');

// Public routes
router.post('/login', AuthController.login);
router.get('/demo-accounts', AuthController.getDemoUsers);

// Protected routes
router.get('/me', authenticateJWT, AuthController.getMe);
router.put('/profile', authenticateJWT, AuthController.updateProfile);
router.put('/change-password', authenticateJWT, AuthController.changePassword);

module.exports = router;
