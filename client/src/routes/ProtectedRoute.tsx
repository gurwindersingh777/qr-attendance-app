import { useAuthStore } from "@/store/authStore"
import { Role } from "@/types"
import { getDefaultRoute } from "@/utils/getDefaultRoute"
import { Navigate } from "react-router-dom"

interface Props {
  children: React.ReactNode
  allowedRole: Role
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== allowedRole) {
    return <Navigate to={getDefaultRoute(user.role)} replace />
  }

  return <>{children}</>
}