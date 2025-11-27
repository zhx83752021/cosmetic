# 下一步操作指南

## 📊 当前状态

### ✅ 已完成

1. **问题诊断**：找到后端地址 `cosmetic-ve-server.vercel.app`，但返回 404
2. **配置修复**：
   - 创建 `apps/server/api/index.js` - Vercel Serverless 入口点
   - 更新 `apps/server/vercel.json` - 简化配置
   - 创建 `apps/server/.vercelignore` - 忽略不必要的文件
   - 修改 `apps/server/src/index.ts` - 兼容 Vercel 环境
   - 更新 `apps/web/.env.production` - 正确的 API 地址
3. **代码提交**：
   - ✅ 第一次提交：`fix: configure backend for Vercel and update frontend API URL`
   - ✅ 第二次提交：`fix: simplify Vercel configuration for Serverless Functions`

### ⏳ 待完成

- 推送最新的配置到 GitHub（网络连接问题）
- 等待 Vercel 重新部署
- 验证后端 API
- 测试登录功能

---

## 🔄 立即操作

### 步骤 1：推送代码到 GitHub

网络连接暂时有问题，请手动重试：

```powershell
# 在项目根目录运行
cd e:\site2
git push origin main
```

**如果仍然失败**，可以：

1. 检查网络连接
2. 稍等片刻后重试
3. 或使用 GitHub Desktop 推送

### 步骤 2：检查 Vercel 部署状态

1. **访问 Vercel Dashboard**
   - 🔗 https://vercel.com/dashboard

2. **找到后端项目**
   - 项目名：`cosmetic-ve-server`

3. **查看部署状态**
   - ✅ **Ready（绿色）**：部署成功，继续步骤 3
   - ⏳ **Building（橙色）**：正在构建，等待 2-3 分钟
   - ❌ **Failed（红色）**：部署失败，查看下方"故障排除"

4. **如果显示 "Failed"**
   - 点击失败的部署
   - 查看 "Build Logs"
   - 根据错误信息参考下方"常见错误"部分

### 步骤 3：测试后端 API

部署成功后，在浏览器或 PowerShell 中测试：

```powershell
# 方法 1：PowerShell
Invoke-WebRequest -Uri https://cosmetic-ve-server.vercel.app/health

# 方法 2：浏览器
# 直接访问：https://cosmetic-ve-server.vercel.app/health
```

**预期响应**：

```json
{
  "status": "ok",
  "timestamp": "2024-11-27T..."
}
```

### 步骤 4：测试前端登录

1. **等待前端也重新部署**
   - 在 Vercel Dashboard 找到 `cosmetic-ve` 项目
   - 确认也完成了重新部署

2. **访问登录页面**
   - 🔗 https://cosmetic-ve.vercel.app/admin/login

3. **尝试登录**
   - 用户名：`admin`
   - 密码：`123456`

### 步骤 5：根据结果采取行动

#### ✅ 登录成功

**恭喜！问题完全解决！**

#### ❌ 数据库错误（400/500）

需要初始化数据库，参考：`VERCEL_DATABASE_SETUP.md`

快速步骤：

1. Vercel Dashboard → Storage → Create Database (Postgres)
2. Connect to `cosmetic-ve-server` project
3. 配置环境变量（DATABASE_URL, JWT_SECRET, CORS_ORIGINS）
4. 运行数据库迁移
5. 创建管理员账号

#### ❌ 网络连接失败

1. 打开浏览器开发者工具（F12）
2. 查看 Console 和 Network 标签
3. 确认 API 请求地址是否正确
4. 检查是否有 CORS 错误

#### ❌ CORS 错误

在后端项目环境变量中确认：

```env
CORS_ORIGINS=https://cosmetic-ve.vercel.app
```

修改后 Redeploy 后端项目

---

## 🔧 常见错误及解决方案

### 错误 1：构建超时

**错误信息**：`Build exceeded maximum time`

**原因**：Vercel 免费计划有构建时间限制

**解决方案**：

1. 检查依赖是否太多
2. 考虑升级 Vercel 计划
3. 优化构建脚本

### 错误 2：找不到模块

**错误信息**：`Cannot find module '../dist/index.js'`

**原因**：构建脚本未正确编译 TypeScript

**解决方案**：

1. 确认 `vercel-build` 脚本正确：
   ```json
   "vercel-build": "prisma migrate deploy && prisma generate && tsc"
   ```
2. 检查 `tsconfig.json` 的 `outDir` 设置为 `"./dist"`

### 错误 3：Prisma 错误

**错误信息**：`Prisma Client is not yet generated`

**原因**：构建时未生成 Prisma Client

**解决方案**：

1. 确认 `vercel-build` 包含 `prisma generate`
2. 检查 `prisma/schema.prisma` 文件存在

### 错误 4：环境变量未定义

**错误信息**：`DATABASE_URL is not defined`

**原因**：Vercel 项目环境变量未配置

**解决方案**：

1. Vercel Dashboard → 项目 → Settings → Environment Variables
2. 添加所有必需的环境变量
3. Redeploy 项目

### 错误 5：404 Not Found

**原因**：路由配置或构建输出路径错误

**解决方案**：

1. 检查 `vercel.json` 配置
2. 确认 `api/index.js` 文件存在
3. 确认构建后 `dist/` 目录被正确生成

---

## 📝 配置文件检查清单

### `apps/server/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

### `apps/server/api/index.js`

```javascript
import app from '../dist/index.js'
export default app
```

### `apps/server/api/package.json`

```json
{
  "type": "module"
}
```

### `apps/web/.env.production`

```env
VITE_API_BASE_URL=https://cosmetic-ve-server.vercel.app/api
VITE_BASE_URL=/
```

### 后端环境变量（Vercel Dashboard）

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-super-secret-key-at-least-32-characters
JWT_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGINS=https://cosmetic-ve.vercel.app
```

---

## 🆘 需要帮助？

如果遇到问题，请提供：

1. **Vercel 部署截图**
   - 显示部署状态（Ready/Failed/Building）

2. **Build Logs**
   - 如果部署失败，完整的构建日志

3. **浏览器控制台错误**
   - F12 → Console 标签的错误信息
   - F12 → Network 标签的失败请求

4. **错误描述**
   - 具体在哪一步出现问题
   - 看到的错误信息

---

## 📚 相关文档

- `PROBLEM_SOLVED.md` - 问题解决方案总结
- `CHECK_VERCEL_STATUS.md` - Vercel 状态检查指南
- `VERCEL_DATABASE_SETUP.md` - 数据库配置详细指南
- `BACKEND_QUICK_DEPLOY.md` - 后端部署完整指南

---

**最后更新**：2024-11-27 16:45
**当前阶段**：等待推送代码并重新部署
**预计完成时间**：5-10 分钟
