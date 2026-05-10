import api from "@/config/apiClient";
import { Subject, User } from "@/types";
import { ApiResponse } from "@/types/ApiResponse";

export const adminApi = {
  getUsers: (params?: { role?: string, search: string }) =>
    api.get<ApiResponse<User[]>>("/admin/users", { params }).then((res) => res.data),

  getUserById: (id: string) =>
    api.get<ApiResponse<User>>(`/admin/user/${id}`).then((res) => res.data),

  updateUser: (id: string, data: Partial<User>) =>
    api.patch<ApiResponse<User>>(`/admin/user/${id}`, data).then((res) => res.data),

  deleteUser: (id: string) =>
    api.delete<ApiResponse<null>>(`/admin/user/${id}`).then((res) => res.data),

  getSubjects: () =>
    api.get<ApiResponse<Subject[]>>(`/admin/subjects`).then((res) => res.data)
}