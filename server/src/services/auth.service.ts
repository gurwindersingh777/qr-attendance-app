import { CONFLICT, NOT_FOUND, UNAUTHORIZED } from "../constants/statusCode.js";
import { UserModel } from "../models/user.model.js";
import { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js";

export const register = async (data: RegisterInput) => {

  const existingUser = await UserModel.findOne({ email: data.email })
  if (existingUser) throw new ApiError(CONFLICT, "User already exists");

  const user = await UserModel.create({
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    rollNumber: data.rollNumber,
  })

  const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role)
  user.refreshToken = refreshToken
  await user.save()
  const createdUser = await UserModel.findById(user._id)

  return { user: createdUser, accessToken, refreshToken }
}

export const login = async (data: LoginInput) => {

  const user = await UserModel.findOne({ email: data.email }).select("+password")
  if (!user) throw new ApiError(NOT_FOUND, "Invalid email or password");

  const isPasswordValid = await user.comparePassword(data.password)
  if (!isPasswordValid) throw new ApiError(UNAUTHORIZED, "Invalid email or password");

  const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role)
  user.refreshToken = refreshToken
  await user.save()
  const loggedInUser = await UserModel.findById(user._id)

  return { user: loggedInUser, accessToken, refreshToken }

}

export const refreshAccessToken = async (refreshToken: string) => {

  const payload = verifyRefreshToken(refreshToken)
  if (!payload) throw new ApiError(UNAUTHORIZED, "Invalid or expired refresh token");

  const user = await UserModel.findById(payload.userId).select("+refreshToken")
  if (!user || user.refreshToken !== refreshToken) throw new ApiError(UNAUTHORIZED, "Invalid refresh token");

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString(), user.role)
  user.refreshToken = newRefreshToken
  await user.save()

  return { accessToken, newRefreshToken }
}