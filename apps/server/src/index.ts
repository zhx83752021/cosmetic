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

// CORS配置 - 开发环境允许所有本地端口
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com', 'https://admin.yourdomain.com']
        : (origin, callback) => {
            // 开发环境允许所有 localhost 请求
            if (!origin || origin.startsWith('http://localhost:')) {
              callback(null, true)
            } else {
              callback(new Error('Not allowed by CORS'))
            }
          },
    credentials: true,
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

// 启动服务器
app.listen(PORT, () => {
  console.log(`✅ 服务器运行在 http://localhost:${PORT}`)
  console.log(`📝 环境: ${process.env.NODE_ENV || 'development'}`)
})

export default app
