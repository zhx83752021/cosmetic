import { get, put, type PaginatedResponse } from './request'

// 订单接口
export interface Order {
    id: number
    orderNo: string
    userId: number
    status: string
    totalAmount: number
    discountAmount: number
    shippingFee: number
    payAmount: number
    addressData: {
        name: string
        phone: string
        province: string
        city: string
        district: string
        detail: string
    }
    remark?: string
    paidAt?: string
    shippedAt?: string
    completedAt?: string
    createdAt: string
    updatedAt: string
    user?: {
        id: number
        username: string
        email: string
        phone?: string
    }
    items?: OrderItem[]
}

// 订单项
export interface OrderItem {
    id: number
    orderId: number
    productId: number
    skuId?: number
    name: string
    image: string
    price: number
    quantity: number
    specs?: any
    product?: {
        id: number
        name: string
        images: string[]
    }
}

// 订单查询参数
export interface OrderQuery {
    page?: number
    pageSize?: number
    status?: string
    keyword?: string
}

/**
 * 获取所有订单（管理员）
 */
export const getAllOrders = (params: OrderQuery) => {
    return get<PaginatedResponse<Order>>('/orders/admin/all', { params })
}

/**
 * 获取订单详情
 */
export const getOrderById = (id: number) => {
    return get<Order>(`/orders/${id}`)
}

/**
 * 更新订单状态
 */
export const updateOrderStatus = (id: number, status: string) => {
    return put(`/orders/admin/${id}/status`, { status })
}
