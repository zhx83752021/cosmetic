import type { Response, NextFunction } from 'express'
import type { AuthRequest } from '../middleware/auth.js'
import { prisma } from '../utils/prisma.js'
import { successResponse, paginatedResponse } from '../utils/response.js'
import { AppError } from '../middleware/errorHandler.js'

/**
 * 生成订单号
 */
const generateOrderNo = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')
  return `${year}${month}${day}${random}`
}

/**
 * 创建订单
 */
export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError(401, '未登录')
    }

    const { items, addressId, couponId, remark } = req.body

    // 获取收货地址
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: req.userId,
      },
    })

    if (!address) {
      throw new AppError(404, '收货地址不存在')
    }

    // 计算订单总金额
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { skus: true },
      })

      if (!product) {
        throw new AppError(404, `商品 ${item.productId} 不存在`)
      }

      if (product.status !== 'active') {
        throw new AppError(400, `商品 ${product.name} 已下架`)
      }

      let price = product.price
      let stock = product.stock
      let specs = null
      let skuId = null

      // 如果有SKU，使用SKU的价格和库存
      if (item.skuId) {
        const sku = product.skus.find((s: any) => s.id === item.skuId)
        if (!sku) {
          throw new AppError(404, `SKU ${item.skuId} 不存在`)
        }
        price = sku.price
        stock = sku.stock
        specs = sku.specs
        skuId = sku.id
      }

      // 检查库存
      if (stock < item.quantity) {
        throw new AppError(400, `商品 ${product.name} 库存不足`)
      }

      const itemTotal = Number(price) * item.quantity
      totalAmount += itemTotal

      const orderItem: any = {
        product: {
          connect: { id: product.id },
        },
        name: product.name,
        image: product.images[0],
        price,
        quantity: item.quantity,
        specs: specs || undefined,
      }

      if (skuId) {
        orderItem.sku = { connect: { id: skuId } }
      }

      orderItems.push(orderItem)
    }

    // 处理优惠券
    let discountAmount = 0
    if (couponId) {
      const userCoupon = await prisma.userCoupon.findFirst({
        where: {
          id: couponId,
          userId: req.userId,
          status: 'available',
        },
        include: { coupon: true },
      })

      if (!userCoupon) {
        throw new AppError(404, '优惠券不存在或不可用')
      }

      const coupon = userCoupon.coupon
      const now = new Date()
      if (now < coupon.startTime || now > coupon.endTime) {
        throw new AppError(400, '优惠券未在有效期内')
      }

      if (totalAmount < Number(coupon.minAmount)) {
        throw new AppError(400, `订单金额未达到优惠券使用门槛 ¥${coupon.minAmount}`)
      }

      // 计算优惠金额
      if (coupon.type === 'discount') {
        discountAmount = totalAmount * (1 - Number(coupon.value) / 100)
      } else if (coupon.type === 'fixed') {
        discountAmount = Number(coupon.value)
      }

      // 如果有最大优惠金额限制
      if (coupon.maxAmount && discountAmount > Number(coupon.maxAmount)) {
        discountAmount = Number(coupon.maxAmount)
      }
    }

    // 运费（简化处理，实际应根据地址和重量计算）
    const shippingFee = totalAmount >= 99 ? 0 : 10

    // 实付金额
    const payAmount = totalAmount - discountAmount + shippingFee

    // 创建订单
    const order = await prisma.order.create({
      data: {
        orderNo: generateOrderNo(),
        userId: req.userId,
        totalAmount,
        discountAmount,
        shippingFee,
        payAmount,
        addressData: {
          name: address.name,
          phone: address.phone,
          province: address.province,
          city: address.city,
          district: address.district,
          detail: address.detail,
        },
        remark,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
    })

    // 扣减库存
    for (const item of items) {
      if (item.skuId) {
        await prisma.productSku.update({
          where: { id: item.skuId },
          data: { stock: { decrement: item.quantity } },
        })
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }
    }

    // 标记优惠券为已使用
    if (couponId) {
      await prisma.userCoupon.update({
        where: { id: couponId },
        data: {
          status: 'used',
          usedAt: new Date(),
        },
      })
    }

    return successResponse(res, order, '订单创建成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 获取订单列表
 */
export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError(401, '未登录')
    }

    const { page = 1, pageSize = 10, status } = req.query

    const pageNum = parseInt(page as string)
    const pageSizeNum = parseInt(pageSize as string)
    const skip = (pageNum - 1) * pageSizeNum

    const where: any = {
      userId: req.userId,
    }

    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSizeNum,
      }),
      prisma.order.count({ where }),
    ])

    return paginatedResponse(res, orders, total, pageNum, pageSizeNum)
  } catch (error) {
    next(error)
  }
}

