import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MarkAttendance from './pages/MarkAttendance';
import AttendanceRecords from './pages/AttendanceRecords';
import StudentsPage from './pages/StudentsPage';
import FacultyPage from './pages/FacultyPage';
import SubjectsPage from './pages/SubjectsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';

const AppLayout = ({ children, pageTitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-wrapper">
        <Topbar
          title={pageTitle}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/dashboard':
      return 'Academic Dashboard';
    case '/mark-attendance':
      return 'Daily Attendance Roll Call';
    case '/attendance-records':
      return 'Attendance Log Records';
    case '/students':
      return 'Students Directory';
    case '/faculty':
      return 'Faculty Directory';
    case '/subjects':
      return 'Courses & Subjects Catalog';
    case '/analytics':
      return 'Analytics & Compliance Reports';
    case '/profile':
      return 'User Account Settings';
    default:
      return 'AttendEase';
  }
};

const App = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <Routes>
      {/* Public Login Route */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Protected Routes inside AppLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout pageTitle={title}>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mark-attendance"
        element={
          <ProtectedRoute allowedRoles={['admin', 'faculty']}>
            <AppLayout pageTitle={title}>
              <MarkAttendance />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance-records"
        element={
          <ProtectedRoute>
            <AppLayout pageTitle={title}>
              <AttendanceRecords />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={['admin', 'faculty']}>
            <AppLayout pageTitle={title}>
              <StudentsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout pageTitle={title}>
              <FacultyPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/subjects"
        element={
          <ProtectedRoute>
            <AppLayout pageTitle={title}>
              <SubjectsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={['admin', 'faculty']}>
            <AppLayout pageTitle={title}>
              <AnalyticsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout pageTitle={title}>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
