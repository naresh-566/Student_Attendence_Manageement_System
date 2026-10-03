import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subjectService } from '../services/subjectService';
import { facultyService } from '../services/facultyService';
import { studentService } from '../services/studentService';
import { attendanceService } from '../services/attendanceService';
import { calculatePercentage } from '../utils/calculations';

const MarkAttendance = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(searchParams.get('subjectId') || '');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionTime, setSessionTime] = useState('09:00 AM');

  const [students, setStudents] = useState([]);
  const [attendanceState, setAttendanceState] = useState({}); // { [studentId]: 'Present' | 'Absent' }
  const [remarksState, setRemarksState] = useState({});

  const [loading, setLoading] = useState(false);
  const [isExistingSession, setIsExistingSession] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch available subjects based on role
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        let subs = [];
        if (hasRole('faculty') && user?.facultyId) {
          const res = await facultyService.getAssignedSubjects(user.facultyId);
          subs = res.data || [];
        } else {
          const res = await subjectService.getAll();
          subs = res.data || [];
        }
        setSubjects(subs);
        if (!selectedSubjectId && subs.length > 0) {
          setSelectedSubjectId(String(subs[0].id));
        }
      } catch (err) {
        console.error('Failed to load subjects:', err);
      }
    };

    fetchSubjects();
  }, [user]);

  // 2. Fetch students & check existing attendance whenever subjectId or date changes
  useEffect(() => {
    if (!selectedSubjectId) return;

    const loadRoster = async () => {
      setLoading(true);
      setSuccessMessage('');
      setErrorMessage('');

      try {
        // Fetch students enrolled or for this department
        let studentList = [];
        try {
          const stRes = await subjectService.getSubjectStudents(selectedSubjectId);
          studentList = stRes.data || [];
        } catch {
          const fallbackRes = await studentService.getAll();
          studentList = fallbackRes.data || [];
        }
        setStudents(studentList);

        // Check if attendance already recorded for this subject & date
        const checkRes = await attendanceService.checkExisting(selectedSubjectId, attendanceDate);
        setIsExistingSession(checkRes.alreadyRecorded);

        // If existing, fetch the records to populate status
        if (checkRes.alreadyRecorded) {
          const existRecords = await attendanceService.getAll({
            subjectId: selectedSubjectId,
            date: attendanceDate
          });
          const initialMap = {};
          const remarkMap = {};
          (existRecords.data || []).forEach((r) => {
            initialMap[r.student_id] = r.status;
            if (r.remarks) remarkMap[r.student_id] = r.remarks;
          });
          setAttendanceState(initialMap);
          setRemarksState(remarkMap);
        } else {
          // Default all to Present
          const defaultMap = {};
          studentList.forEach((st) => {
            defaultMap[st.id] = 'Present';
          });
          setAttendanceState(defaultMap);
          setRemarksState({});
        }
      } catch (err) {
        console.error('Error fetching roster:', err);
        setErrorMessage('Failed to load class roster for the selected subject.');
      } finally {
        setLoading(false);
      }
    };

    loadRoster();
  }, [selectedSubjectId, attendanceDate]);

  const handleToggleStatus = (studentId, status) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((st) => {
      updated[st.id] = status;
    });
    setAttendanceState(updated);
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    if (!selectedSubjectId) {
      setErrorMessage('Please select a subject.');
      return;
    }

    if (students.length === 0) {
      setErrorMessage('No students found to mark attendance.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const records = students.map((st) => ({
      studentId: st.id,
      status: attendanceState[st.id] || 'Present',
      remarks: remarksState[st.id] || ''
    }));

    const payload = {
      subjectId: Number(selectedSubjectId),
      facultyId: user?.facultyId || 1,
      attendanceDate,
      sessionTime,
      records
    };

    try {
      const res = await attendanceService.recordBatch(payload);
      setSuccessMessage(
        res.message || `Successfully recorded attendance for ${records.length} students!`
      );
      setIsExistingSession(true);
    } catch (err) {
      console.error('Error saving attendance:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit attendance. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Calculations
  const totalCount = students.length;
  const presentCount = Object.values(attendanceState).filter((s) => s === 'Present').length;
  const absentCount = totalCount - presentCount;
  const currentPercentage = calculatePercentage(presentCount, totalCount);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 brand-font">Mark Class Attendance</h2>
          <p className="text-muted mb-0">
            Conduct daily roll call, record session attendance, and compute instant class percentages.
          </p>
        </div>
        <div className="mt-2 mt-sm-0">
          <button
            onClick={() => navigate('/attendance-records')}
            className="btn btn-outline-secondary rounded-pill px-3 py-1.5"
          >
            <i className="bi bi-clock-history me-1"></i> View Past Logs
          </button>
        </div>
      </div>

      {/* Control Selection Card */}
      <div className="card-custom mb-4">
        <div className="card-custom-body">
          <form className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label fw-semibold small text-secondary">
                Select Course / Subject
              </label>
              <select
                className="form-select bg-light"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.subject_code} – {sub.subject_name} ({sub.department || 'CSE'}, Sec {sub.section || 'A'})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold small text-secondary">Attendance Date</label>
              <input
                type="date"
                className="form-control bg-light"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold small text-secondary">Class Time</label>
              <select
                className="form-select bg-light"
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:15 AM">11:15 AM</option>
                <option value="12:15 PM">12:15 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
              </select>
            </div>

            <div className="col-md-2">
              <div className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 w-100 p-2 text-center">
                <small className="fw-bold d-block">SESSION STATUS</small>
                <span>{isExistingSession ? 'Existing Record' : 'New Session'}</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Existing Session Alert */}
      {isExistingSession && (
        <div className="alert alert-warning d-flex align-items-center gap-2 mb-4 py-2.5 px-3 rounded-3">
          <i className="bi bi-info-circle-fill fs-5"></i>
          <div>
            <strong>Notice:</strong> Attendance for this subject and date has already been recorded.
            Submitting modifications will update the existing session records in the database.
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4 py-2.5 px-3 rounded-3">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <div>{successMessage}</div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 py-2.5 px-3 rounded-3">
          <i className="bi bi-exclamation-triangle-fill fs-5"></i>
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Real-time Session Statistics Summary Bar */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded-3 text-center">
            <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>
              Total Roster
            </small>
            <div className="fs-3 fw-bold text-dark">{totalCount}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded-3 text-center">
            <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>
              Marked Present
            </small>
            <div className="fs-3 fw-bold text-success">{presentCount}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded-3 text-center">
            <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>
              Marked Absent
            </small>
            <div className="fs-3 fw-bold text-danger">{absentCount}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded-3 text-center">
            <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '11px' }}>
              Session Attendance %
            </small>
            <div className={`fs-3 fw-bold ${currentPercentage < 75 ? 'text-danger' : 'text-primary'}`}>
              {currentPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Roster & Marking Table */}
      <div className="card-custom">
        <div className="card-custom-header flex-wrap gap-2">
          <div>
            <h5 className="fw-bold mb-0">Student Roll Call Roster</h5>
            <small className="text-muted">
              Toggle Present / Absent for each student or use 1-click batch actions
            </small>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              onClick={() => handleMarkAll('Present')}
              className="btn btn-sm btn-outline-success rounded-pill px-3"
            >
              <i className="bi bi-check-all me-1"></i> Mark All Present
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll('Absent')}
              className="btn btn-sm btn-outline-danger rounded-pill px-3"
            >
              <i className="bi bi-x-circle me-1"></i> Mark All Absent
            </button>
          </div>
        </div>

        <div className="card-custom-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading student roster...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table-custom mb-0">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>Roll Number</th>
                    <th>Student Name</th>
                    <th>Department & Sec</th>
                    <th className="text-center" style={{ width: '220px' }}>Attendance Status</th>
                    <th>Remarks (Optional)</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st, index) => {
                    const status = attendanceState[st.id] || 'Present';
                    return (
                      <tr key={st.id} className={status === 'Absent' ? 'table-light' : ''}>
                        <td className="text-muted small">{index + 1}</td>
                        <td>
                          <span className="fw-bold text-dark">{st.roll_number}</span>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{st.name}</div>
                          <small className="text-muted">{st.email}</small>
                        </td>
                        <td>
                          <span className="badge bg-light text-secondary border">
                            {st.department || 'CSE'} - {st.section || 'A'}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm w-100" role="group">
                            <button
                              type="button"
                              className={`btn ${
                                status === 'Present'
                                  ? 'btn-success fw-bold text-white'
                                  : 'btn-outline-secondary'
                              }`}
                              onClick={() => handleToggleStatus(st.id, 'Present')}
                            >
                              <i className="bi bi-check-circle me-1"></i> Present
                            </button>
                            <button
                              type="button"
                              className={`btn ${
                                status === 'Absent'
                                  ? 'btn-danger fw-bold text-white'
                                  : 'btn-outline-secondary'
                              }`}
                              onClick={() => handleToggleStatus(st.id, 'Absent')}
                            >
                              <i className="bi bi-x-circle me-1"></i> Absent
                            </button>
                          </div>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm bg-light"
                            placeholder="e.g. Late / Medical leave"
                            value={remarksState[st.id] || ''}
                            onChange={(e) =>
                              setRemarksState({ ...remarksState, [st.id]: e.target.value })
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="p-3 bg-light border-top d-flex justify-content-between align-items-center">
          <div className="small text-muted">
            Marked <strong>{presentCount}</strong> Present, <strong>{absentCount}</strong> Absent ({currentPercentage}%)
          </div>
          <button
            type="button"
            onClick={handleSubmitAttendance}
            disabled={submitting || students.length === 0}
            className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm d-flex align-items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Saving Attendance...</span>
              </>
            ) : (
              <>
                <i className="bi bi-cloud-arrow-up-fill"></i>
                <span>{isExistingSession ? 'Update Attendance Session' : 'Save Attendance Session'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
