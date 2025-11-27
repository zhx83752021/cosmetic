# 🚨 紧急修复：Serverless Function 崩溃

## 错误信息

```
This Serverless Function has crashed.
500: INTERNAL_SERVER_ERROR
Code: FUNCTION_INVOCATION_FAILED
```

## 根本原因

Serverless Function 在启动时崩溃，最可能的原因：

1. **缺少环境变量**（最常见）
   - DATABASE_URL 未配置
   - JWT_SECRET 未配置
   - 其他必需的环境变量缺失

2. **代码错误**
   - 导入模块失败
   - 依赖项问题

3. **数据库连接失败**
   - 连接字符串格式错误
   - 数据库不可访问

---

## 🔥 立即修复步骤（5分钟）

### 步骤 1：查看错误日志（1分钟）

1. **访问 Vercel Dashboard**
   - 🔗 https://vercel.com/dashboard

2. **进入后端项目**
   - 点击 `cosmetic-ve-server` 项目

3. **查看部署日志**
   - 点击 **Deployments** 标签
   - 点击最新的部署（第一个）
   - 点击 **View Function Logs** 或 **Runtime Logs**

4. **查找错误信息**
   - 看看是否有类似以下的错误：
     - `DATABASE_URL is not defined`
     - `Cannot connect to database`
     - `JWT_SECRET is required`
     - `Error: Cannot find module`

### 步骤 2：配置环境变量（3分钟）

无论日志显示什么，都需要配置环境变量：

1. **进入设置**
   - 项目页面 → **Settings** → **Environment Variables**

2. **添加以下环境变量**

#### 最小必需配置（先添加这些）

**DATABASE_URL**（最重要）

```
名称: DATABASE_URL
值: postgresql://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb?sslmode=require
环境: Production ✓
```

**如何获取**：

- 如果没有数据库：
  1. 左侧菜单 **Storage** → **Create Database**
  2. 选择 **Postgres**
  3. Region: **Hong Kong** 或就近区域
  4. 点击 **Create**
  5. 创建后点击 **Connect Project**
  6. 选择 `cosmetic-ve-server`
  7. 环境选择 **Production**
  8. 点击 **Connect**

- 如果已有数据库：
  1. **Storage** → 点击你的数据库
  2. 切换到 **`.env.local`** 标签
  3. 复制 **`POSTGRES_PRISMA_URL`** 的值（不是 POSTGRES_URL）

**JWT_SECRET**

```
名称: JWT_SECRET
值: cosmetic-ve-secret-key-2024-production-jwt-secure-32chars
环境: Production ✓
```

**NODE_ENV**

```
名称: NODE_ENV
值: production
环境: Production ✓
```

**CORS_ORIGINS**

```
名称: CORS_ORIGINS
值: https://cosmetic-ve.vercel.app
环境: Production ✓
```

### 步骤 3：重新部署（1分钟）

1. **Deployments** 标签
2. 最新部署右侧的 **···** 菜单
3. 点击 **Redeploy**
4. 等待部署完成（约 1-2 分钟）

### 步骤 4：测试（30秒）

部署完成后，刷新页面：

```
https://cosmetic-ve-server.vercel.app/health
```

**预期结果**：

```json
{ "status": "ok", "timestamp": "2024-11-27T..." }
```

---

## 🔍 如果仍然失败

### 检查 Runtime Logs

1. Vercel Dashboard → `cosmetic-ve-server` → Deployments
2. 点击最新的部署
3. 点击 **View Function Logs**
4. 查找具体错误信息

### 常见错误及解决

#### 错误 1: `Cannot find module`

```
Error: Cannot find module '../dist/index.js'
```

**原因**：构建失败或路径错误

**解决**：

1. 检查 Build Logs 是否有编译错误
2. 确认 `apps/server/api/index.js` 中的路径正确
3. 确认 `vercel-build` 脚本包含 `tsc`

#### 错误 2: `Prisma Client is not yet generated`

```
Error: @prisma/client did not initialize yet
```

**原因**：Prisma Client 未在构建时生成

**解决**：

1. 确认 `vercel-build` 包含 `prisma generate`
2. 检查 Build Logs 中 Prisma 相关的输出
3. 重新部署

#### 错误 3: `Can't reach database server`

```
Error: Can't reach database server at xxx
```

**原因**：数据库连接字符串错误或数据库不可访问

**解决**：

1. 确认使用 `POSTGRES_PRISMA_URL`（不是 POSTGRES_URL）
2. 确认连接字符串包含 `?sslmode=require` 或 `?schema=public`
3. 检查 Vercel Postgres 数据库是否正常运行

#### 错误 4: `JWT_SECRET is not defined`

```
Error: JWT_SECRET environment variable is required
```

**原因**：环境变量未配置

**解决**：

1. Settings → Environment Variables
2. 添加 JWT_SECRET
3. Redeploy

---

## 📋 完整环境变量清单

必需配置：

| 变量名         | 示例值                           | 说明                       |
| -------------- | -------------------------------- | -------------------------- |
| `DATABASE_URL` | `postgresql://default:xxx@...`   | Vercel Postgres 连接字符串 |
| `JWT_SECRET`   | `your-secret-key-32-chars-min`   | JWT 加密密钥（至少32位）   |
| `NODE_ENV`     | `production`                     | 环境标识                   |
| `CORS_ORIGINS` | `https://cosmetic-ve.vercel.app` | 前端域名                   |

可选配置：

| 变量名           | 示例值        | 说明               |
| ---------------- | ------------- | ------------------ |
| `JWT_EXPIRES_IN` | `7d`          | Token 过期时间     |
| `REDIS_URL`      | `redis://...` | Redis 缓存（可选） |

---

## 🎯 快速检查清单

配置前检查：

- [ ] 已创建 Vercel Postgres 数据库
- [ ] 数据库已连接到 `cosmetic-ve-server` 项目
- [ ] 已获取 `POSTGRES_PRISMA_URL` 值

环境变量检查：

- [ ] DATABASE_URL 已添加
- [ ] JWT_SECRET 已添加（至少32位）
- [ ] NODE_ENV 已添加
- [ ] CORS_ORIGINS 已添加
- [ ] 所有变量环境都选择了 **Production**

部署检查：

- [ ] 已重新部署
- [ ] 部署状态为 **Ready**（绿色勾号）
- [ ] Function Logs 无错误

---

## 🆘 需要详细帮助？

如果按照以上步骤仍然失败，请提供：

1. **Function Logs 截图**
   - Deployments → 最新部署 → View Function Logs

2. **Build Logs 截图**
   - Deployments → 最新部署 → Build Logs

3. **环境变量配置截图**
   - Settings → Environment Variables

4. **数据库状态**
   - Storage → 你的数据库 → 是否显示 Active

---

**优先级**：🔥🔥🔥 最高
**预计修复时间**：5 分钟
**关键操作**：配置环境变量 → 重新部署
