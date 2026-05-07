import jwt, { JwtPayload as DefaultJwtPayload, SignOptions } from "jsonwebtoken";
import { Role } from "../types/role.js";

export interface JwtPayload extends DefaultJwtPayload {
  userId: string;
  role: Role
}

export const generateTokens = (userId: string, role: Role) => {
  const accessToken = jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn']
  })

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn']
  })

  return { accessToken, refreshToken }
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload
}