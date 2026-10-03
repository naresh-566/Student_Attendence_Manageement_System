import api from './api';

export const studentService = {
  getAll: async (params = {}) => {
    const res = await api.get('/students', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/students/${id}`);
    return res.data;
  },

  create: async (studentData) => {
    const res = await api.post('/students', studentData);
    return res.data;
  },

  update: async (id, studentData) => {
    const res = await api.put(`/students/${id}`, studentData);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/students/${id}`);
    return res.data;
  },

  getAttendanceSummary: async (id) => {
    const res = await api.get(`/students/${id}/attendance-summary`);
    return res.data;
  },

  getAttendanceHistory: async (id, params = {}) => {
    const res = await api.get(`/students/${id}/attendance`, { params });
    return res.data;
  }
};
