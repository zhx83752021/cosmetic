# 修复 500 错误 - 后端环境变量配置

## 当前状态

✅ 代码已成功推送到 GitHub
✅ Vercel 已接收并部署代码
❌ 后端返回 500 内部服务器错误

## 问题原因

后端应用启动时出错，最可能的原因是：

1. **数据库连接未配置**（DATABASE_URL 缺失）
2. **JWT 密钥未配置**（JWT_SECRET 缺失）
3. **其他必需的环境变量缺失**

---

## 🚀 快速修复步骤（5分钟）

### 步骤 1：访问 Vercel Dashboard

🔗 https://vercel.com/dashboard

### 步骤 2：进入后端项目设置

1. 找到并点击 **`cosmetic-ve-server`** 项目
2. 点击顶部的 **Settings** 标签
3. 在左侧菜单中点击 **Environment Variables**

### 步骤 3：检查现有环境变量

查看是否已配置以下变量：

- ✅ DATABASE_URL
- ✅ JWT_SECRET
- ✅ JWT_EXPIRES_IN
- ✅ NODE_ENV
- ✅ CORS_ORIGINS

### 步骤 4：如果缺少环境变量

#### 必需的环境变量

点击 **Add New** 按钮，添加以下变量：

**1. DATABASE_URL**（最重要）

```
名称: DATABASE_URL
值: postgresql://user:password@host:5432/database?schema=public
环境: Production, Preview, Development（全选）
```

**如何获取**：

- 如果已创建 Vercel Postgres：
  1. Vercel Dashboard → Storage 标签
  2. 点击你的数据库
  3. 点击 `.env.local` 标签
  4. 复制 `POSTGRES_PRISMA_URL` 的值

- 如果尚未创建数据库：
  1. Vercel Dashboard → Storage → Create Database
  2. 选择 **Postgres**
  3. 创建后连接到 `cosmetic-ve-server` 项目
  4. 按上述方法获取连接字符串

**2. JWT_SECRET**

```
名称: JWT_SECRET
值: your-super-secret-jwt-key-at-least-32-characters-long-change-this-in-production
环境: Production, Preview, Development（全选）
```

⚠️ **重要**：生产环境必须使用强随机密钥，至少 32 位字符！

可以使用这个命令生成：

```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**3. JWT_EXPIRES_IN**

```
名称: JWT_EXPIRES_IN
值: 7d
环境: Production, Preview, Development（全选）
```

**4. NODE_ENV**

```
名称: NODE_ENV
值: production
环境: Production（只选这个）
```

**5. CORS_ORIGINS**

```
名称: CORS_ORIGINS
值: https://cosmetic-ve.vercel.app
环境: Production, Preview, Development（全选）
```

### 步骤 5：保存并重新部署

1. 确认所有环境变量都已添加
2. 回到项目主页
3. 点击 **Deployments** 标签
4. 找到最新的部署（第一个）
5. 点击右侧的 **···** 菜单
6. 选择 **Redeploy**
7. 确认重新部署

### 步骤 6：等待部署完成（2-3分钟）

在 Deployments 页面：

- ⏳ **Building**：正在构建
- ✅ **Ready**：部署成功
- ❌ **Failed**：部署失败（查看日志）

### 步骤 7：测试后端

部署成功后，测试健康检查端点：

```powershell
Invoke-WebRequest -Uri https://cosmetic-ve-server.vercel.app/health
```

**预期响应**：

```json
{
  "status": "ok",
  "timestamp": "2024-11-27T..."
}
```

---

## 🔍 查看错误日志

如果配置后仍然失败：

1. **Vercel Dashboard** → `cosmetic-ve-server` 项目
2. **Deployments** → 点击最新的部署
3. **View Function Logs** 或 **Build Logs**
4. 查找错误信息：

### 常见错误

#### 错误 A：数据库连接失败

```
Error: Can't reach database server
Error: Invalid DATABASE_URL
```

**解决**：检查 DATABASE_URL 格式是否正确，必须包含 `?schema=public`

#### 错误 B：Prisma Client 未生成

```
Error: Prisma Client is not yet generated
```

**解决**：确认 `vercel-build` 脚本包含 `prisma generate`

#### 错误 C：环境变量未找到

```
Error: JWT_SECRET is not defined
```

**解决**：检查环境变量是否正确配置，确保环境选择了 Production

---

## 📋 完整的环境变量配置清单

| 变量名                  | 必需 | 示例值                                              | 说明               |
| ----------------------- | ---- | --------------------------------------------------- | ------------------ |
| `DATABASE_URL`          | ✅   | `postgresql://user:pass@host:5432/db?schema=public` | 数据库连接字符串   |
| `JWT_SECRET`            | ✅   | `your-32-char-random-secret-key`                    | JWT 加密密钥       |
| `JWT_EXPIRES_IN`        | ✅   | `7d`                                                | Token 过期时间     |
| `NODE_ENV`              | ✅   | `production`                                        | 环境标识           |
| `CORS_ORIGINS`          | ✅   | `https://cosmetic-ve.vercel.app`                    | 允许的前端域名     |
| `REDIS_URL`             | ❌   | `redis://...`                                       | Redis 连接（可选） |
| `BLOB_READ_WRITE_TOKEN` | ❌   | `vercel_blob_...`                                   | 文件存储（可选）   |

---

## 🗄️ 数据库初始化

配置好环境变量后，还需要初始化数据库：

### 方法 1：本地执行（推荐）

```powershell
# 1. 进入 server 目录
cd e:\site2\apps\server

# 2. 从 Vercel 拉取环境变量
vercel env pull .env.production

# 3. 运行数据库迁移
$env:DATABASE_URL = "<从.env.production复制DATABASE_URL>"
pnpm prisma migrate deploy

# 4. 创建管理员账号
pnpm run create-admin
```

### 方法 2：在 Vercel Postgres 控制台执行

1. Vercel Dashboard → Storage → 你的 Postgres 数据库
2. 点击 **Data** 标签 → **Query**
3. 复制并执行迁移 SQL：
   - 文件位置：`apps/server/prisma/migrations/*/migration.sql`
4. 创建管理员账号（执行 SQL）：

```sql
INSERT INTO users (username, email, password, role, status, "createdAt", "updatedAt")
VALUES (
  'admin',
  'admin@cosmetic.com',
  '$2a$10$YourHashedPasswordHere',  -- 使用 bcrypt 加密
  'admin',
  'active',
  NOW(),
  NOW()
);
```

---

## ✅ 验证修复

### 1. 测试后端健康检查

```powershell
Invoke-WebRequest -Uri https://cosmetic-ve-server.vercel.app/health
```

应返回：`{"status":"ok",...}`

### 2. 测试登录 API

```powershell
$body = @{
    account = "admin"
    password = "123456"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://cosmetic-ve-server.vercel.app/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### 3. 测试前端登录

访问：https://cosmetic-ve.vercel.app/admin/login
使用：admin / 123456

---

## 🆘 仍然失败？

提供以下信息以便诊断：

1. **环境变量配置截图**
   - Settings → Environment Variables 页面

2. **部署日志**
   - Deployments → 最新部署 → Function Logs

3. **错误信息**
   - 浏览器控制台（F12）的错误
   - Network 标签中失败的请求

---

**优先级**：🔥 高
**预计修复时间**：5-10 分钟
**关键步骤**：配置环境变量 → 重新部署 → 初始化数据库
