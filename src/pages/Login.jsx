import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { saveToken } = useAuth()
    const navigate = useNavigate()
    async function handleSubmit(event) {

        event.preventDefault()

        try {

            const data = await login(email, password)
            saveToken(data.token)

            navigate('/dashboard')

            console.log('Login successful')
        } catch (error) {
            console.error('Login failed:', error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">

                <h1 className="mb-6 text-3xl font-bold text-center">
                    API Testing Tool
                </h1>

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label className="mb-2 block font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded bg-blue-600 p-2 text-white"
                    >
                        Login
                    </button>
                    <p className="mt-4 text-center text-sm">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-blue-600 hover:underline"
                        >
                            Register
                        </Link>
                    </p>

                </form>


            </div>
        </div>
    )
}

export default Login