// getMyAttendanceSummary
export interface SubjectAttendanceSummary {
  subject: {
    _id: string
    subjectName: string
    subjectCode: string
    teacherId: string
  }
  totalLectures: number
  attendedLectures: number
  percentage: number
}
export interface AttendanceOverview {
  percentage: number
  actionNeeded: number
  subjectsEnrolled: number
}
export interface OverallAttendance {
  overall: AttendanceOverview
  subjects: SubjectAttendanceSummary[]
}

// getMyAttendanceForSubject
export interface SubjectAttendanceSession {
  sessionId: string
  startTime: Date
  endTime: Date
  attended: boolean,
  date : Date
}
export interface SubjectAttendance {
  subject: {
    id: string
    subjectName: string
    subjectCode: string
  }
  attendance: SubjectAttendanceSession[]
  totalSessions : number
  totalAttendedSessions : number
}

// getSubjectAttendanceReport
export interface SubjectAttendanceStudentSummary {
  _id: string

  student: {
    _id: string
    name: string
    email: string
    rollNumber?: string
  }

  totalSessions: number
  attendedSessions: number
  percentage: number
}
export interface SubjectAttendanceStats {
  totalSessions: number
  overallAttendedSessions: number
  overallPercentage: number

  totalStudents: number
  belowThreshold: number
  averageAttendance: number
}
export interface SubjectAttendanceReport {
  subject: {
    id: string
    subjectName: string
    subjectCode: string
  }

  stats: SubjectAttendanceStats

  attendanceSummary: SubjectAttendanceStudentSummary[]
}

// getSessionAttendanceReport
export interface SessionAttendanceRecord {
  _id: string
  studentId: {
    _id: string
    name: string
    email: string
    rollNumber : string
  }
  sessionId: string
  createdAt?: string
  updatedAt?: string
}
export interface SessionAttendanceReport {
  session: {
    id: string
    startTime: Date
    endTime: Date

    subject: {
      _id: string
      subjectName: string
      subjectCode: string
    }
  }

  attendance: SessionAttendanceRecord[]
}