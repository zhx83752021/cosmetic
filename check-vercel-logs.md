# 快速检查 Vercel 日志

## 🔍 查看崩溃原因

### 方法 1：查看 Function Logs（推荐）

1. 访问：https://vercel.com/dashboard
2. 点击 **cosmetic-ve-server** 项目
3. 点击 **Deployments** 标签
4. 点击第一个部署（最新的）
5. 点击 **View Function Logs** 按钮

### 方法 2：实时日志

1. 在项目页面，点击顶部的 **Logs** 标签
2. 选择 **Runtime Logs**
3. 刷新 https://cosmetic-ve-server.vercel.app/health
4. 查看实时错误信息

---

## 📝 可能看到的错误及解决方案

### 错误类型 A：环境变量缺失

**日志显示**：

```
Error: DATABASE_URL environment variable is required
Error: JWT_SECRET is not defined
```

**解决方案**：

1. Settings → Environment Variables
2. 添加缺失的环境变量
3. Redeploy

### 错误类型 B：数据库连接失败

**日志显示**：

```
Error: Can't reach database server
P1001: Can't reach database server at xxx
```

**解决方案**：

1. 检查 DATABASE_URL 格式
2. 确认使用 POSTGRES_PRISMA_URL
3. 检查数据库是否在运行

### 错误类型 C：模块未找到

**日志显示**：

```
Error: Cannot find module '../dist/index.js'
```

**解决方案**：

1. 检查 Build Logs
2. 确认 TypeScript 编译成功
3. 检查 api/index.js 中的路径

---

## 🚀 最快的修复方法

**无论日志显示什么错误，先做这个：**

### 1. 创建并连接数据库

如果还没有数据库：

1. Vercel Dashboard → **Storage** → **Create Database**
2. 选择 **Postgres**
3. Region: Hong Kong
4. 创建后点击 **Connect Project**
5. 选择 `cosmetic-ve-server`
6. Environment: Production ✓
7. 点击 **Connect**

### 2. 配置环境变量

Settings → Environment Variables → Add New

```env
# 从 Storage → 你的数据库 → .env.local 复制
DATABASE_URL=<POSTGRES_PRISMA_URL的值>

# 固定值
JWT_SECRET=cosmetic-ve-production-jwt-secret-key-2024-must-be-32-chars
NODE_ENV=production
CORS_ORIGINS=https://cosmetic-ve.vercel.app
```

### 3. 重新部署

Deployments → 最新部署 → ··· → Redeploy

### 4. 等待并测试

等待 1-2 分钟，然后访问：
https://cosmetic-ve-server.vercel.app/health

---

## ✅ 成功标志

如果看到这个，说明成功了：

```json
{ "status": "ok", "timestamp": "2024-11-27T..." }
```

如果还是失败，查看新的 Function Logs 找具体错误。
