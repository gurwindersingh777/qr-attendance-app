import { cn } from "@/lib/utils"
import type {  Subject } from "@/types"
import { SubjectAttendanceSummary } from "@/types/Attendance"
import { getBadgeStyle } from "@/utils/getStyle"
import { BookOpen, ChevronRight, Users } from "lucide-react"
import { Link } from "react-router-dom"

interface Props {
  subject: Subject
  summary?: SubjectAttendanceSummary
  href: string
}

export default function SubjectCard({ subject, summary, href }: Props) {
  const teacher = subject.teacherId as any
  const pct = summary?.percentage

  return (
    <Link
      to={href}
      className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-200 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-3">

        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-slate-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{subject.subjectName}</p>
            <p className="text-xs text-slate-400 mt-0.5">{subject.subjectCode}</p>
            {teacher?.name && (
              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {teacher.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {pct !== undefined ? (
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-md font-medium border',
                getBadgeStyle(pct)
              )}
            >
              {pct}%
            </span>
          ) : (
            <span className="text-xs text-slate-300 px-2">No data</span>
          )}
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
        </div>

      </div>

      {pct !== undefined && (
        <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full',
              pct >= 75 ? 'bg-green-500' :
                pct >= 60 ? 'bg-amber-400' : 'bg-red-500'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      
    </Link>
  )
}
