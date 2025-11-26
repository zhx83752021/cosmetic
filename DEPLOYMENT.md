# 部署指南

## 项目结构说明

本项目已重组为以下结构，适合 Vercel 部署：

```
apps/
├── web/              # 统一的前端项目（用户端 + 管理后台）
│   ├── src/
│   │   ├── modules/
│   │   │   ├── user/    # 用户端模块（原 frontend）
│   │   │   └── admin/   # 管理后台模块（原 admin）
│   │   ├── router/      # 统一路由配置
│   │   └── main.ts      # 主入口
│   └── package.json
└── server/           # 后端 API 服务
    └── vercel.json
```

## 路由规则

### 用户端（User）
- 访问路径：`/`
- 示例：
  - 首页：`/`
  - 产品列表：`/products`
  - 购物车：`/cart`
  - 用户中心：`/user/profile`

### 管理后台（Admin）
- 访问路径：`/admin`
- 示例：
  - 登录：`/admin/login`
  - 仪表盘：`/admin/dashboard`
  - 商品管理：`/admin/products/list`
  - 订单管理：`/admin/orders/list`

## Vercel 部署步骤

### 1. 部署前端（Web）

#### 方式一：通过 Vercel CLI
```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目根目录部署
cd e:\site2
vercel

# 生产环境部署
vercel --prod
```

#### 方式二：通过 Vercel 网站
1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 Git 仓库
4. Vercel 会自动检测到根目录的 `vercel.json` 配置
5. 点击 "Deploy"

**重要配置：**
- Build Command: `pnpm install && cd apps/web && pnpm run build`
- Output Directory: `apps/web/dist`
- Install Command: `npm install -g pnpm@8.12.1 && pnpm install`

### 2. 部署后端（Server）

后端 API 需要单独部署到 Vercel：

#### 方式一：通过 Vercel CLI
```bash
# 进入 server 目录
cd apps/server

# 先构建项目
pnpm run build

# 部署
vercel

# 生产环境部署
vercel --prod
```

#### 方式二：通过 Vercel 网站
1. 在 Vercel 创建新项目
2. 指定 Root Directory 为 `apps/server`
3. Build Command: `pnpm run build`
4. Output Directory: `dist`

**环境变量配置：**
需要在 Vercel 项目设置中添加以下环境变量：
- `DATABASE_URL`: 数据库连接字符串
- `JWT_SECRET`: JWT 密钥
- `REDIS_URL`: Redis 连接地址（如果使用）
- `NODE_ENV`: production

### 3. 配置 API 地址

部署后，需要更新前端项目中的 API 地址：

1. 在 `apps/web/.env.production` 中设置：
```env
VITE_API_BASE_URL=https://your-api-domain.vercel.app/api
```

2. 重新构建并部署前端

## 本地开发

```bash
# 安装依赖
pnpm install

# 开发模式运行
pnpm dev

# 仅运行前端
cd apps/web
pnpm dev

# 仅运行后端
cd apps/server
pnpm dev
```

## 构建验证

在部署前，建议本地验证构建：

```bash
# 构建前端
cd apps/web
pnpm build

# 预览前端构建结果
pnpm preview

# 构建后端
cd apps/server
pnpm build
```

## 注意事项

1. **Tailwind CSS 前缀**：为避免与 Element Plus 样式冲突，Tailwind CSS 使用了 `tw-` 前缀
2. **路由配置**：用户端和管理后台使用不同的认证 token（`token` 和 `admin-token`）
3. **数据库**：确保后端的 Prisma 数据库已正确配置和迁移
4. **CORS**：后端需要正确配置 CORS 允许前端域名访问

## 常见问题

### Q: 构建失败提示找不到模块
A: 确保已正确安装依赖：`pnpm install`

### Q: 路由 404 错误
A: 确保 Vercel 配置了正确的路由重写规则（已在 vercel.json 中配置）

### Q: API 请求失败
A: 检查前端的 API 地址配置和后端的 CORS 设置

### Q: 样式不生效
A: 检查是否正确引入了 CSS 文件，Tailwind 样式需要使用 `tw-` 前缀
