import { Outlet, useLocation } from 'react-router-dom'
import { BookOpen, Users } from 'lucide-react'
import Logo from '../shared/Logo'
import NavItem from '../shared/NavItem'
import UserAvatar from '../shared/UserAvatar'
import BottomNav from '../shared/BottomNav'

const navItems = [
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/subjects', icon: BookOpen, label: 'Subjects' },
]

function usePageTitle() {
  const { pathname } = useLocation()
  if (pathname.includes('users')) return 'User Management'
  if (pathname.includes('subjects')) return 'All subjects'
  return 'Admin'
}

export default function AdminLayout() {
  const title = usePageTitle()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <aside className="hidden md:flex w-56 shrink-0 bg-white border-r border-gray-200 flex-col">
        <div className="px-4 py-5 border-b border-gray-200">
          <Logo />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <header className="flex h-15 bg-white border-b border-gray-200 items-center justify-between px-6 shrink-0">
          <h1 className="font-semibold text-slate-900 text-lg sm:text-base">{title}</h1>
          <div className="flex items-center gap-1">
            <UserAvatar />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      <BottomNav items={navItems} />
    </div>
  )
}