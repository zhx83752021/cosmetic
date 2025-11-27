import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/logger.js'
import routes from './routes/index.js'
// 加载环境变量
dotenv.config()
const app: express.Express = express()
const PORT = process.env.PORT || 3001
// 安全中间件
app.use(helmet())
// CORS配置
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
      : ['https://hi-ultra.com', 'https://www.hi-ultra.com', 'https://cosmetic-ve.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174']
app.use(
  cors({
    origin: (origin, callback) => {
      // 允许没有 origin 的请求（如 Postman、服务器端请求）
      if (!origin) return callback(null, true)
      // 开发环境：允许所有 localhost
      if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:')) {
        return callback(null, true)
      }
      // 生产环境：允许 Vercel 预览和生产域名
      if (process.env.NODE_ENV === 'production' && origin.endsWith('.vercel.app')) {
        return callback(null, true)
      }
      // 检查白名单
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      callback(new Error(`CORS not allowed for origin: ${origin}`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
// 请求体解析
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// 请求日志
app.use(requestLogger)
// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制100个请求
  message: '请求过于频繁，请稍后再试',
})
app.use('/api/', limiter)
// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})
// API路由
app.use('/api', routes)
// 404处理
app.use((req, res) => {
  res.status(404).json({ success: false, message: '接口不存在' })
})
// 错误处理
app.use(errorHandler)
// 启动服务器（仅在非 Vercel 环境）
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`✅ 服务器运行在 http://localhost:${PORT}`)
    console.log(`📝 环境: ${process.env.NODE_ENV || 'development'}`)
  })
}
export default app
