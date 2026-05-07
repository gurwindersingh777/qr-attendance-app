import { FORBIDDEN, NOT_FOUND } from "../constants/statusCode.js"
import { AttendanceRecordModel } from "../models/attendanceRecord.model.js"
import { AttendanceSessionModel } from "../models/attendanceSession.model.js"
import { SubjectModel } from "../models/subject.model.js"
import { MarkAttendanceInput, StartSessionInput } from "../schemas/sessoin.schema.js"
import { ApiError } from "../utils/ApiError.js"
import { now, sessionEndTime } from "../utils/date.js"
import { generateManualCode } from "../utils/manualCode.js"
import { generateQRToken, verifyQRToken } from "../utils/qrCode.js"

export const startSession = async (data: StartSessionInput, teacherId: string) => {

  const subject = await SubjectModel.findById(data.subjectId)
  if (!subject) throw new ApiError(NOT_FOUND, "Subject not found");

  if (subject.teacherId.toString() !== teacherId)
    throw new ApiError(FORBIDDEN, "You do not own this subject");

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
  if (!session || !session.active) throw new ApiError(NOT_FOUND, "Session not found");

  if (session?.teacherId.toString() !== teacherId)
    throw new ApiError(FORBIDDEN, "You do not own this subject");

  if (session.endTime < now()) {
    session.active = false;
    await session.save();
    throw new ApiError(NOT_FOUND, "Session ended");
  }

  const qrImage = generateQRToken(sessionId)

  return {
    qrImage,
    manualCode: session.manualCode,
  }
}

export const getActiveSession = async (teacherId: string) => {

  const sessions = await AttendanceSessionModel.find({ teacherId, active: true, })
    .populate("subjectId", "name code")
    .sort({ createdAt: -1 })

  return sessions
}

export const markAttendance = async (data: MarkAttendanceInput, studentId: string) => {

  if (!data.token && !data.manualCode) throw new ApiError(FORBIDDEN, "Provide QR or manual code");

  const session = await AttendanceSessionModel.findById(data.sessionId)
  if (!session || !session.active) throw new Error("Session not found");

  if (session.endTime < now()) throw new ApiError(FORBIDDEN, "Session expired")

  const subject = await SubjectModel.findById(session.subjectId)
  const enrolled = subject?.students.some(id => id.toString() === studentId)
  if (!enrolled) throw new ApiError(FORBIDDEN, "You have not enroll in this subject");

  const alreadyMarked = await AttendanceRecordModel.findOne({ studentId, sessionId: data.sessionId })
  if (alreadyMarked) throw new ApiError(FORBIDDEN, "Attendance already marked");

  if (data.token) {
    const decorded = await verifyQRToken(data.token)
    if (decorded.sessionId !== session._id.toString())
      throw new ApiError(FORBIDDEN, "Invalid QR")
  }

  if (data.manualCode) {
    if (data.manualCode !== session.manualCode) throw new ApiError(FORBIDDEN, "Invalid manual code")
  }

  const record = await AttendanceRecordModel.create({
    studentId,
    sessionId: session._id
  })

  return record
}

export const endSession = async (sessionId: string, teacherId: string) => {

  const session = await AttendanceSessionModel.findById(sessionId)
  if (!session) throw new ApiError(NOT_FOUND, "Session not found")

  if (session?.teacherId.toString() !== teacherId)
    throw new ApiError(FORBIDDEN, "You do not own this subject");

  session.active = false
  await session.save()

  return { message: "Session ended" }
}
