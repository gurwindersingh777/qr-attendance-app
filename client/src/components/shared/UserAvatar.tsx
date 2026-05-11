import { authApi } from "@/api/auth"
import { useAuthStore } from "@/store/authStore"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Badge } from "../ui/badge"
import { LogOut } from "lucide-react"

export default function UserAvatar() {
  const { user, clearUser } = useAuthStore()
  const navigate = useNavigate()

  const { mutate: logout } = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearUser()
      toast.success("Logged out")
      navigate('/login', { replace: true })
    },
    onError: () => {
      toast.error("Something went wrong")
    }
  })

  if (!user) return null;

  const initialsNameLetters = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors">
          <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm sm:text-xs font-medium">
            {initialsNameLetters}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-sm text-slate-900">
                {user.name}
              </span>
              <span className="text-xs text-slate-500 truncate">
                {user.email}
              </span>
              {user.rollNumber && <Badge variant="secondary" className="w-fit mt-1 text-[10px]">
                {user.rollNumber}
              </Badge>}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => logout()}>
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
