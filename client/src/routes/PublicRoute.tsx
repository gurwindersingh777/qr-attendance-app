import PageLoader from "@/components/shared/PageLoader"
import { useAuthStore } from "@/store/authStore"
import { getDefaultRoute } from "@/utils/getDefaultRoute"
import { Navigate } from "react-router-dom"

export default function PublicRoute({ children }: { children: React.ReactNode }) {

  const { isAuthenticated, user, hydrated } = useAuthStore()

  if (!hydrated) return <PageLoader />

  if (isAuthenticated && user) {
    return (
      <Navigate to={getDefaultRoute(user.role)} replace />
    )
  }

  return <>{children}</>
}