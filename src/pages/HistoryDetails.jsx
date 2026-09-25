import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getHistoryById } from '../services/historyService'
import Navbar from '../components/Navbar'

function HistoryDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [history, setHistory] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [responseTab, setResponseTab] = useState('body')

    useEffect(() => {
        loadHistoryDetails()
    }, [id])

    async function loadHistoryDetails() {
        try {
            setLoading(true)
            setError('')

            const data = await getHistoryById(id)

            setHistory(data)
        } catch (error) {
            console.error('Failed to load history details:', error)
            setError('Failed to load history details')
        } finally {
            setLoading(false)
        }
    }

    function getStatusClass(statusCode) {
        if (statusCode >= 200 && statusCode < 300) {
            return 'bg-green-100 text-green-700'
        }

        if (statusCode >= 400) {
            return 'bg-red-100 text-red-700'
        }

        return 'bg-yellow-100 text-yellow-700'
    }

    function formatJson(value) {
        if (!value) {
            return ''
        }

        try {
            const parsed = JSON.parse(value)

            return JSON.stringify(parsed, null, 2)
        } catch {
            return value
        }
    }

    function handleRunAgain() {
        navigate('/dashboard', {
            state: {
                history: history,
            },
        })
    }

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="p-6">
                    Loading history details...
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Navbar />

                <div className="p-6 text-red-600">
                    {error}
                </div>
            </>
        )
    }

    if (!history) {
        return (
            <>
                <Navbar />

                <div className="p-6 text-gray-500">
                    History entry not found.
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-6xl">

                    {/* Back Button */}

                    <button
                        onClick={() => navigate('/history')}
                        className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        ← Back to History
                    </button>

                    {/* Page Heading */}

                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                History Details
                            </h1>

                            <p className="mt-1 text-gray-500">
                                Details of the executed API request and response.
                            </p>
                        </div>

                        <button
                            onClick={handleRunAgain}
                            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Run Again
                        </button>
                    </div>
                    {/* Request */}

                    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-lg font-semibold text-gray-800">
                            Request
                        </h2>

                        {/* Method + URL */}

                        <div className="mb-5 flex items-center gap-3">

                            <span className="shrink-0 rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700">
                                {history.method}
                            </span>

                            <div className="min-w-0 break-all font-mono text-sm text-gray-700">
                                {history.url}
                            </div>

                        </div>

                        {/* Request Headers */}

                        <div className="mb-5">

                            <h3 className="mb-2 text-sm font-semibold text-gray-700">
                                Request Headers
                            </h3>

                            <pre className="max-h-72 overflow-auto rounded-lg bg-gray-50 p-4 font-mono text-sm text-gray-700">
                                {formatJson(history.requestHeaders) || 'No request headers'}
                            </pre>

                        </div>

                        {/* Request Body */}

                        <div>

                            <h3 className="mb-2 text-sm font-semibold text-gray-700">
                                Request Body
                            </h3>

                            <pre className="max-h-96 overflow-auto rounded-lg bg-gray-50 p-4 font-mono text-sm text-gray-700">
                                {formatJson(history.requestBody) || 'No request body'}
                            </pre>

                        </div>

                    </div>

                    {/* Response */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <div className="mb-5 flex items-center justify-between">

                            <h2 className="text-lg font-semibold text-gray-800">
                                Response
                            </h2>

                            <span
                                className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${getStatusClass(
                                    history.statusCode
                                )}`}
                            >
                                {history.statusCode}
                            </span>

                        </div>

                        {/* Response Metadata */}

                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                            <div className="rounded-lg bg-gray-50 p-4">

                                <p className="text-sm text-gray-500">
                                    Status
                                </p>

                                <p className="mt-1 font-semibold text-gray-800">
                                    {history.statusCode}
                                </p>

                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">

                                <p className="text-sm text-gray-500">
                                    Response Time
                                </p>

                                <p className="mt-1 font-semibold text-gray-800">
                                    {history.responseTime} ms
                                </p>

                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">

                                <p className="text-sm text-gray-500">
                                    Response Size
                                </p>

                                <p className="mt-1 font-semibold text-gray-800">
                                    {history.responseSize} bytes
                                </p>

                            </div>

                        </div>

                        {/* Response Tabs */}

                        <div className="mb-4 border-b border-gray-200">

                            <div className="flex gap-6">

                                <button
                                    onClick={() => setResponseTab('body')}
                                    className={`border-b-2 px-1 pb-3 text-sm font-medium ${responseTab === 'body'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Body
                                </button>

                                <button
                                    onClick={() => setResponseTab('headers')}
                                    className={`border-b-2 px-1 pb-3 text-sm font-medium ${responseTab === 'headers'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Headers
                                </button>

                            </div>

                        </div>

                        {/* Response Body */}

                        {responseTab === 'body' && (
                            <div>

                                {history.responseBody ? (
                                    <pre className="max-h-[500px] overflow-auto rounded-lg bg-gray-50 p-4 font-mono text-sm text-gray-800">
                                        {formatJson(history.responseBody)}
                                    </pre>
                                ) : (
                                    <div className="rounded-lg bg-gray-50 p-6 text-sm text-gray-500">
                                        No response body
                                    </div>
                                )}

                            </div>
                        )}

                        {/* Response Headers */}

                        {responseTab === 'headers' && (
                            <div>

                                {history.responseHeaders ? (
                                    <pre className="max-h-[500px] overflow-auto rounded-lg bg-gray-50 p-4 font-mono text-sm text-gray-800">
                                        {formatJson(history.responseHeaders)}
                                    </pre>
                                ) : (
                                    <div className="rounded-lg bg-gray-50 p-6 text-sm text-gray-500">
                                        Response headers are not available in history.
                                    </div>
                                )}

                            </div>
                        )}

                    </div>

                </div>
            </div>
        </>
    )
}

export default HistoryDetails