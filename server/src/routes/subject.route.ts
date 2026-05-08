import { Router } from "express";
import authorizeRole from "../middlewares/authorizeRole.js";
import {
  createSubjectHandler,
  enrollSubjectHandler,
  getSubjectsHandler,
  getSubjectStudentsHandler,
} from "../controllers/subject.contoller.js";

const subjectRouter = Router()

subjectRouter.post("/", authorizeRole("teacher"), createSubjectHandler)
subjectRouter.get("/", getSubjectsHandler)
subjectRouter.get("/:subjectId/students", authorizeRole("teacher"), getSubjectStudentsHandler)
subjectRouter.post("/enroll", authorizeRole("student"), enrollSubjectHandler)

export default subjectRouter