import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { validateStudentForm } from '../utils/validation';
import { isLowAttendance } from '../utils/calculations';

const StudentsPage = () => {
  const { hasRole } = useAuth();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'A'
  });
  const [formErrors, setFormErrors] = useState({});
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Attendance Summary Modal State
  const [summaryStudent, setSummaryStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentService.getAll();
      setStudents(res.data || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      rollNumber: '',
      email: '',
      phone: '',
      department: 'Computer Science & Engineering',
      year: 3,
      section: 'A'
    });
    setFormErrors({});
    setServerError('');
    setShowModal(true);
  };

  const handleOpenEdit = (st) => {
    setIsEditing(true);
    setCurrentId(st.id);
    setFormData({
      name: st.name || '',
      rollNumber: st.roll_number || '',
      email: st.email || '',
      phone: st.phone || '',
      department: st.department || 'Computer Science & Engineering',
      year: st.year || 3,
      section: st.section || 'A'
    });
    setFormErrors({});
    setServerError('');
    setShowModal(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    const errors = validateStudentForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setModalSubmitting(true);
    setServerError('');

    try {
      if (isEditing) {
        await studentService.update(currentId, formData);
      } else {
        await studentService.create(formData);
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      console.error('Error saving student:', err);
      setServerError(err.response?.data?.message || 'Failed to save student profile.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove student "${name}"?`)) return;
    try {
      await studentService.delete(id);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete student.');
    }
  };

  const handleViewSummary = async (st) => {
    setSummaryStudent(st);
    setLoadingSummary(true);
    setAttendanceData(null);
    try {
      const res = await studentService.getAttendanceSummary(st.id);
      setAttendanceData(res.data || null);
    } catch (err) {
      console.error('Failed to load student summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      s.name?.toLowerCase().includes(term) ||
      s.roll_number?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term);
    const matchesDept = !selectedDept || s.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 brand-font">Student Roster Directory</h2>
          <p className="text-muted mb-0">
            Manage academic student profiles, roll numbers, and review personal attendance standing.
          </p>
        </div>

        {hasRole(['admin', 'faculty']) && (
          <button
            onClick={handleOpenAdd}
            className="btn btn-primary rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2 mt-2 mt-sm-0"
          >
            <i className="bi bi-person-plus-fill"></i>
            <span>Add New Student</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="card-custom mb-4">
        <div className="card-custom-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small text-secondary">Search Students</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Search by name, roll number, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold small text-secondary">Department</label>
              <select
                className="form-select bg-light"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDept('');
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Students List Table */}
      <div className="card-custom">
        <div className="card-custom-header">
          <div className="d-flex align-items-center gap-2">
            <h5 className="fw-bold mb-0">Enrolled Students</h5>
            <span className="badge bg-light text-dark border">
              {filteredStudents.length} Students
            </span>
          </div>
        </div>

        <div className="card-custom-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading students...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table-custom mb-0">
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Student Name</th>
                    <th>Email & Phone</th>
                    <th>Department</th>
                    <th className="text-center">Year / Sec</th>
                    <th className="text-center" style={{ width: '180px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((st) => (
                      <tr key={st.id}>
                        <td>
                          <span className="fw-bold text-dark">{st.roll_number}</span>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{st.name}</div>
                        </td>
                        <td>
                          <div className="small text-dark">{st.email}</div>
                          <small className="text-muted">{st.phone || '—'}</small>
                        </td>
                        <td>
                          <span className="text-secondary small">{st.department}</span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-light text-secondary border">
                            Yr {st.year} - {st.section}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-info"
                              onClick={() => handleViewSummary(st)}
                              title="View Attendance Report"
                            >
                              <i className="bi bi-bar-chart-line"></i>
                            </button>
                            {hasRole(['admin', 'faculty']) && (
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleOpenEdit(st)}
                                title="Edit Student"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                            )}
                            {hasRole('admin') && (
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(st.id, st.name)}
                                title="Delete Student"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        No students match the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {isEditing ? 'Edit Student Details' : 'Register New Student'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveStudent}>
                <div className="modal-body">
                  {serverError && (
                    <div className="alert alert-danger py-2 small mb-3">{serverError}</div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Full Name *</label>
                      <input
                        type="text"
                        className={`form-control bg-light ${formErrors.name ? 'is-invalid' : ''}`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                      {formErrors.name && (
                        <div className="invalid-feedback">{formErrors.name}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Roll Number *</label>
                      <input
                        type="text"
                        className={`form-control bg-light ${formErrors.rollNumber ? 'is-invalid' : ''}`}
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        required
                      />
                      {formErrors.rollNumber && (
                        <div className="invalid-feedback">{formErrors.rollNumber}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email Address *</label>
                      <input
                        type="email"
                        className={`form-control bg-light ${formErrors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                      {formErrors.email && (
                        <div className="invalid-feedback">{formErrors.email}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number</label>
                      <input
                        type="text"
                        className={`form-control bg-light ${formErrors.phone ? 'is-invalid' : ''}`}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      {formErrors.phone && (
                        <div className="invalid-feedback">{formErrors.phone}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Department *</label>
                      <select
                        className="form-select bg-light"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      >
                        <option value="Computer Science & Engineering">
                          Computer Science & Engineering
                        </option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics & Communication">Electronics & Communication</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Year *</label>
                      <select
                        className="form-select bg-light"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                      >
                        <option value={1}>1st Year</option>
                        <option value={2}>2nd Year</option>
                        <option value={3}>3rd Year</option>
                        <option value={4}>4th Year</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Section *</label>
                      <select
                        className="form-select bg-light"
                        value={formData.section}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                    disabled={modalSubmitting}
                  >
                    {modalSubmitting ? 'Saving...' : isEditing ? 'Update Student' : 'Add Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Student Attendance Summary Modal */}
      {summaryStudent && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold mb-0">
                    Attendance Report: {summaryStudent.name}
                  </h5>
                  <small className="text-muted">
                    Roll No: {summaryStudent.roll_number} • Dept: {summaryStudent.department}
                  </small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSummaryStudent(null)}
                ></button>
              </div>

              <div className="modal-body">
                {loadingSummary ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Calculating statistics...</span>
                    </div>
                  </div>
                ) : attendanceData ? (
                  <div>
                    {/* Overall Summary Banner */}
                    <div
                      className={`p-3 rounded-3 mb-3 border ${
                        isLowAttendance(attendanceData.overall?.percentage)
                          ? 'bg-danger bg-opacity-10 border-danger text-danger'
                          : 'bg-success bg-opacity-10 border-success text-success'
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold fs-5">
                            Cumulative: {attendanceData.overall?.percentage || 0}%
                          </div>
                          <small>
                            Attended {attendanceData.overall?.presentClasses || 0} of{' '}
                            {attendanceData.overall?.totalClasses || 0} total sessions
                          </small>
                        </div>
                        <span
                          className={`badge ${
                            isLowAttendance(attendanceData.overall?.percentage)
                              ? 'bg-danger text-white'
                              : 'bg-success text-white'
                          } p-2`}
                        >
                          {isLowAttendance(attendanceData.overall?.percentage)
                            ? 'DETENTION RISK (<75%)'
                            : 'ELIGIBLE (>=75%)'}
                        </span>
                      </div>
                    </div>

                    {/* Subject Table */}
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Course</th>
                            <th className="text-center">Attended</th>
                            <th className="text-center">Total</th>
                            <th className="text-center">Percentage</th>
                            <th className="text-center">Policy Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(attendanceData.subjects || []).map((sub) => {
                            const isLow = isLowAttendance(sub.percentage);
                            return (
                              <tr key={sub.subject_id}>
                                <td>
                                  <strong>{sub.subject_code}</strong> - {sub.subject_name}
                                </td>
                                <td className="text-center">{sub.presentClasses}</td>
                                <td className="text-center">{sub.totalClasses}</td>
                                <td className="text-center fw-bold">
                                  <span className={isLow ? 'text-danger' : 'text-success'}>
                                    {sub.percentage}%
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span
                                    className={`badge ${
                                      isLow ? 'bg-danger' : 'bg-success'
                                    }`}
                                  >
                                    {isLow ? '< 75% Risk' : 'Satisfactory'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    No attendance records logged for this student.
                  </div>
                )}
              </div>

              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={() => setSummaryStudent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
