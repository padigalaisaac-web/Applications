import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://librarymanage.up.railway.app/api'
});

function message(error) {
  return error.response?.data?.message || error.message || 'Something went wrong';
}

api.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(new Error(message(error)))
);

export const bookService = {
  list: (search) => api.get('/books', { params: search ? { search } : {} }).then((r) => r.data),
  get: (id) => api.get(`/books/${id}`).then((r) => r.data),
  create: (data) => api.post('/books', data).then((r) => r.data),
  update: (id, data) => api.put(`/books/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/books/${id}`).then((r) => r.data)
};

export const memberService = {
  list: (search) => api.get('/members', { params: search ? { search } : {} }).then((r) => r.data),
  get: (id) => api.get(`/members/${id}`).then((r) => r.data),
  create: (data) => api.post('/members', data).then((r) => r.data),
  update: (id, data) => api.put(`/members/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/members/${id}`).then((r) => r.data)
};

export const transactionService = {
  list: (status) => api.get('/transactions', { params: status ? { status } : {} }).then((r) => r.data),
  stats: () => api.get('/transactions/stats').then((r) => r.data),
  issue: (data) => api.post('/transactions/issue', data).then((r) => r.data),
  markReturned: (id) => api.put(`/transactions/${id}/return`).then((r) => r.data)
};

export default api;
