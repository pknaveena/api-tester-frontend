import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import EnvironmentForm from '../components/EnvironmentForm'
import {
  getEnvironments,
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
} from '../services/environmentService'

function Environments() {
  const [environments, setEnvironments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingEnvironment, setEditingEnvironment] =
    useState(null)

  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    loadEnvironments()
  }, [])

  async function loadEnvironments() {
    try {
      setLoading(true)
      setError('')

      const response = await getEnvironments()

      setEnvironments(response.content || [])
    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.message ||
          'Failed to load environments.'
      )
    } finally {
      setLoading(false)
    }
  }

  function handleCreateClick() {
    setEditingEnvironment(null)
    setFormError('')
    setShowForm(true)
  }

  function handleEditClick(environment) {
    setEditingEnvironment(environment)
    setFormError('')
    setShowForm(true)
  }

  function handleCancel() {
    if (submitting) {
      return
    }

    setShowForm(false)
    setEditingEnvironment(null)
    setFormError('')
  }

  async function handleSubmit(data) {
    try {
      setSubmitting(true)
      setFormError('')

      let savedEnvironment

      if (editingEnvironment) {
        savedEnvironment = await updateEnvironment(
          editingEnvironment.id,
          data.name,
          data.variables
        )

        setEnvironments((currentEnvironments) =>
          currentEnvironments.map((environment) =>
            environment.id === savedEnvironment.id
              ? savedEnvironment
              : environment
          )
        )
      } else {
        savedEnvironment = await createEnvironment(
          data.name,
          data.variables
        )

        setEnvironments((currentEnvironments) => [
          savedEnvironment,
          ...currentEnvironments,
        ])
      }

      setShowForm(false)
      setEditingEnvironment(null)
    } catch (error) {
      console.error(error)

      setFormError(
        error.response?.data?.message ||
          'Failed to save environment.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(environment) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${environment.name}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteEnvironment(environment.id)

      setEnvironments((currentEnvironments) =>
        currentEnvironments.filter(
          (item) => item.id !== environment.id
        )
      )
    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.message ||
          'Failed to delete environment.'
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Environments
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage variables used by your API requests.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateClick}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            + New Environment
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow">
            <h3 className="mb-6 text-xl font-semibold text-gray-800">
              {editingEnvironment
                ? 'Edit Environment'
                : 'Create Environment'}
            </h3>

            <EnvironmentForm
              environment={editingEnvironment}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitting={submitting}
              error={formError}
            />
          </div>
        )}

        {loading ? (
          <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow">
            Loading environments...
          </div>
        ) : environments.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="text-gray-500">
              No environments found.
            </p>

            <button
              type="button"
              onClick={handleCreateClick}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create your first environment
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {environments.map((environment) => (
              <div
                key={environment.id}
                className="rounded-lg bg-white p-6 shadow"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {environment.name}
                  </h3>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleEditClick(environment)
                      }
                      className="rounded bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(environment)
                      }
                      className="rounded bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded border border-gray-200">
                  <div className="grid grid-cols-2 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase text-gray-500">
                    <span>Variable</span>
                    <span>Value</span>
                  </div>

                  <div>
                    {Object.entries(
                      environment.variables || {}
                    ).map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-2 border-t border-gray-200 px-4 py-3 text-sm"
                      >
                        <span className="break-all font-medium text-gray-700">
                          {key}
                        </span>

                        <span className="break-all text-gray-600">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Environments
