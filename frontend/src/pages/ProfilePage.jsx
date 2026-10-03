import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || '');
  const [year, setYear] = useState(user?.year || 3);
  const [section, setSection] = useState(user?.section || 'A');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setRollNumber(user.rollNumber || '');
      setYear(user.year || 3);
      setSection(user.section || 'A');
      setDepartment(user.department || 'Computer Science & Engineering');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileError('Name cannot be empty.');
      return;
    }

    if (user?.role === 'student' && !rollNumber.trim()) {
      setProfileError('Roll number cannot be empty.');
      return;
    }

    setSavingProfile(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const payload = {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        department,
        ...(user?.role === 'student'
          ? {
              rollNumber: rollNumber.trim().toUpperCase(),
              year: Number(year),
              section
            }
          : {})
      };

      await authService.updateProfile(payload);
      updateUser(payload);
      setProfileSuccess('Profile & academic details successfully updated!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setSavingPassword(true);

    try {
      await authService.changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully! Keep your credentials secure.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 brand-font">User Account & Security</h2>
          <p className="text-muted mb-0">
            Manage your personal profile details, authentication credentials, and security settings.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Profile Card */}
        <div className="col-lg-4">
          <div className="card-custom text-center p-4">
            <div
              className="rounded-circle mx-auto d-flex align-items-center justify-content-center text-white fw-bold shadow-md mb-3"
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                fontSize: '28px'
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <h4 className="fw-bold text-dark mb-1">{user?.name}</h4>
            <p className="text-muted small mb-3">{user?.email}</p>

            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1.5 fs-6 mb-4">
              ROLE: {user?.role?.toUpperCase()}
            </span>

            <div className="border-top pt-3 text-start small">
              {user?.role === 'student' && (
                <>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-muted">Roll Number:</span>
                    <strong className="text-dark">{user.rollNumber}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-muted">Department:</span>
                    <strong className="text-dark">{user.department}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span className="text-muted">Year / Section:</span>
                    <strong className="text-dark">Year {user.year} - Sec {user.section}</strong>
                  </div>
                </>
              )}

              {user?.role === 'faculty' && (
                <>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-muted">Employee ID:</span>
                    <strong className="text-dark">{user.employeeId}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span className="text-muted">Department:</span>
                    <strong className="text-dark">{user.department}</strong>
                  </div>
                </>
              )}

              {user?.role === 'admin' && (
                <div className="text-muted text-center py-2">
                  System Administrator with complete campus authorization.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile & Password Form */}
        <div className="col-lg-8">
          {/* Edit Profile */}
          <div className="card-custom mb-4">
            <div className="card-custom-header">
              <h5 className="fw-bold mb-0">Edit Profile Details</h5>
              <small className="text-muted">Update personal information</small>
            </div>
            <div className="card-custom-body">
              {profileSuccess && (
                <div className="alert alert-success py-2 small mb-3">{profileSuccess}</div>
              )}
              {profileError && (
                <div className="alert alert-danger py-2 small mb-3">{profileError}</div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Display Full Name</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone Number</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  {user?.role === 'student' && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Roll Number *</label>
                        <input
                          type="text"
                          className="form-control bg-light"
                          value={rollNumber}
                          onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                          placeholder="e.g. 21CS101"
                          required
                        />
                        <small className="text-muted">Unique Student Academic Roll Number</small>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label small fw-semibold">Academic Year *</label>
                        <select
                          className="form-select bg-light"
                          value={year}
                          onChange={(e) => setYear(Number(e.target.value))}
                        >
                          <option value={1}>1st Year</option>
                          <option value={2}>2nd Year</option>
                          <option value={3}>3rd Year</option>
                          <option value={4}>4th Year</option>
                        </select>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label small fw-semibold">Section *</label>
                        <select
                          className="form-select bg-light"
                          value={section}
                          onChange={(e) => setSection(e.target.value)}
                        >
                          <option value="A">Section A</option>
                          <option value="B">Section B</option>
                          <option value="C">Section C</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">Department *</label>
                        <select
                          className="form-select bg-light"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                        >
                          <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Electronics & Communication">Electronics & Communication</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Registered Email</label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      value={user?.email || ''}
                      disabled
                    />
                    <small className="text-muted">
                      Email address is managed by the system administrator and cannot be changed here.
                    </small>
                  </div>

                  <div className="col-12 text-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="btn btn-primary rounded-pill px-4"
                    >
                      {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password */}
          <div className="card-custom">
            <div className="card-custom-header">
              <h5 className="fw-bold mb-0">Change Account Password</h5>
              <small className="text-muted">Ensure minimum 6 characters</small>
            </div>
            <div className="card-custom-body">
              {passwordSuccess && (
                <div className="alert alert-success py-2 small mb-3">{passwordSuccess}</div>
              )}
              {passwordError && (
                <div className="alert alert-danger py-2 small mb-3">{passwordError}</div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Current Password</label>
                    <input
                      type="password"
                      className="form-control bg-light"
                      placeholder="Enter your current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">New Password</label>
                    <input
                      type="password"
                      className="form-control bg-light"
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control bg-light"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12 text-end">
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="btn btn-outline-primary rounded-pill px-4"
                    >
                      {savingPassword ? 'Updating Password...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
