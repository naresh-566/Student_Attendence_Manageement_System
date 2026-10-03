/**
 * AttendEase - Attendance Model
 * Demonstrates: NRD Lab Experiment 5 (Database CRUD), 10 (REST APIs), 13 (Chart Analytics)
 */

const { query } = require('../config/db');

const AttendanceModel = {
  findAll: async ({ subjectId, facultyId, studentId, date, startDate, endDate, status, department, section, limit = 500 } = {}) => {
    let sql = `
      SELECT a.id, a.student_id, a.subject_id, a.faculty_id, a.attendance_date, a.status, a.remarks, a.created_at,
             s.roll_number, s.name as student_name, s.department, s.year, s.section,
             sub.subject_code, sub.subject_name,
             f.name as faculty_name
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN subjects sub ON a.subject_id = sub.id
      JOIN faculty f ON a.faculty_id = f.id
      WHERE 1=1
    `;
    const params = [];

    if (subjectId) {
      sql += ` AND a.subject_id = ?`;
      params.push(subjectId);
    }
    if (facultyId) {
      sql += ` AND a.faculty_id = ?`;
      params.push(facultyId);
    }
    if (studentId) {
      sql += ` AND a.student_id = ?`;
      params.push(studentId);
    }
    if (date) {
      sql += ` AND a.attendance_date = ?`;
      params.push(date);
    }
    if (startDate) {
      sql += ` AND a.attendance_date >= ?`;
      params.push(startDate);
    }
    if (endDate) {
      sql += ` AND a.attendance_date <= ?`;
      params.push(endDate);
    }
    if (status) {
      sql += ` AND a.status = ?`;
      params.push(status);
    }
    if (department) {
      sql += ` AND s.department = ?`;
      params.push(department);
    }
    if (section) {
      sql += ` AND s.section = ?`;
      params.push(section);
    }

    sql += ` ORDER BY a.attendance_date DESC, s.roll_number ASC LIMIT ${parseInt(limit, 10) || 500}`;
    return await query(sql, params);
  },

  findById: async (id) => {
    const rows = await query(
      `SELECT a.*, s.roll_number, s.name as student_name, sub.subject_name, sub.subject_code, f.name as faculty_name
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       JOIN subjects sub ON a.subject_id = sub.id
       JOIN faculty f ON a.faculty_id = f.id
       WHERE a.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Check if attendance has already been recorded for a subject on a date
   */
  checkExistingSession: async (subjectId, attendanceDate) => {
    const rows = await query(
      `SELECT COUNT(*) as count FROM attendance WHERE subject_id = ? AND attendance_date = ?`,
      [subjectId, attendanceDate]
    );
    return (rows[0]?.count || 0) > 0;
  },

  /**
   * Record batch attendance for all students in class
   */
  recordBatch: async ({ subjectId, facultyId, attendanceDate, sessionTime = '09:00 AM', records }) => {
    // Check if session exists in attendance_sessions
    const existingSession = await query(
      `SELECT id FROM attendance_sessions WHERE subject_id = ? AND attendance_date = ?`,
      [subjectId, attendanceDate]
    );
    if (!existingSession || existingSession.length === 0) {
      await query(
        `INSERT INTO attendance_sessions (subject_id, faculty_id, attendance_date, session_time) VALUES (?, ?, ?, ?)`,
        [subjectId, facultyId, attendanceDate, sessionTime]
      ).catch(() => {});
    }

    let insertedCount = 0;
    let updatedCount = 0;

    for (const record of records) {
      const { studentId, status, remarks = null } = record;
      
      // Check if duplicate exists
      const existing = await query(
        `SELECT id FROM attendance WHERE student_id = ? AND subject_id = ? AND attendance_date = ?`,
        [studentId, subjectId, attendanceDate]
      );

      if (existing && existing.length > 0) {
        // Update existing record
        await query(
          `UPDATE attendance SET status = ?, remarks = ?, faculty_id = ? WHERE id = ?`,
          [status, remarks, facultyId, existing[0].id]
        );
        updatedCount++;
      } else {
        // Insert new record
        await query(
          `INSERT INTO attendance (student_id, subject_id, faculty_id, attendance_date, status, remarks)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [studentId, subjectId, facultyId, attendanceDate, status, remarks]
        );
        insertedCount++;
      }
    }

    return { insertedCount, updatedCount, totalProcessed: records.length };
  },

  update: async (id, { status, remarks }) => {
    const result = await query(
      `UPDATE attendance SET status = ?, remarks = ? WHERE id = ?`,
      [status, remarks || null, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM attendance WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  /**
   * Get comprehensive dashboard attendance statistics
   */
  getOverallStatistics: async (threshold = 75) => {
    // Total students, faculty, subjects
    const [stCountRow] = await query('SELECT COUNT(*) as count FROM students');
    const [facCountRow] = await query('SELECT COUNT(*) as count FROM faculty');
    const [subCountRow] = await query('SELECT COUNT(*) as count FROM subjects');

    const totalStudents = stCountRow?.count || 0;
    const totalFaculty = facCountRow?.count || 0;
    const totalSubjects = subCountRow?.count || 0;

    // Overall attendance counts
    const [countsRow] = await query(`
      SELECT 
        COUNT(*) as total_entries,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as total_present,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as total_absent
      FROM attendance
    `);

    const totalEntries = countsRow?.total_entries || 0;
    const totalPresent = countsRow?.total_present || 0;
    const totalAbsent = countsRow?.total_absent || 0;
    const averageAttendance = totalEntries > 0
      ? Number(((totalPresent / totalEntries) * 100).toFixed(1))
      : 0;

    // Today's attendance
    const todayStr = new Date().toISOString().split('T')[0];
    const [todayRow] = await query(`
      SELECT 
        COUNT(*) as today_total,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as today_present,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as today_absent
      FROM attendance
      WHERE attendance_date = ?
    `, [todayStr]);

    const todayTotal = todayRow?.today_total || 0;
    const todayPresent = todayRow?.today_present || 0;
    const todayAbsent = todayRow?.today_absent || 0;
    const todayPercentage = todayTotal > 0
      ? Number(((todayPresent / todayTotal) * 100).toFixed(1))
      : averageAttendance; // Fallback to average if no session today yet

    // Low attendance student calculation
    const studentPercRows = await query(`
      SELECT 
        student_id,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present
      FROM attendance
      GROUP BY student_id
    `);

    let lowAttendanceCount = 0;
    studentPercRows.forEach(row => {
      const perc = (row.present / row.total) * 100;
      if (perc < threshold) {
        lowAttendanceCount++;
      }
    });

    // Subject-wise attendance for Chart.js
    const subjectStats = await query(`
      SELECT 
        sub.id,
        sub.subject_code,
        sub.subject_name,
        COUNT(a.id) as total_classes,
        SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as present_count,
        SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as absent_count
      FROM subjects sub
      LEFT JOIN attendance a ON sub.id = a.subject_id
      GROUP BY sub.id, sub.subject_code, sub.subject_name
      ORDER BY sub.subject_code ASC
    `);

    const subjectAttendanceChart = subjectStats.map(s => {
      const total = Number(s.total_classes || 0);
      const present = Number(s.present_count || 0);
      return {
        subject_id: s.id,
        subject_code: s.subject_code,
        subject_name: s.subject_name,
        percentage: total > 0 ? Number(((present / total) * 100).toFixed(1)) : 0,
        total_classes: total,
        present: present
      };
    });

    // Recent sessions
    const recentSessions = await query(`
      SELECT DISTINCT a.attendance_date, sub.subject_code, sub.subject_name, f.name as faculty_name,
             COUNT(a.id) as total_students,
             SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as present_count
      FROM attendance a
      JOIN subjects sub ON a.subject_id = sub.id
      JOIN faculty f ON a.faculty_id = f.id
      GROUP BY a.attendance_date, sub.subject_code, sub.subject_name, f.name
      ORDER BY a.attendance_date DESC
      LIMIT 5
    `);

    // Monthly trend
    const trendRows = await query(`
      SELECT attendance_date,
             COUNT(*) as total,
             SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present
      FROM attendance
      GROUP BY attendance_date
      ORDER BY attendance_date ASC
      LIMIT 10
    `);

    const trend = trendRows.map(t => ({
      date: t.attendance_date,
      percentage: Number(((t.present / t.total) * 100).toFixed(1))
    }));

    return {
      summary: {
        totalStudents,
        totalFaculty,
        totalSubjects,
        totalEntries,
        averageAttendance,
        todayAttendance: todayPercentage,
        todayPresent,
        todayAbsent,
        lowAttendanceCount,
        threshold
      },
      charts: {
        distribution: {
          present: totalPresent,
          absent: totalAbsent
        },
        subjectWise: subjectAttendanceChart,
        trend
      },
      recentSessions
    };
  }
};

module.exports = AttendanceModel;
