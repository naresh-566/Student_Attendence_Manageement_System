/**
 * AttendEase - Faculty Controller
 * Demonstrates: NRD Lab Experiment 5 (Database CRUD), 10 (REST APIs)
 */

const bcrypt = require('bcryptjs');
const FacultyModel = require('../models/facultyModel');
const UserModel = require('../models/userModel');
const { isValidEmail, isValidPhone } = require('../utils/validation');

const FacultyController = {
  getAll: async (req, res, next) => {
    try {
      const { search, department } = req.query;
      const facultyList = await FacultyModel.findAll({ search, department });
      res.status(200).json({
        success: true,
        count: facultyList.length,
        data: facultyList
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const faculty = await FacultyModel.findById(id);
      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: `Faculty member with ID ${id} not found.`
        });
      }
      res.status(200).json({
        success: true,
        data: faculty
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { employeeId, name, email, department, phone, password } = req.body;

      if (!employeeId || !name || !email || !department) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID, name, email, and department are mandatory.'
        });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email address format.'
        });
      }

      if (phone && !isValidPhone(phone)) {
        return res.status(400).json({
          success: false,
          message: 'Phone number must be 10 digits.'
        });
      }

      const existingEmp = await FacultyModel.findByEmployeeId(employeeId.trim());
      if (existingEmp) {
        return res.status(409).json({
          success: false,
          message: `Faculty with Employee ID '${employeeId}' already exists.`
        });
      }

      const existingUser = await UserModel.findByEmail(email.trim().toLowerCase());
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: `User with email '${email}' already exists.`
        });
      }

      // Create linked user login
      const defaultPassword = password || 'Faculty@123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      const userId = await UserModel.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: 'faculty'
      });

      const facultyId = await FacultyModel.create({
        userId,
        employeeId: employeeId.trim().toUpperCase(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        department: department.trim(),
        phone: phone ? phone.trim() : null
      });

      const newFaculty = await FacultyModel.findById(facultyId);

      res.status(201).json({
        success: true,
        message: 'Faculty profile and login account created successfully.',
        data: newFaculty
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { employeeId, name, email, department, phone } = req.body;

      const faculty = await FacultyModel.findById(id);
      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: `Faculty with ID ${id} not found.`
        });
      }

      if (!employeeId || !name || !email || !department) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID, name, email, and department are required.'
        });
      }

      await FacultyModel.update(id, {
        employeeId: employeeId.trim().toUpperCase(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        department: department.trim(),
        phone: phone ? phone.trim() : null
      });

      const updated = await FacultyModel.findById(id);
      res.status(200).json({
        success: true,
        message: 'Faculty details updated successfully.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const faculty = await FacultyModel.findById(id);
      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: `Faculty with ID ${id} not found.`
        });
      }

      await FacultyModel.delete(id);
      res.status(200).json({
        success: true,
        message: `Faculty '${faculty.name}' removed successfully.`
      });
    } catch (error) {
      next(error);
    }
  },

  getAssignedSubjects: async (req, res, next) => {
    try {
      const { id } = req.params;
      const subjects = await FacultyModel.getAssignedSubjects(id);
      res.status(200).json({
        success: true,
        count: subjects.length,
        data: subjects
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = FacultyController;
