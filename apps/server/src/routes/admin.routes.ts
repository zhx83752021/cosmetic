import { Router, type Router as RouterType } from 'express'
import {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getReviews,
  updateReviewStatus,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getSalesStats,
} from '../controllers/admin.controller.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate, couponSchema } from '../utils/validator.js'

const router: RouterType = Router()

// 所有路由都需要管理员权限
router.use(authenticate, authorize('admin'))

// 仪表盘
router.get('/dashboard', getDashboardStats)

// 用户管理
router.get('/users', getUsers)
router.put('/users/:id/status', updateUserStatus)

// 评论管理
router.get('/reviews', getReviews)
router.put('/reviews/:id/status', updateReviewStatus)

// 优惠券管理
router.get('/coupons', getCoupons)
router.post('/coupons', validate(couponSchema), createCoupon)
router.put('/coupons/:id', updateCoupon)
router.delete('/coupons/:id', deleteCoupon)

// 统计报表
router.get('/stats/sales', getSalesStats)

export default router
