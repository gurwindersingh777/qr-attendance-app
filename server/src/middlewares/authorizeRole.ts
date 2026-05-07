import { NextFunction, Request, RequestHandler, Response } from "express"
import { ApiError } from "../utils/ApiError.js"
import { FORBIDDEN } from "../constants/statusCode.js"

type allowedRoles = 'student' | 'teacher' | 'admin'

const authorizeRole = (role: allowedRoles): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user || user.role !== role) throw new ApiError(FORBIDDEN, "Access denied");
    next()
  }
}

export default authorizeRole