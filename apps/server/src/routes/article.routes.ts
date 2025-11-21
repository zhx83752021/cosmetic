import { Router, type Router as RouterType } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { prisma } from '../utils/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'

const router: RouterType = Router()

/**
 * 获取文章列表（管理员）
 * GET /api/articles/admin
 */
router.get('/admin', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = '1', pageSize = '10', keyword, status } = req.query

    const pageNum = parseInt(page as string)
    const pageSizeNum = parseInt(pageSize as string)
    const skip = (pageNum - 1) * pageSizeNum

    // 构建查询条件
    const where: any = {}

    if (keyword) {
      where.OR = [
        { title: { contains: keyword as string, mode: 'insensitive' } },
        { author: { contains: keyword as string, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    // 查询文章列表
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: pageSizeNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.article.count({ where }),
    ])

    return successResponse(res, {
      items: articles,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total,
        totalPages: Math.ceil(total / pageSizeNum),
      },
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    res.status(500).json({ success: false, message: '获取文章列表失败' })
  }
})

/**
 * 获取文章列表（公开）
 * GET /api/articles
 */
router.get('/', async (req, res) => {
  try {
    const { page = '1', pageSize = '10', keyword, categoryId } = req.query

    const pageNum = parseInt(page as string)
    const pageSizeNum = parseInt(pageSize as string)
    const skip = (pageNum - 1) * pageSizeNum

    // 构建查询条件
    const where: any = { status: 'published' }

    if (keyword) {
      where.OR = [
        { title: { contains: keyword as string, mode: 'insensitive' } },
        { summary: { contains: keyword as string, mode: 'insensitive' } },
      ]
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId as string)
    }

    // 查询文章列表
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: pageSizeNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          cover: true,
          summary: true,
          author: true,
          views: true,
          likes: true,
          tags: true,
          createdAt: true,
        },
      }),
      prisma.article.count({ where }),
    ])

    return successResponse(res, {
      items: articles,
      pagination: {
        page: pageNum,
        pageSize: pageSizeNum,
        total,
        totalPages: Math.ceil(total / pageSizeNum),
      },
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    res.status(500).json({ success: false, message: '获取文章列表失败' })
  }
})

/**
 * 获取文章详情
 * GET /api/articles/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    })

    if (!article) {
      return res.status(404).json({ success: false, message: '文章不存在' })
    }

    // 增加浏览量
    await prisma.article.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } },
    })

    return successResponse(res, article)
  } catch (error) {
    console.error('获取文章详情失败:', error)
    res.status(500).json({ success: false, message: '获取文章详情失败' })
  }
})

/**
 * 创建文章
 * POST /api/articles
 */
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, cover, summary, content, author, tags, status, categoryId } = req.body

    // 验证必填字段
    if (!title || !cover || !content || !author) {
      return res.status(400).json({ success: false, message: '请填写完整的文章信息' })
    }

    // 创建文章
    const article = await prisma.article.create({
      data: {
        title,
        cover,
        summary,
        content,
        author,
        tags: tags || [],
        status: status || 'draft',
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
    })

    return successResponse(res, article, '创建成功')
  } catch (error) {
    console.error('创建文章失败:', error)
    res.status(500).json({ success: false, message: '创建文章失败' })
  }
})

/**
 * 更新文章
 * PUT /api/articles/:id
 */
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params
    const { title, cover, summary, content, author, tags, status, categoryId } = req.body

    // 检查文章是否存在
    const existingArticle = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    })

    if (!existingArticle) {
      return errorResponse(res, '文章不存在', 404)
    }

    // 更新文章
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(cover && { cover }),
        ...(summary !== undefined && { summary }),
        ...(content && { content }),
        ...(author && { author }),
        ...(tags && { tags }),
        ...(status && { status }),
        ...(categoryId !== undefined && { categoryId: categoryId ? parseInt(categoryId) : null }),
      },
    })

    return successResponse(res, article, '更新成功')
  } catch (error) {
    console.error('更新文章失败:', error)
    res.status(500).json({ success: false, message: '更新文章失败' })
  }
})

/**
 * 删除文章
 * DELETE /api/articles/:id
 */
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params

    // 检查文章是否存在
    const existingArticle = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    })

    if (!existingArticle) {
      return res.status(404).json({ success: false, message: '文章不存在' })
    }

    // 删除文章
    await prisma.article.delete({
      where: { id: parseInt(id) },
    })

    return successResponse(res, null, '删除成功')
  } catch (error) {
    console.error('删除文章失败:', error)
    res.status(500).json({ success: false, message: '删除文章失败' })
  }
})

/**
 * 点赞文章
 * POST /api/articles/:id/like
 */
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: 1 } },
    })

    return successResponse(res, article)
  } catch (error) {
    console.error('点赞失败:', error)
    res.status(500).json({ success: false, message: '点赞失败' })
  }
})

export default router
