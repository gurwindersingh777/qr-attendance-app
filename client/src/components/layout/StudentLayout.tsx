import { BookOpen, LayoutDashboard, QrCode } from "lucide-react"
import { Outlet, useLocation } from "react-router-dom"
import Logo from "../shared/Logo"
import NotificationBell from "../shared/NotificationBell"
import UserAvatar from "../shared/UserAvatar"
import BottomNav from "../shared/BottomNav"
import NavItem from "../shared/NavItem"

const navItems = [
  { to: "/student/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/student/subjects", icon: BookOpen, label: "Subjects" },
  { to: "/student/scan", icon: QrCode, label: "Scan QR" }
]

function getPageTitle() {
  const { pathname } = useLocation()
  if (pathname.includes('dashboard')) return 'Dashboard'
  if (pathname.includes('subjects')) return 'My subjects'
  if (pathname.includes('scan')) return 'Scan QR'
  if (pathname.includes('subject/')) return 'Subject detail'
  return 'Dashboard'
}

export default function StudentLayout() {
  const title = getPageTitle()

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
            <NotificationBell />
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