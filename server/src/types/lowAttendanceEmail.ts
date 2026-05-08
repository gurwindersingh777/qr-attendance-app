
export interface LowAttendanceEmailProps {
  studentName: string
  subjectName: string
  subjectCode: string
  attendancePercentage: number
}

export interface SendLowAttendanceEmailProps extends LowAttendanceEmailProps {
  toEmail: string
}