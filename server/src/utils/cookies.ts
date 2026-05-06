import { CookieOptions, Response } from "express";
import { REFRESH_PATH } from "../constants/refreshPath.js";
import { oneDayFromNow, sevenDaysFromNow } from "./date.js";

const cookieOption: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
}

const accessCookieOptions: CookieOptions = {
  ...cookieOption,
  expires: oneDayFromNow()
}

const refreshCookieOptions: CookieOptions = {
  ...cookieOption,
  expires: sevenDaysFromNow(),
  path: REFRESH_PATH
}

export function setCookies(res: Response, accessToken: string, refreshToken: string) {
  res
    .cookie("accessToken", accessToken, accessCookieOptions)
    .cookie("refreshToken", refreshToken, refreshCookieOptions)
}

export function clearCookies(res: Response) {
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken", { path: REFRESH_PATH })
}