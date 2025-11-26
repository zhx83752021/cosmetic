# Web 前端项目

这是统一的前端项目，整合了用户端和管理后台。

## 项目结构

```
src/
├── modules/
│   ├── user/          # 用户端模块
│   │   ├── views/     # 用户端页面
│   │   └── ...
│   └── admin/         # 管理后台模块
│       ├── views/     # 管理后台页面
│       ├── layout/    # 后台布局
│       └── ...
├── components/        # 共享组件
│   ├── auth/         # 认证组件
│   ├── layout/       # 布局组件（用户端）
│   ├── home/         # 首页组件
│   ├── products/     # 产品组件
│   └── icons/        # 图标组件
├── stores/           # Pinia 状态管理
├── types/            # TypeScript 类型定义
├── api/              # API 接口封装
├── router/           # 路由配置
└── main.ts           # 应用入口
```

## 路由说明

### 用户端路由（前缀：`/`）
- `/` - 首页
- `/products` - 产品列表
- `/product/:id` - 产品详情
- `/cart` - 购物车
- `/checkout` - 结算
- `/user/*` - 用户中心
- `/academy` - 美妆学院
- `/about` - 品牌故事
- `/service` - 客户服务

### 管理后台路由（前缀：`/admin`）
- `/admin/login` - 管理员登录
- `/admin/dashboard` - 数据仪表盘
- `/admin/products/*` - 商品管理
- `/admin/orders/*` - 订单管理
- `/admin/users/*` - 用户管理
- `/admin/marketing/*` - 营销管理
- `/admin/content/*` - 内容管理
- `/admin/settings/*` - 系统设置

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器（端口 3000）
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint

# 运行测试
pnpm test
```

## 环境变量

### 开发环境（`.env.development`）
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_BASE_URL=/
```

### 生产环境（`.env.production`）
```env
VITE_API_BASE_URL=https://your-api-domain.vercel.app/api
VITE_BASE_URL=/
```

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite 5
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **UI 框架**:
  - Element Plus（管理后台）
  - Tailwind CSS（用户端，前缀 `tw-`）
- **HTTP 客户端**: Axios
- **图表**: ECharts（管理后台）
- **轮播**: Swiper（用户端）

## 样式说明

### Tailwind CSS 前缀
为避免与 Element Plus 样式冲突，Tailwind CSS 使用 `tw-` 前缀：

```vue
<!-- 正确 -->
<div class="tw-flex tw-items-center tw-bg-primary">

<!-- 错误 -->
<div class="flex items-center bg-primary">
```

### Element Plus
Element Plus 样式无需前缀，自动导入：

```vue
<el-button type="primary">按钮</el-button>
```

## 认证说明

项目使用两套独立的认证系统：

- **用户端**: `localStorage.getItem('token')`
- **管理后台**: `localStorage.getItem('admin-token')`

## 部署

详见项目根目录的 `DEPLOYMENT.md` 和 `README_DEPLOYMENT.md`

## 注意事项

1. 所有组件路径使用别名：
   - `@/` - 指向 `src/`
   - `@user/` - 指向 `src/modules/user/`
   - `@admin/` - 指向 `src/modules/admin/`

2. API 请求统一使用 `src/api/request.ts` 封装的实例

3. 类型定义统一放在 `src/types/index.ts`

4. 用户端和管理后台的组件避免相互引用，保持模块独立

## 迁移说明

本项目由以下项目合并而来：
- `apps/frontend` - 用户端（现在是 `src/modules/user`）
- `apps/admin` - 管理后台（现在是 `src/modules/admin`）

原项目目录已保留但不再使用，可以在确认无误后删除。
