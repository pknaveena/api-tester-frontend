import api from './api'

export async function getCollections() {
  const response = await api.get('/api/collections')
  return response.data
}

export async function createCollection(name, description) {
  const response = await api.post('/api/collections', {
    name,
    description,
  })
  return response.data
}

export async function getCollectionById(id) {
  const response = await api.get(`/api/collections/${id}`)
  return response.data
}

export async function getCollectionItems(collectionId) {
  const response = await api.get(
    `/api/collections/${collectionId}/items`
  )

  return response.data
}

export async function deleteCollectionItem(
  collectionId,
  itemId
) {
  const response = await api.delete(
    `/api/collections/${collectionId}/items/${itemId}`
  )

  return response.data
}

export async function createCollectionItem(
  collectionId,
  request
) {
  const response = await api.post(
    `/api/collections/${collectionId}/items`,
    request
  )

  return response.data
}

export async function updateCollectionItem(
  collectionId,
  itemId,
  request
) {
  const response = await api.put(
    `/api/collections/${collectionId}/items/${itemId}`,
    request
  )

  return response.data
}


