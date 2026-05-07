import { NextFunction, Request, Response } from "express"
import { ApiError } from "../utils/ApiError.js"
import { UNAUTHORIZED } from "../constants/statusCode.js"
import { verifyAccessToken } from "../utils/jwt.js"

const authenticate = async (req: Request, res: Response, next: NextFunction) => {

  const accessToken = req.cookies.accessToken
  if (!accessToken) throw new ApiError(UNAUTHORIZED, "Not Authorized");

  try {
    const payload = verifyAccessToken(accessToken)
    req.user = payload
    next()
  } catch (error: any) {
    throw new ApiError(UNAUTHORIZED, error.message === "jwt expired" ? "Token expried" : "Invalid token")
  }

}

export default authenticate