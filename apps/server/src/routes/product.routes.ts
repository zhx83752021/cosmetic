import { Router, type Router as RouterType } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getHotProducts,
  getNewProducts,
} from '../controllers/product.controller.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate, productSchema, categorySchema } from '../utils/validator.js'

const router: RouterType = Router()

// 公开路由 - 商品
router.get('/', getProducts)
router.get('/hot', getHotProducts)
router.get('/new', getNewProducts)
router.get('/:id', getProductById)

// 公开路由 - 分类
router.get('/categories/all', getCategories)
router.get('/categories/:id', getCategoryById)

// 管理员路由 - 商品
router.post('/', authenticate, authorize('admin'), validate(productSchema), createProduct)
router.put('/:id', authenticate, authorize('admin'), updateProduct)
router.delete('/:id', authenticate, authorize('admin'), deleteProduct)

// 管理员路由 - 分类
router.post(
  '/categories',
  authenticate,
  authorize('admin'),
  validate(categorySchema),
  createCategory
)
router.put('/categories/:id', authenticate, authorize('admin'), updateCategory)
router.delete('/categories/:id', authenticate, authorize('admin'), deleteCategory)

export default router
