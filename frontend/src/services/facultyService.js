import api from './api';

export const facultyService = {
  getAll: async (params = {}) => {
    const res = await api.get('/faculty', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/faculty/${id}`);
    return res.data;
  },

  create: async (facultyData) => {
    const res = await api.post('/faculty', facultyData);
    return res.data;
  },

  update: async (id, facultyData) => {
    const res = await api.put(`/faculty/${id}`, facultyData);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/faculty/${id}`);
    return res.data;
  },

  getAssignedSubjects: async (id) => {
    const res = await api.get(`/faculty/${id}/subjects`);
    return res.data;
  }
};
