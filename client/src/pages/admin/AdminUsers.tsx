import { adminApi } from '@/api/admin'
import EmptyState from '@/components/shared/EmptyState'
import PageLoader from '@/components/shared/PageLoader'
import RoleBadge from '@/components/shared/RoleBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User } from '@/types'
import { formatDate } from '@/utils/formatDate'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Search, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [role, setRole] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', role, search],
    queryFn: () =>
      adminApi.getUsers({
        role: role === 'all' ? undefined : role, search
      }),
    staleTime: 0,
  })
  const users: User[] = data?.data ?? []

  const { data: allData } = useQuery({
    queryKey: ['admin', 'users', 'all'],
    queryFn: () => adminApi.getUsers(),
  })

  const allUsersList: User[] = allData?.data ?? []

  const counts = {
    all: allUsersList.length,
    student: allUsersList.filter((u) => u.role === 'student').length,
    teacher: allUsersList.filter((u) => u.role === 'teacher').length,
    admin: allUsersList.filter((u) => u.role === 'admin').length,
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-5">

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['all', 'student', 'teacher', 'admin'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`bg-gray-100 rounded-xl p-3 border text-left transition-all ${role === r
              ? 'ring-2 ring-slate-900 bg-white'
              : 'hover:bg-gray-100'
              }`}
          >
            <p className="text-xs text-slate-500 capitalize">{r}</p>
            <p className="text-xl font-semibold text-slate-900 mt-0.5">
              {counts[r]}
            </p>
          </button>
        ))}
      </div>

      <div className="flex gap-2">

        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSearch(searchInput)
          }}
          className='relative flex  gap-1 items-center flex-1'>
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-3 text-sm py-4 sm:py-2"
          />
          <Button className="absolute right-0 rounded-l-none" variant={"outline"}><Search /></Button>
        </form>

        <Select value={role} onValueChange={(value) => setRole(value ?? 'all')} >
          <SelectTrigger className="w-25 sm:w-36 py-4 sm:py-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description={
            search
              ? `No results for "${search}". Try a different search.`
              : 'No users in this category yet.'
          }
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-200">
            {users.map((user) => {
              const initials = user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)

              return (
                <Link
                  key={user._id}
                  to={`/admin/users/${user._id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm sm:text-xs font-medium text-slate-600 shrink-0">
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {user.email}
                      {user.rollNumber && (
                        <span className="ml-2 text-slate-300">
                          · {user.rollNumber}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-400 hidden sm:block">
                      {formatDate(user.createdAt)}
                    </span>
                    <RoleBadge role={user.role} />
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div >
  )
}
