import { Router } from "express";
import { getUserHandler } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.get("/", getUserHandler)

export default userRouter