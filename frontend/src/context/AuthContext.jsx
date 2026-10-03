import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('attendease_token');
      const storedUser = localStorage.getItem('attendease_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        // Re-validate and refresh user from server to ensure latest database names
        authService.getMe()
          .then((res) => {
            if (res && res.user) {
              setUser(res.user);
              localStorage.setItem('attendease_user', JSON.stringify(res.user));
            }
          })
          .catch(() => {});
      }
    } catch (err) {
      console.error('Error hydrating auth state:', err);
      localStorage.removeItem('attendease_token');
      localStorage.removeItem('attendease_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data.token && data.user) {
      localStorage.setItem('attendease_token', data.token);
      localStorage.setItem('attendease_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('attendease_token');
    localStorage.removeItem('attendease_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('attendease_user', JSON.stringify(merged));
      return merged;
    });
  };

  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    updateUser,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
