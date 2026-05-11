import { useAuthStore } from "@/store/authStore"
import { zodResolver } from '@hookform/resolvers/zod'
import { data, Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { LoginFormInput, loginSchema } from "@/schemas/auth.schema"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/api/auth"
import toast from "react-hot-toast"
import { getDefaultRoute } from "@/utils/getDefaultRoute"
import { Loader2, QrCode } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Login() {

  const setUser = useAuthStore((s) => s.setUser)
  const naviagte = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInput>({ resolver: zodResolver(loginSchema) })

  const { mutate: login, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      if (res.data) {
        setUser(res.data)
        toast.success(`Welcome back, ${res.data.name}!`)
        naviagte(getDefaultRoute(res.data.role), { replace: true })
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  })


  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-3">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">
            QR Attendance App
          </h1>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>
              Sign in to continue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit((data: LoginFormInput) => login(data))} className="space-y-4">

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register('email')}
                  className={`text-sm ${errors.email ? 'border-red-400' : ''}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                  className={`text-sm ${errors.password ? 'border-red-400' : ''}`}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-700"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>

              <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-slate-900 font-medium hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
