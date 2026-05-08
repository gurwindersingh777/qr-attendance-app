import { Router } from "express";
import authorizeRoles from "../middlewares/authorizeRole.js";
import { getMyAttendanceForSubjectHandler, getMyAttendanceSummaryHandler, getSessionAttendanceReportHandler, getSubjectAttendanceReportHandler } from "../controllers/attendance.controller.js";

const attendanceRouter = Router()

attendanceRouter.get("/summary", authorizeRoles("student"), getMyAttendanceSummaryHandler)
attendanceRouter.get("/subject/:subjectId", authorizeRoles("student"), getMyAttendanceForSubjectHandler)
attendanceRouter.get("/report/subject/:subjectId", authorizeRoles("teacher"), getSubjectAttendanceReportHandler)
attendanceRouter.get("/report/session/:sessionId", authorizeRoles("teacher"), getSessionAttendanceReportHandler)

export default attendanceRouter;