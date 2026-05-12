import { sessionApi } from "@/api/session"
import { subjectApi } from "@/api/subject"
import PageLoader from "@/components/shared/PageLoader"
import StartSessionDialog from "@/components/shared/StartSessionDialog"
import StatCard from "@/components/shared/StatCard"
import { Session, Subject } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { formatTime } from "@/utils/formatDate";
import { ChevronRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

function ActiveSessionCard({ session }: { session: Session }) {
  const timeLeft = useSessionTimer(session.endTime)
  const subject = session.subjectId as any

  return (
    <Link
      to={`/teacher/session/${session._id}`}
      className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100/50 transition-colors group"
    >
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 animate-pulse shrink-0" />
        <div>
          <p className="text-sm font-semibold text-green-900">
            {subject?.subjectName ?? 'Session'}
          </p>
          <p className="text-xs text-green-700 mt-0.5">
            {subject?.subjectCode}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-green-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeLeft} left
            </span>
            <span className="text-xs text-green-600 flex items-center gap-1">
              Started {formatTime(session.startTime)}
            </span>
          </div>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-green-400 group-hover:text-green-600 transition-colors" />
    </Link>
  )
}

export default function TeacherDashboard() {

  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects', 'teacher'],
    queryFn: () => subjectApi.getSubjects(),
  })

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions', 'active'],
    queryFn: () => sessionApi.active(),
    refetchInterval: 30000,
  })

  const subjects: Subject[] = subjectsData?.data ?? []
  const activeSessions: Session[] = sessionsData?.data ?? []

  if (subjectsLoading || sessionsLoading) return <PageLoader />

  return (
    <div className="max-w-3xl space-y-6">
      <p className="text-sm text-slate-500 mt-0.5">
        {activeSessions.length > 0
          ? `${activeSessions.length} session${activeSessions.length > 1 ? 's' : ''} running right now`
          : 'No active sessions — start one when class begins'}
      </p>
      <StartSessionDialog />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatCard
          label="My subjects"
          value={subjects.length}
          sub="Total subjects you teach"
        />
        <StatCard
          label="Active sessions"
          value={activeSessions.length}
          valueClassName={activeSessions.length > 0 ? 'text-green-600' : ''}
          sub={activeSessions.length > 0 ? 'Live right now' : 'None running'}
        />
      </div>

      {activeSessions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Live sessions
          </h3>
          {activeSessions.map((session) => (
            <ActiveSessionCard key={session._id} session={session} />
          ))}
        </div>
      )}

    </div>
  )
}
