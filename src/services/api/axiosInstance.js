import axios from 'axios'
import { AUTH_TOKEN_KEY } from '@/constants'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem('easylearn-auth')
      window.location.href = '/login'
    }
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

export default axiosInstance
