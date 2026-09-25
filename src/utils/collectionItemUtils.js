export function convertObjectToRows(object) {
  if (!object || Object.keys(object).length === 0) {
    return [{ key: '', value: '' }]
  }

  return Object.entries(object).map(
    ([key, value]) => ({
      key,
      value,
    })
  )
}

export function convertRowsToObject(rows) {
  return rows.reduce((result, row) => {
    const key = row.key?.trim()

    if (!key) {
      return result
    }

    result[key] = row.value ?? ''

    return result
  }, {})
}

export function toCollectionItemRequest(request) {
  return {
    name: request.name.trim(),
    method: request.method,
    url: request.url.trim(),
    headers: convertRowsToObject(
      request.headers
    ),
    queryParams: convertRowsToObject(
      request.params
    ),
    body: request.body,
    authType: request.authType,
    bearerToken: request.bearerToken,
    username: request.username,
    password: request.password,
    apiKey: request.apiKey,
    apiKeyName: request.apiKeyName,
  }
}