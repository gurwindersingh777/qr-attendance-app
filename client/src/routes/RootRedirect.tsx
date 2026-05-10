import { useAuthStore } from "@/store/authStore"
import { getDefaultRoute } from "@/utils/getDefaultRoute"
import { Navigate } from "react-router-dom"

export default function RootRedirect() {

  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }
  return <Navigate to={getDefaultRoute(user.role)} replace />
}
