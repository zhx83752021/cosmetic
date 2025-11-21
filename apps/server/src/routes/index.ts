import { Router, type Router as RouterType } from 'express'
import authRoutes from './auth.routes.js'
import productRoutes from './product.routes.js'
import orderRoutes from './order.routes.js'
import userRoutes from './user.routes.js'
import adminRoutes from './admin.routes.js'
import articleRoutes from './article.routes.js'

const router: RouterType = Router()

// 路由注册
router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/orders', orderRoutes)
router.use('/users', userRoutes)
router.use('/admin', adminRoutes)
router.use('/articles', articleRoutes)

// 测试路由
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'API正常工作', timestamp: new Date().toISOString() })
})

export default router
