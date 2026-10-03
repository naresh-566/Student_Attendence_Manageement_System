/**
 * AttendEase - Authentication Middleware
 * Demonstrates: NRD Lab Experiment 11 (JWT Verification & Route Protection)
 */

const { verifyToken } = require('../utils/jwt');
const { query } = require('../config/db');

const authenticateJWT = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Missing or malformed authorization token.'
      });
    }
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (tokenErr) {
      if (tokenErr.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Session token has expired. Please log in again.'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token.'
      });
    }

    // Verify user still exists in database
    const users = await query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);
    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User account not found or has been deactivated.'
      });
    }

    const user = users[0];
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // If student, attach student profile ID
    if (user.role === 'student') {
      const students = await query('SELECT id, roll_number, department, year, section FROM students WHERE user_id = ?', [user.id]);
      if (students.length > 0) {
        req.user.studentId = students[0].id;
        req.user.rollNumber = students[0].roll_number;
        req.user.department = students[0].department;
        req.user.year = students[0].year;
        req.user.section = students[0].section;
      }
    }

    // If faculty, attach faculty profile ID
    if (user.role === 'faculty') {
      const faculty = await query('SELECT id, employee_id, department FROM faculty WHERE user_id = ?', [user.id]);
      if (faculty.length > 0) {
        req.user.facultyId = faculty[0].id;
        req.user.employeeId = faculty[0].employee_id;
        req.user.department = faculty[0].department;
      }
    }

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server authentication error'
    });
  }
};

module.exports = authenticateJWT;
