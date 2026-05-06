import 'dotenv/config'
import express, { Request, Response } from 'express'
import { connectToDB } from './config/db'
import cookieParser from 'cookie-parser'
import cors from 'cors'

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

const PORT = process.env.PORT || 4000

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server on running on port :", PORT);
  })
})
