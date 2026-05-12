import { cn } from "@/lib/utils"
import { Role } from "@/types"

interface Props {
  role: Role
  className?: string
}

const styles: Record<Role, string> = {
  student: 'bg-blue-50 text-blue-700 border-blue-100',
  teacher: 'bg-green-50 text-green-700 border-green-100',
  admin: 'bg-amber-50 text-amber-700 border-amber-100',
}

export default function RoleBadge({ role, className }: Props) {
  return (
    <span className={cn(
      'text-xs px-2 py-0.5 rounded-md font-medium border',
      styles[role],
      className
    )}>
      {role}
    </span>
  )
}