/**
 * AttendEase - Subject Model
 * Demonstrates: NRD Lab Experiment 5 (Database CRUD for Subjects)
 */

const { query } = require('../config/db');

const SubjectModel = {
  findAll: async ({ department = '', facultyId = '' } = {}) => {
    let sql = `
      SELECT s.id, s.subject_code, s.subject_name, s.department, s.year, s.semester, s.section, s.faculty_id, s.created_at,
             f.name as faculty_name, f.email as faculty_email,
             COUNT(DISTINCT a.attendance_date) as total_sessions,
             COUNT(a.id) as total_attendance_entries
      FROM subjects s
      LEFT JOIN faculty f ON s.faculty_id = f.id
      LEFT JOIN attendance a ON s.id = a.subject_id
      WHERE 1=1
    `;
    const params = [];

    if (department) {
      sql += ` AND s.department = ?`;
      params.push(department);
    }

    if (facultyId) {
      sql += ` AND s.faculty_id = ?`;
      params.push(facultyId);
    }

    sql += ` GROUP BY s.id, s.subject_code, s.subject_name, s.department, s.year, s.semester, s.section, s.faculty_id, s.created_at, f.name, f.email ORDER BY s.subject_code ASC`;
    return await query(sql, params);
  },

  findById: async (id) => {
    const rows = await query(
      `SELECT s.*, f.name as faculty_name, f.email as faculty_email
       FROM subjects s
       LEFT JOIN faculty f ON s.faculty_id = f.id
       WHERE s.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  findByCode: async (code) => {
    const rows = await query(
      `SELECT * FROM subjects WHERE subject_code = ?`,
      [code]
    );
    return rows[0] || null;
  },

  create: async ({ subjectCode, subjectName, department, year, semester, section, facultyId }) => {
    const result = await query(
      `INSERT INTO subjects (subject_code, subject_name, department, year, semester, section, faculty_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [subjectCode, subjectName, department, year || 3, semester || 1, section || 'A', facultyId || null]
    );
    return result.insertId;
  },

  update: async (id, { subjectCode, subjectName, department, year, semester, section, facultyId }) => {
    const result = await query(
      `UPDATE subjects 
       SET subject_code = ?, subject_name = ?, department = ?, year = ?, semester = ?, section = ?, faculty_id = ?
       WHERE id = ?`,
      [subjectCode, subjectName, department, year, semester, section, facultyId || null, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM subjects WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  count: async () => {
    const rows = await query('SELECT COUNT(*) as count FROM subjects');
    return rows[0]?.count || 0;
  },

  /**
   * Get subject summary with student-wise attendance counts
   */
  getAttendanceSummary: async (subjectId) => {
    const subject = await SubjectModel.findById(subjectId);
    if (!subject) return null;

    const studentStats = await query(
      `SELECT 
         st.id as student_id,
         st.roll_number,
         st.name as student_name,
         COUNT(a.id) as total_classes,
         SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as present_count,
         SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as absent_count
       FROM students st
       LEFT JOIN attendance a ON st.id = a.student_id AND a.subject_id = ?
       WHERE st.department = ? AND st.section = ?
       GROUP BY st.id, st.roll_number, st.name
       ORDER BY st.roll_number ASC`,
      [subjectId, subject.department, subject.section]
    );

    const processed = studentStats.map(s => {
      const total = Number(s.total_classes || 0);
      const present = Number(s.present_count || 0);
      const absent = Number(s.absent_count || 0);
      const percentage = total > 0 ? Number(((present / total) * 100).toFixed(1)) : 100.0;
      return {
        ...s,
        total_classes: total,
        present_count: present,
        absent_count: absent,
        percentage,
        is_low: percentage < 75,
        status: percentage < 75 ? 'Low Attendance' : 'Satisfactory'
      };
    });

    const totalSessionsRow = await query(
      `SELECT COUNT(DISTINCT attendance_date) as session_count FROM attendance WHERE subject_id = ?`,
      [subjectId]
    );
    const totalSessions = totalSessionsRow[0]?.session_count || 0;

    return {
      subject,
      total_sessions: totalSessions,
      students: processed
    };
  }
};

module.exports = SubjectModel;
