/**
 * AttendEase - Authentication Controller
 * Demonstrates: NRD Lab Experiment 3 (Validation), 8 (Session/Auth State), 11 (JWT Authentication)
 */

const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const StudentModel = require('../models/studentModel');
const FacultyModel = require('../models/facultyModel');
const { generateToken } = require('../utils/jwt');
const { isValidEmail } = require('../utils/validation');
const { query } = require('../config/db');

const AuthController = {
  /**
   * POST /api/auth/login
   * User login with role determination and JWT issuance
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Both email and password are required to login.'
        });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.'
        });
      }

      // Find user
      const user = await UserModel.findByEmail(email.trim().toLowerCase());
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. User with this email does not exist.'
        });
      }

      // Verify bcrypt password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Password is incorrect.'
        });
      }

      // Load profile specific attributes and accurate current display name
      let profileDetails = {};
      let displayName = user.name;

      if (user.role === 'student') {
        const student = await StudentModel.findByUserId(user.id);
        if (student) {
          displayName = student.name;
          profileDetails = {
            studentId: student.id,
            rollNumber: student.roll_number,
            department: student.department,
            year: student.year,
            section: student.section,
            phone: student.phone
          };
          // Sync users table if student name was updated
          if (user.name !== student.name) {
            await query('UPDATE users SET name = ? WHERE id = ?', [student.name, user.id]).catch(() => {});
          }
        }
      } else if (user.role === 'faculty') {
        const faculty = await FacultyModel.findByUserId(user.id);
        if (faculty) {
          displayName = faculty.name;
          profileDetails = {
            facultyId: faculty.id,
            employeeId: faculty.employee_id,
            department: faculty.department,
            phone: faculty.phone
          };
          // Sync users table if faculty name was updated
          if (user.name !== faculty.name) {
            await query('UPDATE users SET name = ? WHERE id = ?', [faculty.name, user.id]).catch(() => {});
          }
        }
      }

      // Generate JWT with current display name
      const token = generateToken({
        id: user.id,
        name: displayName,
        email: user.email,
        role: user.role,
        ...profileDetails
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful! Welcome to AttendEase.',
        token,
        user: {
          id: user.id,
          name: displayName,
          email: user.email,
          role: user.role,
          ...profileDetails
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/auth/me
   * Return authenticated user context
   */
  getMe: async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found.'
        });
      }

      let profileDetails = {};
      let displayName = user.name;

      if (user.role === 'student') {
        const student = await StudentModel.findByUserId(user.id);
        if (student) {
          displayName = student.name;
          profileDetails = {
            studentId: student.id,
            rollNumber: student.roll_number,
            department: student.department,
            year: student.year,
            section: student.section,
            phone: student.phone
          };
        }
      } else if (user.role === 'faculty') {
        const faculty = await FacultyModel.findByUserId(user.id);
        if (faculty) {
          displayName = faculty.name;
          profileDetails = {
            facultyId: faculty.id,
            employeeId: faculty.employee_id,
            department: faculty.department,
            phone: faculty.phone
          };
        }
      }

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: displayName,
          email: user.email,
          role: user.role,
          ...profileDetails
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/auth/demo-accounts
   * Return live demo accounts with updated names directly from database
   */
  getDemoUsers: async (req, res, next) => {
    try {
      const admin = await UserModel.findByEmail('admin@attendease.com');
      const faculty = (await query('SELECT * FROM faculty WHERE email = ? LIMIT 1', ['faculty1@attendease.com']))[0];
      const student1 = (await query('SELECT * FROM students WHERE email = ? OR id = 1 LIMIT 1', ['student1@attendease.com']))[0];
      const student3 = (await query('SELECT * FROM students WHERE email = ? OR id = 3 LIMIT 1', ['student3@attendease.com']))[0];

      res.status(200).json({
        success: true,
        data: {
          admin: {
            email: 'admin@attendease.com',
            name: admin?.name || 'System Administrator',
            role: 'admin',
            badge: 'Admin'
          },
          faculty: {
            email: faculty?.email || 'faculty1@attendease.com',
            name: faculty?.name || 'Dr. Ramesh Kumar',
            department: faculty?.department || 'Computer Science & Engineering',
            role: 'faculty',
            badge: 'Faculty'
          },
          student1: {
            email: student1?.email || 'student1@attendease.com',
            name: student1?.name || 'Rahul Sharma',
            rollNumber: student1?.roll_number || '21CS101',
            role: 'student',
            badge: 'Student'
          },
          student3: {
            email: student3?.email || 'student3@attendease.com',
            name: student3?.name || 'Amit Verma',
            rollNumber: student3?.roll_number || '21CS103',
            role: 'student',
            badge: 'Student (<75%)'
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/auth/profile
   * Update current user profile
   */
  updateProfile: async (req, res, next) => {
    try {
      const { name, phone, rollNumber, year, section, department } = req.body;
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Name cannot be empty.' });
      }

      await UserModel.updateProfile(req.user.id, { name: name.trim(), email: req.user.email });

      let updatedDetails = {};
      if (req.user.role === 'student' && req.user.studentId) {
        const student = await StudentModel.findById(req.user.studentId);
        if (student) {
          const finalRoll = rollNumber ? rollNumber.trim().toUpperCase() : student.roll_number;
          // check if roll number is already used by another student
          if (finalRoll !== student.roll_number) {
            const existing = await StudentModel.findByRollNumber(finalRoll);
            if (existing && existing.id !== student.id) {
              return res.status(409).json({
                success: false,
                message: `Roll number '${finalRoll}' is already in use by another student.`
              });
            }
          }

          const finalYear = year ? parseInt(year, 10) : student.year;
          const finalSection = section ? section.trim().toUpperCase() : student.section;
          const finalDept = department ? department.trim() : student.department;

          await StudentModel.update(student.id, {
            rollNumber: finalRoll,
            name: name.trim(),
            email: student.email,
            phone: phone ? phone.trim() : student.phone,
            department: finalDept,
            year: finalYear,
            section: finalSection
          });

          updatedDetails = {
            rollNumber: finalRoll,
            year: finalYear,
            section: finalSection,
            department: finalDept
          };
        }
      } else if (req.user.role === 'faculty' && req.user.facultyId) {
        const faculty = await FacultyModel.findById(req.user.facultyId);
        if (faculty) {
          const finalDept = department ? department.trim() : faculty.department;
          await FacultyModel.update(faculty.id, {
            employeeId: faculty.employee_id,
            name: name.trim(),
            email: faculty.email,
            department: finalDept,
            phone: phone ? phone.trim() : faculty.phone
          });
          updatedDetails = { department: finalDept };
        }
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: {
          name: name.trim(),
          phone: phone || null,
          ...updatedDetails
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/auth/change-password
   */
  changePassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Both current password and new password are required.'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long.'
        });
      }

      const user = await UserModel.findByEmail(req.user.email);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match.'
        });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(req.user.id, hashed);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully!'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AuthController;
