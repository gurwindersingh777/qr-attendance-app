import api from "@/config/apiClient";
import { ApiResponse } from "@/types/ApiResponse";


export const notificationApi = {
  getAll: () =>
    api.get<ApiResponse<Notification[]>>("/notification/").then((res) => res.data),

  getUnreadCount: () =>
    api.get<ApiResponse<number>>("/notification/unread-count").then((res) => res.data),

  markRead: (notificationId: string) =>
    api.patch<ApiResponse<Notification>>(`/notification/${notificationId}/read`).then((res) => res.data),

  markAllRead: () =>
    api.patch<ApiResponse<null>>("/notification/read-all").then((res) => res.data),
}