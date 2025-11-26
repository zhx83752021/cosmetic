# 项目重组完成总结

## ✅ 已完成的工作

### 1. 项目结构重组
已成功将 `frontend` 和 `admin` 合并为统一的 `web` 项目：

```
e:\site2\
├── apps\
│   ├── web\              # 🆕 统一的前端项目
│   │   ├── src\
│   │   │   ├── modules\
│   │   │   │   ├── user\     # 用户端模块（原 frontend）
│   │   │   │   └── admin\    # 管理后台模块（原 admin）
│   │   │   ├── components\   # 共享组件
│   │   │   ├── stores\       # 状态管理
│   │   │   ├── types\        # 类型定义
│   │   │   ├── api\          # API 接口
│   │   │   ├── router\       # 统一路由
│   │   │   └── main.ts       # 主入口
│   │   ├── dist\             # 构建输出（已验证）✅
│   │   └── package.json
│   │
│   ├── server\           # 后端 API（保持不变）
│   │   └── vercel.json   # 后端部署配置 🆕
│   │
│   ├── frontend\         # ⚠️ 保留但不再使用
│   └── admin\            # ⚠️ 保留但不再使用
│
├── vercel.json           # 前端部署配置（已更新）✅
└── DEPLOYMENT.md         # 详细部署指南 🆕
```

### 2. 路由配置
已配置统一路由，使用路径前缀区分：

**用户端**
- 根路径：`/`
- 示例：
  - 首页：`https://your-domain.com/`
  - 产品：`https://your-domain.com/products`
  - 购物车：`https://your-domain.com/cart`
  - 用户中心：`https://your-domain.com/user/profile`

**管理后台**
- 根路径：`/admin`
- 示例：
  - 登录：`https://your-domain.com/admin/login`
  - 仪表盘：`https://your-domain.com/admin/dashboard`
  - 商品管理：`https://your-domain.com/admin/products/list`
  - 订单管理：`https://your-domain.com/admin/orders/list`

### 3. 已创建的配置文件

| 文件 | 说明 |
|------|------|
| `apps/web/package.json` | 前端项目依赖配置 |
| `apps/web/vite.config.ts` | Vite 构建配置 |
| `apps/web/tsconfig.json` | TypeScript 配置 |
| `apps/web/tailwind.config.js` | Tailwind CSS 配置（带 `tw-` 前缀） |
| `apps/web/.env.development` | 开发环境变量 |
| `apps/web/.env.production` | 生产环境变量 |
| `apps/server/vercel.json` | 后端 Vercel 配置 |
| `vercel.json` | 前端 Vercel 配置（根目录） |
| `DEPLOYMENT.md` | 完整部署指南 |

### 4. 构建验证
✅ 已成功构建前端项目（`apps/web/dist`）
- 输出大小：约 2.5 MB（压缩后）
- 包含所有用户端和管理后台页面
- 代码分割优化完成

## 📦 部署到 Vercel

### 方案 A：分别部署（推荐）

#### 1. 部署前端（Web）
```bash
# 方式一：使用根目录配置
cd e:\site2
vercel --prod

# 方式二：使用 Vercel 网站
# 1. 访问 vercel.com
# 2. 导入 Git 仓库
# 3. Vercel 会自动识别配置
# 4. 点击 Deploy
```

**前端配置要点：**
- Build Command: `pnpm install && cd apps/web && pnpm run build`
- Output Directory: `apps/web/dist`
- Install Command: `npm install -g pnpm@8.12.1 && pnpm install`

#### 2. 部署后端（Server）
```bash
# 进入 server 目录
cd apps/server

# 先构建
pnpm run build

# 部署
vercel --prod
```

**后端配置要点：**
- Root Directory: `apps/server`
- Build Command: `pnpm run build`
- Output Directory: `dist`

**必需环境变量：**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
REDIS_URL=redis://...
NODE_ENV=production
```

### 方案 B：Monorepo 部署

如果使用 Vercel 的 Monorepo 支持：

1. **前端项目设置：**
   - Root Directory: 留空
   - Build Command: `cd apps/web && pnpm run build`
   - Output Directory: `apps/web/dist`

2. **后端项目设置：**
   - Root Directory: `apps/server`
   - Build Command: `pnpm run build`
   - Output Directory: `dist`

## 🔧 部署后配置

### 1. 更新 API 地址

部署后端后，获取后端域名，然后更新：

**文件：** `apps/web/.env.production`
```env
VITE_API_BASE_URL=https://your-api-domain.vercel.app/api
```

### 2. 重新构建前端

```bash
cd apps/web
pnpm run build
vercel --prod
```

### 3. 配置后端 CORS

确保后端允许前端域名访问：

**文件：** `apps/server/src/index.ts`
```typescript
app.use(cors({
  origin: [
    'https://your-frontend-domain.vercel.app',
    'http://localhost:3000'  // 开发环境
  ]
}))
```

## 📱 本地开发

```bash
# 安装依赖（如果还没安装）
pnpm install

# 启动前端（端口 3000）
cd apps/web
pnpm dev

# 启动后端（端口 3001）
cd apps/server
pnpm dev
```

## ⚠️ 重要说明

### 1. 原项目文件
- `apps/frontend` 和 `apps/admin` 文件夹已保留，但不再使用
- 所有功能已迁移到 `apps/web`
- 可以在确认一切正常后删除旧文件夹

### 2. Tailwind CSS 前缀
- 使用 `tw-` 前缀避免与 Element Plus 冲突
- 用户端样式：使用 Tailwind（如 `tw-flex`, `tw-bg-primary`）
- 管理后台：使用 Element Plus 原生类名

### 3. 认证 Token
- 用户端：`localStorage.getItem('token')`
- 管理后台：`localStorage.getItem('admin-token')`

### 4. 数据库准备
部署后端前，确保：
```bash
# 生成 Prisma 客户端
pnpm prisma generate

# 运行数据库迁移
pnpm prisma migrate deploy
```

## 🎯 下一步操作

1. **本地测试**
   ```bash
   cd apps/web
   pnpm dev
   ```
   访问：
   - 用户端：http://localhost:3000
   - 管理后台：http://localhost:3000/admin/login

2. **部署后端**
   - 配置数据库
   - 设置环境变量
   - 部署到 Vercel

3. **部署前端**
   - 更新 API 地址
   - 部署到 Vercel

4. **测试验证**
   - 测试用户端功能
   - 测试管理后台功能
   - 验证 API 连接

## 📚 相关文档

- 详细部署指南：`DEPLOYMENT.md`
- 项目结构说明：`PROJECT_STRUCTURE.md`
- API 文档：`需求文档-06-API接口文档.md`

## 🆘 常见问题

### Q: 构建失败
**A:** 确保已安装所有依赖：
```bash
cd apps/web
pnpm install
```

### Q: 路由 404
**A:** Vercel 已配置路由重写，所有路径会回退到 `index.html`

### Q: API 请求失败
**A:** 检查：
1. `.env.production` 中的 API 地址是否正确
2. 后端 CORS 配置是否包含前端域名
3. 后端是否正常运行

### Q: 样式不生效
**A:**
- Tailwind 样式需要 `tw-` 前缀
- Element Plus 样式自动导入
- 检查 CSS 文件是否正确引入

## ✨ 总结

项目已成功重组为适合 Vercel 部署的结构：
- ✅ 前端项目合并完成（user + admin）
- ✅ 路由配置完成（`/` 和 `/admin`）
- ✅ 构建验证通过
- ✅ 部署配置就绪
- ✅ 文档完整

现在可以按照 `DEPLOYMENT.md` 进行部署了！
