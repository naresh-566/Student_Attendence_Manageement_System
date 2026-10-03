import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoUsers, setDemoUsers] = useState(null);

  useEffect(() => {
    api.get('/auth/demo-accounts')
      .then((res) => {
        if (res.data && res.data.data) {
          setDemoUsers(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setServerError('');

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrors({});
    setServerError('');
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 py-5"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0b1329 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative gradient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0) 70%)',
          pointerEvents: 'none'
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0) 70%)',
          pointerEvents: 'none'
        }}
      ></div>

      <div className="container" style={{ maxWidth: '1000px', zIndex: 1 }}>
        <div className="row g-4 align-items-center">
          {/* Left Brand Column */}
          <div className="col-lg-6 text-white pe-lg-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="logo-icon-box"
                style={{ width: '48px', height: '48px', fontSize: '24px' }}
              >
                <i className="bi bi-calendar-check-fill"></i>
              </div>
              <div>
                <h1 className="h3 fw-bold text-white mb-0 brand-font">AttendEase</h1>
                <small className="text-info text-uppercase" style={{ letterSpacing: '1.2px' }}>
                  Smart Attendance System
                </small>
              </div>
            </div>

            <h2 className="display-6 fw-bold text-white lh-sm mb-3">
              Automate Academic Attendance with Precision.
            </h2>
            <p className="text-slate-300 fs-6 mb-4" style={{ color: '#cbd5e1' }}>
              Built for universities and colleges. Real-time class session tracking, 75% academic
              threshold warning triggers, role-based analytics, and XML/CSV report compliance.
            </p>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <div
                  className="p-3 rounded-3"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <div className="fw-bold text-info fs-5">75% Policy</div>
                  <small style={{ color: '#94a3b8' }}>Real-time shortage alerts & detention warnings</small>
                </div>
              </div>
              <div className="col-6">
                <div
                  className="p-3 rounded-3"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <div className="fw-bold text-success fs-5">Dual Engine</div>
                  <small style={{ color: '#94a3b8' }}>MySQL with automated SQLite fallback</small>
                </div>
              </div>
            </div>

            {/* Quick Demo Switcher Cards */}
            <div className="mb-2">
              <div className="text-uppercase small fw-bold text-slate-400 mb-2" style={{ color: '#94a3b8', fontSize: '11px', letterSpacing: '1px' }}>
                <i className="bi bi-magic me-1"></i> Quick Fill Demo Accounts
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@attendease.com', 'Admin@123')}
                  className="btn btn-sm btn-outline-light text-start py-1.5 px-3 rounded-3"
                  style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: '#ef4444' }}
                >
                  <div className="fw-bold text-danger" style={{ fontSize: '12px' }}>
                    👑 Admin: {demoUsers?.admin?.name || 'System Administrator'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#cbd5e1' }}>admin@attendease.com</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('faculty1@attendease.com', 'Faculty@123')}
                  className="btn btn-sm btn-outline-light text-start py-1.5 px-3 rounded-3"
                  style={{ background: 'rgba(37, 99, 235, 0.15)', borderColor: '#3b82f6' }}
                >
                  <div className="fw-bold text-primary" style={{ fontSize: '12px' }}>
                    👨‍🏫 Faculty: {demoUsers?.faculty?.name || 'Dr. Ramesh Kumar'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#cbd5e1' }}>faculty1@attendease.com</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('student1@attendease.com', 'Student@123')}
                  className="btn btn-sm btn-outline-light text-start py-1.5 px-3 rounded-3"
                  style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981' }}
                >
                  <div className="fw-bold text-success" style={{ fontSize: '12px' }}>
                    🎓 Student: {demoUsers?.student1?.name || 'Rahul Sharma'}
                    {demoUsers?.student1?.rollNumber ? ` (${demoUsers.student1.rollNumber})` : ''}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#cbd5e1' }}>student1@attendease.com</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('student3@attendease.com', 'Student@123')}
                  className="btn btn-sm btn-outline-light text-start py-1.5 px-3 rounded-3"
                  style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: '#f59e0b' }}
                >
                  <div className="fw-bold text-warning" style={{ fontSize: '12px' }}>
                    ⚠️ Student: {demoUsers?.student3?.name || 'Amit Verma'}
                    {demoUsers?.student3?.rollNumber ? ` (${demoUsers.student3.rollNumber})` : ''}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#cbd5e1' }}>student3@attendease.com</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Login Card Column */}
          <div className="col-lg-6 ps-lg-4">
            <div
              className="card border-0 shadow-lg p-4 p-md-5 rounded-4"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(16px)'
              }}
            >
              <div className="mb-4">
                <h3 className="fw-bold text-dark mb-1 brand-font">Account Sign In</h3>
                <p className="text-muted small">
                  Enter your university credentials to access your attendance portal.
                </p>
              </div>

              {serverError && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2.5 px-3 small rounded-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill fs-6 flex-shrink-0"></i>
                  <div>{serverError}</div>
                </div>
              )}

              <form onSubmit={handleLogin} noValidate>
                {/* Email field */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      id="login-email"
                      className={`form-control bg-light border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="name@attendease.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      required
                    />
                  </div>
                  {errors.email && (
                    <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                      <i className="bi bi-info-circle"></i> {errors.email}
                    </div>
                  )}
                </div>

                {/* Password field */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold text-secondary small mb-0">Password</label>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      className={`form-control bg-light border-start-0 border-end-0 ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="input-group-text bg-light text-muted border-start-0"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {errors.password && (
                    <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                      <i className="bi bi-info-circle"></i> {errors.password}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="btn-sign-in"
                  disabled={isSubmitting}
                  className="btn btn-primary w-100 py-2.5 rounded-3 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                    border: 'none'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to AttendEase</span>
                      <i className="bi bi-arrow-right"></i>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 pt-3 border-top text-center text-muted" style={{ fontSize: '12px' }}>
                <span>Demo Password for all accounts: </span>
                <code className="text-dark bg-light px-2 py-0.5 rounded border">Admin@123</code> or{' '}
                <code className="text-dark bg-light px-2 py-0.5 rounded border">Faculty@123</code> or{' '}
                <code className="text-dark bg-light px-2 py-0.5 rounded border">Student@123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
