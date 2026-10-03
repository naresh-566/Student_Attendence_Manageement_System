import api from './api';

export const subjectService = {
  getAll: async (params = {}) => {
    const res = await api.get('/subjects', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/subjects/${id}`);
    return res.data;
  },

  create: async (subjectData) => {
    const res = await api.post('/subjects', subjectData);
    return res.data;
  },

  update: async (id, subjectData) => {
    const res = await api.put(`/subjects/${id}`, subjectData);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/subjects/${id}`);
    return res.data;
  },

  getSubjectStudents: async (id) => {
    const res = await api.get(`/subjects/${id}/students`);
    return res.data;
  },

  getAttendanceSummary: async (id) => {
    const res = await api.get(`/subjects/${id}/attendance-summary`);
    return res.data;
  }
};
