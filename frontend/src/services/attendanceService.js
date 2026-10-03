import api from './api';

export const attendanceService = {
  getStatistics: async () => {
    const res = await api.get('/attendance/statistics');
    return res.data;
  },

  getAll: async (params = {}) => {
    const res = await api.get('/attendance', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/attendance/${id}`);
    return res.data;
  },

  checkExisting: async (subjectId, date) => {
    const res = await api.get('/attendance/check', {
      params: { subjectId, date }
    });
    return res.data;
  },

  recordBatch: async (data) => {
    const res = await api.post('/attendance', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/attendance/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/attendance/${id}`);
    return res.data;
  },

  getSubjectAttendance: async (subjectId, params = {}) => {
    const res = await api.get(`/subjects/${subjectId}/attendance`, { params });
    return res.data;
  },

  exportXmlUrl: (params = {}) => {
    const token = localStorage.getItem('attendease_token');
    const query = new URLSearchParams({ ...params, ...(token ? { token } : {}) }).toString();
    return `/api/attendance/export/xml${query ? `?${query}` : ''}`;
  },

  exportCsvUrl: (params = {}) => {
    const token = localStorage.getItem('attendease_token');
    const query = new URLSearchParams({ ...params, ...(token ? { token } : {}) }).toString();
    return `/api/attendance/export/csv${query ? `?${query}` : ''}`;
  },

  downloadXml: async (params = {}) => {
    const res = await api.get('/attendance/export/xml', {
      params,
      responseType: 'blob'
    });
    return res.data;
  },

  downloadCsv: async (params = {}) => {
    const res = await api.get('/attendance/export/csv', {
      params,
      responseType: 'blob'
    });
    return res.data;
  }
};
