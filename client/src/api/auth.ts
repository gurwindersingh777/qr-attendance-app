import api from "@/config/apiClient";
import { LoginFormInput, RegisterFormInput } from "@/schemas/auth.schema";
import { User } from "@/types";
import { ApiResponse } from "@/types/ApiResponse";


export const authApi = {
  register: (data: RegisterFormInput) =>
    api.post<ApiResponse<User>>("/auth/register", data).then((res) => res.data),

  login: (data: LoginFormInput) =>
    api.post<ApiResponse<User>>("/auth/login", data).then((res) => res.data),

  logout: () =>
    api.post<ApiResponse<null>>("/auth/logout").then((res) => res.data),

  refresh: () =>
    api.post<ApiResponse<null>>("/auth/refresh").then((res) => res.data),

  getMe: () =>
    api.get<ApiResponse<User>>("/user").then((res) => res.data)
} 