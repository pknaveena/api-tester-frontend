function EnvironmentSelector({
  environments,
  environmentId,
  setEnvironmentId,
}) {
  return (
    <div className="mb-5 w-full">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Environment
      </label>

      <div className="w-full">
        <select
          value={environmentId}
          onChange={(event) =>
            setEnvironmentId(
              event.target.value
                ? Number(event.target.value)
                : ''
            )
          }
          className="block w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="">No Environment</option>

          {environments.map((environment) => (
            <option
              key={environment.id}
              value={environment.id}
            >
              {environment.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default EnvironmentSelector