import { attendanceApi } from "@/api/attendance"
import { subjectApi } from "@/api/subject"
import PageLoader from "@/components/shared/PageLoader"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { SubjectAttendance } from "@/types/Attendance"
import { formatDate, formatTime } from "@/utils/formatDate"
import { getBarColor, getPctColor } from "@/utils/getStyle"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Calendar, CheckCircle2, XCircle } from "lucide-react"
import { Link, useParams } from "react-router-dom"

export default function StudentSubjectDetail() {
  const { id: subjectId } = useParams<{ id: string }>()

  const { data: recordsData, isLoading } = useQuery({
    queryKey: ['attendance', 'subject', subjectId],
    queryFn: () => attendanceApi.getMyForSubject(subjectId!),
    enabled: !!subjectId,
  })

  if (isLoading) return <PageLoader />

  const records = recordsData?.data as SubjectAttendance
  const subject = records.subject
  const total = records.totalSessions
  const attended = records.totalAttendedSessions
  const pct = total > 0 ? Math.round((attended / total) * 100) : 0

  return (
    <div className="max-w-2xl space-y-5">

      <Link
        to="/student/subjects"
        className="inline-flex items-center gap-1.5 sm:text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to subjects
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {subject?.subjectName ?? 'Subject'}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {subject?.subjectCode}
            </p>
          </div>
          <span className={cn('text-2xl font-bold', getPctColor(pct))}>
            {pct}%
          </span>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>{attended} attended</span>
            <span>{total - attended} missed</span>
            <span>{total} total</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', getBarColor(pct))}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {pct < 75 && total > 0 && (
          <div className="mt-3 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
            You need to attend {Math.ceil((0.75 * total - attended) / (1 - 0.75))} more
            consecutive classes to reach 75%.
          </div>
        )}

      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Session history
          </h3>
          <span className="text-xs text-slate-400">
            {total} session{total !== 1 ? 's' : ''}
          </span>
        </div>

        {records.attendance.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Calendar className="w-5 h-5 text-slate-300" />
            <p className="text-sm text-slate-400">No sessions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {records.attendance.map((record, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center justify-between px-5 py-3',
                  record.attended ? '' : 'bg-red-50/30'
                )}
              >
                <div className="flex items-center gap-3">
                  {record.attended ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm text-slate-900">
                      {formatDate(record.date)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatTime(record.startTime)} – {formatTime(record.endTime)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={record.attended ? 'default' : 'destructive'}
                  className={cn(
                    'text-xs',
                    record.attended
                      ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-50'
                      : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-50'
                  )}
                >
                  {record.attended ? 'Present' : 'Absent'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
