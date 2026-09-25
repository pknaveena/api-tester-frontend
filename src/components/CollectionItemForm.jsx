function CollectionItemForm({
  request,
  setRequest,
  onSubmit,
  onCancel,
  submitting,
  submitLabel = 'Save',
  error,
}) {
  function updateField(field, value) {
    setRequest((currentRequest) => ({
      ...currentRequest,
      [field]: value,
    }))
  }

  function updateRow(field, index, rowField, value) {
    setRequest((currentRequest) => {
      const updatedRows = [...currentRequest[field]]

      updatedRows[index] = {
        ...updatedRows[index],
        [rowField]: value,
      }

      return {
        ...currentRequest,
        [field]: updatedRows,
      }
    })
  }

  function addRow(field) {
    setRequest((currentRequest) => ({
      ...currentRequest,
      [field]: [
        ...currentRequest[field],
        {
          key: '',
          value: '',
        },
      ],
    }))
  }

  function removeRow(field, index) {
    setRequest((currentRequest) => {
      if (currentRequest[field].length === 1) {
        return {
          ...currentRequest,
          [field]: [
            {
              key: '',
              value: '',
            },
          ],
        }
      }

      return {
        ...currentRequest,
        [field]: currentRequest[field].filter(
          (_, rowIndex) => rowIndex !== index
        ),
      }
    })
  }

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div className="mb-4 rounded bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Request Name */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Request Name
        </label>

        <input
          type="text"
          value={request.name}
          onChange={(event) =>
            updateField('name', event.target.value)
          }
          placeholder="Get Users"
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />
      </div>

      {/* Method */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Method
        </label>

        <select
          value={request.method}
          onChange={(event) =>
            updateField('method', event.target.value)
          }
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>

      {/* URL */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          URL
        </label>

        <input
          type="text"
          value={request.url}
          onChange={(event) =>
            updateField('url', event.target.value)
          }
          placeholder="https://example.com/api/users"
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />
      </div>

      {/* Headers */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Headers
          </label>

          <button
            type="button"
            onClick={() => addRow('headers')}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Header
          </button>
        </div>

        <div className="space-y-2">
          {request.headers.map((header, index) => (
            <div
              key={index}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Key"
                value={header.key}
                onChange={(event) =>
                  updateRow(
                    'headers',
                    index,
                    'key',
                    event.target.value
                  )
                }
                className="flex-1 rounded border border-gray-300 px-3 py-2"
              />

              <input
                type="text"
                placeholder="Value"
                value={header.value}
                onChange={(event) =>
                  updateRow(
                    'headers',
                    index,
                    'value',
                    event.target.value
                  )
                }
                className="flex-1 rounded border border-gray-300 px-3 py-2"
              />

              <button
                type="button"
                onClick={() =>
                  removeRow('headers', index)
                }
                className="rounded bg-red-100 px-3 text-red-600 hover:bg-red-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Query Parameters */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Query Parameters
          </label>

          <button
            type="button"
            onClick={() => addRow('params')}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Parameter
          </button>
        </div>

        <div className="space-y-2">
          {request.params.map((param, index) => (
            <div
              key={index}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Key"
                value={param.key}
                onChange={(event) =>
                  updateRow(
                    'params',
                    index,
                    'key',
                    event.target.value
                  )
                }
                className="flex-1 rounded border border-gray-300 px-3 py-2"
              />

              <input
                type="text"
                placeholder="Value"
                value={param.value}
                onChange={(event) =>
                  updateRow(
                    'params',
                    index,
                    'value',
                    event.target.value
                  )
                }
                className="flex-1 rounded border border-gray-300 px-3 py-2"
              />

              <button
                type="button"
                onClick={() =>
                  removeRow('params', index)
                }
                className="rounded bg-red-100 px-3 text-red-600 hover:bg-red-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Body
        </label>

        <textarea
          value={request.body}
          onChange={(event) =>
            updateField('body', event.target.value)
          }
          rows={8}
          placeholder='{"name":"John"}'
          className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm outline-none focus:border-blue-500"
        />
      </div>

      {/* Authentication */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Authentication
        </label>

        <select
          value={request.authType}
          onChange={(event) =>
            updateField('authType', event.target.value)
          }
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="NONE">No Auth</option>
          <option value="BEARER_TOKEN">
            Bearer Token
          </option>
          <option value="BASIC_AUTH">
            Basic Auth
          </option>
          <option value="API_KEY">
            API Key
          </option>
        </select>
      </div>

      {/* Bearer Token */}
      {request.authType === 'BEARER_TOKEN' && (
        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Bearer Token
          </label>

          <input
            type="password"
            value={request.bearerToken}
            onChange={(event) =>
              updateField(
                'bearerToken',
                event.target.value
              )
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      )}

      {/* Basic Auth */}
      {request.authType === 'BASIC_AUTH' && (
        <>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              type="text"
              value={request.username}
              onChange={(event) =>
                updateField(
                  'username',
                  event.target.value
                )
              }
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={request.password}
              onChange={(event) =>
                updateField(
                  'password',
                  event.target.value
                )
              }
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </>
      )}

      {/* API Key */}
      {request.authType === 'API_KEY' && (
        <>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              API Key Name
            </label>

            <input
              type="text"
              value={request.apiKeyName}
              onChange={(event) =>
                updateField(
                  'apiKeyName',
                  event.target.value
                )
              }
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              API Key
            </label>

            <input
              type="password"
              value={request.apiKey}
              onChange={(event) =>
                updateField(
                  'apiKey',
                  event.target.value
                )
              }
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
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
            : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default CollectionItemForm