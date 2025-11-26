# 🚀 快速部署指南

## 项目已完成重组

你的项目已经成功重组为适合 Vercel 部署的结构！

### 📁 新的项目结构

```
apps/
├── web/         ← 🆕 统一前端（用户端 + 管理后台）
├── server/      ← 后端 API
├── frontend/    ← ⚠️ 已废弃，可删除
└── admin/       ← ⚠️ 已废弃，可删除
```

### 🌐 访问路径

| 模块 | 路径 | 示例 |
|------|------|------|
| 用户端首页 | `/` | `yourdomain.com/` |
| 用户端产品 | `/products` | `yourdomain.com/products` |
| 管理后台登录 | `/admin/login` | `yourdomain.com/admin/login` |
| 管理后台首页 | `/admin/dashboard` | `yourdomain.com/admin/dashboard` |

---

## 🎯 部署步骤（3步完成）

### 步骤 1: 部署后端 API

```bash
# 1. 进入后端目录
cd apps/server

# 2. 构建项目
pnpm run build

# 3. 部署到 Vercel
vercel --prod
```

**记住你的后端域名**，例如：`your-api.vercel.app`

**⚠️ 重要：** 在 Vercel 项目设置中添加环境变量：
- `DATABASE_URL`: 你的数据库连接字符串
- `JWT_SECRET`: JWT 密钥
- `NODE_ENV`: `production`

---

### 步骤 2: 更新前端 API 配置

编辑文件：`apps/web/.env.production`

```env
# 替换为你的后端域名
VITE_API_BASE_URL=https://your-api.vercel.app/api
VITE_BASE_URL=/
```

---

### 步骤 3: 部署前端

```bash
# 在项目根目录执行
vercel --prod
```

Vercel 会自动使用根目录的 `vercel.json` 配置进行构建。

---

## 🧪 本地测试

在部署前，建议先本地测试：

```bash
# 终端 1 - 启动后端（端口 3001）
cd apps/server
pnpm dev

# 终端 2 - 启动前端（端口 3000）
cd apps/web
pnpm dev
```

然后访问：
- 用户端：http://localhost:3000
- 管理后台：http://localhost:3000/admin/login

---

## 📋 部署检查清单

部署前确保：

- [ ] 后端已成功部署并运行
- [ ] 数据库已创建并配置
- [ ] 环境变量已设置
- [ ] 前端 `.env.production` 已更新 API 地址
- [ ] 后端 CORS 已配置允许前端域名
- [ ] 本地测试通过

---

## 🔗 相关文档

- **详细部署指南**: `DEPLOYMENT.md`
- **完成总结**: `DEPLOYMENT_SUMMARY.md`
- **项目结构**: `PROJECT_STRUCTURE.md`

---

## 💡 快速命令参考

```bash
# 安装依赖
pnpm install

# 开发模式
cd apps/web && pnpm dev        # 前端
cd apps/server && pnpm dev     # 后端

# 构建
cd apps/web && pnpm build      # 前端
cd apps/server && pnpm build   # 后端

# 部署
vercel --prod                  # 在对应目录执行
```

---

## ❓ 遇到问题？

1. **构建失败**: 运行 `pnpm install` 重新安装依赖
2. **API 连接失败**: 检查 `.env.production` 中的 API 地址
3. **路由 404**: Vercel 已配置路由重写，应该不会出现此问题
4. **样式问题**: Tailwind 使用 `tw-` 前缀，Element Plus 不需要前缀

查看 `DEPLOYMENT.md` 获取更多帮助！

---

## ✅ 部署完成后

部署成功后，你将拥有：

1. **一个前端域名**: 同时服务用户端（`/`）和管理后台（`/admin`）
2. **一个后端 API 域名**: 提供所有接口服务

所有功能整合在一起，方便管理和维护！

---

**祝部署顺利！** 🎉
