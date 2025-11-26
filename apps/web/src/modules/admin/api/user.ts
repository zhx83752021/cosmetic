import { get, put, type PaginatedResponse } from './request'

// 用户接口
export interface User {
    id: number
    username: string
    email: string
    phone?: string
    nickname?: string
    avatar?: string
    gender?: string
    birthday?: string
    level: number
    points: number
    role: string
    status: string
    createdAt: string
    updatedAt: string
    _count?: {
        orders: number
    }
}

// 用户查询参数
export interface UserQuery {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    level?: number
}

/**
 * 获取用户列表（管理员）
 */
export const getUsers = (params: UserQuery) => {
    return get<PaginatedResponse<User>>('/admin/users', { params })
}

/**
 * 更新用户状态
 */
export const updateUserStatus = (id: number, status: string) => {
    return put(`/admin/users/${id}/status`, { status })
}
