import { Router } from "express";
import { endSessionHandler, generateQRHandler, getActiveSessionHandler, markAttendanceHandler, startSessionHandler } from "../controllers/session.controller.js";
import authorizeRole from "../middlewares/authorizeRole.js";

const sessionRouter = Router()

sessionRouter.post("/start", authorizeRole("teacher"), startSessionHandler)
sessionRouter.get("/:sessionId/qr", authorizeRole("teacher"), generateQRHandler)
sessionRouter.get("/active", authorizeRole("teacher"), getActiveSessionHandler)
sessionRouter.post("/attendance", authorizeRole("student"), markAttendanceHandler)
sessionRouter.post("/:sessionId/end", authorizeRole("teacher"), endSessionHandler)

export default sessionRouter