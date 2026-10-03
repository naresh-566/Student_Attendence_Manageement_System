import React, { useState, useEffect } from 'react';
import { facultyService } from '../services/facultyService';
import { validateFacultyForm } from '../utils/validation';

const FacultyPage = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    department: 'Computer Science & Engineering'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await facultyService.getAll();
      setFacultyList(res.data || []);
    } catch (err) {
      console.error('Failed to load faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      employeeId: '',
      email: '',
      phone: '',
      department: 'Computer Science & Engineering'
    });
    setFormErrors({});
    setServerError('');
    setShowModal(true);
  };

  const handleOpenEdit = (fac) => {
    setIsEditing(true);
    setCurrentId(fac.id);
    setFormData({
      name: fac.name || '',
      employeeId: fac.employee_id || '',
      email: fac.email || '',
      phone: fac.phone || '',
      department: fac.department || 'Computer Science & Engineering'
    });
    setFormErrors({});
    setServerError('');
    setShowModal(true);
  };

  const handleSaveFaculty = async (e) => {
    e.preventDefault();
    const errors = validateFacultyForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      if (isEditing) {
        await facultyService.update(currentId, formData);
      } else {
        await facultyService.create(formData);
      }
      setShowModal(false);
      fetchFaculty();
    } catch (err) {
      console.error('Error saving faculty:', err);
      setServerError(err.response?.data?.message || 'Failed to save faculty record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove faculty member "${name}"?`)) return;
    try {
      await facultyService.delete(id);
      fetchFaculty();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete faculty member.');
    }
  };

  const filteredFaculty = facultyList.filter((f) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      f.name?.toLowerCase().includes(term) ||
      f.employee_id?.toLowerCase().includes(term) ||
      f.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 brand-font">Faculty Staff Directory</h2>
          <p className="text-muted mb-0">
            Manage academic instructors, assigned courses, and university departmental faculty.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn btn-primary rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2 mt-2 mt-sm-0"
        >
          <i className="bi bi-person-plus-fill"></i>
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="card-custom mb-4">
        <div className="card-custom-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Search faculty by name, employee ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
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

      {/* Faculty Cards / Table */}
      <div className="card-custom">
        <div className="card-custom-header">
          <div className="d-flex align-items-center gap-2">
            <h5 className="fw-bold mb-0">Faculty Members</h5>
            <span className="badge bg-light text-dark border">
              {filteredFaculty.length} Instructors
            </span>
          </div>
        </div>

        <div className="card-custom-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading faculty...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table-custom mb-0">
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Faculty Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th className="text-center" style={{ width: '130px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.length > 0 ? (
                    filteredFaculty.map((f) => (
                      <tr key={f.id}>
                        <td>
                          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 fw-bold">
                            {f.employee_id}
                          </span>
                        </td>
                        <td>
                          <div className="fw-bold text-dark">{f.name}</div>
                        </td>
                        <td>
                          <span className="text-muted small">{f.email}</span>
                        </td>
                        <td>
                          <span className="text-secondary small">{f.phone || '—'}</span>
                        </td>
                        <td>
                          <span className="text-dark small">{f.department}</span>
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleOpenEdit(f)}
                              title="Edit Faculty"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(f.id, f.name)}
                              title="Delete Faculty"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        No faculty members match the search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
                  {isEditing ? 'Edit Faculty Details' : 'Add New Faculty Member'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSaveFaculty}>
                <div className="modal-body">
                  {serverError && (
                    <div className="alert alert-danger py-2 small mb-3">{serverError}</div>
                  )}

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Faculty Full Name *</label>
                      <input
                        type="text"
                        className={`form-control bg-light ${formErrors.name ? 'is-invalid' : ''}`}
                        placeholder="e.g. Dr. Ramesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                      {formErrors.name && (
                        <div className="invalid-feedback">{formErrors.name}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Employee ID *</label>
                      <input
                        type="text"
                        className={`form-control bg-light ${formErrors.employeeId ? 'is-invalid' : ''}`}
                        placeholder="e.g. FAC-CSE-004"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        required
                      />
                      {formErrors.employeeId && (
                        <div className="invalid-feedback">{formErrors.employeeId}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number</label>
                      <input
                        type="text"
                        className={`form-control bg-light ${formErrors.phone ? 'is-invalid' : ''}`}
                        placeholder="10-digit phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      {formErrors.phone && (
                        <div className="invalid-feedback">{formErrors.phone}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Email Address *</label>
                      <input
                        type="email"
                        className={`form-control bg-light ${formErrors.email ? 'is-invalid' : ''}`}
                        placeholder="faculty@attendease.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                      {formErrors.email && (
                        <div className="invalid-feedback">{formErrors.email}</div>
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
                        <option value="Electronics & Communication">
                          Electronics & Communication
                        </option>
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
                    {submitting ? 'Saving...' : isEditing ? 'Update Faculty' : 'Add Faculty'}
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

export default FacultyPage;
