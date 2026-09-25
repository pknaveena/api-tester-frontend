import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MethodBadge from '../components/MethodBadge'
import Navbar from '../components/Navbar'
import CollectionItemForm from '../components/CollectionItemForm'

import {
  getCollectionById,
  getCollectionItems,
  createCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
} from '../services/collectionService'

import {
  convertObjectToRows,
  toCollectionItemRequest,
} from '../utils/collectionItemUtils'

function CollectionDetails() {
  const { collectionId } = useParams()
  const navigate = useNavigate()

  const [collection, setCollection] = useState(null)
  const [items, setItems] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // --------------------------------------------------
  // Create request state
  // --------------------------------------------------

  const [showCreateForm, setShowCreateForm] = useState(false)


  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  // --------------------------------------------------
  // Edit request state
  // --------------------------------------------------

  const [editingItem, setEditingItem] = useState(null)

  const [updating, setUpdating] = useState(false)
  const [editError, setEditError] = useState('')

  // --------------------------------------------------
  // Load collection
  // --------------------------------------------------

  useEffect(() => {
    async function loadCollection() {
      try {
        setLoading(true)
        setError('')

        const [collectionData, itemsData] =
          await Promise.all([
            getCollectionById(collectionId),
            getCollectionItems(collectionId),
          ])

        setCollection(collectionData)
        setItems(itemsData)
      } catch (error) {
        console.error(
          'Failed to load collection details'
        )

        setError(
          error.response?.data?.message ||
          'Failed to load collection'
        )
      } finally {
        setLoading(false)
      }
    }

    loadCollection()
  }, [collectionId])

  function createEmptyCollectionItemRequest() {
    return {
      name: '',
      method: 'GET',
      url: '',
      headers: [{ key: '', value: '' }],
      params: [{ key: '', value: '' }],
      body: '',
      authType: 'NONE',
      bearerToken: '',
      username: '',
      password: '',
      apiKey: '',
      apiKeyName: '',
    }
  }

  const [createRequest, setCreateRequest] = useState(createEmptyCollectionItemRequest())
  const [editRequest, setEditRequest] = useState(createEmptyCollectionItemRequest())


  // --------------------------------------------------
  // Reset create form
  // --------------------------------------------------
  function resetCreateForm() {
    setCreateRequest(
      createEmptyCollectionItemRequest()
    )

    setCreateError('')
  }

  // --------------------------------------------------
  // Open create form
  // --------------------------------------------------

  function handleAddRequest() {
    resetCreateForm()
    setShowCreateForm(true)
  }

  // --------------------------------------------------
  // Create collection item
  // --------------------------------------------------

  async function handleCreate(event) {
    event.preventDefault()

    setCreateError('')

    if (!createRequest.name.trim()) {
      setCreateError('Request name is required')
      return
    }

    if (!createRequest.url.trim()) {
      setCreateError('URL is required')
      return
    }

    const request = toCollectionItemRequest(
      createRequest
    )

    try {
      setCreating(true)

      const createdItem =
        await createCollectionItem(
          collectionId,
          request
        )

      setItems((currentItems) => [
        ...currentItems,
        createdItem,
      ])

      setShowCreateForm(false)

      resetCreateForm()
    } catch (error) {
      console.error(
        'Failed to create collection item:',
        error
      )

      setCreateError(
        error.response?.data?.message ||
        'Failed to create request'
      )
    } finally {
      setCreating(false)
    }
  }

  // --------------------------------------------------
  // Edit collection item
  // --------------------------------------------------

  function handleEdit(item) {
    setEditError('')

    setEditRequest({
      name: item.name || '',
      method: item.method || 'GET',
      url: item.url || '',
      headers: convertObjectToRows(
        item.headers
      ),
      params: convertObjectToRows(
        item.queryParams
      ),
      body: item.body || '',
      authType: item.authType || 'NONE',
      bearerToken: item.bearerToken || '',
      username: item.username || '',
      password: item.password || '',
      apiKey: item.apiKey || '',
      apiKeyName: item.apiKeyName || '',
    })

    setEditingItem(item)
  }

  // --------------------------------------------------
  // Update collection item
  // --------------------------------------------------

  async function handleUpdate(event) {
    event.preventDefault()

    setEditError('')

    if (!editRequest.name.trim()) {
      setEditError('Request name is required')
      return
    }

    if (!editRequest.url.trim()) {
      setEditError('URL is required')
      return
    }

    const request = toCollectionItemRequest(
      editRequest
    )

    try {
      setUpdating(true)

      const updatedItem =
        await updateCollectionItem(
          collectionId,
          editingItem.id,
          request
        )

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === updatedItem.id
            ? updatedItem
            : item
        )
      )

      setEditingItem(null)

      setEditRequest(
        createEmptyCollectionItemRequest()
      )
    } catch (error) {
      console.error(
        'Failed to update collection item:',
        error
      )

      setEditError(
        error.response?.data?.message ||
        'Failed to update request'
      )
    } finally {
      setUpdating(false)
    }
  }

  // --------------------------------------------------
  // Delete collection item
  // --------------------------------------------------

  async function handleDelete(itemId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this request?'
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteCollectionItem(
        collectionId,
        itemId
      )

      setItems((currentItems) =>
        currentItems.filter(
          (item) => item.id !== itemId
        )
      )
    } catch (error) {
      console.error(
        'Failed to delete collection item'
      )

      setError(
        error.response?.data?.message ||
        'Failed to delete request'
      )
    }
  }

  // --------------------------------------------------
  // Run collection item
  // --------------------------------------------------

  function handleRun(item) {
    navigate('/dashboard', {
      state: {
        collectionItem: item,
      },
    })
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="p-6">
          <p className="text-gray-600">
            Loading collection...
          </p>
        </main>
      </>
    )
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error && !collection) {
    return (
      <>
        <Navbar />

        <main className="p-6">
          <div className="rounded bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl p-6">

        {/* ------------------------------------------ */}
        {/* Collection Header */}
        {/* ------------------------------------------ */}

        <div className="mb-6 flex items-start justify-between">
          <div>
            <button
              type="button"
              onClick={() =>
                navigate('/collections')
              }
              className="mb-3 text-sm text-blue-600 hover:underline"
            >
              ← Back to Collections
            </button>

            <h2 className="text-2xl font-bold text-gray-800">
              {collection?.name}
            </h2>

            {collection?.description && (
              <p className="mt-1 text-gray-600">
                {collection.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddRequest}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + Add Request
          </button>
        </div>

        {/* ------------------------------------------ */}
        {/* General error */}
        {/* ------------------------------------------ */}

        {error && (
          <div className="mb-4 rounded bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* Saved Requests */}
        {/* ------------------------------------------ */}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Saved Requests
            </h3>

            <span className="text-sm text-gray-500">
              {items.length}{' '}
              {items.length === 1
                ? 'request'
                : 'requests'}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="mb-4 text-gray-500">
                No requests have been saved in this
                collection yet.
              </p>

              <button
                type="button"
                onClick={handleAddRequest}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                + Add Your First Request
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                         <MethodBadge method={item.method} />
                        </span>

                        <h4 className="font-semibold text-gray-800">
                          {item.name}
                        </h4>
                      </div>

                      <p className="truncate text-sm text-gray-600">
                        {item.url}
                      </p>

                      {item.authType && (
                        <p className="mt-1 text-xs text-gray-500">
                          Auth: {item.authType}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleRun(item)
                        }
                        className="rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                      >
                        Run
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(item)
                        }
                        className="rounded bg-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-300"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        className="rounded bg-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* ========================================== */}
      {/* CREATE REQUEST MODAL */}
      {/* ========================================== */}

      {showCreateForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
          <div className="mx-auto my-8 w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Add Request
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new request to{' '}
                  {collection?.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCreateForm(false)
                }
                disabled={creating}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <CollectionItemForm
              request={createRequest}
              setRequest={setCreateRequest}
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              submitting={creating}
              submitLabel="Create Request"
              error={createError}
            />

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* EDIT REQUEST MODAL */}
      {/* ========================================== */}

      {editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
          <div className="mx-auto my-8 w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Edit Saved Request
              </h3>

              <button
                type="button"
                onClick={() =>
                  setEditingItem(null)
                }
                disabled={updating}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <CollectionItemForm
              request={editRequest}
              setRequest={setEditRequest}
              onSubmit={handleUpdate}
              onCancel={() => setEditingItem(null)}
              submitting={updating}
              submitLabel="Save Changes"
              error={editError}
            />

          </div>
        </div>
      )}
    </>
  )
}

export default CollectionDetails
