import { FORBIDDEN, NOT_FOUND } from "../constants/statusCode.js"
import { NotificationModel } from "../models/notification.model.js"
import { ApiError } from "../utils/ApiError.js"


export const getMyNotifications = async (userId: string) => {
  const notifications = await NotificationModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)

  return notifications
}

export const getUnreadCount = async (userId: string) => {

  const unreadCount = await NotificationModel.countDocuments({
    userId,
    isRead: false
  })

  return unreadCount
}

export const markNotificationRead = async (notificationId: string, userId: string) => {

  const notification = await NotificationModel.findById(notificationId)
  if (!notification) {
    throw new ApiError(NOT_FOUND, "notification not found")
  }

  if (notification.userId.toString() !== userId) {
    throw new ApiError(FORBIDDEN, "You cannot modify this notification");
  }

  notification.isRead = true
  await notification.save()

  return notification
}

export const markAllNotificationsRead = async (userId: string) => {

  await NotificationModel.updateMany(
    { userId, isRead: false },
    { isRead: true }
  )

  return 
}