/**
 * 获取订单详情
 */
export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError(401, '未登录')
    }

    const { id } = req.params

    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      throw new AppError(404, '订单不存在')
    }

    return successResponse(res, order)
  } catch (error) {
    next(error)
  }
}

/**
 * 取消订单
 */
export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError(401, '未登录')
    }

    const { id } = req.params

    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
      include: { items: true },
    })

    if (!order) {
      throw new AppError(404, '订单不存在')
    }

    if (order.status !== 'pending') {
      throw new AppError(400, '订单状态不允许取消')
    }

    // 更新订单状态
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' },
    })

    // 恢复库存
    for (const item of order.items) {
      if (item.skuId) {
        await prisma.productSku.update({
          where: { id: item.skuId },
          data: { stock: { increment: item.quantity } },
        })
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        })
      }
    }

    return successResponse(res, updatedOrder, '订单已取消')
  } catch (error) {
    next(error)
  }
}

/**
 * 确认收货
 */
export const confirmOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError(401, '未登录')
    }

    const { id } = req.params

    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
    })

    if (!order) {
      throw new AppError(404, '订单不存在')
    }

    if (order.status !== 'shipped') {
      throw new AppError(400, '订单状态不允许确认收货')
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    })

    return successResponse(res, updatedOrder, '确认收货成功')
  } catch (error) {
    next(error)
  }
}

/**
 * 申请退款
 */
export const refundOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError(401, '未登录')
    }

    const { id } = req.params

    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
    })

    if (!order) {
      throw new AppError(404, '订单不存在')
    }

    if (!['paid', 'shipped', 'completed'].includes(order.status)) {
      throw new AppError(400, '订单状态不允许申请退款')
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: 'refunding' },
    })

    return successResponse(res, updatedOrder, '退款申请已提交')
  } catch (error) {
    next(error)
  }
}

/**
 * 获取所有订单（管理员）
 */
export const getAllOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, pageSize = 10, status, keyword } = req.query

    const pageNum = parseInt(page as string)
    const pageSizeNum = parseInt(pageSize as string)
    const skip = (pageNum - 1) * pageSizeNum

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (keyword) {
      where.OR = [{ orderNo: { contains: keyword as string } }]
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSizeNum,
      }),
      prisma.order.count({ where }),
    ])

    return paginatedResponse(res, orders, total, pageNum, pageSizeNum)
  } catch (error) {
    next(error)
  }
}

/**
 * 更新订单状态（管理员）
 */
export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      throw new AppError(400, '状态不能为空')
    }

    const validStatuses = [
      'pending',
      'paid',
      'shipped',
      'completed',
      'cancelled',
      'refunding',
      'refunded',
    ]
    if (!validStatuses.includes(status)) {
      throw new AppError(400, '无效的订单状态')
    }

    const updateData: any = { status }

    // 根据状态更新相应的时间字段
    if (status === 'paid') {
      updateData.paidAt = new Date()
    } else if (status === 'shipped') {
      updateData.shippedAt = new Date()
    } else if (status === 'completed') {
      updateData.completedAt = new Date()
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        items: true,
      },
    })

    // 如果是退款完成，恢复库存
    if (status === 'refunded') {
      for (const item of order.items) {
        if (item.skuId) {
          await prisma.productSku.update({
            where: { id: item.skuId },
            data: { stock: { increment: item.quantity } },
          })
        } else {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          })
        }
      }
    }

    return successResponse(res, order, '订单状态更新成功')
  } catch (error) {
    next(error)
  }
}
