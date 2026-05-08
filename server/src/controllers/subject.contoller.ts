import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { createSubject, enrollSubject, getSubjects, getSubjectStudents } from "../services/subject.service.js";
import { createSubjectSchema, enrollSchema } from "../schemas/subject.schema.js";
import { CREATED, OK } from "../constants/statusCode.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const createSubjectHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const teacherId = req.user?.userId as string
    const data = createSubjectSchema.parse(req.body)
    const subject = await createSubject(data, teacherId)

    return res
      .status(CREATED).json(new ApiResponse(subject, "Subject created successfully"))
  }
)

export const getSubjectsHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string
    const role = req.user?.role as string
    const subjects = await getSubjects(userId, role)

    return res
      .status(OK).json(new ApiResponse(subjects, "Subjects fetched successfully"))
  }
)

export const getSubjectStudentsHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const teacherId = req.user?.userId as string
    const subjectId = req.params.subjectId as string
    const students = await getSubjectStudents(teacherId, subjectId)

    return res
      .status(OK).json(new ApiResponse(students, "Students in subjects fetched successfully"))
  }
)

export const enrollSubjectHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const studentId = req.user?.userId as string
    const { subjectCode } = enrollSchema.parse(req.body)
    await enrollSubject(studentId, subjectCode)

    return res
      .status(OK).json(new ApiResponse(null, "Enrolled successfully"))
  }
)




