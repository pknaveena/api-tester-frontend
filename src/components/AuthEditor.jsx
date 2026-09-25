function AuthEditor({
  authType,
  setAuthType,
  bearerToken,
  setBearerToken,
  username,
  setUsername,
  password,
  setPassword,
  apiKey,
  setApiKey,
  apiKeyName,
  setApiKeyName,
}) {
  return (
    <div className="mt-4">
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Authentication
        </label>
        <p className="mb-3 text-xs text-gray-500">
          Choose how authentication should be sent with this request.
        </p>

        <select
          value={authType}
          onChange={(event) => setAuthType(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="NONE">No Auth</option>
          <option value="BEARER_TOKEN">Bearer Token</option>
          <option value="BASIC_AUTH">Basic Auth</option>
          <option value="API_KEY">API Key</option>
        </select>
      </div>

      {authType === 'BEARER_TOKEN' && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Token
          </label>

          <input
            type="password"
            value={bearerToken}
            onChange={(event) =>
              setBearerToken(event.target.value)
            }
            placeholder="Enter bearer token"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            
          />
        </div>
      )}

      {authType === 'BASIC_AUTH' && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Username"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      )}

      {authType === 'API_KEY' && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Key Name
            </label>

            <input
              type="text"
              value={apiKeyName}
              onChange={(event) =>
                setApiKeyName(event.target.value)
              }
              placeholder="X-API-Key"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              API Key
            </label>

            <input
              type="password"
              value={apiKey}
              onChange={(event) =>
                setApiKey(event.target.value)
              }
              placeholder="Enter API key"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AuthEditor