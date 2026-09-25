import { useEffect, useState } from 'react'

function EnvironmentForm({
  environment,
  onSubmit,
  onCancel,
  submitting,
  error,
}) {
  const [name, setName] = useState('')
  const [variables, setVariables] = useState([
    { key: '', value: '' },
  ])

  useEffect(() => {
    if (environment) {
      setName(environment.name || '')

      const existingVariables = Object.entries(
        environment.variables || {}
      ).map(([key, value]) => ({
        key,
        value,
      }))

      setVariables(
        existingVariables.length > 0
          ? existingVariables
          : [{ key: '', value: '' }]
      )
    } else {
      setName('')
      setVariables([{ key: '', value: '' }])
    }
  }, [environment])

  function handleVariableChange(index, field, value) {
    setVariables((currentVariables) =>
      currentVariables.map((variable, variableIndex) =>
        variableIndex === index
          ? {
              ...variable,
              [field]: value,
            }
          : variable
      )
    )
  }

  function addVariable() {
    setVariables((currentVariables) => [
      ...currentVariables,
      {
        key: '',
        value: '',
      },
    ])
  }

  function removeVariable(index) {
    setVariables((currentVariables) => {
      const updatedVariables = currentVariables.filter(
        (_, variableIndex) => variableIndex !== index
      )

      return updatedVariables.length > 0
        ? updatedVariables
        : [{ key: '', value: '' }]
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedName = name.trim()

    const validVariables = variables.filter(
      (variable) => variable.key.trim()
    )

    if (!trimmedName) {
      return
    }

    if (validVariables.length === 0) {
      return
    }

    const variablesObject = validVariables.reduce(
      (result, variable) => {
        result[variable.key.trim()] =
          variable.value

        return result
      },
      {}
    )

    onSubmit({
      name: trimmedName,
      variables: variablesObject,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="environment-name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Environment Name
        </label>

        <input
          id="environment-name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Development"
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          disabled={submitting}
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Variables
            </h3>

            <p className="text-xs text-gray-500">
              Add key-value pairs for this environment.
            </p>
          </div>

          <button
            type="button"
            onClick={addVariable}
            disabled={submitting}
            className="rounded bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Add Variable
          </button>
        </div>

        <div className="space-y-3">
          {variables.map((variable, index) => (
            <div
              key={index}
              className="flex gap-3"
            >
              <input
                type="text"
                value={variable.key}
                onChange={(event) =>
                  handleVariableChange(
                    index,
                    'key',
                    event.target.value
                  )
                }
                placeholder="Variable name"
                className="flex-1 rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                disabled={submitting}
              />

              <input
                type="text"
                value={variable.value}
                onChange={(event) =>
                  handleVariableChange(
                    index,
                    'value',
                    event.target.value
                  )
                }
                placeholder="Variable value"
                className="flex-1 rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                disabled={submitting}
              />

              <button
                type="button"
                onClick={() => removeVariable(index)}
                disabled={
                  submitting || variables.length === 1
                }
                className="rounded bg-red-100 px-3 py-2 text-red-700 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? 'Saving...'
            : environment
              ? 'Update Environment'
              : 'Create Environment'}
        </button>
      </div>
    </form>
  )
}

export default EnvironmentForm
