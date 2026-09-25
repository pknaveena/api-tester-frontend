function MethodBadge({ method }) {
  function getMethodClass(method) {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-700'

      case 'POST':
        return 'bg-blue-100 text-blue-700'

      case 'PUT':
        return 'bg-orange-100 text-orange-700'

      case 'PATCH':
        return 'bg-purple-100 text-purple-700'

      case 'DELETE':
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <span
      className={`rounded px-2.5 py-1 text-xs font-semibold ${getMethodClass(
        method
      )}`}
    >
      {method}
    </span>
  )
}

export default MethodBadge