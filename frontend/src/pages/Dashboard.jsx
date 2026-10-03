import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { attendanceService } from '../services/attendanceService';
import { studentService } from '../services/studentService';
import { facultyService } from '../services/facultyService';
import { subjectService } from '../services/subjectService';
import StatCard from '../components/StatCard';
import { calculatePercentage, isLowAttendance, getAttendanceStatus } from '../utils/calculations';

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalSubjects: 0,
    overallAttendancePercentage: 0,
    totalSessions: 0,
    totalRecords: 0
  });

  // Role specific states
  const [studentSummary, setStudentSummary] = useState(null);
  const [facultySubjects, setFacultySubjects] = useState([]);
  const [lowAttendanceList, setLowAttendanceList] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (hasRole('student') && user?.studentId) {
        // Fetch student's personal attendance summary
        const summary = await studentService.getAttendanceSummary(user.studentId);
        setStudentSummary(summary.data || null);
      } else if (hasRole('faculty') && user?.facultyId) {
        // Fetch faculty's assigned subjects
        const subjectsRes = await facultyService.getAssignedSubjects(user.facultyId);
        setFacultySubjects(subjectsRes.data || []);

        // Fetch general stats
        const statRes = await attendanceService.getStatistics();
        if (statRes.data) setStats(statRes.data);

        // Fetch recent attendance sessions
        const recRes = await attendanceService.getAll({ facultyId: user.facultyId, limit: 10 });
        setRecentRecords(recRes.data || []);
      } else {
        // Admin view
        const [statRes, subRes, stRes, facRes, attRes] = await Promise.all([
          attendanceService.getStatistics().catch(() => ({ data: {} })),
          subjectService.getAll().catch(() => ({ data: [] })),
          studentService.getAll().catch(() => ({ data: [] })),
          facultyService.getAll().catch(() => ({ data: [] })),
          attendanceService.getAll({ limit: 10 }).catch(() => ({ data: [] }))
        ]);

        const allStudents = stRes.data || [];
        const allSubjects = subRes.data || [];
        const allFaculty = facRes.data || [];

        setStats({
          totalStudents: allStudents.length,
          totalFaculty: allFaculty.length,
          totalSubjects: allSubjects.length,
          overallAttendancePercentage: statRes.data?.overallAttendancePercentage || 85.0,
          totalSessions: statRes.data?.totalSessions || 0,
          totalRecords: statRes.data?.totalRecords || 0
        });

        setRecentRecords(attRes.data || []);

        // Calculate low attendance students (< 75%)
        calculateAdminLowAttendance(allStudents);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAdminLowAttendance = async (students) => {
    try {
      const lowList = [];
      for (const st of students.slice(0, 10)) {
        const res = await studentService.getAttendanceSummary(st.id);
        const overall = res.data?.overall;
        if (overall && overall.totalClasses > 0 && overall.percentage < 75) {
          lowList.push({
            id: st.id,
            rollNumber: st.roll_number,
            name: st.name,
            department: st.department,
            present: overall.presentClasses,
            total: overall.totalClasses,
            percentage: overall.percentage
          });
        }
      }
      setLowAttendanceList(lowList);
    } catch (e) {
      console.error('Error computing low attendance:', e);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STUDENT DASHBOARD VIEW
  // -------------------------------------------------------------
  if (hasRole('student')) {
    const overall = studentSummary?.overall || { percentage: 0, presentClasses: 0, totalClasses: 0 };
    const pct = Number(overall.percentage) || 0;
    const isDetentionRisk = isLowAttendance(pct);
    const statusObj = getAttendanceStatus(pct);

    // Calculate required classes to reach 75%:
    // (Present + x) / (Total + x) >= 0.75  =>  x >= (0.75 * Total - Present) / 0.25 = 3 * Total - 4 * Present
    const classesNeeded = isDetentionRisk
      ? Math.max(1, Math.ceil(3 * overall.totalClasses - 4 * overall.presentClasses))
      : 0;

    return (
      <div>
        {/* Welcome Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1 brand-font">Welcome back, {user?.name}!</h2>
            <p className="text-muted mb-0">
              Roll No: <span className="fw-semibold text-dark">{user?.rollNumber || '21CS101'}</span> •{' '}
              Dept: <span className="fw-semibold text-dark">{user?.department || 'CSE'}</span> •{' '}
              Year: <span className="fw-semibold text-dark">Year {user?.year || 3}, Sec {user?.section || 'A'}</span>
            </p>
          </div>
          <div className="mt-2 mt-sm-0">
            <button
              onClick={() => navigate('/attendance-records')}
              className="btn btn-outline-primary rounded-pill px-3 py-1.5 d-flex align-items-center gap-2"
            >
              <i className="bi bi-clock-history"></i>
              <span>View Detailed History</span>
            </button>
          </div>
        </div>

        {/* 75% Academic Policy Warning Banner */}
        <div className="mb-4">
          {isDetentionRisk ? (
            <div className="card border-danger bg-danger bg-opacity-10 shadow-sm p-4 rounded-4">
              <div className="d-flex align-items-start gap-3">
                <div className="text-danger fs-1 lh-1">
                  <i className="bi bi-exclamation-octagon-fill"></i>
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h5 className="fw-bold text-danger mb-0">Academic Detention Alert</h5>
                    <span className="badge bg-danger text-white">BELOW 75% REQUIREMENT</span>
                  </div>
                  <p className="text-danger text-opacity-85 mb-2 small">
                    Your cumulative attendance of <strong>{pct}%</strong> is below the mandatory university threshold of <strong>75%</strong>. You are at high risk of academic detention and debarment from semester examinations.
                  </p>
                  <div className="alert alert-light border-danger border-opacity-25 d-inline-flex align-items-center gap-2 py-2 px-3 mb-0 small">
                    <i className="bi bi-info-circle text-danger"></i>
                    <span>
                      <strong>Remedial Requirement:</strong> You must attend the next <strong>{classesNeeded}</strong> consecutive scheduled classes without absence to restore your attendance to 75%.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-success bg-success bg-opacity-10 shadow-sm p-4 rounded-4">
              <div className="d-flex align-items-start gap-3">
                <div className="text-success fs-1 lh-1">
                  <i className="bi bi-shield-check"></i>
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h5 className="fw-bold text-success mb-0">Attendance Status: Satisfactory</h5>
                    <span className="badge bg-success text-white">ELIGIBLE FOR EXAMS</span>
                  </div>
                  <p className="text-success text-opacity-85 mb-0 small">
                    Great job! Your cumulative attendance is <strong>{pct}%</strong>, fulfilling university eligibility criteria (&gt;= 75%). Continue attending regularly to maintain your standing.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Student Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <StatCard
              title="Overall Attendance"
              value={`${pct}%`}
              icon="bi bi-pie-chart"
              variant={isDetentionRisk ? 'danger' : 'success'}
              subtitle={statusObj.label}
              badgeText={isDetentionRisk ? 'ACTION NEEDED' : 'GOOD'}
              badgeVariant={isDetentionRisk ? 'danger' : 'success'}
            />
          </div>
          <div className="col-md-4">
            <StatCard
              title="Classes Attended"
              value={overall.presentClasses || 0}
              icon="bi bi-check2-circle"
              variant="primary"
              subtitle={`Out of ${overall.totalClasses || 0} classes held`}
            />
          </div>
          <div className="col-md-4">
            <StatCard
              title="Classes Missed"
              value={(overall.totalClasses || 0) - (overall.presentClasses || 0)}
              icon="bi bi-x-circle"
              variant={isDetentionRisk ? 'danger' : 'warning'}
              subtitle={`Target to 75%: +${classesNeeded} classes`}
            />
          </div>
        </div>

        {/* Subject Breakdown Table */}
        <div className="card-custom">
          <div className="card-custom-header">
            <div>
              <h5 className="fw-bold mb-0">Subject-wise Attendance Progress</h5>
              <small className="text-muted">Breakdown of attendance for each enrolled course</small>
            </div>
            <span className="badge bg-light text-dark border">Semester 5</span>
          </div>
          <div className="card-custom-body p-0">
            <div className="table-responsive">
              <table className="table-custom mb-0">
                <thead>
                  <tr>
                    <th>Subject Code & Name</th>
                    <th>Faculty In-Charge</th>
                    <th className="text-center">Attended / Total</th>
                    <th>Attendance Bar</th>
                    <th className="text-center">Percentage</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentSummary?.subjects?.length > 0 ? (
                    studentSummary.subjects.map((sub) => {
                      const subPct = Number(sub.percentage) || 0;
                      const isLow = isLowAttendance(subPct);
                      return (
                        <tr key={sub.subject_id}>
                          <td>
                            <div className="fw-bold text-dark">{sub.subject_code}</div>
                            <div className="small text-muted">{sub.subject_name}</div>
                          </td>
                          <td className="text-secondary">{sub.faculty_name || 'Assigned Faculty'}</td>
                          <td className="text-center fw-semibold">
                            {sub.presentClasses} / {sub.totalClasses}
                          </td>
                          <td style={{ minWidth: '150px' }}>
                            <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                              <div
                                className={`progress-bar ${isLow ? 'bg-danger' : 'bg-success'}`}
                                role="progressbar"
                                style={{ width: `${Math.min(100, subPct)}%` }}
                                aria-valuenow={subPct}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className={`fw-bold ${isLow ? 'text-danger' : 'text-success'}`}>
                              {subPct}%
                            </span>
                          </td>
                          <td className="text-center">
                            <span className={isLow ? 'badge-low-alert' : 'badge-satisfactory'}>
                              {isLow ? 'Shortage (<75%)' : 'Eligible'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No subject attendance data available yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FACULTY DASHBOARD VIEW
  // -------------------------------------------------------------
  if (hasRole('faculty')) {
    return (
      <div>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1 brand-font">Faculty Portal: {user?.name}</h2>
            <p className="text-muted mb-0">
              Employee ID: <span className="fw-semibold text-dark">{user?.employeeId || 'FAC-001'}</span> •{' '}
              Dept: <span className="fw-semibold text-dark">{user?.department || 'CSE'}</span>
            </p>
          </div>
          <div className="mt-2 mt-sm-0 d-flex gap-2">
            <button
              onClick={() => navigate('/mark-attendance')}
              className="btn btn-primary rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2"
            >
              <i className="bi bi-check2-square"></i>
              <span>Mark Attendance Now</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <StatCard
              title="Assigned Subjects"
              value={facultySubjects.length}
              icon="bi bi-journal-bookmark"
              variant="primary"
              subtitle="Current semester teaching load"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              title="Recent Sessions Logged"
              value={recentRecords.length}
              icon="bi bi-calendar-check"
              variant="success"
              subtitle="Attendance batches recorded"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              title="Total Enrolled Students"
              value={18}
              icon="bi bi-people"
              variant="purple"
              subtitle="Students across your sections"
            />
          </div>
        </div>

        {/* Assigned Subjects Grid */}
        <div className="card-custom mb-4">
          <div className="card-custom-header">
            <h5 className="fw-bold mb-0">Your Assigned Subjects</h5>
            <small className="text-muted">Click Mark Attendance to take daily roll call</small>
          </div>
          <div className="card-custom-body">
            <div className="row g-3">
              {facultySubjects.length > 0 ? (
                facultySubjects.map((sub) => (
                  <div className="col-md-6" key={sub.id}>
                    <div className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                      <div>
                        <span className="badge bg-primary mb-1">{sub.subject_code}</span>
                        <h6 className="fw-bold text-dark mb-0">{sub.subject_name}</h6>
                        <small className="text-muted">
                          Year {sub.year || 3}, Sem {sub.semester || 5}, Sec {sub.section || 'A'}
                        </small>
                      </div>
                      <button
                        onClick={() => navigate(`/mark-attendance?subjectId=${sub.id}`)}
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                      >
                        <i className="bi bi-check2-circle me-1"></i> Mark
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-3 text-muted">
                  No subjects currently assigned to your account.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Attendance Sessions */}
        <div className="card-custom">
          <div className="card-custom-header">
            <h5 className="fw-bold mb-0">Recent Attendance Records</h5>
            <button
              onClick={() => navigate('/attendance-records')}
              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            >
              View All Records
            </button>
          </div>
          <div className="card-custom-body p-0">
            <div className="table-responsive">
              <table className="table-custom mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.slice(0, 6).map((rec) => (
                    <tr key={rec.id}>
                      <td>{rec.attendance_date}</td>
                      <td>
                        <div className="fw-semibold text-dark">{rec.student_name}</div>
                        <small className="text-muted">{rec.roll_number}</small>
                      </td>
                      <td>{rec.subject_code} - {rec.subject_name}</td>
                      <td>
                        <span className={rec.status === 'Present' ? 'badge-present' : 'badge-absent'}>
                          {rec.status === 'Present' ? (
                            <><i className="bi bi-check-circle-fill"></i> Present</>
                          ) : (
                            <><i className="bi bi-x-circle-fill"></i> Absent</>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ADMIN DASHBOARD VIEW
  // -------------------------------------------------------------
  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 brand-font">Administrative Overview</h2>
          <p className="text-muted mb-0">
            Campus-wide attendance health, departmental metrics, and academic risk alerts.
          </p>
        </div>
        <div className="d-flex gap-2 mt-2 mt-sm-0">
          <button
            onClick={() => navigate('/mark-attendance')}
            className="btn btn-primary rounded-pill px-3 py-1.5 d-flex align-items-center gap-2"
          >
            <i className="bi bi-check2-square"></i>
            <span>Mark Attendance</span>
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="btn btn-outline-secondary rounded-pill px-3 py-1.5 d-flex align-items-center gap-2"
          >
            <i className="bi bi-graph-up"></i>
            <span>Full Analytics</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon="bi bi-people-fill"
            variant="primary"
            subtitle="Active enrollees"
            onClick={() => navigate('/students')}
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard
            title="Faculty Staff"
            value={stats.totalFaculty}
            icon="bi bi-person-workspace"
            variant="purple"
            subtitle="Department educators"
            onClick={() => navigate('/faculty')}
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard
            title="Courses / Subjects"
            value={stats.totalSubjects}
            icon="bi bi-journal-text"
            variant="warning"
            subtitle="B.Tech curriculum"
            onClick={() => navigate('/subjects')}
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard
            title="Overall Attendance"
            value={`${stats.overallAttendancePercentage}%`}
            icon="bi bi-patch-check-fill"
            variant="success"
            subtitle="Campus average"
            badgeText="HEALTHY"
            badgeVariant="success"
          />
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Academic Detention / Low Attendance Registry */}
        <div className="col-lg-7">
          <div className="card-custom h-100 mb-0">
            <div className="card-custom-header">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-danger rounded-circle p-1"></span>
                <h5 className="fw-bold mb-0">Academic Detention Watchlist (&lt;75%)</h5>
              </div>
              <span className="badge-low-alert">75% Policy Enforcement</span>
            </div>
            <div className="card-custom-body p-0">
              <div className="table-responsive">
                <table className="table-custom mb-0">
                  <thead>
                    <tr>
                      <th>Roll Number</th>
                      <th>Student Name</th>
                      <th>Attended</th>
                      <th>Attendance %</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowAttendanceList.length > 0 ? (
                      lowAttendanceList.map((st) => (
                        <tr key={st.id}>
                          <td className="fw-bold text-dark">{st.rollNumber}</td>
                          <td>
                            <div className="fw-semibold">{st.name}</div>
                            <small className="text-muted">{st.department}</small>
                          </td>
                          <td>{st.present} / {st.total}</td>
                          <td>
                            <span className="badge bg-danger text-white fw-bold">
                              {st.percentage}%
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => navigate('/attendance-records')}
                              className="btn btn-sm btn-outline-danger rounded-pill py-1 px-2.5"
                            >
                              Notice
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          No students are currently below the 75% attendance threshold.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links & Shortcuts */}
        <div className="col-lg-5">
          <div className="card-custom h-100 mb-0">
            <div className="card-custom-header">
              <h5 className="fw-bold mb-0">Administrative Actions</h5>
              <small className="text-muted">Shortcuts</small>
            </div>
            <div className="card-custom-body d-flex flex-column gap-3">
              <div
                className="p-3 border rounded-3 d-flex align-items-center justify-content-between bg-light cursor-pointer"
                onClick={() => navigate('/mark-attendance')}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon primary" style={{ width: '42px', height: '42px', fontSize: '18px' }}>
                    <i className="bi bi-pencil-square"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">Take Attendance Session</div>
                    <small className="text-muted">Record daily roll call for any course</small>
                  </div>
                </div>
                <i className="bi bi-chevron-right text-muted"></i>
              </div>

              <div
                className="p-3 border rounded-3 d-flex align-items-center justify-content-between bg-light cursor-pointer"
                onClick={() => navigate('/students')}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon success" style={{ width: '42px', height: '42px', fontSize: '18px' }}>
                    <i className="bi bi-person-plus-fill"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">Manage Student Enrollees</div>
                    <small className="text-muted">Add, modify or view student profiles</small>
                  </div>
                </div>
                <i className="bi bi-chevron-right text-muted"></i>
              </div>

              <div
                className="p-3 border rounded-3 d-flex align-items-center justify-content-between bg-light cursor-pointer"
                onClick={() => navigate('/analytics')}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon purple" style={{ width: '42px', height: '42px', fontSize: '18px' }}>
                    <i className="bi bi-filetype-xml"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">XML / CSV Reports</div>
                    <small className="text-muted">Export data compliant with DTD / XSD</small>
                  </div>
                </div>
                <i className="bi bi-chevron-right text-muted"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
