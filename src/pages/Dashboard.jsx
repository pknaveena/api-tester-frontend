import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { executeRequest } from '../services/apiExecutionService'
import { getEnvironments } from '../services/environmentService'
import { getCollections, createCollectionItem } from '../services/collectionService'
import EnvironmentSelector from '../components/EnvironmentSelector'
import ParamsEditor from '../components/ParamsEditor'
import HeadersEditor from '../components/HeadersEditor'
import BodyEditor from '../components/BodyEditor'
import AuthEditor from '../components/AuthEditor'
import ResponseViewer from '../components/ResponseViewer'
import {
  convertObjectToRows,
  toCollectionItemRequest,
} from '../utils/collectionItemUtils'
import CollectionItemForm from '../components/CollectionItemForm'

function Dashboard() {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [params, setParams] = useState([])
  const [headers, setHeaders] = useState([])
  const [body, setBody] = useState('')
  const [authType, setAuthType] = useState('NONE')
  const [bearerToken, setBearerToken] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiKeyName, setApiKeyName] = useState('')
  const [environments, setEnvironments] = useState([])
  const [environmentId, setEnvironmentId] = useState('')
  const [activeTab, setActiveTab] = useState('params')
  const [response, setResponse] = useState(null)
  const [responseTab, setResponseTab] = useState('body')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fromCollection, setFromCollection] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const history = location.state?.history
  const collectionItem = location.state?.collectionItem

  // Add Save-to-Collection state
  const [saveRequest, setSaveRequest] = useState({
    name: '',
    method: 'GET',
    url: '',
    headers: [{ key: '', value: '' }],
    params: [{ key: '', value: '' }],
    body: '',
    authType: 'NONE',
    bearerToken: '',
    username: '',
    password: '',
    apiKey: '',
    apiKeyName: '',
  })
  const [showSaveCollection, setShowSaveCollection] = useState(false)
  const [collections, setCollections] = useState([])
  const [selectedCollectionId, setSelectedCollectionId] = useState('')
  const [savingToCollection, setSavingToCollection] = useState(false)
  const [saveCollectionError, setSaveCollectionError] = useState('')

  // Open the modal
  function handleOpenSaveCollection() {
    setSaveCollectionError('')
    setSelectedCollectionId('')

    setSaveRequest({
      name: '',
      method,
      url,
      headers:
        headers.length > 0
          ? headers.map((header) => ({ ...header }))
          : [{ key: '', value: '' }],
      params:
        params.length > 0
          ? params.map((param) => ({ ...param }))
          : [{ key: '', value: '' }],
      body,
      authType,
      bearerToken,
      username,
      password,
      apiKey,
      apiKeyName,
    })

    setShowSaveCollection(true)
  }

  useEffect(() => {
    async function loadCollections() {
      try {
        const data = await getCollections()
        setCollections(data)
      } catch (error) {
        console.error(
          'Failed to load collections'
        )
      }
    }

    loadCollections()
  }, [])

  function parseHeaders(headers) {
    if (!headers) {
      return [{ key: '', value: '' }]
    }

    try {
      const parsed = JSON.parse(headers)

      return Object.entries(parsed).map(([key, value]) => ({
        key,
        value: Array.isArray(value)
          ? value.join(', ')
          : String(value),
      }))
    } catch {
      return [{ key: '', value: '' }]
    }
  }

  function parseQueryParams(url) {
    if (!url) {
      return [{ key: '', value: '' }]
    }

    try {
      const parsedUrl = new URL(url)

      const params = Array.from(parsedUrl.searchParams.entries())

      if (params.length === 0) {
        return [{ key: '', value: '' }]
      }

      return params.map(([key, value]) => ({
        key,
        value,
      }))
    } catch {
      return [{ key: '', value: '' }]
    }
  }

  function getBaseUrl(url) {
    if (!url) {
      return ''
    }

    try {
      const parsedUrl = new URL(url)

      return `${parsedUrl.origin}${parsedUrl.pathname}`
    } catch {
      return url
    }
  }
  useEffect(() => {
    async function loadEnvironments() {
      try {
        const data = await getEnvironments()
        setEnvironments(data.content)
      } catch (error) {
        console.error('Failed to load environments')
      }
    }

    loadEnvironments()
  }, [])

  useEffect(() => {
    if (!history) {
      return
    }

    setFromCollection(false);

    setMethod(history.method || 'GET')
    setUrl(getBaseUrl(history.url))
    setParams(parseQueryParams(history.url))
    setHeaders(parseHeaders(history.requestHeaders))
    setBody(history.requestBody || '')

    setAuthType('NONE')
    setBearerToken('')
    setUsername('')
    setPassword('')
    setApiKey('')
    setApiKeyName('')
    setEnvironmentId('')

    setResponse(null)
    setError('')

    navigate('/dashboard', {
      replace: true,
      state: null,
    })
  }, [history, navigate])

  useEffect(() => {
    if (!collectionItem) {
      return
    }

    setFromCollection(true)

    setMethod(collectionItem.method || 'GET')

    setUrl(collectionItem.url || '')

    setParams(
      convertObjectToRows(
        collectionItem.queryParams
      )
    )

    setHeaders(
      convertObjectToRows(
        collectionItem.headers
      )
    )

    setBody(collectionItem.body || '')

    setAuthType(
      collectionItem.authType || 'NONE'
    )

    setBearerToken(
      collectionItem.bearerToken || ''
    )

    setUsername(
      collectionItem.username || ''
    )

    setPassword(
      collectionItem.password || ''
    )

    setApiKey(
      collectionItem.apiKey || ''
    )

    setApiKeyName(
      collectionItem.apiKeyName || ''
    )

    setResponse(null)
    setError('')

    navigate('/dashboard', {
      replace: true,
      state: null,
    })
  }, [collectionItem, navigate])


  function addParam() {
    setParams([
      ...params,
      {
        key: '',
        value: '',
      },
    ])
  }

  function updateParam(index, field, value) {
    const updatedParams = [...params]

    updatedParams[index][field] = value

    setParams(updatedParams)
  }

  function removeParam(index) {
    const updatedParams = params.filter(
      (_, paramIndex) => paramIndex !== index
    )

    setParams(updatedParams)
  }

  function addHeader() {
    setHeaders([
      ...headers,
      {
        key: '',
        value: '',
      },
    ])
  }

  function updateHeader(index, field, value) {
    const updatedHeaders = [...headers]

    updatedHeaders[index][field] = value

    setHeaders(updatedHeaders)
  }

  function removeHeader(index) {
    const updatedHeaders = headers.filter(
      (_, headerIndex) => headerIndex !== index
    )

    setHeaders(updatedHeaders)
  }

  async function handleSend() {
    setError('')
    setResponse(null)

    if (!url.trim()) {
      setError('URL is required')
      return
    }

    const hasEnvironmentVariable = /\{\{[^{}]+\}\}/.test(url)

    if (!hasEnvironmentVariable) {
      try {
        const parsedUrl = new URL(url)

        if (
          parsedUrl.protocol !== 'http:' &&
          parsedUrl.protocol !== 'https:'
        ) {
          setError('Only HTTP and HTTPS URLs are allowed')
          return
        }
      } catch {
        setError('Please enter a valid URL')
        return
      }
    }

    if (body.trim()) {
      try {
        JSON.parse(body)
      } catch {
        setError('Request body must contain valid JSON')
        return
      }
    }

    if (authType === 'BEARER_TOKEN' && !bearerToken.trim()) {
      setError('Bearer token is required')
      return
    }

    if (authType === 'BASIC_AUTH') {
      if (!username.trim()) {
        setError('Username is required')
        return
      }

      if (!password.trim()) {
        setError('Password is required')
        return
      }
    }

    if (authType === 'API_KEY') {
      if (!apiKeyName.trim()) {
        setError('API key name is required')
        return
      }

      if (!apiKey.trim()) {
        setError('API key is required')
        return
      }
    }

    setLoading(true)


    try {
      const queryParams = {}

      params.forEach((param) => {
        if (param.key.trim()) {
          queryParams[param.key.trim()] = param.value
        }
      })

      const requestHeaders = {}

      headers.forEach((header) => {
        if (header.key.trim()) {
          requestHeaders[header.key.trim()] = header.value
        }
      })

      const data = await executeRequest({
        method,
        url,
        queryParams,
        headers: requestHeaders,
        body,
        environmentId,
        authType,
        bearerToken,
        username,
        password,
        apiKey,
        apiKeyName,
      })

      setResponse(data)
    } catch (error) {
      setError('Failed to execute request')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }


  async function handleSaveToCollection(event) {
    event.preventDefault()

    setSaveCollectionError('')

    if (!selectedCollectionId) {
      setSaveCollectionError(
        'Please select a collection'
      )
      return
    }

    if (!saveRequest.name.trim()) {
      setSaveCollectionError(
        'Request name is required'
      )
      return
    }

    if (!saveRequest.url.trim()) {
      setSaveCollectionError(
        'URL is required'
      )
      return
    }

    const request = toCollectionItemRequest(
      saveRequest
    )

    try {
      setSavingToCollection(true)

      await createCollectionItem(
        Number(selectedCollectionId),
        request
      )

      setShowSaveCollection(false)

      setSaveRequest({
        name: '',
        method: 'GET',
        url: '',
        headers: [
          {
            key: '',
            value: '',
          },
        ],
        params: [
          {
            key: '',
            value: '',
          },
        ],
        body: '',
        authType: 'NONE',
        bearerToken: '',
        username: '',
        password: '',
        apiKey: '',
        apiKeyName: '',
      })

      setSelectedCollectionId('')
    } catch (error) {
      console.error(
        'Failed to save request to collection:',
        error
      )

      setSaveCollectionError(
        error.response?.data?.message ||
        'Failed to save request to collection'
      )
    } finally {
      setSavingToCollection(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl p-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            API Request Builder
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Build and test HTTP requests
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          {/* Environment */}
          <EnvironmentSelector
            environments={environments}
            environmentId={environmentId}
            setEnvironmentId={setEnvironmentId}
          />


          {/* Method, URL and Send */}

          <div className="flex gap-3">
            <select
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>

            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/api/users or {{baseUrl}}/users"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />

            {!fromCollection && (
              <button
                type="button"
                onClick={handleOpenSaveCollection}
                disabled={!url.trim()}
                className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save to Collection
              </button>
            )}

            <button
              onClick={handleSend}
              disabled={loading || !url.trim()}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>

          {/* Tabs */}

          <div className="mt-6">
            <div className="border-b border-gray-200">

              <button
                onClick={() => setActiveTab('params')}
                className={
                  activeTab === 'params'
                    ? 'border-b-2 border-blue-600 px-5 py-3 text-sm font-semibold text-blue-600'
                    : 'px-5 py-3 text-sm font-medium text-gray-500 hover:text-gray-700'
                }


              >
                Params
              </button>

              <button
                onClick={() => setActiveTab('headers')}
                className={
                  activeTab === 'headers'
                    ? 'border-b-2 border-blue-600 px-5 py-3 text-sm font-semibold text-blue-600'
                    : 'px-5 py-3 text-sm font-medium text-gray-500 hover:text-gray-700'
                }
              >
                Headers
              </button>

              <button
                onClick={() => setActiveTab('body')}
                className={
                  activeTab === 'body'
                    ? 'border-b-2 border-blue-600 px-5 py-3 text-sm font-semibold text-blue-600'
                    : 'px-5 py-3 text-sm font-medium text-gray-500 hover:text-gray-700'
                }
              >
                Body
              </button>

              <button
                onClick={() => setActiveTab('auth')}
                className={
                  activeTab === 'auth'
                    ? 'border-b-2 border-blue-600 px-5 py-3 text-sm font-semibold text-blue-600'
                    : 'px-5 py-3 text-sm font-medium text-gray-500 hover:text-gray-700'
                }
              >
                Auth
              </button>

            </div>

            {/* Params */}

            {activeTab === 'params' && (
              <ParamsEditor
                params={params}
                addParam={addParam}
                updateParam={updateParam}
                removeParam={removeParam}
              />
            )}

            {/* Headers */}

            {activeTab === 'headers' && (
              <HeadersEditor
                headers={headers}
                addHeader={addHeader}
                updateHeader={updateHeader}
                removeHeader={removeHeader}
              />
            )}

            {/* Body */}

            {activeTab === 'body' && (
              <BodyEditor
                body={body}
                setBody={setBody}
              />
            )}

            {/* Auth */}

            {activeTab === 'auth' && (
              <AuthEditor
                authType={authType}
                setAuthType={setAuthType}
                bearerToken={bearerToken}
                setBearerToken={setBearerToken}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                apiKey={apiKey}
                setApiKey={setApiKey}
                apiKeyName={apiKeyName}
                setApiKeyName={setApiKeyName}
              />
            )}


          </div>
        </div>

        {/* Response */}

        <ResponseViewer
          response={response}
          responseTab={responseTab}
          setResponseTab={setResponseTab}
          error={error}
        />

        {showSaveCollection && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
            <div className="mx-auto my-8 w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Save Request to Collection
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Save this request for later use.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowSaveCollection(false)
                  }
                  disabled={savingToCollection}
                  className="text-2xl text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div>
                {/* Collection selector */}

                <div className="mb-5">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Collection
                  </label>

                  <select
                    value={selectedCollectionId}
                    onChange={(event) =>
                      setSelectedCollectionId(event.target.value)
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  >
                    <option value="">
                      Select a collection
                    </option>

                    {collections.map((collection) => (
                      <option
                        key={collection.id}
                        value={collection.id}
                      >
                        {collection.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Request form */}

                <CollectionItemForm
                  request={saveRequest}
                  setRequest={setSaveRequest}
                  onSubmit={handleSaveToCollection}
                  onCancel={() => setShowSaveCollection(false)}
                  submitting={savingToCollection}
                  submitLabel="Save to Collection"
                  error={saveCollectionError}
                />
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default Dashboard