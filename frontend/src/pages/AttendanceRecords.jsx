import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { attendanceService } from '../services/attendanceService';
import { subjectService } from '../services/subjectService';
import { exportToCSV } from '../utils/exportUtils';

const AttendanceRecords = () => {
  const { user, hasRole } = useAuth();

  const [records, setRecords] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState(null);
  const [editStatus, setEditStatus] = useState('Present');
  const [editRemarks, setEditRemarks] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [selectedSubject, selectedDate, selectedStatus]);

  const fetchSubjects = async () => {
    try {
      const res = await subjectService.getAll();
      setSubjects(res.data || []);
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedSubject) params.subjectId = selectedSubject;
      if (selectedDate) params.date = selectedDate;
      if (selectedStatus) params.status = selectedStatus;
      if (hasRole('student') && user?.studentId) params.studentId = user.studentId;

      const res = await attendanceService.getAll(params);
      setRecords(res.data || []);
    } catch (err) {
      console.error('Failed to load attendance records:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter records by search term
  const filteredRecords = records.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch = r.student_name?.toLowerCase().includes(term);
    const rollMatch = r.roll_number?.toLowerCase().includes(term);
    const subMatch = r.subject_code?.toLowerCase().includes(term) || r.subject_name?.toLowerCase().includes(term);
    return nameMatch || rollMatch || subMatch;
  });

  const handleExportCSV = () => {
    const exportData = filteredRecords.map((r) => ({
      'Record ID': r.id,
      'Date': r.attendance_date,
      'Roll Number': r.roll_number,
      'Student Name': r.student_name,
      'Department': r.department,
      'Subject Code': r.subject_code,
      'Subject Name': r.subject_name,
      'Status': r.status,
      'Remarks': r.remarks || 'N/A'
    }));
    exportToCSV(exportData, `attendease_attendance_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportXML = async () => {
    try {
      const params = {};
      if (selectedSubject) params.subjectId = selectedSubject;
      if (selectedDate) params.date = selectedDate;
      const blob = await attendanceService.downloadXml(params);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/xml;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendease_attendance_${new Date().toISOString().split('T')[0]}.xml`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Direct XML download failed, opening in new tab:', err);
      const params = {};
      if (selectedSubject) params.subjectId = selectedSubject;
      if (selectedDate) params.date = selectedDate;
      const xmlUrl = attendanceService.exportXmlUrl(params);
      window.open(xmlUrl, '_blank');
    }
  };

  const handleOpenEdit = (rec) => {
    setEditingRecord(rec);
    setEditStatus(rec.status);
    setEditRemarks(rec.remarks || '');
    setEditError('');
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;
    setSavingEdit(true);
    setEditError('');

    try {
      await attendanceService.update(editingRecord.id, {
        status: editStatus,
        remarks: editRemarks
      });

      // Update local state
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingRecord.id ? { ...r, status: editStatus, remarks: editRemarks } : r
        )
      );
      setEditingRecord(null);
    } catch (err) {
      console.error('Error updating record:', err);
      setEditError(err.response?.data?.message || 'Failed to update record.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) return;
    try {
      await attendanceService.delete(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete record.');
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 brand-font">
            {hasRole('student') ? 'My Attendance History' : 'Attendance Log Records'}
          </h2>
          <p className="text-muted mb-0">
            Audit, filter, and export session attendance data across departments and semesters.
          </p>
        </div>

        <div className="d-flex gap-2 mt-2 mt-sm-0">
          <button
            onClick={handleExportCSV}
            className="btn btn-outline-success rounded-pill px-3 py-1.5 d-flex align-items-center gap-2"
          >
            <i className="bi bi-file-earmark-spreadsheet"></i>
            <span>Export CSV</span>
          </button>
          {!hasRole('student') && (
            <button
              onClick={handleExportXML}
              className="btn btn-outline-primary rounded-pill px-3 py-1.5 d-flex align-items-center gap-2"
              title="Download standardized XML attendance conforming to DTD/XSD"
            >
              <i className="bi bi-filetype-xml"></i>
              <span>Export XML (DTD/XSD)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card-custom mb-4">
        <div className="card-custom-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold small text-secondary">Search</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Roll No, Name, Subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold small text-secondary">Filter Subject</label>
              <select
                className="form-select bg-light"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.subject_code} - {sub.subject_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold small text-secondary">Filter Date</label>
              <input
                type="date"
                className="form-control bg-light"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold small text-secondary">Status</label>
              <select
                className="form-select bg-light"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <div className="col-md-1 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                title="Reset Filters"
                onClick={() => {
                  setSelectedSubject('');
                  setSelectedDate('');
                  setSelectedStatus('');
                  setSearchTerm('');
                }}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="card-custom">
        <div className="card-custom-header">
          <div className="d-flex align-items-center gap-2">
            <h5 className="fw-bold mb-0">Recorded Attendance Entries</h5>
            <span className="badge bg-light text-dark border">
              {filteredRecords.length} records found
            </span>
          </div>
        </div>

        <div className="card-custom-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading records...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table-custom mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Roll Number</th>
                    <th>Student Name</th>
                    <th>Subject</th>
                    <th className="text-center">Status</th>
                    <th>Remarks</th>
                    {(hasRole('admin') || hasRole('faculty')) && (
                      <th className="text-center" style={{ width: '120px' }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <span className="fw-semibold text-dark">{r.attendance_date}</span>
                        </td>
                        <td>
                          <span className="fw-bold text-dark">{r.roll_number}</span>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{r.student_name}</div>
                          <small className="text-muted">{r.department}</small>
                        </td>
                        <td>
                          <span className="badge bg-light text-primary border me-1">
                            {r.subject_code}
                          </span>
                          <span className="text-secondary small">{r.subject_name}</span>
                        </td>
                        <td className="text-center">
                          <span className={r.status === 'Present' ? 'badge-present' : 'badge-absent'}>
                            {r.status === 'Present' ? (
                              <><i className="bi bi-check-circle-fill"></i> Present</>
                            ) : (
                              <><i className="bi bi-x-circle-fill"></i> Absent</>
                            )}
                          </span>
                        </td>
                        <td>
                          <span className="text-muted small">{r.remarks || '—'}</span>
                        </td>
                        {(hasRole('admin') || hasRole('faculty')) && (
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleOpenEdit(r)}
                                title="Edit Record"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              {hasRole('admin') && (
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDeleteRecord(r.id)}
                                  title="Delete Record"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={hasRole('admin') || hasRole('faculty') ? 7 : 6}
                        className="text-center py-5 text-muted"
                      >
                        No attendance records match your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingRecord && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Edit Attendance Record</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingRecord(null)}
                ></button>
              </div>
              <div className="modal-body">
                {editError && (
                  <div className="alert alert-danger py-2 small mb-3">{editError}</div>
                )}
                <div className="p-3 bg-light rounded-3 mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Student:</span>
                    <strong className="text-dark">{editingRecord.student_name} ({editingRecord.roll_number})</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Subject:</span>
                    <strong className="text-dark">{editingRecord.subject_code} - {editingRecord.subject_name}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Date:</span>
                    <strong className="text-dark">{editingRecord.attendance_date}</strong>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Attendance Status</label>
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${editStatus === 'Present' ? 'btn-success fw-bold text-white' : 'btn-outline-secondary'}`}
                      onClick={() => setEditStatus('Present')}
                    >
                      <i className="bi bi-check-circle me-1"></i> Present
                    </button>
                    <button
                      type="button"
                      className={`btn ${editStatus === 'Absent' ? 'btn-danger fw-bold text-white' : 'btn-outline-secondary'}`}
                      onClick={() => setEditStatus('Absent')}
                    >
                      <i className="bi bi-x-circle me-1"></i> Absent
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Remarks / Notes</label>
                  <textarea
                    className="form-control bg-light"
                    rows="3"
                    placeholder="e.g. Attended remedial session / approved medical reason"
                    value={editRemarks}
                    onChange={(e) => setEditRemarks(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4"
                  onClick={() => setEditingRecord(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4 fw-semibold"
                  disabled={savingEdit}
                  onClick={handleSaveEdit}
                >
                  {savingEdit ? 'Saving...' : 'Update Record'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceRecords;
