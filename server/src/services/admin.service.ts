import { CONFLICT, FORBIDDEN, NOT_FOUND } from "../constants/statusCode.js"
import { SubjectModel } from "../models/subject.model.js"
import { UserModel } from "../models/user.model.js"
import { UpdateUserInput } from "../schemas/user.schema.js"
import { Role } from "../types/role.js"
import { ApiError } from "../utils/ApiError.js"

export const getAllUsers = async (filter: { role?: Role, search?: string }) => {

  const query: Record<string, any> = {}

  if (filter.role) {
    query.role = filter.role
  }

  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { email: { $regex: filter.search, $options: "i" } }
    ]
  }

  const users = await UserModel.find(query).sort({ createdAt: -1 })
  return users
}

export const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId)

  if (!user) {
    throw new ApiError(NOT_FOUND, "User not found")
  }

  return user
}

export const updateUserProfile = async (userId: string, data: UpdateUserInput) => {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw new ApiError(NOT_FOUND, "User not found")
  }

  if (data.email && data.email !== user.email) {
    const emailTaken = await UserModel.findOne({ email: data.email })
    if (emailTaken) {
      throw new ApiError(CONFLICT, "Email is already in use by another user")
    }
  }

  const isNonStudent = (data.role && data.role !== "student") || (!data.role && user.role !== "student")

  if (isNonStudent && data.rollNumber) {
    throw new ApiError(FORBIDDEN, "Only students can have a roll number")
  }
  
  if (data.rollNumber && data.rollNumber !== user.rollNumber) {
    const rollTaken = await UserModel.findOne({
      rollNumber: data.rollNumber,
      _id: { $ne: userId }
    })
    if (rollTaken) {
      throw new ApiError(CONFLICT, "Roll number is already in use")
    }
  }

  if (data.name) user.name = data.name
  if (data.email) user.email = data.email
  if (data.role) user.role = data.role as any
  if (data.rollNumber !== undefined) user.rollNumber = data.rollNumber

  await user.save()
  return user
}

export const deleteUser = async (userId: string) => {
  const user = await UserModel.findById(userId)

  if (!user) {
    throw new ApiError(NOT_FOUND, "User not found");
  }

  if (user.role === "student") {
    await SubjectModel.updateMany(
      { students: userId },
      { $pull: { students: userId } }
    )
  }

  if (user.role === "teacher") {
    await SubjectModel.deleteMany({ teacherId: userId })
  }

  await UserModel.findByIdAndDelete(userId)
  return
}

export const getAllSubjects = async () => {
  const subject = await SubjectModel.find()
    .populate("teacherId", "name email")
    .populate("students", "name email rollNumber")
    .sort({ createdAt: -1 })

  return subject
}