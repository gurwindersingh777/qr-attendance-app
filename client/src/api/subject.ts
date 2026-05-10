import api from "@/config/apiClient";
import { CreateSubjectInput } from "@/schemas/subject.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { Subject, User } from "@/types";


export const subjectApi = {
  create: (data: CreateSubjectInput) =>
    api.post<ApiResponse<Subject>>("/subject/", data).then((res) => res.data),

  getSubjects: () =>
    api.get<ApiResponse<Subject[]>>("/subject/").then((res) => res.data),

  getSubjectStudents: (subjectId: string) =>
    api.get<ApiResponse<User[]>>(`/subject/${subjectId}/students`).then((res) => res.data),

  enroll: (subjectCode: string) =>
    api.post<ApiResponse<null>>(`/subject/enroll`, { subjectCode }).then((res) => res.data),
}