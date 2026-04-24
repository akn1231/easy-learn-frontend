import axiosInstance from './axiosInstance'

export const authService = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  logout: () => axiosInstance.post('/auth/logout'),
  me: () => axiosInstance.get('/auth/me'),
}
