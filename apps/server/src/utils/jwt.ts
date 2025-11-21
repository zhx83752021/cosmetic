import jwt, { type SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'

/**
 * 生成访问令牌
 */
export const generateAccessToken = (userId: number, role: string = 'user') => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions)
}

/**
 * 生成刷新令牌
 */
export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as SignOptions)
}

/**
 * 验证令牌
 */
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (_error) {
    return null
  }
}

/**
 * 生成令牌对
 */
export const generateTokenPair = (userId: number, role: string = 'user') => {
  return {
    accessToken: generateAccessToken(userId, role),
    refreshToken: generateRefreshToken(userId),
  }
}
