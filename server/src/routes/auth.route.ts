import { Router } from "express";
import { loginHandler, logoutHandler, refreshHandler, registerHandler } from "../controllers/auth.controller.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = Router()

authRouter.post("/register", registerHandler)
authRouter.post("/login", loginHandler)
authRouter.post("/logout", authenticate, logoutHandler)
authRouter.post("/refresh", refreshHandler)

export default authRouter