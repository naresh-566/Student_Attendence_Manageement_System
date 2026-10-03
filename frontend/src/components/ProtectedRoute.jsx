import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-slate">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading AttendEase...</span>
          </div>
          <p className="mt-3 text-muted fw-semibold">Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="card-custom p-5 text-center mt-4">
        <div className="text-danger mb-3">
          <i className="bi bi-shield-lock-fill" style={{ fontSize: '3rem' }}></i>
        </div>
        <h4 className="fw-bold">Access Restricted</h4>
        <p className="text-muted">
          Your current account role (<strong>{user?.role?.toUpperCase()}</strong>) does not have permission to view this section.
        </p>
        <div className="mt-3">
          <a href="/dashboard" className="btn btn-primary px-4 py-2">
            <i className="bi bi-arrow-left me-2"></i> Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
