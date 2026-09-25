function BodyEditor({ body, setBody }) {
  return (
    <div className="mt-4">
      <div className="mb-2">
        <span className="text-sm font-medium text-gray-700">
          JSON
        </span>
        <p className="mt-1 text-xs text-gray-500">
          Enter a JSON request body. Environment variables such as {'{{userId}}'} are supported.
        </p>
      </div>

      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder={`{
  "name": "Naveen",
  "email": "naveen@example.com"
}`}
        rows="12"
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 font-mono text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </div>
  )
}

export default BodyEditor