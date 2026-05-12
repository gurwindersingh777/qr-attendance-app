import { attendanceApi } from "@/api/attendance"
import { sessionApi } from "@/api/session"
import PageLoader from "@/components/shared/PageLoader"
import { Button } from "@/components/ui/button"
import { useSessionTimer } from "@/hooks/useSessionTimer"
import { SessionAttendanceReport } from "@/types/Attendance"
import { formatTime } from "@/utils/formatDate"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle, CheckCircle2, Clock, RefreshCw, StopCircle, Users } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"

const QR_REFRESH_SECONDS = 30

export default function TeacherSession() {
  const { id: sessionId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [sessionEnded, setSessionEnded] = useState(false)
  const [countdown, setCountdown] = useState(QR_REFRESH_SECONDS)

  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => sessionApi.getSession(sessionId!),
    enabled: !!sessionId,
  })

  const session = sessionData?.data
  const timeLeft = useSessionTimer(session?.endTime ?? null)

  const { data: qrData, refetch: refetchQR, isFetching: isRotating, } = useQuery({
    queryKey: ["session", sessionId, "qr"],
    queryFn: () => sessionApi.generateQR(sessionId!),
    enabled: !!sessionId && !sessionEnded,
    staleTime: Infinity,
  })

  const qrImage = qrData?.data?.qrImage
  const manualCode = qrData?.data?.manualCode

  const { data: reportData } = useQuery({
    queryKey: ["session", "report", sessionId],
    queryFn: () => attendanceApi.getSessionReport(sessionId!),
    enabled: !!sessionId,
    refetchInterval: 10_000,
  })

  const report = reportData?.data as SessionAttendanceReport
  const attendanceRecords = report?.attendance ?? []
  const presentCount = attendanceRecords.length

  useEffect(() => {
    if (sessionEnded) return

    setCountdown(QR_REFRESH_SECONDS)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refetchQR()
          return QR_REFRESH_SECONDS
        }
        return prev - 1
      })
    }, 1_000)

    return () => clearInterval(timer)
  }, [sessionEnded, refetchQR])

  const { mutate: endSession, isPending: isEnding } = useMutation({
    mutationFn: () => sessionApi.end(sessionId!),
    onSuccess: () => {
      setSessionEnded(true)
      queryClient.invalidateQueries({ queryKey: ["sessions", "active"] })
      toast.success("Session ended")
      navigate("/teacher/subjects")
    },
    onError: (err: any) => {
      toast.error(err?.response?.data.message || "Failed to end session")
    },
  })

  const isExpired = session?.endTime ? new Date(session.endTime) <= new Date() : false
  const subject = session?.subjectId as any

  if (sessionLoading) return <PageLoader />

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertTriangle className="w-6 h-6 text-slate-400" />
        <p className="text-sm text-slate-500">Session not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-5">

      <div className="flex items-start justify-between gap-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">{subject?.subjectName}</h2>

            {!isExpired && !sessionEnded ? (
              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Ended</span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {isExpired || sessionEnded ? "Session ended" : `${timeLeft} remaining`}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Users className="w-3 h-3" />
              {presentCount} present
            </span>
          </div>
        </div>

        {!isExpired && !sessionEnded && (
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:bg-red-50 shrink-0"
            onClick={() => endSession()}
            disabled={isEnding}
          >
            <StopCircle className="w-3.5 h-3.5 mr-1.5" />
            {isEnding ? "Ending..." : "End session"}
          </Button>
        )}
      </div>

      {!isExpired && !sessionEnded && (
        <div className="bg-slate-900 rounded-2xl overflow-hidden w-full">
          <div className="p-6 flex flex-col items-center gap-4">

            <div className="bg-white rounded-xl p-3">
              {qrImage ? (
                <img
                  src={qrImage}
                  alt="QR code for attendance"
                  className={`w-52 h-52 transition-opacity ${isRotating ? "opacity-30" : "opacity-100"}`}
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${countdown > 10 ? "bg-green-400"
                  : countdown > 5 ? "bg-amber-400"
                    : "bg-red-400 animate-pulse"
                  }`} />
                <span className="text-sm text-slate-300">
                  {isRotating ? "Refreshing QR code..." : `Refreshes in ${countdown}s`}
                </span>
              </div>

              <div className="w-52 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${countdown > 10 ? "bg-green-400"
                    : countdown > 5 ? "bg-amber-400"
                      : "bg-red-400"
                    }`}
                  style={{ width: `${(countdown / QR_REFRESH_SECONDS) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Show this QR code to your students.
              It changes every 30 seconds to prevent sharing.
            </p>
          </div>

          <div className="bg-slate-950 px-6 py-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Started {formatTime(session.startTime)} · Ends {formatTime(session.endTime)}
            </span>
            <span className="text-xs text-slate-400">Code: {subject?.subjectCode}</span>
          </div>
        </div>
      )}

      {manualCode && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs text-slate-500">Manual entry code</p>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {manualCode.split("").map((char, i) => (
              <div
                key={i}
                className="w-9 h-11 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center"
              >
                <span className="text-lg font-mono font-semibold text-white tracking-wider">
                  {char}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">Students without camera can type this code</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Students present</h3>
          <span className="text-xs text-slate-400">{presentCount} marked attendance</span>
        </div>

        {presentCount === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2">
            <Users className="w-5 h-5 text-slate-300" />
            <p className="text-sm text-slate-400">No students have marked attendance yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {attendanceRecords.map((record: any, i: number) => {
              const student = record.studentId
              const initials = student.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)

              return (
                <div key={student._id ?? i} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate">{student.name}</p>
                    <p className="text-xs text-slate-400">{student.rollNumber}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}