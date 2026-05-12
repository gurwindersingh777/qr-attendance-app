import { adminApi } from "@/api/admin"
import EmptyState from "@/components/shared/EmptyState"
import PageLoader from "@/components/shared/PageLoader"
import { Subject } from "@/types"
import { formatDate } from "@/utils/formatDate"
import { useQuery } from "@tanstack/react-query"
import { BookOpen, Users } from "lucide-react"

export default function AdminSubjects() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'subjects'],
    queryFn: () => adminApi.getSubjects(),
  })

  const subjects: Subject[] = data?.data ?? []

  if (isLoading) return <PageLoader />

  return (
    <div className="max-w-3xl space-y-5">

      <p className="text-md sm:text-sm text-slate-500 mt-0.5">
        {subjects.length} subject{subjects.length !== 1 ? 's' : ''} across all teachers
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
          <p className="text-sm sm:text-xs text-slate-500 mb-1">Total subjects</p>
          <p className="text-2xl font-semibold text-slate-900">
            {subjects.length}
          </p>
        </div>
        <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
          <p className="text-sm sm:text-xs text-slate-500 mb-1">Total enrollments</p>
          <p className="text-2xl font-semibold text-slate-900">
            {subjects.reduce(
              (acc, s) => acc + (s.students as any[]).length, 0
            )}
          </p>
        </div>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects yet"
          description="Subjects will appear here once teachers create them."
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-200">
            {subjects.map((subject) => {
              const teacher = subject.teacherId as any
              const studentCount = subject.students.length
              const teacherInitials = teacher?.name
                ?.split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)

              return (
                <div key={subject._id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {subject.subjectName}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {subject.subjectCode} · Created {formatDate(subject.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-[10px] font-medium text-green-700">
                      {teacherInitials}
                    </div>
                    <span className="text-xs text-slate-500 hidden sm:block">
                      {teacher?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500">
                      {studentCount}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
