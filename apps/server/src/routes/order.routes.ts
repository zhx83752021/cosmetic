import { Router, type Router as RouterType } from 'express'
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  confirmOrder,
  refundOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate, createOrderSchema } from '../utils/validator.js'

const router: RouterType = Router()

// 用户订单路由
router.post('/', authenticate, validate(createOrderSchema), createOrder)
router.get('/', authenticate, getOrders)
router.get('/:id', authenticate, getOrderById)
router.put('/:id/cancel', authenticate, cancelOrder)
router.put('/:id/confirm', authenticate, confirmOrder)
router.put('/:id/refund', authenticate, refundOrder)

// 管理员订单路由
router.get('/admin/all', authenticate, authorize('admin'), getAllOrders)
router.put('/admin/:id/status', authenticate, authorize('admin'), updateOrderStatus)

export default router
