import { CONFLICT, FORBIDDEN, NOT_FOUND } from "../constants/statusCode.js"
import { SubjectModel } from "../models/subject.model.js"
import { CreateSubjectInput } from "../schemas/subject.schema.js"
import { ApiError } from "../utils/ApiError.js"

export const createSubject = async (data: CreateSubjectInput, teacherId: string) => {

  const existing = await SubjectModel.findOne({ subjectCode: data.subjectCode.toUpperCase() })
  if (existing) throw new ApiError(CONFLICT, "Subject code already exists");

  const subject = await SubjectModel.create({
    subjectName: data.subjectName,
    subjectCode: data.subjectCode.toUpperCase(),
    teacherId
  })

  return subject
}

export const getTeacherSubjects = async (teacherId: string) => {
  const subject = await SubjectModel.find({ teacherId })
    .select("-students")
    .sort({ createdAt: -1 })

  return subject
}

export const getSubjectStudents = async (teacherId: string, subjectId: string) => {

  const subject = await SubjectModel.findById(subjectId)
    .populate("students", "name email rollNumber")

  if (!subject) throw new ApiError(NOT_FOUND, "Subject not found");

  if (teacherId !== subject.teacherId.toString()) throw new ApiError(FORBIDDEN, "You do not have access to this subject");

  return subject.students
}

export const enrollSubject = async (studentId: string, subjectCode: string) => {

  const subject = await SubjectModel.findOne({ subjectCode })
  if (!subject) throw new ApiError(NOT_FOUND, "Subject not found");

  const alreadyEnrolled = subject.students.includes(studentId as any)
  if (alreadyEnrolled) throw new ApiError(CONFLICT, "You are already enrolled in this subject");

  subject.students.push(studentId as any)
  await subject.save()

  return { message: "Enroll Successfully" }
}

export const getStudentSubjects = async (studentId: string) => {
  const subjects = await SubjectModel.find({ students: studentId })
    .select("-students")
    .populate("teacherId", "name email")
    .sort({ createdAt: -1 })

  return subjects
}