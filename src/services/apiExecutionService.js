import api from './api'

export async function executeRequest({ method,
  url,
  queryParams,
  headers,
  body,
  environmentId,
  authType,
  bearerToken,
  username,
  password,
  apiKey,
  apiKeyName }) {
  const response = await api.post(
    '/api/requests/execute',
    {
      method,
      url,
      queryParams,
      headers,
      body,
      environmentId,
      authType,
      bearerToken,
      username,
      password,
      apiKey,
      apiKeyName,
    }
  )

  return response.data
}