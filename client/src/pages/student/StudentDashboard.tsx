import { attendanceApi } from "@/api/attendance"
import AttendanceBar from "@/components/shared/AttendanceBar"
import EmptyState from "@/components/shared/EmptyState"
import PageLoader from "@/components/shared/PageLoader"
import StatCard from "@/components/shared/StatCard"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { OverallAttendance } from "@/types/Attendance"
import { useQuery } from "@tanstack/react-query"
import { AlertTriangle, BookOpen } from "lucide-react"
import { Link } from "react-router-dom"

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["attendance", "summary"],
    queryFn: () => attendanceApi.getMySummary()
  })

  const summaries = data?.data  as OverallAttendance

  if (isLoading) return <PageLoader />

  const totalSubjects = summaries.subjects.length
  const overallAverage = summaries.overall.percentage
  const belowThreshold = summaries.subjects.filter((s) => s.percentage < 75)
  const sorted = [...summaries.subjects].sort((a, b) => a.percentage - b.percentage)


  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-slate-500">
          Failed to load attendance data. Try refreshing.
        </p>
      </div>
    )
  }

  if (totalSubjects === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No subjects yet"
        description="Enroll in a subject using a subject code from your teacher to start tracking attendance."
        action={
          <Button asChild size="sm">
            <Link to="/student/subjects">Browse subjects</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">

      <div>
        <h2 className="text-2xl sm:text-lg  font-semibold text-slate-900">Hello, {user?.name?.split(' ')[0]}</h2>
        <p className="text-sm text-slate-500 mt-0.5">Here's your attendance overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Overall attendance"
          value={`${overallAverage}`}
          valueClassName={
            overallAverage >= 75 ? 'text-green-600' : overallAverage >= 60 ? 'text-amber-500' : 'text-red-500'
          }
        />
        <StatCard
          label="Subjects enrolled"
          value={totalSubjects}
        />
        <StatCard
          label="Needs attention"
          value={belowThreshold.length}
          valueClassName={belowThreshold.length > 0 ? 'text-red-500' : 'text-green-600'}
        />
      </div>

      {belowThreshold.length > 0 && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-700 mb-0.5">
              {belowThreshold.length === 1 ? '1 subject needs attention'
                : `${belowThreshold.length} subjects need attention`}
            </p>
            <p className="text-xs text-red-600">
              {belowThreshold
                .map((s) => (s.subject as any).subjectName)
                .join(', ')}{' '}
              {belowThreshold.length === 1 ? 'is' : 'are'} below 75%.
              Attend all upcoming classes.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text font-semibold text-slate-900">Subject attendance</h3>
          <span className="text-xs text-slate-400"> 75% min required</span>
        </div>
        <div className="space-y-5">
          {sorted.map((summary) => (
            <AttendanceBar
              key={summary.subject._id}
              summary={summary}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
