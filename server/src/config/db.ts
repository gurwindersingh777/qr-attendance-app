import mongoose from "mongoose"

export const connectToDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI!)
    console.log("MongoDB connected successfully :", connectionInstance.connection.host);

  } catch (error: any) {
    console.log("MongoDB connection failed", error);
    process.exit(1)
  }
}