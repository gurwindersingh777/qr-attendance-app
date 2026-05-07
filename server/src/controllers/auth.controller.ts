import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { LoginInput, loginSchema, RegisterInput, registerSchema } from "../schemas/auth.schema.js";
import { login, refreshAccessToken, register } from "../services/auth.service.js";
import { accessCookieOptions, clearCookies, refreshCookieOptions, setCookies } from "../utils/cookies.js";
import { CREATED, OK, UNAUTHORIZED } from "../constants/statusCode.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { UserModel } from "../models/user.model.js";

export const registerHandler = AsyncHandler(
  async (req: Request, res: Response) => {

    const data: RegisterInput = registerSchema.parse(req.body)
    const { user, accessToken, refreshToken } = await register(data)
    setCookies(res, accessToken, refreshToken)

    return res
      .status(CREATED).json(new ApiResponse(user, "User registered successfully"))
  }
)

export const loginHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const data: LoginInput = loginSchema.parse(req.body)
    const { user, accessToken, refreshToken } = await login(data)
    setCookies(res, accessToken, refreshToken)

    return res
      .status(OK).json(new ApiResponse(user, "User logged in successfully"));
  }
)

export const logoutHandler = AsyncHandler(
  async (req: Request, res: Response) => {

    await UserModel.findByIdAndUpdate(req.user?.userId, { refreshToken: null })
    clearCookies(res)
    return res.status(OK).json(new ApiResponse(null, "User logged out successfully"))

  }
)

export const refreshHandler = AsyncHandler(
  async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) throw new ApiError(UNAUTHORIZED, "Refresh token missing");

    const { accessToken, newRefreshToken } = await refreshAccessToken(refreshToken)
    if (newRefreshToken) res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    return res
      .status(OK)
      .cookie("accessToken", accessToken, accessCookieOptions)
      .json(new ApiResponse(null, "Token refreshed successfully"))
  }
) 