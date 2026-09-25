import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  getCollections,
  createCollection,
} from '../services/collectionService'

function Collections() {
  const navigate = useNavigate()

  const [collections, setCollections] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [collectionName, setCollectionName] = useState('')
  const [collectionDescription, setCollectionDescription] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadCollections()
  }, [])

  async function loadCollections() {
    setLoading(true)
    setError('')

    try {
      const data = await getCollections()

      setCollections(data || [])
    } catch (error) {
      console.error('Failed to load collections')
      setError('Failed to load collections')
    } finally {
      setLoading(false)
    }
  }

  function openCreateForm() {
    setCollectionName('')
    setCollectionDescription('')
    setError('')
    setShowCreateForm(true)
  }

  function closeCreateForm() {
    if (creating) {
      return
    }

    setShowCreateForm(false)
    setCollectionName('')
    setCollectionDescription('')
  }

  async function handleCreateCollection(event) {
    event.preventDefault()

    setError('')

    const name = collectionName.trim()
    const description = collectionDescription.trim()

    if (!name) {
      setError('Collection name is required')
      return
    }

    if (!description) {
      setError('Collection description is required')
      return
    }

    setCreating(true)

    try {
      await createCollection(name, description)

      setShowCreateForm(false)
      setCollectionName('')
      setCollectionDescription('')

      await loadCollections()
    } catch (error) {
      console.error('Failed to create collection')
      setError('Failed to create collection')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl p-8">

        {/* Heading */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Collections
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Organize and manage your saved API requests.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + New Collection
          </button>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Create Collection Form */}

        {showCreateForm && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                Create Collection
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Give your collection a name and description.
              </p>
            </div>

            <form onSubmit={handleCreateCollection}>

              {/* Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Collection Name
                </label>

                <input
                  type="text"
                  value={collectionName}
                  onChange={(event) =>
                    setCollectionName(event.target.value)
                  }
                  placeholder="e.g. Api History APIs"
                  autoFocus
                  disabled={creating}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />
              </div>

              {/* Description */}

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  value={collectionDescription}
                  onChange={(event) =>
                    setCollectionDescription(event.target.value)
                  }
                  placeholder="e.g. APIs related to history"
                  rows={3}
                  disabled={creating}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />
              </div>

              {/* Buttons */}

              <div className="mt-5 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeCreateForm}
                  disabled={creating}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    creating ||
                    !collectionName.trim() ||
                    !collectionDescription.trim()
                  }
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? 'Creating...'
                    : 'Create Collection'}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* Loading */}

        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading collections...
            </p>
          </div>
        )}

        {/* Empty */}

        {!loading && collections.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">

            <h2 className="text-lg font-semibold text-gray-800">
              No collections found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create a collection to organize your API requests.
            </p>

            <button
              onClick={openCreateForm}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Create Collection
            </button>

          </div>
        )}

        {/* Collection List */}

        {!loading && collections.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {collections.map((collection) => (
              <div
                key={collection.id}
                onClick={() =>
                  navigate(`/collections/${collection.id}`)
                }
                className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <h2 className="truncate text-lg font-semibold text-gray-800">
                      {collection.name}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {collection.description}
                    </p>

                  </div>

                  <span className="shrink-0 rounded-lg bg-blue-50 px-3 py-2 text-blue-600">
                    📁
                  </span>

                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <span className="text-sm font-medium text-blue-600">
                    Open Collection →
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  )
}

export default Collections
