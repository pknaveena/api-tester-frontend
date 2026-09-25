import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
import { Link } from 'react-router-dom'
function Register() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(event) {

    event.preventDefault()

    try {

      await register(name, email, password)

      console.log('Registration successful')

      navigate('/login')

    } catch (error) {

      console.error('Registration failed:', error)

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">

        <h1 className="mb-6 text-center text-3xl font-bold">
          Create Account
        </h1>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">

            <label className="mb-2 block font-medium">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Enter your name"
            />

          </div>

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
            className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
          >
            Register
          </button>
          <div>
            <p className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>

        </form>

      </div>

    </div>
  )
}

export default Register