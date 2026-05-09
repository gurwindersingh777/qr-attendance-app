import { Router } from "express";
import authorizeRoles from "../middlewares/authorizeRole.js";
import { deleteUserHandler, getAllSubjectHandler, getAllUsersHandler, getUserByIdHandler, updateUserProfileHandler } from "../controllers/admin.controller.js";

const adminRouter = Router()

adminRouter.use(authorizeRoles("admin"))
adminRouter.get("/users", getAllUsersHandler)
adminRouter.get("/user/:id", getUserByIdHandler)
adminRouter.patch("/user/:id", updateUserProfileHandler)
adminRouter.delete("/user/:id", deleteUserHandler)
adminRouter.get("/subjects", getAllSubjectHandler)

export default adminRouter