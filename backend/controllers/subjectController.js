/**
 * AttendEase - Subject Controller
 * Demonstrates: NRD Lab Experiment 5 (Database CRUD), 10 (REST APIs)
 */

const SubjectModel = require('../models/subjectModel');
const { query } = require('../config/db');

const SubjectController = {
  getAll: async (req, res, next) => {
    try {
      const { department, facultyId } = req.query;
      const subjects = await SubjectModel.findAll({ department, facultyId });
      res.status(200).json({
        success: true,
        count: subjects.length,
        data: subjects
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findById(id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: `Subject with ID ${id} not found.`
        });
      }
      res.status(200).json({
        success: true,
        data: subject
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { subjectCode, subjectName, department, year, semester, section, facultyId } = req.body;

      if (!subjectCode || !subjectName || !department) {
        return res.status(400).json({
          success: false,
          message: 'Subject code, subject name, and department are mandatory.'
        });
      }

      const existing = await SubjectModel.findByCode(subjectCode.trim());
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `Subject code '${subjectCode}' is already registered.`
        });
      }

      const subjectId = await SubjectModel.create({
        subjectCode: subjectCode.trim().toUpperCase(),
        subjectName: subjectName.trim(),
        department: department.trim(),
        year: year ? parseInt(year, 10) : 3,
        semester: semester ? parseInt(semester, 10) : 1,
        section: section ? section.trim().toUpperCase() : 'A',
        facultyId: facultyId ? parseInt(facultyId, 10) : null
      });

      const newSubject = await SubjectModel.findById(subjectId);
      res.status(201).json({
        success: true,
        message: 'Subject created successfully.',
        data: newSubject
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { subjectCode, subjectName, department, year, semester, section, facultyId } = req.body;

      const subject = await SubjectModel.findById(id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: `Subject with ID ${id} not found.`
        });
      }

      if (!subjectCode || !subjectName || !department) {
        return res.status(400).json({
          success: false,
          message: 'Subject code, subject name, and department are mandatory.'
        });
      }

      await SubjectModel.update(id, {
        subjectCode: subjectCode.trim().toUpperCase(),
        subjectName: subjectName.trim(),
        department: department.trim(),
        year: year ? parseInt(year, 10) : subject.year,
        semester: semester ? parseInt(semester, 10) : subject.semester,
        section: section ? section.trim().toUpperCase() : subject.section,
        facultyId: facultyId ? parseInt(facultyId, 10) : null
      });

      const updated = await SubjectModel.findById(id);
      res.status(200).json({
        success: true,
        message: 'Subject updated successfully.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findById(id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: `Subject with ID ${id} not found.`
        });
      }

      await SubjectModel.delete(id);
      res.status(200).json({
        success: true,
        message: `Subject '${subject.subject_name}' (${subject.subject_code}) removed successfully.`
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all students belonging to the department and section of this subject
   * (Crucial for the Mark Attendance page)
   */
  getSubjectStudents: async (req, res, next) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findById(id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: `Subject with ID ${id} not found.`
        });
      }

      const students = await query(
        `SELECT id, roll_number, name, email, department, year, section
         FROM students
         WHERE department = ? AND section = ?
         ORDER BY roll_number ASC`,
        [subject.department, subject.section]
      );

      res.status(200).json({
        success: true,
        subject,
        count: students.length,
        data: students
      });
    } catch (error) {
      next(error);
    }
  },

  getAttendanceSummary: async (req, res, next) => {
    try {
      const { id } = req.params;
      const summary = await SubjectModel.getAttendanceSummary(id);
      if (!summary) {
        return res.status(404).json({
          success: false,
          message: `Subject with ID ${id} not found.`
        });
      }
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = SubjectController;
