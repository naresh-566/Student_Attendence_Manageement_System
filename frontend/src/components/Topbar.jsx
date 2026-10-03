import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Topbar = ({ onToggleSidebar, title = 'Dashboard' }) => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [dbMode, setDbMode] = useState('ONLINE');
  const [demoUsers, setDemoUsers] = useState(null);

  const fetchDemoUsers = () => {
    api.get('/auth/demo-accounts')
      .then((res) => {
        if (res.data && res.data.data) {
          setDemoUsers(res.data.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    api.get('/health')
      .then((res) => {
        if (res.data && res.data.database_mode) {
          setDbMode(res.data.database_mode.toUpperCase());
        }
      })
      .catch(() => setDbMode('SQLITE'));

    fetchDemoUsers();
  }, []);

  const handleQuickSwitch = async (email, password) => {
    try {
      await login(email, password);
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      console.error('Quick switch failed:', err);
    }
  };

  return (
    <header className="topbar-header">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-secondary d-lg-none p-2 rounded"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-5"></i>
        </button>
        <div>
          <h1 className="h5 mb-0 fw-bold brand-font text-dark">{title}</h1>
          <small className="text-muted d-none d-sm-inline">
            Academic Session 2026–2027 • B.Tech CSE Semester V
          </small>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* DB Engine Badge */}
        <span
          className="badge bg-light text-secondary border d-none d-md-inline-flex align-items-center gap-1 px-2.5 py-1.5"
          title="Database engine active"
        >
          <span
            className="rounded-circle bg-success"
            style={{ width: '8px', height: '8px', display: 'inline-block' }}
          ></span>
          <small className="fw-semibold">DB: {dbMode}</small>
        </span>

        {/* Quick Demo Switcher Dropdown for Lab Evaluation */}
        <div className="dropdown d-none d-sm-block">
          <button
            className="btn btn-sm btn-outline-primary dropdown-toggle d-flex align-items-center gap-1 rounded-pill px-3 py-1"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onClick={fetchDemoUsers}
          >
            <i className="bi bi-arrow-repeat"></i>
            <span>Switch Role</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 py-2">
            <li>
              <h6 className="dropdown-header text-uppercase fs-xs">Quick Role Switch</h6>
            </li>
            <li>
              <button
                className="dropdown-item py-2 d-flex align-items-center gap-2"
                onClick={() => handleQuickSwitch('admin@attendease.com', 'Admin@123')}
              >
                <span className="badge bg-danger">Admin</span>
                <span className="text-truncate" style={{ maxWidth: '240px' }}>
                  {demoUsers?.admin?.name || 'System Administrator'}
                </span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item py-2 d-flex align-items-center gap-2"
                onClick={() => handleQuickSwitch('faculty1@attendease.com', 'Faculty@123')}
              >
                <span className="badge bg-primary">Faculty</span>
                <span className="text-truncate" style={{ maxWidth: '240px' }}>
                  {demoUsers?.faculty?.name || 'Dr. Ramesh Kumar'}
                </span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item py-2 d-flex align-items-center gap-2"
                onClick={() => handleQuickSwitch('student1@attendease.com', 'Student@123')}
              >
                <span className="badge bg-success">Student</span>
                <span className="text-truncate" style={{ maxWidth: '240px' }}>
                  {demoUsers?.student1?.name || 'Rahul Sharma'}
                  {demoUsers?.student1?.rollNumber ? ` (${demoUsers.student1.rollNumber})` : ''}
                </span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item py-2 d-flex align-items-center gap-2"
                onClick={() => handleQuickSwitch('student3@attendease.com', 'Student@123')}
              >
                <span className="badge bg-warning text-dark">Student</span>
                <span className="text-truncate" style={{ maxWidth: '240px' }}>
                  {demoUsers?.student3?.name || 'Amit Verma'}
                  {demoUsers?.student3?.rollNumber ? ` (${demoUsers.student3.rollNumber})` : ''}
                </span>
              </button>
            </li>
          </ul>
        </div>

        {/* User Chip */}
        <div
          className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-light border cursor-pointer"
          onClick={() => navigate('/profile')}
          title="Click to view profile"
          style={{ cursor: 'pointer' }}
        >
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
            style={{ width: '28px', height: '28px', fontSize: '12px' }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="d-none d-md-block text-start lh-1">
            <div className="fw-semibold text-dark small">{user?.name || 'User'}</div>
            <small className="text-muted" style={{ fontSize: '10.5px' }}>
              {user?.role?.toUpperCase()}
            </small>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
