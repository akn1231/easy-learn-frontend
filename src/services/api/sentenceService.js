import axiosInstance from './axiosInstance'

const buildQuery = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === '' || v == null) return
    Array.isArray(v) ? v.forEach((item) => query.append(k, item)) : query.set(k, v)
  })
  return query.toString()
}

export const sentenceService = {
  getAll: (params) => axiosInstance.get(`/sentences?${buildQuery(params)}`),
  getById: (id) => axiosInstance.get(`/sentences/${id}`),
  create: (payload) => axiosInstance.post('/sentences', payload),
  update: (id, payload) => axiosInstance.put(`/sentences/${id}`, payload),
  delete: (id) => axiosInstance.delete(`/sentences/${id}`),
  approve: (id) => axiosInstance.patch(`/sentences/${id}/approve`),
}
