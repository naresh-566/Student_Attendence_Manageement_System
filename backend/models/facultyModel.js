/**
 * AttendEase - Faculty Model
 * Demonstrates: NRD Lab Experiment 5 (Database CRUD for Faculty)
 */

const { query } = require('../config/db');

const FacultyModel = {
  findAll: async ({ search = '', department = '' } = {}) => {
    let sql = `
      SELECT f.id, f.user_id, f.employee_id, f.name, f.email, f.department, f.phone, f.created_at,
             COUNT(DISTINCT s.id) as assigned_subjects_count
      FROM faculty f
      LEFT JOIN subjects s ON f.id = s.faculty_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (f.name LIKE ? OR f.employee_id LIKE ? OR f.email LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (department) {
      sql += ` AND f.department = ?`;
      params.push(department);
    }

    sql += ` GROUP BY f.id, f.user_id, f.employee_id, f.name, f.email, f.department, f.phone, f.created_at ORDER BY f.name ASC`;
    return await query(sql, params);
  },

  findById: async (id) => {
    const rows = await query(
      `SELECT f.*, u.role
       FROM faculty f
       LEFT JOIN users u ON f.user_id = u.id
       WHERE f.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  findByUserId: async (userId) => {
    const rows = await query(
      `SELECT f.* FROM faculty f WHERE f.user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  },

  findByEmployeeId: async (empId) => {
    const rows = await query(
      `SELECT * FROM faculty WHERE employee_id = ?`,
      [empId]
    );
    return rows[0] || null;
  },

  create: async ({ userId, employeeId, name, email, department, phone }) => {
    const result = await query(
      `INSERT INTO faculty (user_id, employee_id, name, email, department, phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, employeeId, name, email, department, phone || null]
    );
    return result.insertId;
  },

  update: async (id, { employeeId, name, email, department, phone }) => {
    const faculty = await FacultyModel.findById(id);
    const result = await query(
      `UPDATE faculty 
       SET employee_id = ?, name = ?, email = ?, department = ?, phone = ?
       WHERE id = ?`,
      [employeeId, name, email, department, phone || null, id]
    );

    // Sync user email and name in users table
    if (faculty && faculty.user_id) {
      await query(
        `UPDATE users SET name = ?, email = ? WHERE id = ?`,
        [name, email, faculty.user_id]
      ).catch(err => console.error('Error syncing faculty user record:', err));
    }

    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const faculty = await FacultyModel.findById(id);
    if (!faculty) return false;

    // Reset assigned subjects
    await query('UPDATE subjects SET faculty_id = NULL WHERE faculty_id = ?', [id]);

    // Delete faculty
    await query('DELETE FROM faculty WHERE id = ?', [id]);

    // Delete associated user
    if (faculty.user_id) {
      await query('DELETE FROM users WHERE id = ?', [faculty.user_id]);
    }
    return true;
  },

  getAssignedSubjects: async (facultyId) => {
    return await query(
      `SELECT s.*,
              (SELECT COUNT(*) FROM students st WHERE st.department = s.department AND st.section = s.section) as student_count,
              (SELECT COUNT(DISTINCT attendance_date) FROM attendance a WHERE a.subject_id = s.id AND a.faculty_id = ?) as sessions_conducted
       FROM subjects s
       WHERE s.faculty_id = ?
       ORDER BY s.subject_name ASC`,
      [facultyId, facultyId]
    );
  },

  count: async () => {
    const rows = await query('SELECT COUNT(*) as count FROM faculty');
    return rows[0]?.count || 0;
  }
};

module.exports = FacultyModel;
