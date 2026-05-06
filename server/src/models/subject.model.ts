import mongoose, { Document } from "mongoose";

export interface SubjectDocument extends Document {
  subjectName: string
  subjectCode: string
  teacherId: mongoose.Types.ObjectId
  students: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const subjectSchema = new mongoose.Schema<SubjectDocument>({
  subjectName: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
    unique: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: []
  }]
}, {
  timestamps: true
})

subjectSchema.index({ teacherId: 1 });

export const SubjectModel = mongoose.model<SubjectDocument>("Subject", subjectSchema)