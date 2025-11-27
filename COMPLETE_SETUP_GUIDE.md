# 完整配置指南 - 一次性解决所有问题

## 当前状态

❌ 后端返回 500 错误
❌ 环境变量未完整配置
❌ 数据库可能未初始化

---

## 🎯 完整解决方案（10分钟）

### 第一步：创建 Vercel Postgres 数据库（2分钟）

1. **访问 Vercel Dashboard**
   - 🔗 https://vercel.com/dashboard

2. **创建数据库**
   - 点击左侧 **Storage** 标签
   - 点击 **Create Database**
   - 选择 **Postgres**
   - Database Name: `cosmetics-db`
   - Region: **Hong Kong (hkg1)** 或就近区域
   - 点击 **Create**

3. **连接到项目**
   - 创建完成后，点击 **Connect Project**
   - 选择项目：`cosmetic-ve-server`
   - Environment: 勾选 **Production**, **Preview**, **Development**
   - 点击 **Connect**

4. **获取连接字符串**
   - 点击 **`.env.local`** 标签
   - 找到 `POSTGRES_PRISMA_URL`
   - 复制整个值（类似：`postgresql://default:xxx@xxx-pooler.aws-xxx.postgres.vercel-storage.com/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15`）

---

### 第二步：配置所有环境变量（3分钟）

1. **进入项目设置**
   - Vercel Dashboard → `cosmetic-ve-server` 项目
   - 点击 **Settings** 标签
   - 点击 **Environment Variables**

2. **检查并添加所有必需变量**

#### 变量 1: DATABASE_URL（自动添加的）

```
名称：DATABASE_URL
值：<连接数据库时自动添加，确认存在即可>
环境：Production ✓ Preview ✓ Development ✓
```

如果没有自动添加，手动添加：

```
名称：DATABASE_URL
值：<步骤1中复制的 POSTGRES_PRISMA_URL>
环境：Production ✓ Preview ✓ Development ✓
```

#### 变量 2: JWT_SECRET（必须手动添加）

```
名称：JWT_SECRET
值：cosmetic-ve-production-jwt-secret-key-2024-must-be-at-least-32-characters-long
环境：Production ✓ Preview ✓ Development ✓
```

#### 变量 3: NODE_ENV（手动添加）

```
名称：NODE_ENV
值：production
环境：Production ✓
```

#### 变量 4: CORS_ORIGINS（手动添加）

```
名称：CORS_ORIGINS
值：https://hi-ultra.com,https://www.hi-ultra.com,https://cosmetic-ve.vercel.app
环境：Production ✓ Preview ✓ Development ✓
```

#### 变量 5: JWT_EXPIRES_IN（可选，建议添加）

```
名称：JWT_EXPIRES_IN
值：7d
环境：Production ✓ Preview ✓ Development ✓
```

3. **保存所有变量**

---

### 第三步：重新部署后端（1分钟）

1. 点击 **Deployments** 标签
2. 找到最新的部署（第一个）
3. 点击右侧的 **···** 菜单
4. 选择 **Redeploy**
5. 等待部署完成（约 1-2 分钟）

---

### 第四步：初始化数据库（4分钟）

#### 方法 1：在本地执行（推荐）

```powershell
# 1. 进入 server 目录
cd e:\site2\apps\server

# 2. 设置环境变量（使用步骤1复制的连接字符串）
$env:DATABASE_URL = "postgresql://default:xxx@xxx.postgres.vercel-storage.com/verceldb?sslmode=require"

# 3. 运行数据库迁移
pnpm prisma migrate deploy

# 4. 生成 Prisma Client
pnpm prisma generate

# 5. 创建管理员账号
pnpm run create-admin
```

最后一步会生成 SQL，**复制生成的 SQL 语句**。

#### 方法 2：在 Vercel Postgres 控制台执行

1. **执行迁移 SQL**
   - Vercel Dashboard → Storage → 你的数据库
   - 点击 **Data** 标签 → **Query**
   - 打开本地文件：`e:\site2\apps\server\prisma\migrations\20251121080256_init\migration.sql`
   - 复制全部内容
   - 粘贴到 Query 框
   - 点击 **Run Query**

