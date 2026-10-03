/**
 * AttendEase - Student Controller
 * Demonstrates: NRD Lab Experiment 5 (Database CRUD), 10 (REST APIs)
 */

const bcrypt = require('bcryptjs');
const StudentModel = require('../models/studentModel');
const UserModel = require('../models/userModel');
const { isValidEmail, isValidPhone } = require('../utils/validation');

const StudentController = {
  getAll: async (req, res, next) => {
    try {
      const { search, department, year, section } = req.query;
      const students = await StudentModel.findAll({ search, department, year, section });
      res.status(200).json({
        success: true,
        count: students.length,
        data: students
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const student = await StudentModel.findById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: `Student with ID ${id} not found.`
        });
      }
      res.status(200).json({
        success: true,
        data: student
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { rollNumber, name, email, phone, department, year, section, password } = req.body;

      // Validation
      if (!rollNumber || !name || !email || !department) {
        return res.status(400).json({
          success: false,
          message: 'Roll number, student name, email, and department are mandatory.'
        });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid student email address.'
        });
      }

      if (phone && !isValidPhone(phone)) {
        return res.status(400).json({
          success: false,
          message: 'Phone number must be a valid 10-digit number.'
        });
      }

      // Check unique roll number
      const existingRoll = await StudentModel.findByRollNumber(rollNumber.trim());
      if (existingRoll) {
        return res.status(409).json({
          success: false,
          message: `A student with roll number '${rollNumber}' is already registered.`
        });
      }

      // Check unique email
      const existingUser = await UserModel.findByEmail(email.trim().toLowerCase());
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: `User with email '${email}' is already registered.`
        });
      }

      // Create linked user login account
      const defaultPassword = password || 'Student@123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      const userId = await UserModel.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: 'student'
      });

      // Create student profile
      const studentId = await StudentModel.create({
        userId,
        rollNumber: rollNumber.trim().toUpperCase(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        department: department.trim(),
        year: year ? parseInt(year, 10) : 3,
        section: section ? section.trim().toUpperCase() : 'A'
      });

      const newStudent = await StudentModel.findById(studentId);

      res.status(201).json({
        success: true,
        message: 'Student registered successfully with user login credentials.',
        data: newStudent
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { rollNumber, name, email, phone, department, year, section } = req.body;

      const student = await StudentModel.findById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: `Student with ID ${id} not found.`
        });
      }

      if (!rollNumber || !name || !email || !department) {
        return res.status(400).json({
          success: false,
          message: 'Roll number, student name, email, and department are required.'
        });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email address format.'
        });
      }

      // Check if roll number is already assigned to another student
      const existingRoll = await StudentModel.findByRollNumber(rollNumber.trim().toUpperCase());
      if (existingRoll && existingRoll.id !== parseInt(id, 10)) {
        return res.status(409).json({
          success: false,
          message: `A student with roll number '${rollNumber}' is already registered.`
        });
      }

      await StudentModel.update(id, {
        rollNumber: rollNumber.trim().toUpperCase(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        department: department.trim(),
        year: year ? parseInt(year, 10) : student.year,
        section: section ? section.trim().toUpperCase() : student.section
      });

      const updated = await StudentModel.findById(id);
      res.status(200).json({
        success: true,
        message: 'Student record updated successfully.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const student = await StudentModel.findById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: `Student with ID ${id} not found.`
        });
      }

      await StudentModel.delete(id);
      res.status(200).json({
        success: true,
        message: `Student '${student.name}' (${student.roll_number}) and login credentials deleted successfully.`
      });
    } catch (error) {
      next(error);
    }
  },

  getAttendanceSummary: async (req, res, next) => {
    try {
      const { id } = req.params;
      const threshold = parseInt(process.env.ATTENDANCE_THRESHOLD || '75', 10);
      const student = await StudentModel.findById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: `Student with ID ${id} not found.`
        });
      }

      const summary = await StudentModel.getAttendanceSummary(id, threshold);
      res.status(200).json({
        success: true,
        student,
        summary
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = StudentController;
