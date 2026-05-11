import { authApi } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RegisterFormInput, registerSchema } from "@/schemas/auth.schema"
import { useAuthStore } from "@/store/authStore"
import { getDefaultRoute } from "@/utils/getDefaultRoute"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2, QrCode } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"


export default function Register() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [selectedRole, setSelectedRole] = useState<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
  })

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: authApi.register,
    onSuccess: (res) => {
      if (res.data) {
        setUser(res.data)
        toast.success('Account created successfully!')
        navigate(getDefaultRoute(res.data.role), { replace: true })
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
            <form onSubmit={handleSubmit((data: RegisterFormInput) => registerUser(data))} className="space-y-4">

              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  {...register('name')}
                  className={`text-sm ${errors.name ? 'border-red-400' : ''}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

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
                  placeholder="Min 6 chars, uppercase, number, symbol"
                  autoComplete="new-password"
                  {...register('password')}
                  className={`text-sm ${errors.password ? 'border-red-400' : ''}`}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select
                  onValueChange={(val) => {
                    setSelectedRole(val as any)
                    setValue('role', val as any, { shouldValidate: true })
                  }}
                >
                  <SelectTrigger className={`text-sm ${errors.role ? 'border-red-400' : ''}`}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedRole === 'student' && (
                <div className="space-y-1.5">
                  <Label htmlFor="rollNumber">Roll number</Label>
                  <Input
                    id="rollNumber"
                    placeholder="e.g. 2021001"
                    {...register('rollNumber')}
                    className={errors.rollNumber ? 'border-red-400 text-sm' : 'text-sm'}
                  />
                  {errors.rollNumber && (
                    <p className="text-xs text-red-500">
                      {errors.rollNumber.message}
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-700"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>

            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-slate-900 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
