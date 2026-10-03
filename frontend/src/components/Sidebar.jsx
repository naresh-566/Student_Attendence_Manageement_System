import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="badge bg-danger text-white">ADMINISTRATOR</span>;
      case 'faculty':
        return <span className="badge bg-primary text-white">FACULTY MEMBER</span>;
      case 'student':
        return <span className="badge bg-success text-white">STUDENT</span>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-lg-none"
          style={{ zIndex: 95 }}
          onClick={onClose}
        ></div>
      )}

      <aside className={`sidebar-wrapper ${isOpen ? 'show' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header d-flex align-items-center justify-content-between">
          <NavLink to="/dashboard" className="sidebar-logo" onClick={onClose}>
            <div className="logo-icon-box">
              <i className="bi bi-calendar-check-fill"></i>
            </div>
            <div>
              <div className="fw-bold fs-5 tracking-tight lh-1 text-white brand-font">
                AttendEase
              </div>
            </div>
          </NavLink>
          <button
            className="btn btn-link text-white-50 d-lg-none p-0"
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <i className="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        {/* User Card */}
        <div className="px-3 pt-3 pb-2 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
              style={{
                width: '38px',
                height: '38px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                fontSize: '14px'
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="text-white text-truncate fw-semibold" style={{ fontSize: '13.5px' }}>
                {user?.name || 'Logged User'}
              </div>
              <div className="mt-1">{getRoleBadge(user?.role)}</div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">Overview</div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <i className="bi bi-grid-1x2-fill"></i>
            <span>Dashboard</span>
          </NavLink>

          <div className="nav-section-title">Attendance</div>
          {(hasRole('admin') || hasRole('faculty')) && (
            <NavLink
              to="/mark-attendance"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-check2-square"></i>
              <span>Mark Attendance</span>
            </NavLink>
          )}

          <NavLink
            to="/attendance-records"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <i className="bi bi-table"></i>
            <span>{hasRole('student') ? 'My Attendance' : 'Attendance Records'}</span>
          </NavLink>

          <div className="nav-section-title">Academic Directory</div>
          {(hasRole('admin') || hasRole('faculty')) && (
            <NavLink
              to="/students"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-people-fill"></i>
              <span>Students Directory</span>
            </NavLink>
          )}

          {hasRole('admin') && (
            <NavLink
              to="/faculty"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-person-workspace"></i>
              <span>Faculty Directory</span>
            </NavLink>
          )}

          <NavLink
            to="/subjects"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <i className="bi bi-journal-bookmark-fill"></i>
            <span>{hasRole('student') ? 'Enrolled Subjects' : 'Subjects Catalog'}</span>
          </NavLink>

          {(hasRole('admin') || hasRole('faculty')) && (
            <>
              <div className="nav-section-title">Insights & Exports</div>
              <NavLink
                to="/analytics"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <i className="bi bi-pie-chart-fill"></i>
                <span>Analytics & Reports</span>
              </NavLink>
            </>
          )}

          <div className="nav-section-title">Settings</div>
          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <i className="bi bi-person-gear"></i>
            <span>My Profile</span>
          </NavLink>
        </nav>

        {/* Footer Logout */}
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2"
            style={{ fontSize: '13.5px' }}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
