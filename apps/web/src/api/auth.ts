import { post, get, put } from './request'

// 登录参数
export interface LoginParams {
    account: string
    password: string
}

// 登录响应
export interface LoginResponse {
    user: {
        id: number
        username: string
        email: string
        role: string
        nickname?: string
        avatar?: string
    }
    accessToken: string
    refreshToken: string
}

// 用户信息
export interface UserInfo {
    id: number
    username: string
    email: string
    phone?: string
    nickname?: string
    avatar?: string
    role: string
    status: string
    createdAt: string
}

/**
 * 用户登录
 */
export const login = (data: LoginParams) => {
    return post<LoginResponse>('/auth/login', data)
}

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
    return get<UserInfo>('/auth/me')
}

/**
 * 刷新令牌
 */
export const refreshToken = (refreshToken: string) => {
    return post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
        refreshToken,
    })
}

/**
 * 更新个人信息
 */
export const updateProfile = (data: Partial<UserInfo>) => {
    return put<UserInfo>('/auth/profile', data)
}

/**
 * 修改密码
 */
export const changePassword = (oldPassword: string, newPassword: string) => {
    return put('/auth/password', { oldPassword, newPassword })
}
