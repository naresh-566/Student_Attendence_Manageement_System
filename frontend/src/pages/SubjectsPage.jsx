import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subjectService } from '../services/subjectService';
import { facultyService } from '../services/facultyService';
import { validateSubjectForm } from '../utils/validation';

const SubjectsPage = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    subjectCode: '',
    subjectName: '',
    department: 'Computer Science & Engineering',
    year: 3,
    semester: 5,
    section: 'A',
    facultyId: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    fetchSubjectsAndFaculty();
  }, []);

  const fetchSubjectsAndFaculty = async () => {
    setLoading(true);
    try {
      const [subRes, facRes] = await Promise.all([
        subjectService.getAll(),
        facultyService.getAll().catch(() => ({ data: [] }))
      ]);
      setSubjects(subRes.data || []);
      setFacultyList(facRes.data || []);
    } catch (err) {
      console.error('Failed to load subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      subjectCode: '',
      subjectName: '',
      department: 'Computer Science & Engineering',
      year: 3,
      semester: 5,
      section: 'A',
      facultyId: facultyList.length > 0 ? String(facultyList[0].id) : ''
    });
    setFormErrors({});
    setServerError('');
    setShowModal(true);
  };

  const handleOpenEdit = (sub) => {
    setIsEditing(true);
    setCurrentId(sub.id);
    setFormData({
      subjectCode: sub.subject_code || '',
      subjectName: sub.subject_name || '',
      department: sub.department || 'Computer Science & Engineering',
      year: sub.year || 3,
      semester: sub.semester || 5,
      section: sub.section || 'A',
      facultyId: sub.faculty_id ? String(sub.faculty_id) : ''
    });
    setFormErrors({});
    setServerError('');
    setShowModal(true);
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    const errors = validateSubjectForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      const payload = {
        ...formData,
        facultyId: formData.facultyId ? Number(formData.facultyId) : null
      };

      if (isEditing) {
        await subjectService.update(currentId, payload);
      } else {
        await subjectService.create(payload);
      }
      setShowModal(false);
      fetchSubjectsAndFaculty();
    } catch (err) {
      console.error('Error saving subject:', err);
      setServerError(err.response?.data?.message || 'Failed to save subject course.');
    } finally {
      setModalSubmitting ? setModalSubmitting(false) : setSubmitting(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete course ${code}?`)) return;
    try {
      await subjectService.delete(id);
      fetchSubjectsAndFaculty();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course.');
    }
  };

  const filteredSubjects = subjects.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.subject_code?.toLowerCase().includes(term) ||
      s.subject_name?.toLowerCase().includes(term) ||
      s.faculty_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 brand-font">Courses & Subjects Catalog</h2>
          <p className="text-muted mb-0">
            Curriculum course registry, semester distribution, and instructor assignment.
          </p>
        </div>

        {hasRole('admin') && (
          <button
            onClick={handleOpenAdd}
            className="btn btn-primary rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2 mt-2 mt-sm-0"
          >
            <i className="bi bi-plus-circle-fill"></i>
            <span>Add New Subject</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="card-custom mb-4">
        <div className="card-custom-body">
          <div className="row g-3">
            <div className="col-md-9">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Search by code, subject name, or faculty instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="row g-3">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading courses...</span>
            </div>
          </div>
        ) : filteredSubjects.length > 0 ? (
          filteredSubjects.map((sub) => (
            <div className="col-md-6 col-lg-4" key={sub.id}>
              <div className="card-custom h-100 mb-0 d-flex flex-column justify-content-between">
                <div className="card-custom-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary fs-6 px-2.5 py-1">
                      {sub.subject_code}
                    </span>
                    <span className="badge bg-light text-secondary border">
                      Sem {sub.semester} • Sec {sub.section || 'A'}
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-2">{sub.subject_name}</h5>
                  <p className="text-muted small mb-3">{sub.department}</p>

                  <div className="p-2.5 bg-light rounded-3 d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-person-badge text-primary fs-5"></i>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                        FACULTY IN-CHARGE
                      </small>
                      <span className="fw-semibold text-dark small">
                        {sub.faculty_name || 'Not Assigned'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-light border-top d-flex justify-content-between align-items-center">
                  {(hasRole('admin') || hasRole('faculty')) && (
                    <button
                      onClick={() => navigate(`/mark-attendance?subjectId=${sub.id}`)}
                      className="btn btn-sm btn-primary rounded-pill px-3"
                    >
                      <i className="bi bi-check2-circle me-1"></i> Mark Attendance
                    </button>
                  )}

                  {hasRole('student') && (
                    <button
                      onClick={() => navigate('/attendance-records')}
                      className="btn btn-sm btn-outline-primary rounded-pill px-3"
                    >
                      View Log
                    </button>
                  )}

                  {hasRole('admin') && (
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => handleOpenEdit(sub)}
                        title="Edit Subject"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(sub.id, sub.subject_code)}
                        title="Delete Subject"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5 text-muted">
            No subjects match the search criteria.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
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
                  {isEditing ? 'Edit Subject Course' : 'Create New Subject Course'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSaveSubject}>
                <div className="modal-body">
                  {serverError && (
                    <div className="alert alert-danger py-2 small mb-3">{serverError}</div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-5">
                      <label className="form-label small fw-semibold">Subject Code *</label>
                      <input
                        type="text"
                        className={`form-control bg-light ${formErrors.subjectCode ? 'is-invalid' : ''}`}
                        placeholder="e.g. CS501"
                        value={formData.subjectCode}
                        onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                        required
                      />
                      {formErrors.subjectCode && (
                        <div className="invalid-feedback">{formErrors.subjectCode}</div>
                      )}
                    </div>

                    <div className="col-md-7">
                      <label className="form-label small fw-semibold">Subject Name *</label>
                      <input
                        type="text"
                        className={`form-control bg-light ${formErrors.subjectName ? 'is-invalid' : ''}`}
                        placeholder="e.g. Web Technologies"
                        value={formData.subjectName}
                        onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                        required
                      />
                      {formErrors.subjectName && (
                        <div className="invalid-feedback">{formErrors.subjectName}</div>
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

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Year *</label>
                      <select
                        className="form-select bg-light"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                      >
                        <option value={1}>Year 1</option>
                        <option value={2}>Year 2</option>
                        <option value={3}>Year 3</option>
                        <option value={4}>Year 4</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Semester *</label>
                      <select
                        className="form-select bg-light"
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
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

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Assign Faculty Instructor</label>
                      <select
                        className="form-select bg-light"
                        value={formData.facultyId}
                        onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                      >
                        <option value="">-- No Faculty Assigned --</option>
                        {facultyList.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} ({f.employee_id})
                          </option>
                        ))}
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
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : isEditing ? 'Update Subject' : 'Create Subject'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;
