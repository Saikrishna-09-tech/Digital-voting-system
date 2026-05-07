import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (fullName, email, password, voterId, aadhaar) =>
    api.post('/auth/register', { fullName, email, password, voterId, aadhaar }),

  login: (email, password, role) =>
    api.post('/auth/login', { email, password, role }),

  sendOTP: (email) =>
    api.post('/auth/send-otp', { email }),

  verifyOTP: (email, otp) =>
    api.post('/auth/verify-otp', { email, otp }),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (email, otp, newPassword) =>
    api.post('/auth/reset-password', { email, otp, newPassword }),
};

export const candidateService = {
  getAllCandidates: () =>
    api.get('/candidates'),

  addCandidate: (name, party, image) =>
    api.post('/candidates', { name, party, image }),

  updateCandidate: (id, name, party, image) =>
    api.put(`/candidates/${id}`, { name, party, image }),

  deleteCandidate: (id) =>
    api.delete(`/candidates/${id}`),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/candidates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const voteService = {
  castVote: (candidateId, txHash) =>
    api.post('/votes/cast', { candidateId, txHash }),

  hasUserVoted: () =>
    api.get('/votes/has-voted'),

  getResults: () =>
    api.get('/votes/results'),

  getTotalVoters: () =>
    api.get('/votes/total-voters'),
};

export const electionService = {
  getStatus: () =>
    api.get('/election/status'),

  startElection: () =>
    api.post('/election/start'),

  endElection: () =>
    api.post('/election/end'),

  getAnalytics: () =>
    api.get('/election/analytics'),
};

export const auditService = {
  getAuditLog: (page = 1, limit = 20) =>
    api.get(`/audit-log?page=${page}&limit=${limit}`),

  logAction: (action, details) =>
    api.post('/audit-log', { action, details }),
};

export default api;
