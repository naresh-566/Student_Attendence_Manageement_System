/**
 * AttendEase - Attendance Controller
 * Demonstrates: NRD Lab Experiment 4 (ES6 Data Handling), 5 (CRUD), 6 (XML Export), 10 (REST APIs)
 */

const AttendanceModel = require('../models/attendanceModel');
const SubjectModel = require('../models/subjectModel');
const StudentModel = require('../models/studentModel');
const { isValidDate } = require('../utils/validation');
const { query } = require('../config/db');

const AttendanceController = {
  getAll: async (req, res, next) => {
    try {
      const { subjectId, facultyId, studentId, date, startDate, endDate, status, department, section, limit } = req.query;
      
      // If student is logged in, restrict to their own attendance
      let filterStudentId = studentId;
      if (req.user.role === 'student' && req.user.studentId) {
        filterStudentId = req.user.studentId;
      }

      // If faculty is logged in and facultyId not specified, optionally filter
      let filterFacultyId = facultyId;
      if (req.user.role === 'faculty' && !facultyId && !req.query.all) {
        filterFacultyId = req.user.facultyId;
      }

      const records = await AttendanceModel.findAll({
        subjectId,
        facultyId: filterFacultyId,
        studentId: filterStudentId,
        date,
        startDate,
        endDate,
        status,
        department,
        section,
        limit
      });

      res.status(200).json({
        success: true,
        count: records.length,
        data: records
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const record = await AttendanceModel.findById(id);
      if (!record) {
        return res.status(404).json({
          success: false,
          message: `Attendance record #${id} not found.`
        });
      }
      res.status(200).json({
        success: true,
        data: record
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check if attendance was already recorded for subject and date
   * GET /api/attendance/check?subjectId=1&date=2026-09-30
   */
  checkExisting: async (req, res, next) => {
    try {
      const { subjectId, date } = req.query;
      if (!subjectId || !date) {
        return res.status(400).json({
          success: false,
          message: 'Both subjectId and date are required query parameters.'
        });
      }

      const exists = await AttendanceModel.checkExistingSession(subjectId, date);
      res.status(200).json({
        success: true,
        alreadyRecorded: exists,
        message: exists
          ? 'Attendance has already been recorded for this date. Submitting again will update the existing records.'
          : 'Attendance not yet recorded for this date.'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/attendance
   * Submit Batch Attendance (Faculty marks Present/Absent)
   */
  recordBatch: async (req, res, next) => {
    try {
      const { subjectId, attendanceDate, sessionTime, records } = req.body;

      // Validation
      if (!subjectId) {
        return res.status(400).json({
          success: false,
          message: 'Please select a subject.'
        });
      }

      if (!attendanceDate || !isValidDate(attendanceDate)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid attendance date in YYYY-MM-DD format.'
        });
      }

      if (!records || !Array.isArray(records) || records.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Records array cannot be empty. At least one student attendance status must be provided.'
        });
      }

      // Verify subject exists
      const subject = await SubjectModel.findById(subjectId);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Selected subject does not exist.'
        });
      }

      // Determine facultyId
      let facultyId = subject.faculty_id;
      if (req.user.role === 'faculty' && req.user.facultyId) {
        facultyId = req.user.facultyId;
      }
      if (!facultyId) {
        facultyId = 1; // Fallback to primary faculty if subject had no assigned faculty
      }

      const result = await AttendanceModel.recordBatch({
        subjectId: parseInt(subjectId, 10),
        facultyId: parseInt(facultyId, 10),
        attendanceDate,
        sessionTime: sessionTime || '09:00 AM',
        records
      });

      res.status(200).json({
        success: true,
        message: `Attendance saved successfully. Processed ${result.totalProcessed} students (${result.insertedCount} new, ${result.updatedCount} updated).`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/attendance/:id
   * Edit individual student attendance status
   */
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;

      if (!status || !['Present', 'Absent'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Attendance status must be either 'Present' or 'Absent'."
        });
      }

      const record = await AttendanceModel.findById(id);
      if (!record) {
        return res.status(404).json({
          success: false,
          message: `Attendance record #${id} not found.`
        });
      }

      await AttendanceModel.update(id, { status, remarks });
      const updated = await AttendanceModel.findById(id);

      res.status(200).json({
        success: true,
        message: 'Attendance record updated successfully.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const record = await AttendanceModel.findById(id);
      if (!record) {
        return res.status(404).json({
          success: false,
          message: `Attendance record #${id} not found.`
        });
      }

      await AttendanceModel.delete(id);
      res.status(200).json({
        success: true,
        message: `Attendance record #${id} deleted.`
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/attendance/statistics
   * Returns calculated values from the database for dashboard and charts
   */
  getStatistics: async (req, res, next) => {
    try {
      const threshold = parseInt(process.env.ATTENDANCE_THRESHOLD || '75', 10);
      const stats = await AttendanceModel.getOverallStatistics(threshold);
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/students/:id/attendance
   */
  getStudentAttendance: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { subjectId, startDate, endDate } = req.query;
      const records = await AttendanceModel.findAll({
        studentId: id,
        subjectId,
        startDate,
        endDate
      });

      res.status(200).json({
        success: true,
        count: records.length,
        data: records
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/subjects/:id/attendance
   */
  getSubjectAttendance: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { date } = req.query;
      const records = await AttendanceModel.findAll({
        subjectId: id,
        date
      });

      res.status(200).json({
        success: true,
        count: records.length,
        data: records
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/attendance/export/xml
   * Demonstrates NRD Lab Experiment 6 (XML generation & validation against DTD/XSD)
   */
  exportXml: async (req, res, next) => {
    try {
      const { subjectId = 1 } = req.query;
      const subject = await SubjectModel.findById(subjectId) || {
        subject_code: 'CS501',
        subject_name: 'Web Technologies',
        department: 'Computer Science & Engineering',
        semester: 5,
        faculty_name: 'Dr. Ramesh Kumar'
      };

      const summary = await SubjectModel.getAttendanceSummary(subjectId);
      const studentsList = summary?.students || [];
      const totalSessions = summary?.total_sessions || 0;

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<!DOCTYPE attendance_report SYSTEM "attendance.dtd">\n`;
      xml += `<attendance_report xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="attendance.xsd">\n`;
      xml += `  <institution>Department of Computer Science &amp; Engineering</institution>\n`;
      xml += `  <academic_year>2026-2027</academic_year>\n`;
      xml += `  <generated_date>${new Date().toISOString().split('T')[0]}</generated_date>\n`;
      xml += `  <subject_summary>\n`;
      xml += `    <subject_code>${subject.subject_code}</subject_code>\n`;
      xml += `    <subject_name>${subject.subject_name.replace(/&/g, '&amp;')}</subject_name>\n`;
      xml += `    <department>${subject.department.replace(/&/g, '&amp;')}</department>\n`;
      xml += `    <semester>${subject.semester || 5}</semester>\n`;
      xml += `    <faculty_in_charge>${(subject.faculty_name || 'Faculty In Charge').replace(/&/g, '&amp;')}</faculty_in_charge>\n`;
      xml += `    <total_classes>${totalSessions}</total_classes>\n`;
      xml += `    <total_students>${studentsList.length}</total_students>\n`;
      xml += `  </subject_summary>\n`;
      xml += `  <records>\n`;

      studentsList.forEach((st, idx) => {
        xml += `    <record id="${idx + 1}">\n`;
        xml += `      <roll_number>${st.roll_number}</roll_number>\n`;
        xml += `      <student_name>${st.student_name.replace(/&/g, '&amp;')}</student_name>\n`;
        xml += `      <total_present>${st.present_count || 0}</total_present>\n`;
        xml += `      <total_absent>${st.absent_count || 0}</total_absent>\n`;
        xml += `      <percentage>${Number(st.percentage).toFixed(1)}</percentage>\n`;
        xml += `      <status>${st.percentage < 75 ? 'Low Attendance' : 'Satisfactory'}</status>\n`;
        xml += `    </record>\n`;
      });

      xml += `  </records>\n`;
      xml += `</attendance_report>`;

      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', `attachment; filename=attendance-${subject.subject_code}.xml`);
      return res.status(200).send(xml);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/attendance/export/csv
   */
  exportCsv: async (req, res, next) => {
    try {
      const { subjectId, date } = req.query;
      const records = await AttendanceModel.findAll({ subjectId, date, limit: 1000 });

      let csv = 'ID,Date,Subject Code,Subject Name,Roll Number,Student Name,Status,Faculty,Remarks\n';
      records.forEach(r => {
        csv += `"${r.id}","${r.attendance_date}","${r.subject_code}","${r.subject_name}","${r.roll_number}","${r.student_name}","${r.status}","${r.faculty_name}","${r.remarks || ''}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=attendance_report.csv');
      return res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AttendanceController;
