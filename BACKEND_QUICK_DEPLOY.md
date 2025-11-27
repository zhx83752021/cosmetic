# 后端快速部署指南

## 🚨 当前问题

前端已部署但后端未部署，导致登录时出现"网络连接失败"错误。

## ✅ 解决步骤（10分钟）

### 第一步：在 Vercel 创建后端项目（3分钟）

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New...** → **Project**
3. 选择 GitHub 仓库：`zhx83752021/cosmetic-ve`
4. 配置项目：
   - **Project Name**: `cosmetic-ve-server`（或其他名称）
   - **Root Directory**: `apps/server` ⚠️ **必须设置**
   - **Framework Preset**: `Other`

### 第二步：配置构建设置（1分钟）

- **Build Command**: `pnpm run vercel-build`
- **Output Directory**: 留空
- **Install Command**: `npm install -g pnpm@8.12.1 && pnpm install`

### 第三步：配置数据库（2分钟）

1. 在 Vercel Dashboard，进入 **Storage** 标签
2. 点击 **Create Database** → 选择 **Postgres**
3. 数据库名称：`cosmetics-db`
4. 创建后，点击 **Connect Project**
5. 选择刚创建的 `cosmetic-ve-server` 项目
6. 环境选择：**Production**（必选）

### 第四步：添加环境变量（2分钟）

在项目的 **Environment Variables** 中添加：

```env
# 数据库（已自动添加）
DATABASE_URL=<自动生成>

# JWT 密钥（请修改为强密钥）
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long-change-this
JWT_EXPIRES_IN=7d

# CORS（前端域名）
CORS_ORIGINS=https://cosmetic-ve.vercel.app

# 环境
NODE_ENV=production
```

⚠️ **重要**：`JWT_SECRET` 必须是至少 32 位的随机字符串

### 第五步：部署（2分钟）

1. 点击 **Deploy** 开始部署
2. 等待构建完成（约1-2分钟）
3. 部署成功后，记录你的后端域名，例如：
   - `https://cosmetic-ve-server.vercel.app`
   - 或者你自定义的项目名称

## 📝 部署后操作

### 1. 初始化数据库（必须）

本地运行以下命令：

```powershell
# 进入后端目录
cd apps\server

# 设置临时环境变量（使用 Vercel 提供的 DATABASE_URL）
$env:DATABASE_URL="<你的数据库URL>"

# 运行数据库迁移
pnpm prisma migrate deploy

# 创建管理员账号
pnpm run create-admin
```

### 2. 测试后端 API

```powershell
# 替换为你的实际后端域名
Invoke-WebRequest -Uri https://your-backend.vercel.app/health
```

✅ 正常响应：

```json
{
  "status": "ok",
  "timestamp": "2024-11-27..."
}
```

### 3. 更新前端配置

修改 `apps/web/.env.production`：

```env
# 替换为你的实际后端域名
VITE_API_BASE_URL=https://your-backend.vercel.app/api
VITE_BASE_URL=/
```

### 4. 重新部署前端

```powershell
git add apps\web\.env.production
git commit -m "fix: 更新生产环境 API 地址"
git push origin main
```

Vercel 会自动重新部署前端。

## 🧪 验证

部署完成后，访问：

- https://cosmetic-ve.vercel.app/admin/login
- 使用账号：`admin` / `123456`

应该能够正常登录。

## ❓ 常见问题

### Q1: 数据库连接失败

**解决**：确保 `DATABASE_URL` 使用的是 Vercel Postgres 的 `POSTGRES_PRISMA_URL`

### Q2: CORS 错误

**解决**：检查后端环境变量 `CORS_ORIGINS` 是否包含前端域名

### Q3: 404 错误

**解决**：确认 Root Directory 设置为 `apps/server`

## 🆘 需要帮助？

如果遇到问题，提供以下信息：

1. Vercel 部署日志
2. 后端域名
3. 错误截图
