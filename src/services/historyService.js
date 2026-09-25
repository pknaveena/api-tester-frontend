import api from './api'

export async function getHistory(page = 0, size = 20) {
  const response = await api.get('/api/history', {
    params: {
      page,
      size,
    },
  })

  return response.data
}

export async function getHistoryById(id) {
  const response = await api.get(`/api/history/${id}`)

  return response.data
}

export async function deleteHistory(id) {
  const response = await api.delete(`/api/history/${id}`)

  return response.data
}