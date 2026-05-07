import 'dotenv/config'
import express, { Request, Response } from 'express'
import { connectToDB } from './config/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler.js'
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import authenticate from './middlewares/authenticate.js'
import subjectRouter from './routes/subject.route.js'
import sessionRouter from './routes/session.route.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use('/health', (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "OK" })
})

app.use("/auth", authRouter)
app.use("/user", authenticate, userRouter)
app.use("/subject", authenticate, subjectRouter)
app.use("/session", authenticate, sessionRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 4000

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server on running on port :", PORT);
  })
})
