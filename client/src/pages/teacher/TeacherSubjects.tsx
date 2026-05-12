import { sessionApi } from "@/api/session"
import { subjectApi } from "@/api/subject"
import CreateSubjectDialog from "@/components/shared/CreateSubjectDialog"
import EmptyState from "@/components/shared/EmptyState"
import PageLoader from "@/components/shared/PageLoader"
import StartSessionDialog from "@/components/shared/StartSessionDialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Session, Subject } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { BarChart2, BookOpen, Radio, Users } from "lucide-react"
import { Link } from "react-router-dom"

export default function TeacherSubjects() {

  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects', 'teacher'],
    queryFn: () => subjectApi.getSubjects(),
  })

  const { data: sessionsData } = useQuery({
    queryKey: ['sessions', 'active'],
    queryFn: () => sessionApi.active(),
    refetchInterval: 30000,
  })

  const subjects: Subject[] = subjectsData?.data ?? []
  const activeSessions: Session[] = sessionsData?.data ?? []

  const activeSubjectIds = new Set(
    activeSessions.map((s) =>
      typeof s.subjectId === 'string' ? s.subjectId : (s.subjectId as any)._id
    )
  )

  const getActiveSession = (subjectId: string) =>
    activeSessions.find((s) => {
      const id = typeof s.subjectId === 'string'
        ? s.subjectId : (s.subjectId as any)._id
      return id === subjectId
    })

  if (subjectsLoading) return <PageLoader />

  return (
    <div className="max-w-3xl space-y-5">

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 mt-0.5">
          {subjects.length === 0
            ? 'Create your first subject to get started'
            : `${subjects.length} subject${subjects.length !== 1 ? 's' : ''}`}
        </p>
        <CreateSubjectDialog />
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects yet"
          description="Create a subject and share the code with your students so they can enroll."
        />
      ) : (
        <div className="space-y-3">
          {subjects.map((subject) => {
            const isActive = activeSubjectIds.has(subject._id)
            const activeSession = getActiveSession(subject._id)
            const studentCount = (subject.students as any[]).length

            return (
              <div
                key={subject._id}
                className={cn(
                  'bg-white border rounded-xl p-4 transition-all border-gray-200',
                  isActive
                    ? ' bg-green-50/30'
                    : ''
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                      isActive ? 'bg-green-100' : 'bg-slate-100'
                    )}>
                      <BookOpen className={cn(
                        'w-4 h-4',
                        isActive ? 'text-green-600' : 'text-slate-500'
                      )} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {subject.subjectName}
                        </p>
                        {isActive && (
                          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Live
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {subject.subjectCode}
                      </p>
                      <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {studentCount} student{studentCount !== 1 ? 's' : ''} enrolled
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                  {isActive && activeSession ? (
                    <Button asChild size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white flex-1">
                      <Link to={`/teacher/session/${activeSession._id}`}>
                        <Radio className="w-3.5 h-3.5 mr-1.5" />
                        View live session
                      </Link>
                    </Button>
                  ) : (
                    <div className="flex-1">
                      <StartSessionDialog defaultSubjectId={subject._id} />
                    </div>
                  )}

                  <Link to={`/teacher/report/${subject._id}`}>
                    <Button variant="outline" size="sm">
                      <BarChart2 className="w-3.5 h-3.5 mr-1.5" />
                      Report
                    </Button>
                  </Link>
                </div>
              </div>
            )
          }
          )}
        </div>
      )}
    </div>
  )
}

