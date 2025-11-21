import type { Response, NextFunction } from 'express'
import type { AuthRequest } from '../middleware/auth.js'
import { prisma } from '../utils/prisma.js'
import { successResponse, paginatedResponse } from '../utils/response.js'
import { AppError } from '../middleware/errorHandler.js'

/**
 * 获取仪表盘数据
 */
export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // 并发查询各项统计数据
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      todayOrders,
      pendingOrders,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      // 总用户数
      prisma.user.count(),

      // 总商品数
      prisma.product.count({ where: { status: 'active' } }),

      // 总订单数
      prisma.order.count(),

      // 总收入（已完成订单）
      prisma.order.aggregate({
        where: { status: 'completed' },
        _sum: { payAmount: true },
      }),

      // 今日订单数
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(now.setHours(0, 0, 0, 0)),
          },
        },
      }),

      // 待处理订单
      prisma.order.count({
        where: { status: 'pending' },
      }),

      // 低库存商品
      prisma.product.count({
        where: {
          status: 'active',
          stock: { lte: 10 },
        },
      }),

      // 最近订单
      prisma.order.findMany({
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    // 获取30天销售趋势
    const salesTrend = (await prisma.$queryRaw`
            SELECT
                DATE(created_at) as date,
                COUNT(*) as orders,
                SUM(pay_amount) as revenue
            FROM orders
            WHERE created_at >= ${thirtyDaysAgo}
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `) as any[]

    // 获取商品销售排行
    const topProducts = await prisma.product.findMany({
      where: { status: 'active' },
      orderBy: { sales: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        images: true,
        price: true,
        sales: true,
      },
    })

    // 获取分类销售统计
    const categorySales = (await prisma.$queryRaw`
            SELECT
                c.id,
                c.name,
                COUNT(DISTINCT o.id) as order_count,
                SUM(oi.quantity) as total_quantity,
                SUM(oi.price * oi.quantity) as total_revenue
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id
            LEFT JOIN order_items oi ON oi.product_id = p.id
            LEFT JOIN orders o ON o.id = oi.order_id
            WHERE o.status = 'completed'
            GROUP BY c.id, c.name
            ORDER BY total_revenue DESC
            LIMIT 10
        `) as any[]

    return successResponse(res, {
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: Number(totalRevenue._sum.payAmount || 0),
        todayOrders,
        pendingOrders,
        lowStockProducts,
      },
      salesTrend,
      topProducts,
      categorySales,
      recentOrders,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 获取用户列表（管理员）
 */
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, pageSize = 10, keyword, status, level } = req.query

    const pageNum = parseInt(page as string)
    const pageSizeNum = parseInt(pageSize as string)
    const skip = (pageNum - 1) * pageSizeNum

    const where: any = {}

    if (keyword) {
      where.OR = [
        { username: { contains: keyword as string, mode: 'insensitive' } },
        { email: { contains: keyword as string, mode: 'insensitive' } },
        { phone: { contains: keyword as string } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (level) {
      where.level = parseInt(level as string)
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          nickname: true,
          avatar: true,
          level: true,
          points: true,
          role: true,
          status: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSizeNum,
      }),
      prisma.user.count({ where }),
    ])

    return paginatedResponse(res, users, total, pageNum, pageSizeNum)
  } catch (error) {
    next(error)
  }
}

/**
 * 更新用户状态（管理员）
 */
export const updateUserStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['active', 'banned'].includes(status)) {
      throw new AppError(400, '无效的用户状态')
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { status },
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
      },
    })

    return successResponse(res, user, '用户状态更新成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 获取评论列表（管理员）
 */
export const getReviews = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, pageSize = 10, status, productId } = req.query

    const pageNum = parseInt(page as string)
    const pageSizeNum = parseInt(pageSize as string)
    const skip = (pageNum - 1) * pageSizeNum

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (productId) {
      where.productId = parseInt(productId as string)
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSizeNum,
      }),
      prisma.review.count({ where }),
    ])

    return paginatedResponse(res, reviews, total, pageNum, pageSizeNum)
  } catch (error) {
    next(error)
  }
}

/**
 * 更新评论状态（管理员）
 */
export const updateReviewStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw new AppError(400, '无效的评论状态')
    }

    const review = await prisma.review.update({
      where: { id: parseInt(id) },
      data: { status },
    })

    return successResponse(res, review, '评论状态更新成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 获取优惠券列表（管理员）
 */
export const getCoupons = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, pageSize = 10, status } = req.query

    const pageNum = parseInt(page as string)
    const pageSizeNum = parseInt(pageSize as string)
    const skip = (pageNum - 1) * pageSizeNum

    const where: any = {}

    if (status) {
      where.status = status
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSizeNum,
      }),
      prisma.coupon.count({ where }),
    ])

    return paginatedResponse(res, coupons, total, pageNum, pageSizeNum)
  } catch (error) {
    next(error)
  }
}

/**
 * 创建优惠券（管理员）
 */
export const createCoupon = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, type, value, minAmount, maxAmount, total, startTime, endTime, description } =
      req.body

    const coupon = await prisma.coupon.create({
      data: {
        name,
        type,
        value,
        minAmount,
        maxAmount,
        total,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
      },
    })

    return successResponse(res, coupon, '优惠券创建成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 更新优惠券（管理员）
 */
export const updateCoupon = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updateData = req.body

    if (updateData.startTime) {
      updateData.startTime = new Date(updateData.startTime)
    }
    if (updateData.endTime) {
      updateData.endTime = new Date(updateData.endTime)
    }

    const coupon = await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: updateData,
    })

    return successResponse(res, coupon, '优惠券更新成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 删除优惠券（管理员）
 */
export const deleteCoupon = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // 软删除：更新状态为inactive
    await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: { status: 'inactive' },
    })

    return successResponse(res, null, '优惠券删除成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 获取销售统计
 */
export const getSalesStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query

    const where: any = {
      status: 'completed',
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      }
    }

    const [orderStats, topProducts, topCategories] = await Promise.all([
      // 订单统计
      prisma.order.aggregate({
        where,
        _count: true,
        _sum: {
          totalAmount: true,
          discountAmount: true,
          payAmount: true,
        },
        _avg: {
          payAmount: true,
        },
      }),

      // 商品销售排行
      prisma.product.findMany({
        where: { status: 'active' },
        orderBy: { sales: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          sales: true,
          price: true,
        },
      }),

      // 分类销售排行
      prisma.$queryRaw`
                SELECT
                    c.id,
                    c.name,
                    COUNT(DISTINCT o.id) as order_count,
                    SUM(oi.quantity) as total_quantity
                FROM categories c
                LEFT JOIN products p ON p.category_id = c.id
                LEFT JOIN order_items oi ON oi.product_id = p.id
                LEFT JOIN orders o ON o.id = oi.order_id
                WHERE o.status = 'completed'
                GROUP BY c.id, c.name
                ORDER BY total_quantity DESC
                LIMIT 10
            ` as unknown as any[],
    ])

    return successResponse(res, {
      orderStats: {
        totalOrders: orderStats._count,
        totalRevenue: Number(orderStats._sum.payAmount || 0),
        totalDiscount: Number(orderStats._sum.discountAmount || 0),
        averageOrderValue: Number(orderStats._avg.payAmount || 0),
      },
      topProducts,
      topCategories,
    })
  } catch (error) {
    next(error)
  }
}
