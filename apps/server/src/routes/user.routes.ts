import { Router, type Router as RouterType } from 'express'
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  getUserCoupons,
  claimCoupon,
  getAvailableCoupons,
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
  getPointsHistory,
} from '../controllers/user.controller.js'
import { authenticate } from '../middleware/auth.js'
import { validate, addressSchema } from '../utils/validator.js'

const router: RouterType = Router()

// 地址管理
router.get('/addresses', authenticate, getAddresses)
router.get('/addresses/:id', authenticate, getAddressById)
router.post('/addresses', authenticate, validate(addressSchema), createAddress)
router.put('/addresses/:id', authenticate, updateAddress)
router.delete('/addresses/:id', authenticate, deleteAddress)

// 优惠券
router.get('/coupons', authenticate, getUserCoupons)
router.post('/coupons/claim', authenticate, claimCoupon)
router.get('/coupons/available', getAvailableCoupons)

// 收藏
router.get('/favorites', authenticate, getFavorites)
router.post('/favorites', authenticate, addFavorite)
router.delete('/favorites/:productId', authenticate, removeFavorite)
router.get('/favorites/:productId/check', authenticate, checkFavorite)

// 积分
router.get('/points', authenticate, getPointsHistory)

export default router
