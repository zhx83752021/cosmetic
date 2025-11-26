<template>
    <div class="articles-page">
        <div class="page-header">
            <h2 class="page-title">文章管理</h2>
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增文章</el-button>
        </div>

        <!-- 筛选条件 -->
        <el-card shadow="never" class="filter-card">
            <el-form :inline="true" :model="queryParams">
                <el-form-item label="关键词">
                    <el-input v-model="queryParams.keyword" placeholder="标题/作者" clearable style="width: 200px" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="queryParams.status" placeholder="全部状态" clearable style="width: 150px">
                        <el-option label="已发布" value="published" />
                        <el-option label="草稿" value="draft" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
                    <el-button :icon="Refresh" @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 表格 -->
        <el-card shadow="never" class="table-card">
            <el-table v-loading="loading" :data="articleList" border>
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column label="封面" width="100">
                    <template #default="{ row }">
                        <el-image :src="row.cover" fit="cover" style="width: 60px; height: 60px; border-radius: 4px;" />
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="文章标题" min-width="250" show-overflow-tooltip />
                <el-table-column prop="author" label="作者" width="120" />
                <el-table-column label="标签" width="200">
                    <template #default="{ row }">
                        <el-tag v-for="tag in row.tags" :key="tag" size="small" class="mr-1">{{ tag }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="views" label="浏览量" width="100" />
                <el-table-column prop="likes" label="点赞数" width="100" />
                <el-table-column label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag v-if="row.status === 'published'" type="success">已发布</el-tag>
                        <el-tag v-else type="info">草稿</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="180">
                    <template #default="{ row }">
                        {{ formatDate(row.createdAt) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
                        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize"
                    :total="total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleQuery" @current-change="handleQuery" />
            </div>
        </el-card>

        <!-- 新增/编辑对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" @close="handleDialogClose">
            <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="formData.title" placeholder="请输入文章标题" />
                </el-form-item>
                <el-form-item label="封面图片" prop="cover">
                    <el-input v-model="formData.cover" placeholder="请输入封面图片URL" />
                </el-form-item>
                <el-form-item label="文章摘要" prop="summary">
                    <el-input v-model="formData.summary" type="textarea" :rows="2" placeholder="请输入文章摘要" />
                </el-form-item>
                <el-form-item label="文章内容" prop="content">
                    <el-input v-model="formData.content" type="textarea" :rows="8" placeholder="请输入文章内容（支持Markdown）" />
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="formData.author" placeholder="请输入作者名称" />
                </el-form-item>
                <el-form-item label="标签">
                    <el-input v-model="tagsInput" placeholder="多个标签用逗号分隔" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio value="published">发布</el-radio>
                        <el-radio value="draft">草稿</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getArticles, createArticle, updateArticle, deleteArticle, type Article } from '@/api/article'

// 查询参数
const queryParams = reactive({
    page: 1,
    pageSize: 10,
    keyword: '',
    status: '',
})

// 列表数据
const loading = ref(false)
const articleList = ref<Article[]>([])
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增文章')
const formRef = ref<FormInstance>()
const tagsInput = ref('')
const formData = reactive({
    id: null as number | null,
    title: '',
    cover: '',
    summary: '',
    content: '',
    author: '',
    status: 'draft',
})

// 表单验证规则
const rules: FormRules = {
    title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
    cover: [{ required: true, message: '请输入封面图片URL', trigger: 'blur' }],
    content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
    author: [{ required: true, message: '请输入作者名称', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 获取列表
const getList = async () => {
    loading.value = true
    try {
        const params = {
            page: queryParams.page,
            pageSize: queryParams.pageSize,
            keyword: queryParams.keyword || undefined,
            status: queryParams.status || undefined,
        }

        const res = await getArticles(params)
        if (res.success && res.data) {
            articleList.value = res.data.data.items
            total.value = res.data.data.pagination.total
        }
    } catch (error) {
        console.error('获取文章列表失败:', error)
        ElMessage.error('获取文章列表失败')
    } finally {
        loading.value = false
    }
}

// 查询
const handleQuery = () => {
    queryParams.page = 1
    getList()
}

// 重置
const handleReset = () => {
    queryParams.keyword = ''
    queryParams.status = ''
    handleQuery()
}

// 新增
const handleAdd = () => {
    dialogTitle.value = '新增文章'
    dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Article) => {
    dialogTitle.value = '编辑文章'
    formData.id = row.id
    formData.title = row.title
    formData.cover = row.cover
    formData.summary = row.summary || ''
    formData.content = row.content
    formData.author = row.author
    formData.status = row.status
    tagsInput.value = row.tags.join(',')
    dialogVisible.value = true
}

// 删除
const handleDelete = async (row: Article) => {
    try {
        await ElMessageBox.confirm('确定要删除该文章吗？', '提示', {
            type: 'warning',
        })

        await deleteArticle(row.id)
        ElMessage.success('删除成功')
        getList()
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('删除失败:', error)
            ElMessage.error('删除失败')
        }
    }
}

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                const submitData = {
                    title: formData.title,
                    cover: formData.cover,
                    summary: formData.summary,
                    content: formData.content,
                    author: formData.author,
                    tags: tagsInput.value ? tagsInput.value.split(',').map(t => t.trim()).filter(t => t) : [],
                    status: formData.status,
                }

                if (formData.id) {
                    await updateArticle(formData.id, submitData)
                    ElMessage.success('更新成功')
                } else {
                    await createArticle(submitData)
                    ElMessage.success('创建成功')
                }

                dialogVisible.value = false
                getList()
            } catch (error) {
                console.error('提交失败:', error)
                ElMessage.error('提交失败')
            }
        }
    })
}

// 关闭对话框
const handleDialogClose = () => {
    formRef.value?.resetFields()
    formData.id = null
    formData.title = ''
    formData.cover = ''
    formData.summary = ''
    formData.content = ''
    formData.author = ''
    formData.status = 'draft'
    tagsInput.value = ''
}

// 格式化日期
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
}

onMounted(() => {
    getList()
})
</script>

<style scoped>
.articles-page {
    padding: 20px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0;
}

.filter-card {
    margin-bottom: 20px;
}

.table-card {
    margin-bottom: 20px;
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.mr-1 {
    margin-right: 4px;
}
</style>
