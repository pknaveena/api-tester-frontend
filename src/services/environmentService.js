import api from './api'

export async function getEnvironments(page = 0, size = 20) {
  const response = await api.get('/api/environments', {
    params: {
      page,
      size,
    },
  })

  return response.data
}

export async function getEnvironmentById(id) {
  const response = await api.get(`/api/environments/${id}`)

  return response.data
}

export async function createEnvironment(name, variables) {
  const response = await api.post('/api/environments', {
    name,
    variables,
  })

  return response.data
}

export async function updateEnvironment(id, name, variables) {
  const response = await api.put(`/api/environments/${id}`, {
    name,
    variables,
  })

  return response.data
}

export async function deleteEnvironment(id) {
  const response = await api.delete(`/api/environments/${id}`)

  return response.data
}