import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

export const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn']
  })

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn']
  })

  return { accessToken, refreshToken }
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload
}