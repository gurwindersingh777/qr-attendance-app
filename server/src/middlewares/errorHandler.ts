import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { REFRESH_PATH } from "../constants/refreshPath.js";
import { clearCookies } from "../utils/cookies.js";
import z from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/statusCode.js";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.log(`PATH : ${req.path} error : ${err.message}`);

  if (req.path === REFRESH_PATH) {
    clearCookies(res)
  }

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((err) => ({
      path: err.path.join("."),
      message: err.message
    }))

    return res.status(BAD_REQUEST).json({
      success: false,
      errors
    })
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }

  return res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error"
  })
}