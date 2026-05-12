import { attendanceApi } from "@/api/attendance"
import PageLoader from "@/components/shared/PageLoader"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SubjectAttendanceReport } from "@/types/Attendance"
import { exportToCsv } from "@/utils/exportCsv"
import { getBadgeStyle, getBarColor } from "@/utils/getStyle"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Download, Users } from "lucide-react"
import { Link, useParams } from "react-router-dom"


export default function TeacherReport() {
  const { id: subjectId } = useParams<{ id: string }>()

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["report", "subject", subjectId],
    queryFn: () => attendanceApi.getSubjectReport(subjectId!),
    enabled: !!subjectId,
  })

  if (isLoading) return <PageLoader />;

  const report = reportData?.data as SubjectAttendanceReport

  if (!report) return null;

  const { subject, stats, attendanceSummary } = report

  const handleExport = () => {
    const rows = attendanceSummary.map((row) => ({
      Name: row.student.name,
      Email: row.student.email,
      "Roll Number": row.student.rollNumber ?? "",
      Attended: row.attendedSessions,
      Total: row.totalSessions,
      Percentage: `${row.percentage}%`,
    }))

    exportToCsv(`${subject.subjectCode}-report.csv`, rows)
  }

  return (
    <div className="max-w-3xl space-y-5">
      <Link
        to="/teacher/subjects"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to subjects
      </Link>

      <div className="flex items-start justify-between gap-4 px-1">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            {subject?.subjectName ??
              "Attendance report"}
          </h2>

          <p className="text-sm text-slate-400 mt-0.5">
            {subject?.subjectCode} ·{" "}
            {stats.totalStudents} students
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={stats.totalStudents === 0}
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gray-100 rounded-xl p-4 border">
          <p className="text-xs text-slate-500 mb-1">
            Average attendance
          </p>

          <p
            className={cn(
              "text-2xl font-semibold",
              stats.averageAttendance >= 75
                ? "text-green-600"
                : stats.averageAttendance >= 60
                  ? "text-amber-500"
                  : "text-red-500"
            )}
          >
            {stats.averageAttendance}%
          </p>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 border">
          <p className="text-xs text-slate-500 mb-1">
            Total students
          </p>

          <p className="text-2xl font-semibold text-slate-900">
            {stats.totalStudents}
          </p>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 border">
          <p className="text-xs text-slate-500 mb-1">
            Below 75%
          </p>

          <p
            className={cn(
              "text-2xl font-semibold",
              stats.belowThreshold > 0
                ? "text-red-500"
                : "text-green-600"
            )}
          >
            {stats.belowThreshold}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-semibold text-slate-900">
            Student breakdown
          </h3>

          <p className="text-xs text-slate-400 mt-0.5">
            Sorted by attendance — lowest first
          </p>
        </div>

        {attendanceSummary.length === 0 ? (
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 px-5 py-4">
            <Users className="w-5 h-5 text-slate-300" />

            <p className="text-sm text-slate-400">
              No attendance data yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {attendanceSummary.map((row, i) => {
              const student = row.student

              const pct = row.percentage

              const initials = student?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)

              return (
                <div
                  key={student?._id ?? i}
                  className="px-5 py-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 shrink-0">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {student?.name ?? "Unknown"}
                        </p>

                        {student?.rollNumber && (
                          <p className="text-xs text-slate-400">
                            {student.rollNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400">
                        {row.attendedSessions}/
                        {row.totalSessions}
                      </span>

                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-md font-medium border",
                          getBadgeStyle(pct)
                        )}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>

                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        getBarColor(pct)
                      )}
                      style={{
                        width: `${pct}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}