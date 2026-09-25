function ParamsEditor({
  params,
  addParam,
  updateParam,
  removeParam,
}) {
  return (
    <div className="mt-4">
      {params.length === 0 && (
        <p className="text-sm text-gray-500">
          No query parameters added.
        </p>
      )}

      {params.map((param, index) => (
        <div
          key={index}
          className="mb-3 flex gap-3"
        >
          <input
            type="text"
            value={param.key}
            onChange={(event) =>
              updateParam(
                index,
                'key',
                event.target.value
              )
            }
            placeholder="Key"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          <input
            type="text"
            value={param.value}
            onChange={(event) =>
              updateParam(
                index,
                'value',
                event.target.value
              )
            }
            placeholder="Value"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          <button
            onClick={() => removeParam(index)}
            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addParam}
        className="mt-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        + Add Parameter
      </button>
    </div>
  )
}

export default ParamsEditor