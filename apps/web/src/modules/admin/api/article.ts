import { get, post, put, del, type PaginatedResponse } from './request'

// 文章接口
export interface Article {
    id: number
    title: string
    cover: string
    summary?: string
    content: string
    categoryId?: number
    author: string
    views: number
    likes: number
    tags: string[]
    status: string
    createdAt: string
    updatedAt: string
}

// 文章查询参数
export interface ArticleQuery {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    categoryId?: number
}

/**
 * 获取文章列表（管理员）
 */
export const getArticles = (params: ArticleQuery) => {
    return get<PaginatedResponse<Article>>('/articles/admin', { params })
}

/**
 * 获取文章详情
 */
export const getArticleById = (id: number) => {
    return get<Article>(`/articles/${id}`)
}

/**
 * 创建文章
 */
export const createArticle = (data: Partial<Article>) => {
    return post<Article>('/articles', data)
}

/**
 * 更新文章
 */
export const updateArticle = (id: number, data: Partial<Article>) => {
    return put<Article>(`/articles/${id}`, data)
}

/**
 * 删除文章
 */
export const deleteArticle = (id: number) => {
    return del(`/articles/${id}`)
}

/**
 * 点赞文章
 */
export const likeArticle = (id: number) => {
    return post(`/articles/${id}/like`)
}
