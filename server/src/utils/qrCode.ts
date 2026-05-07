import jwt from 'jsonwebtoken'
import QRCode from 'qrcode'
import { ApiError } from './ApiError.js'
import { FORBIDDEN } from '../constants/statusCode.js'

export const generateQRToken = async (sessionId: string) => {

  const token = jwt.sign(
    { sessionId },
    process.env.QR_SECRET!,
    { expiresIn: "30s" }
  )

  const qrData = JSON.stringify({ sessionId, token }) 
  const qrImage = await QRCode.toDataURL(qrData)
  return qrImage
}

export const verifyQRToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.QR_SECRET!) as { sessionId: string }
    return decoded
  } catch (error) {
    throw new ApiError(FORBIDDEN, "QR expired")
  }
}