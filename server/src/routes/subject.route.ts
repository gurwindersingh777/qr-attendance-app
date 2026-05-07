import { Router } from "express";
import authorizeRole from "../middlewares/authorizeRole.js";
import {
  createSubjectHandler,
  enrollSubjectHandler,
  getTeacherSubjectsHandler,
  getStudentSubjectsHandler,
  getSubjectStudentsHandler,
} from "../controllers/subject.contoller.js";

const subjectRouter = Router()

subjectRouter.post("/", authorizeRole("teacher"), createSubjectHandler)
subjectRouter.get("/teacher", authorizeRole("teacher"), getTeacherSubjectsHandler)
subjectRouter.get("/:subjectId/students", authorizeRole("teacher"), getSubjectStudentsHandler)
subjectRouter.post("/enroll", authorizeRole("student"), enrollSubjectHandler)
subjectRouter.get("/student", authorizeRole("student"), getStudentSubjectsHandler)

export default subjectRouter