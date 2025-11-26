# ⚡ 快速开始

## 项目已重组完成 ✅

你的化妆品电商项目已成功重组，现在可以直接部署到 Vercel！

---

## 🎯 3 分钟本地测试

### 1️⃣ 启动后端 API

```bash
# 打开第一个终端
cd apps\server
pnpm dev
```

✅ 后端将运行在：http://localhost:3001

---

### 2️⃣ 启动前端

```bash
# 打开第二个终端
cd apps\web
pnpm dev
```

✅ 前端将运行在：http://localhost:3000

---

### 3️⃣ 访问测试

- **用户端首页**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin/login

---

## 🚀 部署到 Vercel

### 快速部署命令

```bash
# 1. 部署后端（记住域名）
cd apps\server
pnpm run build
vercel --prod

# 2. 更新前端 API 配置
# 编辑 apps\web\.env.production
# VITE_API_BASE_URL=https://你的后端域名.vercel.app/api

# 3. 部署前端
cd ..\..
vercel --prod
```

---

## 📊 项目状态

| 项目 | 状态 | 位置 |
|------|------|------|
| 统一前端 | ✅ 已创建 | `apps/web` |
| 路由配置 | ✅ 完成 | 用户端：`/` 管理后台：`/admin` |
| 构建验证 | ✅ 通过 | `apps/web/dist` |
| Vercel 配置 | ✅ 就绪 | `vercel.json` |
| 部署文档 | ✅ 完整 | `DEPLOYMENT.md` |

---

## 📁 新的项目结构

```
apps/
├── web/          ← 🆕 统一前端（用户端 + 管理后台）
│   ├── dist/     ← ✅ 已构建
│   └── ...
├── server/       ← 后端 API
├── frontend/     ← ⚠️ 已废弃（可删除）
└── admin/        ← ⚠️ 已废弃（可删除）
```

---

## 🎨 访问路径示例

### 用户端
- 首页: `/`
- 产品列表: `/products`
- 购物车: `/cart`
- 用户中心: `/user/profile`

### 管理后台
- 登录: `/admin/login`
- 仪表盘: `/admin/dashboard`
- 商品管理: `/admin/products/list`
- 订单管理: `/admin/orders/list`

---

## 📖 详细文档

- **快速部署**: `README_DEPLOYMENT.md` ⭐ 推荐
- **完整指南**: `DEPLOYMENT.md`
- **完成总结**: `DEPLOYMENT_SUMMARY.md`
- **Web 项目**: `apps/web/README.md`

---

## ⚙️ 环境变量清单

### 后端需要
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
REDIS_URL=redis://...
NODE_ENV=production
```

### 前端需要
```env
# apps/web/.env.production
VITE_API_BASE_URL=https://your-api.vercel.app/api
VITE_BASE_URL=/
```

---

## 💡 提示

1. **本地测试**: 先本地测试确保一切正常
2. **先部署后端**: 获取后端域名后再部署前端
3. **更新 API 地址**: 部署前端前务必更新 `.env.production`
4. **数据库配置**: 确保后端连接到生产数据库
5. **CORS 设置**: 后端需要允许前端域名访问

---

## ✅ 检查清单

部署前确认：

- [ ] 本地测试通过
- [ ] 后端数据库已配置
- [ ] 后端已部署并获取域名
- [ ] 前端 API 地址已更新
- [ ] 后端 CORS 已配置
- [ ] 前端已成功构建

---

## 🎉 完成！

项目已准备就绪，现在可以：
1. 本地测试功能
2. 部署到 Vercel
3. 开始使用

**需要帮助？** 查看 `DEPLOYMENT.md` 获取详细步骤和常见问题解答。

---

**祝你部署顺利！** 🚀
