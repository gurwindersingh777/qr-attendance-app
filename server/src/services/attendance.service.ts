import { FORBIDDEN, NOT_FOUND } from "../constants/statusCode.js"
import { AttendanceRecordModel } from "../models/attendanceRecord.model.js"
import { AttendanceSessionModel } from "../models/attendanceSession.model.js"
import { AttendanceSummaryModel } from "../models/attendanceSummary.model.js"
import { SubjectModel } from "../models/subject.model.js"
import { ApiError } from "../utils/ApiError.js"

export const getMyAttendanceSummary = async (studentId: string) => {

  const enrolledSubjects = await SubjectModel.find({ students: studentId })

  const subjectSummaries = await Promise.all(
    enrolledSubjects.map(async (subject) => {

      const allSessionIds = await AttendanceSessionModel.find({ subjectId: subject._id }).distinct("_id")
      const totalSessions = allSessionIds.length
      const attendedSessions = await AttendanceRecordModel.countDocuments({
        studentId,
        sessionId: { $in: allSessionIds },
      })
      const percentage = totalSessions === 0 ? 0 : Number(((attendedSessions / totalSessions) * 100)
        .toFixed(2))

      return {
        subject: {
          _id: subject._id,
          subjectName: subject.subjectName,
          subjectCode: subject.subjectCode,
          teacherId: subject.teacherId,
        },
        totalLectures: totalSessions,
        attendedLectures: attendedSessions,
        percentage,
      }
    })
  )

  const totalLectures = subjectSummaries.reduce((acc, s) => acc + s.totalLectures, 0)
  const totalAttendedLectures = subjectSummaries.reduce((acc, s) => acc + s.attendedLectures, 0)
  const overallPercentage = totalLectures === 0 ? 0 : Number(((totalAttendedLectures / totalLectures) * 100)
    .toFixed(2))
  const THRESHOLD = Number(process.env.LOW_ATTENDANCE_THRESHOLD) || 75
  const actionNeeded = overallPercentage < THRESHOLD

  return {
    overall: {
      percentage: overallPercentage,
      actionNeeded,
      subjectsEnrolled: enrolledSubjects.length,
    },
    subjects: subjectSummaries,
  }
}

export const getMyAttendanceForSubject = async (studentId: string, subjectId: string) => {

  const subject = await SubjectModel.findById(subjectId)

  if (!subject) {
    throw new ApiError(NOT_FOUND, "Subject not found")
  }

  const isEnrolled = subject.students.includes(studentId as any)
  if (!isEnrolled) {
    throw new ApiError(FORBIDDEN, "You are not enrolled in this subject")
  }

  const sessions = await AttendanceSessionModel.find({ subjectId }).sort({ startTime: -1 });

  const records = await AttendanceRecordModel.find({ studentId })

  const attendedSessionIds = new Set(records.map(record => record.sessionId.toString()))

  const attendance = sessions.map(session => ({
    sessionId: session._id,
    startTime: session.startTime,
    endTime: session.endTime,
    attended: attendedSessionIds.has(session._id.toString()),
    date: session.createdAt
  }))

  const totalAttendedSessions = attendance.filter(a => a.attended).length

  return {
    subject: {
      id: subject._id,
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode
    },
    attendance,
    totalSessions: sessions.length,
    totalAttendedSessions
  }
}

export const getSubjectAttendanceReport = async (teacherId: string, subjectId: string) => {
  const subject = await SubjectModel.findById(subjectId).populate("students", "name email");

  if (!subject) {
    throw new ApiError(NOT_FOUND, "Subject not found")
  }

  if (subject.teacherId.toString() !== teacherId) {
    throw new ApiError(FORBIDDEN, "You do not own this subject")
  }

  const summaries = await AttendanceSummaryModel.find({ subjectId })
    .populate("studentId", "name email")

  const attendanceSummary = summaries.map(summary => ({
    _id: summary._id,
    student: summary.studentId,
    totalSessions: summary.totalSessions,
    attendedSessions: summary.attendedSessions,
    percentage: summary.totalSessions === 0
      ? 0
      : Number(((summary.attendedSessions / summary.totalSessions) * 100).toFixed(2))
  }))

  const overallTotalSessions = await AttendanceSessionModel.countDocuments({ subjectId })

  const overallAttendedSessions = summaries.reduce((acc, summary) => acc + summary.attendedSessions, 0)

  const totalPossibleAttendances = overallTotalSessions * summaries.length;

  const overallPercentage =
    totalPossibleAttendances === 0
      ? 0
      : Number(((overallAttendedSessions / totalPossibleAttendances) * 100).toFixed(2))

  const totalStudents = attendanceSummary.length

  const belowThreshold = attendanceSummary.filter(s => s.percentage < 75).length

  const averageAttendance =
    totalStudents === 0
      ? 0
      : Math.round(attendanceSummary.reduce((acc, s) => acc + s.percentage, 0) / totalStudents)

  return {
    subject: {
      id: subject._id,
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode
    },

    stats: {
      totalSessions: overallTotalSessions,
      overallAttendedSessions,
      overallPercentage,
      totalStudents,
      belowThreshold,
      averageAttendance,
    },

    attendanceSummary
  }
}

export const getSessionAttendanceReport = async (teacherId: string, sessionId: string) => {
  const session = await AttendanceSessionModel.findById(sessionId)
    .populate("subjectId", "subjectName subjectCode")

  if (!session) {
    throw new ApiError(NOT_FOUND, "Session not found")
  }

  if (session.teacherId.toString() !== teacherId) {
    throw new ApiError(FORBIDDEN, "You do not own this session")
  }

  const records = await AttendanceRecordModel.find({ sessionId })
    .populate("studentId", "name email rollNumber")

  return {
    session: {
      id: session._id,
      startTime: session.startTime,
      endTime: session.endTime,
      subject: session.subjectId
    },
    attendance: records
  }
}