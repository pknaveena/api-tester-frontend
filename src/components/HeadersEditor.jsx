function HeadersEditor({
  headers,
  addHeader,
  updateHeader,
  removeHeader,
}) {
  return (
    <div className="mt-4">
      {headers.length === 0 && (
        <p className="text-sm text-gray-500">
          No headers added.
        </p>
      )}

      {headers.map((header, index) => (
        <div
          key={index}
          className="mb-3 flex gap-3"
        >
          <input
            type="text"
            value={header.key}
            onChange={(event) =>
              updateHeader(
                index,
                'key',
                event.target.value
              )
            }
            placeholder="Header name"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          <input
            type="text"
            value={header.value}
            onChange={(event) =>
              updateHeader(
                index,
                'value',
                event.target.value
              )
            }
            placeholder="Header value"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          <button
            onClick={() => removeHeader(index)}
            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addHeader}
        className="mt-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        + Add Header
      </button>
    </div>
  )
}

export default HeadersEditor