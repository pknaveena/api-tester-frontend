function ResponseViewer({
  response,
  responseTab,
  setResponseTab,
  error,
}) {

  function getStatusClass(statusCode) {
    if (statusCode >= 200 && statusCode < 300) {
      return 'bg-green-100 text-green-700'
    }

    if (statusCode >= 400) {
      return 'bg-red-100 text-red-700'
    }

    return 'bg-yellow-100 text-yellow-700'
  }
  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Response
      </h2>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-medium">
            Request Error
          </p>

          <p className="mt-1">
            {error}
          </p>
        </div>
      )}

      {response && (
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-6 border-b border-gray-200 pb-4 md:grid-cols-3">

  <div className="text-center">
    <p className="text-xs uppercase tracking-wide text-gray-500">
      Status
    </p>

    <p
      className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusClass(response.statusCode)}`}
    >
      {response.statusText}
    </p>
  </div>

  <div className="text-center">
    <p className="text-xs uppercase tracking-wide text-gray-500">
      Response Time
    </p>

    <p className="mt-1 font-semibold text-gray-900">
      {response.responseTime} ms
    </p>
  </div>

  <div className="text-center">
    <p className="text-xs uppercase tracking-wide text-gray-500">
      Response Size
    </p>

    <p className="mt-1 font-semibold text-gray-900">
      {response.responseSize} bytes
    </p>
  </div>

</div>

          <div className="mt-4 border-b border-gray-200">
            <button
              onClick={() => setResponseTab('body')}
              className={
                responseTab === 'body'
                  ? 'border-b-2 border-blue-600 px-5 py-3 text-sm font-semibold text-blue-600'
                  : 'px-5 py-3 text-sm font-medium text-gray-500 hover:text-gray-700'
              }
            >
              Body
            </button>

            <button
              onClick={() => setResponseTab('headers')}
              className={
                responseTab === 'headers'
                  ? 'border-b-2 border-blue-600 px-5 py-3 text-sm font-semibold text-blue-600'
                  : 'px-5 py-3 text-sm font-medium text-gray-500 hover:text-gray-700'
              }
            >
              Headers
            </button>
          </div>

          {responseTab === 'body' && (
            <pre className="mt-4 max-h-96 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm leading-6 text-gray-800">
              {response.body}
            </pre>
          )}

          {responseTab === 'headers' && (
            <pre className="mt-4 max-h-96 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm leading-6 text-gray-800">
              {JSON.stringify(response.headers, null, 2)}
            </pre>
          )}
        </div>
      )}

      {!response && !error && (
        <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="font-medium text-gray-700">
            No response yet
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Send a request to see the response here.
          </p>
        </div>
      )}
    </div>
  )
}

export default ResponseViewer