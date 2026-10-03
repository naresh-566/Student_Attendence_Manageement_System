/**
 * AttendEase - JWT Utility
 * Demonstrates: NRD Lab Experiment 11 (JWT Authentication and Authorization)
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'attendease_nrd_lab_secure_jwt_secret_key_2026_!@#';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate a signed JSON Web Token
 * @param {Object} payload - User identification and role details
 * @returns {string} Signed JWT
 */
const generateToken = (payload) => {
  return jwt.sign(
    {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      studentId: payload.studentId || null,
      facultyId: payload.facultyId || null,
      rollNumber: payload.rollNumber || null,
      employeeId: payload.employeeId || null
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Verify and decode an incoming JWT
 * @param {string} token 
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET
};
