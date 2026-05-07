import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { NOT_FOUND, OK } from "../constants/statusCode.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const getUserHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    
    const user = await UserModel.findById(req.user?.userId)
    if (!user) throw new ApiError(NOT_FOUND, "User not found");
    return res
      .status(OK).json(new ApiResponse(user, "User fetched successfully"))
  }
)