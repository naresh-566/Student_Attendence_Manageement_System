/**
 * AttendEase - Student Model
 * Demonstrates: NRD Lab Experiment 5 & 10 (Database CRUD & Student Management)
 */

const { query } = require('../config/db');

const StudentModel = {
  findAll: async ({ search = '', department = '', year = '', section = '' } = {}) => {
    let sql = `
      SELECT s.id, s.user_id, s.roll_number, s.name, s.email, s.phone, s.department, s.year, s.section, s.created_at,
             COUNT(a.id) as total_records,
             SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as total_present,
             SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as total_absent
      FROM students s
      LEFT JOIN attendance a ON s.id = a.student_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (s.name LIKE ? OR s.roll_number LIKE ? OR s.email LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (department) {
      sql += ` AND s.department = ?`;
      params.push(department);
    }

    if (year) {
      sql += ` AND s.year = ?`;
      params.push(year);
    }

    if (section) {
      sql += ` AND s.section = ?`;
      params.push(section);
    }

    sql += ` GROUP BY s.id, s.user_id, s.roll_number, s.name, s.email, s.phone, s.department, s.year, s.section, s.created_at ORDER BY s.roll_number ASC`;

    const rows = await query(sql, params);
    return rows.map(r => {
      const total = Number(r.total_records || 0);
      const present = Number(r.total_present || 0);
      const absent = Number(r.total_absent || 0);
      const percentage = total > 0 ? Number(((present / total) * 100).toFixed(1)) : 100.0;
      return {
        ...r,
        total_classes: total,
        total_present: present,
        total_absent: absent,
        attendance_percentage: percentage,
        status: percentage < 75 ? 'Low Attendance' : 'Satisfactory'
      };
    });
  },

  findById: async (id) => {
    const rows = await query(
      `SELECT s.id, s.user_id, s.roll_number, s.name, s.email, s.phone, s.department, s.year, s.section, s.created_at, u.role
       FROM students s
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  findByUserId: async (userId) => {
    const rows = await query(
      `SELECT s.* FROM students s WHERE s.user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  },

  findByRollNumber: async (rollNumber) => {
    const rows = await query(
      `SELECT * FROM students WHERE roll_number = ?`,
      [rollNumber]
    );
    return rows[0] || null;
  },

  create: async ({ userId, rollNumber, name, email, phone, department, year, section }) => {
    const result = await query(
      `INSERT INTO students (user_id, roll_number, name, email, phone, department, year, section)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, rollNumber, name, email, phone || null, department, year || 3, section || 'A']
    );
    return result.insertId;
  },

  update: async (id, { rollNumber, name, email, phone, department, year, section }) => {
    const student = await StudentModel.findById(id);
    const result = await query(
      `UPDATE students 
       SET roll_number = ?, name = ?, email = ?, phone = ?, department = ?, year = ?, section = ?
       WHERE id = ?`,
      [rollNumber, name, email, phone || null, department, year, section, id]
    );

    // Also sync student's user account name/email in users table
    if (student && student.user_id) {
      await query(
        `UPDATE users SET name = ?, email = ? WHERE id = ?`,
        [name, email, student.user_id]
      ).catch(err => console.error('Error syncing student user record:', err));
    }

    return result.affectedRows > 0;
  },

  delete: async (id) => {
    // Find associated user_id first
    const student = await StudentModel.findById(id);
    if (!student) return false;

    // Delete student
    await query('DELETE FROM students WHERE id = ?', [id]);

    // If user_id exists, delete user as well
    if (student.user_id) {
      await query('DELETE FROM users WHERE id = ?', [student.user_id]);
    }
    return true;
  },

  count: async () => {
    const rows = await query('SELECT COUNT(*) as count FROM students');
    return rows[0]?.count || 0;
  },

  /**
   * Get subject-wise attendance breakdown for a student
   */
  getAttendanceSummary: async (studentId, threshold = 75) => {
    const sql = `
      SELECT 
        sub.id as subject_id,
        sub.subject_code,
        sub.subject_name,
        sub.department,
        f.name as faculty_name,
        COUNT(a.id) as total_classes,
        SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as present_count,
        SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as absent_count
      FROM subjects sub
      LEFT JOIN faculty f ON sub.faculty_id = f.id
      LEFT JOIN attendance a ON a.subject_id = sub.id AND a.student_id = ?
      GROUP BY sub.id, sub.subject_code, sub.subject_name, sub.department, f.name
      ORDER BY sub.subject_code ASC
    `;
    const rows = await query(sql, [studentId]);

    let overallTotal = 0;
    let overallPresent = 0;
    let overallAbsent = 0;

    const subjects = rows.map(r => {
      const total = Number(r.total_classes || 0);
      const present = Number(r.present_count || 0);
      const absent = Number(r.absent_count || 0);
      const percentage = total > 0 ? Number(((present / total) * 100).toFixed(1)) : 100.0;
      const isLow = percentage < threshold;

      overallTotal += total;
      overallPresent += present;
      overallAbsent += absent;

      return {
        subject_id: r.subject_id,
        subject_code: r.subject_code,
        subject_name: r.subject_name,
        department: r.department,
        faculty_name: r.faculty_name || 'Not Assigned',
        total_classes: total,
        present: present,
        absent: absent,
        percentage,
        is_low: isLow,
        status: isLow ? 'Low Attendance' : 'Attendance Satisfactory'
      };
    });

    const overallPercentage = overallTotal > 0
      ? Number(((overallPresent / overallTotal) * 100).toFixed(1))
      : 100.0;

    return {
      overall: {
        total_classes: overallTotal,
        present_count: overallPresent,
        absent_count: overallAbsent,
        percentage: overallPercentage,
        is_low: overallPercentage < threshold,
        status: overallPercentage < threshold ? 'Low Attendance' : 'Attendance Satisfactory',
        threshold
      },
      subjects
    };
  }
};

module.exports = StudentModel;
