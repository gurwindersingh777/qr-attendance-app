import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { createSubject, enrollSubject, getStudentSubjects, getSubjectStudents, getTeacherSubjects } from "../services/subject.service.js";
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

export const getTeacherSubjectsHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const teacherId = req.user?.userId as string
    const subjects = await getTeacherSubjects(teacherId)

    return res
      .status(OK).json(new ApiResponse(subjects, "Teacher subjects fetched successfully"))
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
    const result = await enrollSubject(studentId , subjectCode)

    return res
      .status(OK).json(new ApiResponse(result.message, "Enrolled successfully"))
  }
)

export const getStudentSubjectsHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const studentId = req.user?.userId as string
    const subjects = await getStudentSubjects(studentId)

    return res
      .status(OK).json(new ApiResponse(subjects, "Student subjects fetched successfully"))
  }
)



