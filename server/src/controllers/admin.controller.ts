import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { deleteUser, getAllSubjects, getAllUsers, getUserById, updateUserProfile } from "../services/admin.service.js";
import { Role } from "../types/role.js";
import { OK } from "../constants/statusCode.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { updateUserSchema } from "../schemas/user.schema.js";

export const getAllUsersHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const role = req.query.role as Role | undefined
    const search = req.query.search as string | undefined
    const users = await getAllUsers({ search, role })

    return res
      .status(OK)
      .json(new ApiResponse(users, "Users fetched successfully"))
  }
)

export const getUserByIdHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string
    const user = await getUserById(userId);

    return res
      .status(OK)
      .json(new ApiResponse(user, "User fetched successfully"))
  }
)

export const updateUserProfileHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string
    const data = updateUserSchema.parse(req.body)
    const updatedUser = await updateUserProfile(userId, data)

    return res
      .status(OK)
      .json(new ApiResponse(updatedUser, "User profile updated sucessfully"))
  }
)

export const deleteUserHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.id as string
    await deleteUser(userId)

    return res
      .status(OK)
      .json(new ApiResponse(null, "User deleted sucessfully"))
  }
)

export const getAllSubjectHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const subjects = await getAllSubjects()

    return res
      .status(OK)
      .json(new ApiResponse(subjects, "Subjects fetched successfully"))
  }
)