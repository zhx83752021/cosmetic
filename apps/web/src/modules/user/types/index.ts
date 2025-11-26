// 用户信息
export interface UserInfo {
    id: number
    username: string
    email: string
    phone: string
    avatar?: string
    nickname?: string
    gender?: 'male' | 'female' | 'other'
    birthday?: string
    level: number
    points: number
    createdAt: string
}

// 购物车商品
export interface CartItem {
    id: number
    skuId?: number
    name: string
    image: string
    price: number
    quantity: number
    selected: boolean
    specs?: { name: string; value: string }[]
    stock: number
}

// 产品
export interface Product {
    id: number
    name: string
    subTitle?: string
    images: string[]
    price: number
    originalPrice?: number
    categoryId: number
    categoryName: string
    brand?: string
    sales: number
    stock: number
    rating: number
    reviewCount: number
    description: string
    details: string
    ingredients?: string
    usage?: string
    specifications?: { name: string; value: string }[]
    skus?: ProductSku[]
    tags?: string[]
    isNew?: boolean
    isHot?: boolean
    createdAt: string
}

// 产品SKU
export interface ProductSku {
    id: number
    productId: number
    name: string
    price: number
    stock: number
    image?: string
    specs: { name: string; value: string }[]
}

// 产品分类
export interface Category {
    id: number
    name: string
    icon?: string
    image?: string
    parentId?: number
    children?: Category[]
    sort: number
}

// 订单
export interface Order {
    id: number
    orderNo: string
    userId: number
    status: OrderStatus
    items: OrderItem[]
    totalAmount: number
    discountAmount: number
    shippingFee: number
    payAmount: number
    address: Address
    remark?: string
    createdAt: string
    paidAt?: string
    shippedAt?: string
    completedAt?: string
}

export type OrderStatus =
    | 'pending'
    | 'paid'
    | 'shipped'
    | 'completed'
    | 'cancelled'
    | 'refunding'
    | 'refunded'

export interface OrderItem {
    id: number
    orderId: number
    productId: number
    skuId?: number
    name: string
    image: string
    price: number
    quantity: number
    specs?: { name: string; value: string }[]
}

// 收货地址
export interface Address {
    id: number
    userId: number
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
    isDefault: boolean
    createdAt: string
}

// 优惠券
export interface Coupon {
    id: number
    name: string
    type: 'discount' | 'fixed'
    value: number
    minAmount: number
    maxAmount?: number
    startTime: string
    endTime: string
    total: number
    used: number
    status: 'available' | 'used' | 'expired'
    description?: string
}

// 用户优惠券
export interface UserCoupon {
    id: number
    userId: number
    couponId: number
    coupon: Coupon
    status: 'available' | 'used' | 'expired'
    usedAt?: string
    createdAt: string
}

// 文章
export interface Article {
    id: number
    title: string
    cover: string
    summary: string
    content: string
    categoryId: number
    categoryName: string
    author: string
    views: number
    likes: number
    tags?: string[]
    createdAt: string
}

// API响应
export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    message?: string
    code?: number
}

// 分页响应
export interface PageResponse<T = any> {
    list: T[]
    total: number
    page: number
    pageSize: number
}
