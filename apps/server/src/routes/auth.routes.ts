import { Router, type Router as RouterType } from 'express'
import {
  register,
  login,
  refreshToken,
  getCurrentUser,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.js'
import { validate, registerSchema, loginSchema } from '../utils/validator.js'

const router: RouterType = Router()

// 公开路由
router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/refresh', refreshToken)

// 需要认证的路由
router.get('/me', authenticate, getCurrentUser)
router.put('/profile', authenticate, updateProfile)
router.put('/password', authenticate, changePassword)

export default router
