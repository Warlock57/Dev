import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.userLogin)

  if (!userInfo) {
    return <Navigate to="/sign-in" replace />
  }

  if (!userInfo.isAdmin) {
    return <Navigate to="/" replace /> // Redirect non-admins to home
  }

  if (!userInfo.AcStatus) {
    return <Navigate to="/waiting-approval" replace /> // Prevent unapproved admins
  }

  return <Outlet />
}

export default ProtectedRoute
