import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// API响应接口
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

// 分页响应接口
export interface PaginatedResponse<T = any> {
  success: boolean
  message: string
  data: {
    items: T[]
    pagination: {
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  }
  timestamp: string
}

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 15000,
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加认证令牌
    const token = localStorage.getItem('admin-token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data

    // 如果响应成功
    if (res.success) {
      return response
    }

    // 如果响应失败
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  error => {
    console.error('响应错误:', error)

    // 处理不同的错误状态
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录')
          localStorage.removeItem('admin-token')
          router.push('/login')
          break
        case 403:
          ElMessage.error('权限不足')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error(data?.message || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

// 封装GET请求
export const get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return service
    .get<ApiResponse<T>>(url, config)
    .then((response: AxiosResponse<ApiResponse<T>>) => response.data)
}

// 封装POST请求
export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return service
    .post<ApiResponse<T>>(url, data, config)
    .then((response: AxiosResponse<ApiResponse<T>>) => response.data)
}

// 封装PUT请求
export const put = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return service
    .put<ApiResponse<T>>(url, data, config)
    .then((response: AxiosResponse<ApiResponse<T>>) => response.data)
}

// 封装DELETE请求
export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return service
    .delete<ApiResponse<T>>(url, config)
    .then((response: AxiosResponse<ApiResponse<T>>) => response.data)
}

export default service
