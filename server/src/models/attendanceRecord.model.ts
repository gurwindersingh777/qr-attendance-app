import mongoose, { Document } from "mongoose";

interface AttendanceRecordDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceRecordSchema = new mongoose.Schema<AttendanceRecordDocument>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttendanceSession",
      required: true,
    },
  },
  { timestamps: true }
);

attendanceRecordSchema.index({ studentId: 1, sessionId: 1 }, { unique: true });

export const AttendanceRecordModel = mongoose.model<AttendanceRecordDocument>(
  "AttendanceRecord",
  attendanceRecordSchema
);