2. **创建管理员账号**
   - 在本地运行：`pnpm run create-admin`
   - 复制生成的 SQL
   - 在 Vercel Postgres Query 中执行

---

### 第五步：测试验证（2分钟）

#### 1. 测试后端健康检查

在浏览器或 PowerShell 中访问：

```
https://cosmetic-ve-server.vercel.app/health
```

**预期响应**：

```json
{ "status": "ok", "timestamp": "2024-11-27T..." }
```

#### 2. 测试登录 API

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

**预期响应**：应返回 200 状态码和 token

#### 3. 测试前端登录

访问：https://www.hi-ultra.com/admin/login

输入：

- 用户名：`admin`
- 密码：`123456`

应该能成功登录！

---

## 📋 环境变量完整清单

| 变量名           | 值                                | 必需 | 说明                       |
| ---------------- | --------------------------------- | ---- | -------------------------- |
| `DATABASE_URL`   | `postgresql://default:xxx@xxx...` | ✅   | Vercel Postgres 连接字符串 |
| `JWT_SECRET`     | `至少32位的随机字符串`            | ✅   | JWT 加密密钥               |
| `NODE_ENV`       | `production`                      | ✅   | 环境标识                   |
| `CORS_ORIGINS`   | `https://hi-ultra.com,...`        | ✅   | CORS 白名单                |
| `JWT_EXPIRES_IN` | `7d`                              | ❌   | Token 过期时间（可选）     |

---

## 🔍 常见问题及解决

### Q1: 部署后仍然 500 错误

**检查**：

1. Deployments → 最新部署 → **View Function Logs**
2. 查看具体错误信息

**常见原因**：

- DATABASE_URL 未配置
- JWT_SECRET 未配置
- 数据库表未创建

### Q2: 登录时显示"数据库操作失败"

**原因**：数据库表未创建或管理员账号不存在

**解决**：按照"第四步：初始化数据库"重新执行

### Q3: 登录时显示 CORS 错误

**原因**：CORS_ORIGINS 未配置或重新部署未生效

**解决**：

1. 确认 CORS_ORIGINS 已添加
2. 重新部署一次
3. 清除浏览器缓存

### Q4: 健康检查返回 404

**原因**：Vercel 配置问题

**解决**：

1. 确认 `apps/server/api/index.js` 文件存在
2. 确认 `apps/server/vercel.json` 配置正确
3. 查看 Build Logs 是否有编译错误

---

## 🆘 查看详细错误日志

### 查看 Runtime Logs

1. Vercel Dashboard → `cosmetic-ve-server`
2. **Deployments** → 点击最新部署
3. **View Function Logs**
4. 查找错误信息

### 查看 Build Logs

1. Vercel Dashboard → `cosmetic-ve-server`
2. **Deployments** → 点击最新部署
3. **Build Logs** 标签
4. 检查构建过程是否有错误

---

## 📞 需要帮助？

如果按照以上步骤仍然失败，请提供：

1. **环境变量配置截图**
   - Settings → Environment Variables

2. **Function Logs 截图**
   - 显示具体的错误信息

3. **Build Logs 截图**（如果部署失败）

4. **数据库状态**
   - Storage → 你的数据库 → 是否显示 Active

---

## ✅ 成功标志

所有步骤完成后，你应该能够：

1. ✅ 访问 `https://cosmetic-ve-server.vercel.app/health` 返回成功
2. ✅ 在 `https://www.hi-ultra.com/admin/login` 使用 admin/123456 登录
3. ✅ 登录后能看到管理后台界面

---

**默认管理员账号**：

- 用户名：`admin`
- 密码：`123456`
- 邮箱：`admin@cosmetic.com`
- 手机：`13800138000`

---

**最后更新**：2024-11-27
**预计完成时间**：10 分钟
**难度**：⭐⭐⭐☆☆ 中等
