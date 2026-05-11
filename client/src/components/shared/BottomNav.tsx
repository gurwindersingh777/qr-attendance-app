import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { NavLink } from "react-router-dom"

interface BottomNavItem {
  to: string
  icon: LucideIcon
  label: string
}

interface Props {
  items: BottomNavItem[]
}

export default function BottomNav({ items }: Props) {

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex md:hidden">
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-[10px] transition-colors',
              isActive
                ? 'text-slate-900 '
                : 'text-slate-400 hover:text-slate-600'
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className={cn(
                'w-8 h-6 flex items-center justify-center rounded-full transition-colors',
                isActive ? 'bg-slate-100' : ''
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-medium">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
