import api from "@/config/apiClient";
import { MarkAttendanceInput, StartSessionInput } from "@/schemas/sesssion.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { Record, Session } from "@/types";

export const sessionApi = {
  start: (data: StartSessionInput) =>
    api.post<ApiResponse<Session>>("/session/start/", data).then((res) => res.data),

  end: (sessionId: string) =>
    api.post<ApiResponse<null>>(`/session/${sessionId}/end/`).then((res) => res.data),

  generateQR: (sessionId: string) =>
    api.get<ApiResponse<{ qrImage: string, manualCode: string }>>(`/session/${sessionId}/qr/`).then((res) => res.data),

  getSession: (sessionId: string) =>
    api.get<ApiResponse<Session>>(`/session/${sessionId}/`).then((res) => res.data),

  active: () =>
    api.get<ApiResponse<Session[] | null>>(`/session/active/`).then((res) => res.data),

  attendance: (data: MarkAttendanceInput) =>
    api.post<ApiResponse<Record>>(`/session/attendance`, data).then((res) => res.data),
}