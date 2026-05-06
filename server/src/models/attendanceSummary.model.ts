import mongoose, { Document } from "mongoose";

interface AttendanceSummaryDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  totalSessions: number;
  attendedSessions: number;
  attendancePercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSummarySchema = new mongoose.Schema<AttendanceSummaryDocument>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    totalSessions: {
      type: Number,
      required: true,
      default: 0,
    },
    attendedSessions: {
      type: Number,
      required: true,
      default: 0,
    },
    attendancePercentage: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

attendanceSummarySchema.index({ studentId: 1, subjectId: 1 }, { unique: true });

export const AttendanceSummaryModel = mongoose.model<AttendanceSummaryDocument>(
  "AttendanceSummary",
  attendanceSummarySchema
);