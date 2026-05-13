import { attendanceApi } from "@/api/attendance"
import { subjectApi } from "@/api/subject"
import EmptyState from "@/components/shared/EmptyState"
import EnrollDialog from "@/components/shared/EnrollDialog"
import PageLoader from "@/components/shared/PageLoader"
import SubjectCard from "@/components/shared/SubjectCard"
import type { Subject } from "@/types"
import { OverallAttendance, SubjectAttendanceSummary } from "@/types/Attendance"
import { useQuery } from "@tanstack/react-query"
import { BookOpen } from "lucide-react"

export default function StudentSubjects() {

  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects', 'student'],
    queryFn: () => subjectApi.getSubjects()
  })

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['attendance', 'summary'],
    queryFn: () => attendanceApi.getMySummary()
  })

  const subjects: Subject[] = subjectsData?.data ?? []
  const summaries: SubjectAttendanceSummary[] = summaryData?.data?.subjects ?? []

  const summaryMap = new Map<string, SubjectAttendanceSummary>(
    summaries.map((s) => [
      typeof s.subject._id === 'string'
        ? s.subject._id
        : (s.subject._id as any)._id,
      s,
    ])
  )

  const isLoading = subjectsLoading || summaryLoading

  if (isLoading) return <PageLoader />

  return (
    <div className="max-w-3xl space-y-5">

      <div className="flex items-center justify-between px-1">
        <p className=" sm:text-sm text-slate-500 mt-0.5">
          {subjects.length === 0
            ? 'You are not enrolled in any subjects yet'
            : `${subjects.length} subject${subjects.length !== 1 ? 's' : ''} enrolled`}
        </p>
        <EnrollDialog />
      </div>

      {subjects.length === 0 ?
        <EmptyState
          icon={BookOpen}
          title="No subjects enrolled"
          description="Get a subject code from your teacher and enroll using the button above."
        /> : (
          <div className="space-y-3">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject._id}
                subject={subject}
                summary={summaryMap.get(subject._id)}
                href={`/student/subject/${subject._id}`}
              />
            ))}
          </div>
        )}

      {subjects.length > 0 && (
        <p className="text-xs text-slate-400 text-center pt-2">
          Tap a subject to see your session-by-session attendance history
        </p>
      )}

    </div>
  )
}
