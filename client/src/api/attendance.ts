import api from "@/config/apiClient";
import { ApiResponse } from "@/types/ApiResponse";
import { OverallAttendance, SessionAttendanceReport, SubjectAttendance, SubjectAttendanceReport } from "@/types/Attendance";

export const attendanceApi = {
  getMySummary: () =>
    api.get<ApiResponse<OverallAttendance>>("/attendance/summary").then((res) => res.data),

  getMyForSubject: (subjectId: string) =>
    api.get<ApiResponse<SubjectAttendance>>(`/attendance/subject/${subjectId}`).then((res) => res.data),

  getSubjectReport: (subjectId: string) =>
    api.get<ApiResponse<SubjectAttendanceReport>>(`/attendance/report/subject/${subjectId}`).then((res) => res.data),

  getSessionReport: (sessionId: string) =>
    api.get<ApiResponse<SessionAttendanceReport>>(`/attendance/report/session/${sessionId}`).then((res) => res.data),
}