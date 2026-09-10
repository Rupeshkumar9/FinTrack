import api from './api';
export const transactionService = {
  getAll: (params) => api.get('/transactions', { params }).then(r => r.data),
  create: (data) => api.post('/transactions', data).then(r => r.data),
  update: (id, data) => api.put(`/transactions/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/transactions/${id}`).then(r => r.data),
  getSummary: (params) => api.get('/transactions/summary', { params }).then(r => r.data),
};
export const categoryService = {
  getAll: () => api.get('/categories').then(r => r.data),
  create: (data) => api.post('/categories', data).then(r => r.data),
  update: (id, data) => api.put(`/categories/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/categories/${id}`).then(r => r.data),
};
export const budgetService = {
  getAll: (params) => api.get('/budgets', { params }).then(r => r.data),
  upsert: (data) => api.post('/budgets', data).then(r => r.data),
  delete: (id) => api.delete(`/budgets/${id}`).then(r => r.data),
};
export const reportService = {
  monthly: (params) => api.get('/reports/monthly', { params }).then(r => r.data),
  category: (params) => api.get('/reports/category', { params }).then(r => r.data),
  exportCSV: (params) => api.get('/reports/export', { params, responseType: 'blob' }).then(r => r.data),
};
