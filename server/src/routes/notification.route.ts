import { Router } from "express"
import { getMyNotificationsHandler, getUnreadCountHandler, markAllNotificationsReadHandler, markNotificationReadHandler } from "../controllers/notification.controller.js"

const notificationRouter = Router()

notificationRouter.get("/", getMyNotificationsHandler)
notificationRouter.get("/unread-count", getUnreadCountHandler)
notificationRouter.patch("/:notificationId/read", markNotificationReadHandler)
notificationRouter.patch("/read-all", markAllNotificationsReadHandler)

export default notificationRouter