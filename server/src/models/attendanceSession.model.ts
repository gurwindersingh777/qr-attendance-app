import mongoose, { Document } from "mongoose";

export interface AttendanceSessionDocument extends Document {
  teacherId: mongoose.Types.ObjectId
  subjectId: mongoose.Types.ObjectId
  startTime: Date
  endTime: Date
  manualCode: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const attendanceSessionSchema = new mongoose.Schema<AttendanceSessionDocument>(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    manualCode: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

attendanceSessionSchema.index({ teacherId: 1 })
attendanceSessionSchema.index({ subjectId: 1 })

export const AttendanceSessionModel = mongoose.model("AttendanceSession", attendanceSessionSchema)