import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { getMyAttendanceForSubject, getMyAttendanceSummary, getSessionAttendanceReport, getSubjectAttendanceReport } from "../services/attendance.service.js";
import { OK } from "../constants/statusCode.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getMyAttendanceSummaryHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const studentId = req.user!.userId
    const summaries = await getMyAttendanceSummary(studentId)

    return res
      .status(OK)
      .json(new ApiResponse(summaries, "Attendance summary fetched"))
  }
)

export const getMyAttendanceForSubjectHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const studentId = req.user!.userId
    const subjectId = req.params.subjectId as string
    const records = await getMyAttendanceForSubject(studentId, subjectId)

    return res
      .status(OK)
      .json(new ApiResponse(records, "Attendance records fetched"))
  }
)

export const getSubjectAttendanceReportHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const teacherId = req.user!.userId
    const subjectId = req.params.subjectId as string
    const report = await getSubjectAttendanceReport(teacherId, subjectId)

    return res
      .status(OK)
      .json(new ApiResponse(report, "Subject attendance report fetched"))
  }
)

export const getSessionAttendanceReportHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const teacherId = req.user!.userId
    const sessionId = req.params.sessionId as string
    const report = await getSessionAttendanceReport(teacherId, sessionId)

    return res
      .status(OK)
      .json(new ApiResponse(report, "Session attendance report fetched"))
  }
)