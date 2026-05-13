import { BAD_REQUEST, CONFLICT, FORBIDDEN, NOT_FOUND } from "../constants/statusCode.js"
import { AttendanceRecordModel } from "../models/attendanceRecord.model.js"
import { AttendanceSessionDocument, AttendanceSessionModel } from "../models/attendanceSession.model.js"
import { AttendanceSummaryModel } from "../models/attendanceSummary.model.js"
import { NotificationModel } from "../models/notification.model.js"
import { SubjectModel } from "../models/subject.model.js"
import { MarkAttendanceInput, StartSessionInput } from "../schemas/sessoin.schema.js"
import { ApiError } from "../utils/ApiError.js"
import { now, oneDayAgo, sessionEndTime } from "../utils/date.js"
import { generateManualCode } from "../utils/manualCode.js"
import { generateQRToken, verifyQRToken } from "../utils/qrCode.js"
import { sendLowAttendanceEmail } from "../utils/sendLowAttendanceEmail.js"

const updateAttendanceSummary = async (session: AttendanceSessionDocument) => {

  const subject = await SubjectModel.findById(session.subjectId).populate("students", "name email")

  if (!subject) {
    throw new ApiError(NOT_FOUND, "Subject not found")
  }

  for (const student of subject.students as any[]) {

    const summary = await AttendanceSummaryModel.findOneAndUpdate(
      { studentId: student._id, subjectId: subject._id },
      { $inc: { totalSessions: 1 } },
      { returnDocument: "after", upsert: true }
    )

    const attendancePercentage = summary.totalSessions === 0
      ? 0
      : (summary.attendedSessions / summary.totalSessions) * 100

    const LOW_ATTENDANCE_THRESHOLD = Number(process.env.LOW_ATTENDANCE_THRESHOLD) || 75

    if (attendancePercentage < LOW_ATTENDANCE_THRESHOLD) {

      const recentNotifcation = await NotificationModel.findOne({
        userId: student._id,
        type: "low_attendance",
        createdAt: { $gt: oneDayAgo() }
      })

      if (!recentNotifcation) {

        await sendLowAttendanceEmail({
          toEmail: student.email,
          studentName: student.name,
          subjectName: subject.subjectName,
          subjectCode: subject.subjectCode,
          attendancePercentage
        })

        await NotificationModel.create({
          userId: student._id,
          message: `Your attendance in ${subject.subjectName} (${subject.subjectCode}) is ${attendancePercentage}%. Minimum required is 75%.`,
          type: "low_attendance",
        })
      }
    }
  }
}

export const startSession = async (data: StartSessionInput, teacherId: string) => {

  const subject = await SubjectModel.findById(data.subjectId)
  if (!subject) {
    throw new ApiError(NOT_FOUND, "Subject not found")
  }

  if (subject.teacherId.toString() !== teacherId) {
    throw new ApiError(FORBIDDEN, "You do not own this subject")
  }

  const activeSession = await AttendanceSessionModel.findOne({
    subjectId: data.subjectId,
    active: true,
    endTime: { $gt: now() }
  })

  if (activeSession) {
    throw new ApiError(CONFLICT, "A session is already active for this subject")
  }

  const session = await AttendanceSessionModel.create({
    teacherId,
    subjectId: data.subjectId,
    startTime: now(),
    endTime: sessionEndTime(data.durationMinutes),
    manualCode: generateManualCode()
  })

  return session
}

export const generateQR = async (sessionId: string, teacherId: string) => {

  const session = await AttendanceSessionModel.findById(sessionId)
  if (!session || !session.active) {
    throw new ApiError(NOT_FOUND, "Session not found")
  }

  if (session?.teacherId.toString() !== teacherId) {
    throw new ApiError(FORBIDDEN, "You do not own this subject")
  }

  if (session.endTime < now()) {
    session.active = false;
    await session.save();
    throw new ApiError(NOT_FOUND, "Session has already ended");
  }

  const qrImage = await generateQRToken(sessionId)

  return {
    qrImage,
    manualCode: session.manualCode,
  }
}

export const getSession = async (sessionId: string, teacherId: string) => {

  const session = await AttendanceSessionModel.findById(sessionId)
    .populate("subjectId", "subjectName subjectCode")

  if (!session) {
    throw new ApiError(NOT_FOUND, "Session not found")
  }

  if (session?.teacherId.toString() !== teacherId) {
    throw new ApiError(FORBIDDEN, "You do not own this subject")
  }

  if (!session.active) {
    throw new ApiError(FORBIDDEN, "Session has already ended")
  }

  return session
}

export const getActiveSession = async (teacherId: string) => {

  await AttendanceSessionModel.updateMany({
    teacherId,
    active: true,
    endTime: { $lt: now() }
  }, { active: false })

  const sessions = await AttendanceSessionModel.find({ teacherId, active: true, })
    .populate("subjectId", "subjectName subjectCode")

  if (!sessions) return null;

  return sessions
}

export const markAttendance = async (data: MarkAttendanceInput, studentId: string) => {

  if (data.token && data.manualCode) {
    throw new ApiError(BAD_REQUEST, "Use either QR or manual code")
  }

  let session: AttendanceSessionDocument | null = null

  if (data.token) {
    const decoded = await verifyQRToken(data.token)
    session = await AttendanceSessionModel.findById(decoded.sessionId)

    if (!session || !session.active) {
      throw new ApiError(NOT_FOUND, "Session not found")
    }
  }

  if (data.manualCode) {
    session = await AttendanceSessionModel.findOne({
      manualCode: data.manualCode,
      active: true,
      endTime: { $gt: now() }
    })

    if (!session) {
      throw new ApiError(NOT_FOUND, "Invalid manual code")
    }
  }

  if (!session || !session.active) {
    throw new ApiError(NOT_FOUND, "Session not found")
  }

  if (session.endTime < now()) {
    throw new ApiError(FORBIDDEN, "This session has ended")
  }

  const subject = await SubjectModel.findById(session.subjectId)
  const enrolled = subject?.students.some(id => id.toString() === studentId)
  if (!enrolled) {
    throw new ApiError(FORBIDDEN, "You have not enrolled in this subject")
  }

  const alreadyMarked = await AttendanceRecordModel.findOne({ studentId, sessionId: session._id })
  if (alreadyMarked) throw new ApiError(FORBIDDEN, "You have already marked attendance for this session");

  const record = await AttendanceRecordModel.create({
    studentId,
    sessionId: session._id
  })

  await AttendanceSummaryModel.findOneAndUpdate(
    { studentId, subjectId: session.subjectId },
    { $inc: { attendedSessions: 1 } },
    { upsert: true })

  return record
}

export const endSession = async (sessionId: string, teacherId: string) => {

  const session = await AttendanceSessionModel.findById(sessionId)
  if (!session) {
    throw new ApiError(NOT_FOUND, "Session not found")
  }

  if (session?.teacherId.toString() !== teacherId) {
    throw new ApiError(FORBIDDEN, "You do not own this subject")
  }

  if (!session.active) {
    return { message: "Session has already ended" }
  }

  session.active = false
  await session.save()

  await updateAttendanceSummary(session)

  return null
}
