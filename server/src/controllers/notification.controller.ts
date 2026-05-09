import { Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { getMyNotifications, getUnreadCount, markAllNotificationsRead, markNotificationRead } from "../services/notification.service.js";
import { OK } from "../constants/statusCode.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getMyNotificationsHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string
    const notifictaions = await getMyNotifications(userId)

    return res
      .status(OK)
      .json(new ApiResponse(notifictaions, "Notifications fetched"))
  }
)

export const getUnreadCountHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string
    const count = await getUnreadCount(userId)

    return res
      .status(OK)
      .json(new ApiResponse(count, "Unread count fetched"))
  }
)

export const markNotificationReadHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string
    const notificationId = req.params.notificationId as string
    const notification = await markNotificationRead(notificationId, userId)

    return res
      .status(OK)
      .json(new ApiResponse(notification, "Notification marked as read"))
  }
)

export const markAllNotificationsReadHandler = AsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId as string
    await markAllNotificationsRead(userId)

    return res
      .status(OK)
      .json(new ApiResponse(null, "All notifications are marked Successfully"))
  }
)