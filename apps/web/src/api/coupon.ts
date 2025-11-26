import { get, post, put, del, type PaginatedResponse } from './request'

// 优惠券接口
export interface Coupon {
    id: number
    name: string
    type: string // discount, fixed
    value: number
    minAmount: number
    maxAmount?: number
    total: number
    used: number
    startTime: string
    endTime: string
    description?: string
    status: string
    createdAt: string
    updatedAt: string
}

// 优惠券查询参数
export interface CouponQuery {
    page?: number
    pageSize?: number
    status?: string
}

/**
 * 获取优惠券列表（管理员）
 */
export const getCoupons = (params: CouponQuery) => {
    return get<PaginatedResponse<Coupon>>('/admin/coupons', { params })
}

/**
 * 创建优惠券
 */
export const createCoupon = (data: Partial<Coupon>) => {
    return post<Coupon>('/admin/coupons', data)
}

/**
 * 更新优惠券
 */
export const updateCoupon = (id: number, data: Partial<Coupon>) => {
    return put<Coupon>(`/admin/coupons/${id}`, data)
}

/**
 * 删除优惠券
 */
export const deleteCoupon = (id: number) => {
    return del(`/admin/coupons/${id}`)
}
