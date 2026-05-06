import mongoose, { Document } from "mongoose";

export type NotificationType = "low_attendance" | "warning" | "info";

interface NotificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
  type: NotificationType;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema<NotificationDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["low_attendance", "warning", "info"],
      default: "info"
    },
  },
  { timestamps: true }
)

notificationSchema.index({ userId: 1 });

export const NotificationModel = mongoose.model<NotificationDocument>("Notification", notificationSchema)