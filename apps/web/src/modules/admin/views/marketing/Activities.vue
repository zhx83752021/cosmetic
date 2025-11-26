<template>
    <div class="activities-page">
        <div class="page-header">
            <h2 class="page-title">活动管理</h2>
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增活动</el-button>
        </div>

        <!-- 筛选条件 -->
        <el-card shadow="never" class="filter-card">
            <el-form :inline="true" :model="queryParams">
                <el-form-item label="活动名称">
                    <el-input
                        v-model="queryParams.keyword"
                        placeholder="请输入活动名称"
                        clearable
                        style="width: 200px"
                    />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="queryParams.status" placeholder="全部状态" clearable style="width: 150px">
                        <el-option label="进行中" value="ongoing" />
                        <el-option label="未开始" value="upcoming" />
                        <el-option label="已结束" value="ended" />
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
            <el-table v-loading="loading" :data="activityList" border>
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column label="活动封面" width="120">
                    <template #default="{ row }">
                        <el-image
                            :src="row.banner"
                            fit="cover"
                            style="width: 80px; height: 60px; border-radius: 4px;"
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="活动名称" min-width="200" show-overflow-tooltip />
                <el-table-column prop="type" label="活动类型" width="120">
                    <template #default="{ row }">
                        <el-tag v-if="row.type === 'discount'">限时折扣</el-tag>
                        <el-tag v-else-if="row.type === 'seckill'" type="danger">秒杀</el-tag>
                        <el-tag v-else-if="row.type === 'bundle'" type="success">组合优惠</el-tag>
                        <el-tag v-else type="info">其他</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="活动时间" min-width="300">
                    <template #default="{ row }">
                        {{ formatDate(row.startTime) }} ~ {{ formatDate(row.endTime) }}
                    </template>
                </el-table-column>
                <el-table-column prop="participants" label="参与人数" width="100" />
                <el-table-column label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag v-if="row.status === 'ongoing'" type="success">进行中</el-tag>
                        <el-tag v-else-if="row.status === 'upcoming'" type="warning">未开始</el-tag>
                        <el-tag v-else type="info">已结束</el-tag>
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
                <el-pagination
                    v-model:current-page="queryParams.page"
                    v-model:page-size="queryParams.pageSize"
                    :total="total"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleQuery"
                    @current-change="handleQuery"
                />
            </div>
        </el-card>

        <!-- 新增/编辑对话框 -->
        <el-dialog
            v-model="dialogVisible"
            :title="dialogTitle"
            width="700px"
            @close="handleDialogClose"
        >
            <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="活动名称" prop="title">
                    <el-input v-model="formData.title" placeholder="请输入活动名称" />
                </el-form-item>
                <el-form-item label="活动类型" prop="type">
                    <el-select v-model="formData.type" placeholder="请选择活动类型" style="width: 100%">
                        <el-option label="限时折扣" value="discount" />
                        <el-option label="秒杀活动" value="seckill" />
                        <el-option label="组合优惠" value="bundle" />
                        <el-option label="其他" value="other" />
                    </el-select>
                </el-form-item>
                <el-form-item label="活动封面" prop="banner">
                    <el-input v-model="formData.banner" placeholder="请输入活动封面URL" />
                </el-form-item>
                <el-form-item label="活动描述">
                    <el-input v-model="formData.description" type="textarea" :rows="3" />
                </el-form-item>
                <el-form-item label="活动时间" prop="timeRange">
                    <el-date-picker
                        v-model="formData.timeRange"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        style="width: 100%"
                    />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 活动接口类型
interface Activity {
    id: number
    title: string
    type: string
    banner: string
    description?: string
    startTime: string
    endTime: string
    participants: number
    status: string
}

// 查询参数
const queryParams = reactive({
    page: 1,
    pageSize: 10,
    keyword: '',
    status: '',
})

// 列表数据
const loading = ref(false)
const activityList = ref<Activity[]>([
    {
        id: 1,
        title: '双十一狂欢购物节',
        type: 'discount',
        banner: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400',
        description: '全场5折起，满299减50',
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        participants: 3256,
        status: 'ongoing',
    },
])
const total = ref(1)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增活动')
const formRef = ref<FormInstance>()
const formData = reactive({
    id: null as number | null,
    title: '',
    type: '',
    banner: '',
    description: '',
    timeRange: [] as Date[],
})

// 表单验证规则
const rules: FormRules = {
    title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
    banner: [{ required: true, message: '请输入活动封面URL', trigger: 'blur' }],
    timeRange: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
}

// 获取列表
const getList = async () => {
    loading.value = true
    // TODO: 调用API
    setTimeout(() => {
        loading.value = false
    }, 500)
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
    dialogTitle.value = '新增活动'
    dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Activity) => {
    dialogTitle.value = '编辑活动'
    formData.id = row.id
    formData.title = row.title
    formData.type = row.type
    formData.banner = row.banner
    formData.description = row.description || ''
    formData.timeRange = [new Date(row.startTime), new Date(row.endTime)]
    dialogVisible.value = true
}

// 删除
const handleDelete = async (row: Activity) => {
    try {
        await ElMessageBox.confirm('确定要删除该活动吗？', '提示', {
            type: 'warning',
        })
        // TODO: 调用API
        ElMessage.success('删除成功')
        getList()
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('删除失败:', error)
        }
    }
}

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                // TODO: 调用API
                ElMessage.success(formData.id ? '更新成功' : '创建成功')
                dialogVisible.value = false
                getList()
            } catch (error) {
                console.error('提交失败:', error)
            }
        }
    })
}

// 关闭对话框
const handleDialogClose = () => {
    formRef.value?.resetFields()
    formData.id = null
    formData.title = ''
    formData.type = ''
    formData.banner = ''
    formData.description = ''
    formData.timeRange = []
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
.activities-page {
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
</style>
