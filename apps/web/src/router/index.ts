import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 用户端路由
const userRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@user/views/Home.vue'),
        meta: { title: '首页', module: 'user' },
    },
    {
        path: '/products',
        name: 'Products',
        component: () => import('@user/views/Products.vue'),
        meta: { title: '产品中心', module: 'user' },
    },
    {
        path: '/product/:id',
        name: 'ProductDetail',
        component: () => import('@user/views/ProductDetail.vue'),
        meta: { title: '产品详情', module: 'user' },
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('@user/views/Cart.vue'),
        meta: { title: '购物车', module: 'user' },
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: () => import('@user/views/Checkout.vue'),
        meta: { title: '结算', module: 'user' },
    },
    {
        path: '/user',
        name: 'User',
        component: () => import('@user/views/User.vue'),
        redirect: '/user/profile',
        meta: { title: '用户中心', requiresAuth: true, module: 'user' },
        children: [
            {
                path: 'profile',
                name: 'UserProfile',
                component: () => import('@user/views/user/Profile.vue'),
                meta: { title: '个人信息', module: 'user' },
            },
            {
                path: 'orders',
                name: 'UserOrders',
                component: () => import('@user/views/user/Orders.vue'),
                meta: { title: '我的订单', module: 'user' },
            },
            {
                path: 'addresses',
                name: 'UserAddresses',
                component: () => import('@user/views/user/Addresses.vue'),
                meta: { title: '收货地址', module: 'user' },
            },
            {
                path: 'coupons',
                name: 'UserCoupons',
                component: () => import('@user/views/user/Coupons.vue'),
                meta: { title: '优惠券', module: 'user' },
            },
            {
                path: 'points',
                name: 'UserPoints',
                component: () => import('@user/views/user/Points.vue'),
                meta: { title: '积分', module: 'user' },
            },
        ],
    },
    {
        path: '/academy',
        name: 'Academy',
        component: () => import('@user/views/Academy.vue'),
        meta: { title: '美妆学院', module: 'user' },
    },
    {
        path: '/academy/:id',
        name: 'AcademyArticle',
        component: () => import('@user/views/AcademyArticle.vue'),
        meta: { title: '文章详情', module: 'user' },
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@user/views/About.vue'),
        meta: { title: '品牌故事', module: 'user' },
    },
    {
        path: '/service',
        name: 'Service',
        component: () => import('@user/views/Service.vue'),
        meta: { title: '客户服务', module: 'user' },
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('@user/views/Search.vue'),
        meta: { title: '搜索', module: 'user' },
    },
]

// 管理后台路由（添加 /admin 前缀）
const adminRoutes: RouteRecordRaw[] = [
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: () => import('@admin/views/Login.vue'),
        meta: { title: '管理员登录', hidden: true, module: 'admin' },
    },
    {
        path: '/admin',
        component: () => import('@admin/layout/index.vue'),
        redirect: '/admin/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@admin/views/Dashboard.vue'),
                meta: { title: '数据仪表盘', icon: 'DataAnalysis', module: 'admin' },
            },
        ],
    },
    {
        path: '/admin/products',
        component: () => import('@admin/layout/index.vue'),
        redirect: '/admin/products/list',
        meta: { title: '商品管理', icon: 'Box', module: 'admin' },
        children: [
            {
                path: 'list',
                name: 'AdminProductList',
                component: () => import('@admin/views/products/List.vue'),
                meta: { title: '商品列表', module: 'admin' },
            },
            {
                path: 'categories',
                name: 'AdminProductCategories',
                component: () => import('@admin/views/products/Categories.vue'),
                meta: { title: '商品分类', module: 'admin' },
            },
        ],
    },
    {
        path: '/admin/orders',
        component: () => import('@admin/layout/index.vue'),
        redirect: '/admin/orders/list',
        meta: { title: '订单管理', icon: 'ShoppingCart', module: 'admin' },
        children: [
            {
                path: 'list',
                name: 'AdminOrderList',
                component: () => import('@admin/views/orders/List.vue'),
                meta: { title: '订单列表', module: 'admin' },
            },
        ],
    },
    {
        path: '/admin/users',
        component: () => import('@admin/layout/index.vue'),
        redirect: '/admin/users/list',
        meta: { title: '用户管理', icon: 'User', module: 'admin' },
        children: [
            {
                path: 'list',
                name: 'AdminUserList',
                component: () => import('@admin/views/users/List.vue'),
                meta: { title: '用户列表', module: 'admin' },
            },
        ],
    },
    {
        path: '/admin/marketing',
        component: () => import('@admin/layout/index.vue'),
        redirect: '/admin/marketing/coupons',
        meta: { title: '营销管理', icon: 'Present', module: 'admin' },
        children: [
            {
                path: 'coupons',
                name: 'AdminCouponManagement',
                component: () => import('@admin/views/marketing/Coupons.vue'),
                meta: { title: '优惠券管理', module: 'admin' },
            },
            {
                path: 'activities',
                name: 'AdminActivityManagement',
                component: () => import('@admin/views/marketing/Activities.vue'),
                meta: { title: '活动管理', module: 'admin' },
            },
        ],
    },
    {
        path: '/admin/content',
        component: () => import('@admin/layout/index.vue'),
        redirect: '/admin/content/articles',
        meta: { title: '内容管理', icon: 'Document', module: 'admin' },
        children: [
            {
                path: 'articles',
                name: 'AdminArticleManagement',
                component: () => import('@admin/views/content/Articles.vue'),
                meta: { title: '文章管理', module: 'admin' },
            },
        ],
    },
    {
        path: '/admin/settings',
        component: () => import('@admin/layout/index.vue'),
        redirect: '/admin/settings/system',
        meta: { title: '系统设置', icon: 'Setting', module: 'admin' },
        children: [
            {
                path: 'system',
                name: 'AdminSystemSettings',
                component: () => import('@admin/views/settings/System.vue'),
                meta: { title: '系统设置', module: 'admin' },
            },
        ],
    },
]

// 404页面路由
const fallbackRoutes: RouteRecordRaw[] = [
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@user/views/NotFound.vue'),
        meta: { title: '页面不存在' },
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...userRoutes, ...adminRoutes, ...fallbackRoutes],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const isAdminRoute = to.path.startsWith('/admin')

    // 设置页面标题
    if (isAdminRoute) {
        document.title = `${to.meta.title || '雅妆'} - 后台管理系统`
    } else {
        document.title = `${to.meta.title || '雅妆'} - 高端化妆品品牌`
    }

    // 检查是否需要登录
    if (isAdminRoute && to.path !== '/admin/login') {
        const token = localStorage.getItem('admin-token')
        if (!token) {
            next({ path: '/admin/login' })
            return
        }
    } else if (to.meta.requiresAuth) {
        const token = localStorage.getItem('token')
        if (!token) {
            next({ name: 'Home' })
            return
        }
    }

    next()
})

export default router
