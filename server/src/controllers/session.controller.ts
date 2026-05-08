import { CREATED, OK } from "../constants/statusCode.js";
import { markAttendanceSchema, startSessionSchema } from "../schemas/sessoin.schema.js";
import { endSession, generateQR, getActiveSession, markAttendance, startSession } from "../services/session.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

export const startSessionHandler = AsyncHandler(
  async (req, res) => {
    const data = startSessionSchema.parse(req.body)
    const teacherId = req.user?.userId as string
    const session = await startSession(data, teacherId)

    return res
      .status(CREATED).json(new ApiResponse(session, "Session started"))
  }
)

export const endSessionHandler = AsyncHandler(
  async (req, res) => {
    const teacherId = req.user?.userId as string
    const sessionId = req.params.sessionId as string
    const result = await endSession(sessionId, teacherId)

    return res
      .status(OK).json(new ApiResponse(result.message, "Session ended"))
  }
)

export const getActiveSessionHandler = AsyncHandler(
  async (req, res) => {
    const teacherId = req.user?.userId as string
    const session = await getActiveSession(teacherId)

    return res
      .status(OK).json(new ApiResponse(session, "Active session fetched"))
  }
)

export const generateQRHandler = AsyncHandler(
  async (req, res) => {
    const teacherId = req.user?.userId as string
    const sessionId = req.params.sessionId as string
    const sessions = await generateQR(sessionId, teacherId)

    return res
      .status(OK).json(new ApiResponse(sessions, "QR generated"))
  }
)

export const markAttendanceHandler = AsyncHandler(
  async (req, res) => {
    const studentId = req.user!.userId
    const data = markAttendanceSchema.parse(req.body)

    const record = await markAttendance(data, studentId)

    return res
      .status(OK)
      .json(new ApiResponse(record, "Attendance marked"))
  }
)