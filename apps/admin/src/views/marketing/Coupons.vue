<template>
  <div class="coupons-page">
    <div class="page-header">
      <h2 class="page-title">优惠券管理</h2>
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增优惠券</el-button>
    </div>

    <!-- 筛选条件 -->
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="全部状态"
            clearable
            style="width: 150px"
          >
            <el-option label="进行中" value="active" />
            <el-option label="已结束" value="inactive" />
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
      <el-table v-loading="loading" :data="couponList" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="优惠券名称" min-width="200" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.type === 'discount'">折扣券</el-tag>
            <el-tag v-else type="success">满减券</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="优惠金额/折扣" width="140">
          <template #default="{ row }">
            <span v-if="row.type === 'discount'">{{ row.value }}折</span>
            <span v-else>¥{{ row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="minAmount" label="最低消费" width="110">
          <template #default="{ row }"> ¥{{ row.minAmount }} </template>
        </el-table-column>
        <el-table-column label="发放/使用" width="120">
          <template #default="{ row }"> {{ row.used }} / {{ row.total }} </template>
        </el-table-column>
        <el-table-column label="有效期" min-width="300">
          <template #default="{ row }">
            {{ formatDate(row.startTime) }} ~ {{ formatDate(row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'active'" type="success">进行中</el-tag>
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
      width="600px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="110px">
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入优惠券名称" />
        </el-form-item>
        <el-form-item label="优惠类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio value="discount">折扣券</el-radio>
            <el-radio value="fixed">满减券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="formData.type === 'discount' ? '折扣(0-10)' : '优惠金额'"
          prop="value"
        >
          <el-input-number
            v-model="formData.value"
            :min="0"
            :max="formData.type === 'discount' ? 10 : 99999"
            :precision="formData.type === 'discount' ? 1 : 2"
            :step="formData.type === 'discount' ? 0.1 : 1"
          />
        </el-form-item>
        <el-form-item label="最低消费" prop="minAmount">
          <el-input-number v-model="formData.minAmount" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="最大优惠">
          <el-input-number
            v-model="formData.maxAmount"
            :min="0"
            :precision="2"
            placeholder="不限制请留空"
          />
        </el-form-item>
        <el-form-item label="发放数量" prop="total">
          <el-input-number v-model="formData.total" :min="1" />
        </el-form-item>
        <el-form-item label="有效期" prop="timeRange">
          <el-date-picker
            v-model="formData.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="优惠券描述">
          <el-input v-model="formData.description" type="textarea" :rows="3" />
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
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/api/coupon'
import type { Coupon } from '@/api/coupon'

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  status: '',
})

// 列表数据
const loading = ref(false)
const couponList = ref<Coupon[]>([])
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增优惠券')
const formRef = ref<FormInstance>()
const formData = reactive<any>({
  id: null,
  name: '',
  type: 'discount',
  value: 0,
  minAmount: 0,
  maxAmount: null,
  total: 100,
  timeRange: [],
  description: '',
})

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择优惠类型', trigger: 'change' }],
  value: [{ required: true, message: '请输入优惠金额/折扣', trigger: 'blur' }],
  minAmount: [{ required: true, message: '请输入最低消费金额', trigger: 'blur' }],
  total: [{ required: true, message: '请输入发放数量', trigger: 'blur' }],
  timeRange: [{ required: true, message: '请选择有效期', trigger: 'change' }],
}

// 获取列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getCoupons(queryParams)
    if (res.success && res.data) {
      couponList.value = res.data.data.items
      total.value = res.data.data.pagination.total
    }
  } catch (error) {
    console.error('获取优惠券列表失败:', error)
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
  queryParams.status = ''
  handleQuery()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增优惠券'
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Coupon) => {
  dialogTitle.value = '编辑优惠券'
  formData.id = row.id
  formData.name = row.name
  formData.type = row.type
  formData.value = row.value
  formData.minAmount = row.minAmount
  formData.maxAmount = row.maxAmount
  formData.total = row.total
  formData.timeRange = [new Date(row.startTime), new Date(row.endTime)]
  formData.description = row.description
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: Coupon) => {
  try {
    await ElMessageBox.confirm('确定要删除该优惠券吗？', '提示', {
      type: 'warning',
    })
    await deleteCoupon(row.id)
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

  await formRef.value.validate(async valid => {
    if (valid) {
      try {
        const submitData = {
          name: formData.name,
          type: formData.type,
          value: formData.value,
          minAmount: formData.minAmount,
          maxAmount: formData.maxAmount,
          total: formData.total,
          startTime: formData.timeRange[0].toISOString(),
          endTime: formData.timeRange[1].toISOString(),
          description: formData.description,
        }

        if (formData.id) {
          await updateCoupon(formData.id, submitData)
          ElMessage.success('更新成功')
        } else {
          await createCoupon(submitData)
          ElMessage.success('创建成功')
        }

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
  formData.name = ''
  formData.type = 'discount'
  formData.value = 0
  formData.minAmount = 0
  formData.maxAmount = null
  formData.total = 100
  formData.timeRange = []
  formData.description = ''
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
.coupons-page {
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
