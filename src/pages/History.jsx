import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  getHistory,
  deleteHistory,
} from '../services/historyService'
import MethodBadge from '../components/MethodBadge'

function History() {
  const navigate = useNavigate()

  const [history, setHistory] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const pageSize = 10

  useEffect(() => {
    loadHistory()
  }, [page])

  async function loadHistory() {
    setLoading(true)
    setError('')

    try {
      const data = await getHistory(page, pageSize)

      setHistory(data.content || [])
      setTotalPages(data.totalPages || 0)
    } catch (error) {
      console.error('Failed to load history')
      setError('Failed to load API history')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this history item?'
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteHistory(id)

      setHistory((currentHistory) =>
        currentHistory.filter((item) => item.id !== id)
      )
    } catch (error) {
      console.error('Failed to delete history')
      setError('Failed to delete history item')
    }
  }

  function getStatusClass(statusCode) {
    if (statusCode >= 200 && statusCode < 300) {
      return 'bg-green-100 text-green-700'
    }

    if (statusCode >= 400) {
      return 'bg-red-100 text-red-700'
    }

    return 'bg-yellow-100 text-yellow-700'
  }

  function matchesStatusFilter(statusCode) {
    if (statusFilter === 'ALL') {
      return true
    }

    if (statusFilter === 'SUCCESS') {
      return statusCode >= 200 && statusCode < 300
    }

    if (statusFilter === 'CLIENT_ERROR') {
      return statusCode >= 400 && statusCode < 500
    }

    if (statusFilter === 'SERVER_ERROR') {
      return statusCode >= 500
    }

    return true
  }

  const filteredHistory = history.filter((item) => {
    const searchText = search.trim().toLowerCase()

    const matchesSearch =
      !searchText ||
      item.url?.toLowerCase().includes(searchText)

    const matchesMethod =
      methodFilter === 'ALL' ||
      item.method === methodFilter

    const matchesStatus = matchesStatusFilter(
      item.statusCode
    )

    return (
      matchesSearch &&
      matchesMethod &&
      matchesStatus
    )
  })

  function clearFilters() {
    setSearch('')
    setMethodFilter('ALL')
    setStatusFilter('ALL')
  }

  const hasActiveFilters =
    search.trim() !== '' ||
    methodFilter !== 'ALL' ||
    statusFilter !== 'ALL'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl p-8">

        {/* Heading */}

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            API History
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage your previously executed API requests.
          </p>
        </div>

        {/* Filters */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row">

            {/* Search */}

            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Search URL
              </label>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by URL..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Method */}

            <div className="w-full md:w-40">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Method
              </label>

              <select
                value={methodFilter}
                onChange={(event) =>
                  setMethodFilter(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="ALL">All Methods</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>

            {/* Status */}

            <div className="w-full md:w-44">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="ALL">All Status</option>
                <option value="SUCCESS">2xx Success</option>
                <option value="CLIENT_ERROR">4xx Error</option>
                <option value="SERVER_ERROR">5xx Error</option>
              </select>
            </div>

          </div>

          {/* Filter summary */}

          <div className="mt-4 flex items-center justify-between">

            <p className="text-sm text-gray-500">
              {hasActiveFilters
                ? `${filteredHistory.length} result${
                    filteredHistory.length === 1
                      ? ''
                      : 's'
                  } found`
                : `${history.length} request${
                    history.length === 1
                      ? ''
                      : 's'
                  } on this page`}
            </p>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}

          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}

        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading history...
            </p>
          </div>
        )}

        {/* No history */}

        {!loading && history.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              No API history found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Execute an API request and it will appear here.
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Create Request
            </button>
          </div>
        )}

        {/* No filtered results */}

        {!loading &&
          history.length > 0 &&
          filteredHistory.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">
                No matching requests
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-5 rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Clear filters
              </button>
            </div>
          )}

        {/* History List */}

        {!loading && filteredHistory.length > 0 && (
          <div className="space-y-4">

            {filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  navigate(`/history/${item.id}`)
                }
                className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >

                {/* Top row */}

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-3">

                      {/* Method */}

                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-bold`}
                      >
                                                 <MethodBadge method={item.method} />

                      </span>

                      {/* URL */}

                      <p
                        className="truncate text-sm font-medium text-gray-800"
                        title={item.url}
                      >
                        {item.url}
                      </p>

                    </div>

                  </div>

                  {/* Delete */}

                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      handleDelete(item.id)
                    }}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>

                </div>

                {/* Metadata */}

                <div className="mt-4 flex flex-wrap items-center gap-3">

                  {/* Status */}

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      Status
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                        item.statusCode
                      )}`}
                    >
                      {item.statusCode}
                    </span>
                  </div>

                  {/* Response Time */}

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      Time
                    </span>

                    <span className="text-xs text-gray-700">
                      {item.responseTime} ms
                    </span>
                  </div>

                  {/* Response Size */}

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      Size
                    </span>

                    <span className="text-xs text-gray-700">
                      {item.responseSize} bytes
                    </span>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

        {/* Pagination */}

        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">

            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {page + 1} of {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>
        )}

      </main>
    </div>
  )
}

export default History
