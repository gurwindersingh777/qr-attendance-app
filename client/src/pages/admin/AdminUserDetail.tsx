import { adminApi } from "@/api/admin"
import PageLoader from "@/components/shared/PageLoader"
import RoleBadge from "@/components/shared/RoleBadge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { UpdateUserForm, updateUserSchema } from "@/schemas/user.schema"
import type { User } from "@/types"
import { formatDate } from "@/utils/formatDate"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Link, useNavigate, useParams } from "react-router-dom"


export default function AdminUserDetail() {
  const { id: userId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: () => adminApi.getUserById(userId!),
    enabled: !!userId,
  })

  const user: User | undefined = data?.data ?? undefined

  const {
    register, handleSubmit, setValue, reset,
    formState: { errors, isDirty },
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber ?? '',
      })
      setSelectedRole(user.role)
    }
  }, [user, reset])

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdateUserForm) => adminApi.updateUser(userId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', userId] })
      toast.success('User updated successfully')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data.message || "Somthing went wrong")
    }
  })
  

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: () => adminApi.deleteUser(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('User deleted')
      navigate('/admin/users')
    },
  })

  if (isLoading) return <PageLoader />
  if (!user) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-sm text-slate-500">User not found</p>
    </div>
  )

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="max-w-xl space-y-5">

      <Link
        to="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to users
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-sm font-semibold text-slate-600 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-slate-900">
                {user.name}
              </h2>
              <RoleBadge role={user.role} />
            </div>
            <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
            <p className="text-xs text-slate-400 mt-1">
              Joined {formatDate(user.createdAt)}
              {user.rollNumber && ` · Roll no. ${user.rollNumber}`}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          Edit profile
        </h3>

        <form
          onSubmit={handleSubmit((d) => updateUser(d))}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              {...register('name')}
              className={cn("text-sm", errors.name && 'border-red-400')}
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
              {...register('email')}
              className={cn("text-sm", errors.email && 'border-red-400')}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className={cn("grid gap-3", selectedRole === 'student' ? 'grid-cols-2' : 'grid-cols-1')}>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(v) => {
                  setSelectedRole(v as any)
                  setValue('role', v as any, { shouldValidate: true, shouldDirty: true })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Change Role" />
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
                  placeholder="Enter a roll number"
                  {...register('rollNumber')}
                  className="text-sm"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete user
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Delete {user.name}?</DialogTitle>
                  <DialogDescription>
                    This will permanently delete the user
                    {user.role === 'student'
                      ? ' and remove them from all enrolled subjects.'
                      : user.role === 'teacher'
                        ? ' and delete all subjects they teach.'
                        : '.'}
                    {' '}This cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => deleteUser()}
                    disabled={isDeleting}
                  >
                    {isDeleting
                      ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Deleting...</>
                      : 'Yes, delete'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              type="submit"
              size="sm"
              className="bg-slate-900 hover:bg-slate-700"
              disabled={isUpdating || !isDirty}
            >
              {isUpdating ? (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</>
              ) : (
                <><Save className="w-3.5 h-3.5 mr-1.5" />Save changes</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}