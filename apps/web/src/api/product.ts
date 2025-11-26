import { get, post, put, del, type PaginatedResponse } from './request'

// 商品接口
export interface Product {
    id: number
    name: string
    subTitle?: string
    images: string[]
    price: number
    originalPrice?: number
    categoryId: number
    brand?: string
    sales: number
    stock: number
    description?: string
    details?: string
    ingredients?: string
    usage?: string
    status: string
    isNew: boolean
    isHot: boolean
    createdAt: string
    updatedAt: string
    category?: {
        id: number
        name: string
    }
}

// 商品分类
export interface Category {
    id: number
    name: string
    icon?: string
    image?: string
    parentId?: number
    sort: number
    createdAt: string
    updatedAt: string
    children?: Category[]
    _count?: {
        products: number
    }
}

// 商品查询参数
export interface ProductQuery {
    page?: number
    pageSize?: number
    categoryId?: number
    brand?: string
    keyword?: string
    status?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

/**
 * 获取商品列表
 */
export const getProducts = (params: ProductQuery) => {
    return get<PaginatedResponse<Product>>('/products', { params })
}

/**
 * 获取商品详情
 */
export const getProductById = (id: number) => {
    return get<Product>(`/products/${id}`)
}

/**
 * 创建商品
 */
export const createProduct = (data: Partial<Product>) => {
    return post<Product>('/products', data)
}

/**
 * 更新商品
 */
export const updateProduct = (id: number, data: Partial<Product>) => {
    return put<Product>(`/products/${id}`, data)
}

/**
 * 删除商品
 */
export const deleteProduct = (id: number) => {
    return del(`/products/${id}`)
}

/**
 * 获取分类列表
 */
export const getCategories = () => {
    return get<Category[]>('/products/categories/all')
}

/**
 * 获取分类详情
 */
export const getCategoryById = (id: number) => {
    return get<Category>(`/products/categories/${id}`)
}

/**
 * 创建分类
 */
export const createCategory = (data: Partial<Category>) => {
    return post<Category>('/products/categories', data)
}

/**
 * 更新分类
 */
export const updateCategory = (id: number, data: Partial<Category>) => {
    return put<Category>(`/products/categories/${id}`, data)
}

/**
 * 删除分类
 */
export const deleteCategory = (id: number) => {
    return del(`/products/categories/${id}`)
}
