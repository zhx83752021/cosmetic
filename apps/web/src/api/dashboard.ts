import { get } from './request'

// 仪表盘数据
export interface DashboardStats {
    overview: {
        totalUsers: number
        totalProducts: number
        totalOrders: number
        totalRevenue: number
        todayOrders: number
        pendingOrders: number
        lowStockProducts: number
    }
    salesTrend: Array<{
        date: string
        orders: number
        revenue: number
    }>
    topProducts: Array<{
        id: number
        name: string
        images: string[]
        price: number
        sales: number
    }>
    categorySales: Array<{
        id: number
        name: string
        order_count: number
        total_quantity: number
        total_revenue: number
    }>
    recentOrders: Array<any>
}

/**
 * 获取仪表盘统计数据
 */
export const getDashboardStats = () => {
    return get<DashboardStats>('/admin/dashboard')
}

/**
 * 获取销售统计
 */
export const getSalesStats = (startDate?: string, endDate?: string) => {
    return get('/admin/stats/sales', {
        params: { startDate, endDate },
    })
}
