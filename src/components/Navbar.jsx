import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {

  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="flex items-center justify-between bg-gray-800 px-6 py-4 text-white">
      <h1 className="text-xl font-bold">
        API Testing Tool
      </h1>

      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="hover:text-gray-300"
        >
          API Tester
        </Link>

        <Link
          to="/history"
          className="hover:text-gray-300"
        >
          History
        </Link>

        <Link
          to="/collections"
          className="hover:text-gray-300"
        >
          Collections
        </Link>
        <Link to="/environments" className="hover:text-gray-300">
          Environments
        </Link>

        <button
          onClick={handleLogout}
          className="rounded bg-red-600 px-4 py-2 hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar