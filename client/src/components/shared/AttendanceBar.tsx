import { cn } from "@/lib/utils"
import { SubjectAttendanceSummary } from "@/types/Attendance"
import { getBadgeStyle, getBarColor } from "@/utils/getStyle"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

interface Props {
  summary: SubjectAttendanceSummary
}

export default function AttendanceBar({ summary }: Props) {
  const subject = summary.subject as any
  const pct = summary.totalLectures === 0
    ? 0
    : Number(((summary.attendedLectures / summary.totalLectures) * 100).toFixed(2))

  return (
    <Link
      to={`/student/subject/${subject._id}`}
      className="block group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-slate-900 truncate">
            {subject.subjectName}
          </span>
          <span className="text-xs text-slate-400 shrink-0">
            {subject.subjectCode}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400">
            {summary.attendedLectures}/{summary.totalLectures}
          </span>
          <span className={cn('text-xs px-2 py-0.5 rounded-md font-medium', getBadgeStyle(pct))}>
            {pct}%
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
        </div>
      </div>

      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', getBarColor(pct))}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="relative h-0">
        <div
          className="absolute -top-1.5 w-px h-3 bg-slate-300"
          style={{ left: '75%' }}
          title="75% minimum"
        />
      </div>
    </Link>
  )
}
