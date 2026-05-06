import mongoose, { Document } from "mongoose";
import bcrypt from 'bcrypt'

interface UserDocument extends Document {
  name: string
  email: string
  password: string
  role: string
  rollNumber?: number
  refreshToken: string
  createdAt: Date
  expireAt: Date
  comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    required: true,
  },
  rollNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  refreshToken: {
    type: String,
    select: false
  }
}, { timestamps: true })

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

export const UserModel = mongoose.model<UserDocument>("User", userSchema)