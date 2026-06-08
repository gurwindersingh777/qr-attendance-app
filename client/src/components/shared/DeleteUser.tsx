import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { adminApi } from "@/api/admin"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { User } from "@/types"

export default function DeleteUser({ user }: { user: User }) {

  const [deleteOpen, setDeleteOpen] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: () => adminApi.deleteUser(user._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('User deleted')
      navigate('/admin/users')
    },
  })
  
  return (
    <div className="flex items-center justify-between pt-2">
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
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
    </div>
  )
}
