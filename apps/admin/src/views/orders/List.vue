<template>
  <div class="order-list">
    <div class="page-header">
      <h2 class="page-title">订单列表</h2>
    </div>

    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="订单号/用户">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入订单号或用户名"
            clearable
            @keyup.enter="handleSearch"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select
            v-model="searchForm.status"
            placeholder="全部状态"
            clearable
            style="width: 150px"
          >
            <el-option label="待付款" value="pending" />
            <el-option label="待发货" value="paid" />
            <el-option label="已发货" value="shipped" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
            <el-option label="已退款" value="refunded" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column label="用户信息" width="150">
          <template #default="{ row }">
            <div>
              <div>{{ row.user?.username || '-' }}</div>
              <div class="text-gray">{{ row.user?.phone || '-' }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.payAmount?.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="支付时间" width="180">
          <template #default="{ row }">
            {{ row.paidAt ? formatDate(row.paidAt) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleDetail(row)">详情</el-button>
            <el-button
              v-if="row.status === 'paid'"
              link
              type="success"
              size="small"
              @click="handleShip(row)"
              >发货</el-button
            >
            <el-button
              v-if="row.status === 'shipped'"
              link
              type="warning"
              size="small"
              @click="handleComplete(row)"
              >完成</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        @size-change="handleSearch"
        @current-change="handleSearch"
      />
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog v-model="detailVisible" title="订单详情" width="800px">
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(currentOrder.status)">{{
              getStatusText(currentOrder.status)
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户信息">
            {{ currentOrder.user?.username || '-' }} ({{ currentOrder.user?.phone || '-' }})
          </el-descriptions-item>
          <el-descriptions-item label="下单时间">{{
            formatDate(currentOrder.createdAt)
          }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{
            currentOrder.paidAt ? formatDate(currentOrder.paidAt) : '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="发货时间">{{
            currentOrder.shippedAt ? formatDate(currentOrder.shippedAt) : '-'
          }}</el-descriptions-item>
        </el-descriptions>

        <h4 class="section-title">收货地址</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="收货人">{{
            currentOrder.addressData?.name
          }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            currentOrder.addressData?.phone
          }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">
            {{ currentOrder.addressData?.province }} {{ currentOrder.addressData?.city }}
            {{ currentOrder.addressData?.district }} {{ currentOrder.addressData?.detail }}
          </el-descriptions-item>
        </el-descriptions>

        <h4 class="section-title">商品信息</h4>
        <el-table :data="currentOrder.items" border>
          <el-table-column label="商品" min-width="200">
            <template #default="{ row }">
              <div class="product-info">
                <el-image
                  :src="row.image"
                  fit="cover"
                  style="width: 60px; height: 60px; border-radius: 4px"
                />
                <div class="product-name">{{ row.name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="120">
            <template #default="{ row }"> ¥{{ row.price?.toFixed(2) }} </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="80" />
          <el-table-column label="小计" width="120">
            <template #default="{ row }"> ¥{{ (row.price * row.quantity).toFixed(2) }} </template>
          </el-table-column>
        </el-table>

        <h4 class="section-title">费用明细</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="商品总额"
            >¥{{ currentOrder.totalAmount?.toFixed(2) }}</el-descriptions-item
          >
          <el-descriptions-item label="优惠金额"
            >-¥{{ currentOrder.discountAmount?.toFixed(2) }}</el-descriptions-item
          >
          <el-descriptions-item label="运费"
            >¥{{ currentOrder.shippingFee?.toFixed(2) }}</el-descriptions-item
          >
          <el-descriptions-item label="实付金额">
            <span class="price" style="font-size: 18px; font-weight: bold"
              >¥{{ currentOrder.payAmount?.toFixed(2) }}</span
            >
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="currentOrder.remark" class="order-remark">
          <h4 class="section-title">订单备注</h4>
          <p>{{ currentOrder.remark }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAllOrders, getOrderById, updateOrderStatus, type Order } from '@/api/order'

const loading = ref(false)
const searchForm = reactive({
  keyword: '',
  status: '',
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

const tableData = ref<Order[]>([])
const detailVisible = ref(false)
const currentOrder = ref<Order | null>(null)

// 获取订单列表
const loadOrders = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.size,
      keyword: searchForm.keyword || undefined,
      status: searchForm.status || undefined,
    }

    const res = await getAllOrders(params)
    if (res.success && res.data) {
      tableData.value = res.data.data.items
      pagination.total = res.data.data.pagination.total
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

const getStatusType = (status: string): TagType => {
  const map: Record<string, TagType> = {
    pending: 'info',
    paid: 'warning',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger',
    refunded: 'info',
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待付款',
    paid: '待发货',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款',
  }
  return map[status] || '未知'
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleSearch = () => {
  pagination.page = 1
  loadOrders()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  pagination.page = 1
  loadOrders()
}

const handleDetail = async (row: Order) => {
  try {
    const res = await getOrderById(row.id)
    if (res.success && res.data) {
      currentOrder.value = res.data
      detailVisible.value = true
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  }
}

// 发货
const handleShip = async (row: Order) => {
  try {
    await ElMessageBox.confirm(`确定要为订单 "${row.orderNo}" 发货吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await updateOrderStatus(row.id, 'shipped')
    ElMessage.success('发货成功')
    loadOrders()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('发货失败:', error)
      ElMessage.error('发货失败')
    }
  }
}

// 完成订单
const handleComplete = async (row: Order) => {
  try {
    await ElMessageBox.confirm(`确定要完成订单 "${row.orderNo}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await updateOrderStatus(row.id, 'completed')
    ElMessage.success('订单已完成')
    loadOrders()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('完成订单失败:', error)
      ElMessage.error('完成订单失败')
    }
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.order-list {
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

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-top: 20px;
}

.price {
  color: #f56c6c;
  font-weight: 600;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.text-gray {
  font-size: 12px;
  color: #909399;
}

.order-detail {
  padding: 10px 0;
}

.section-title {
  margin: 20px 0 10px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-name {
  flex: 1;
}

.order-remark {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.order-remark p {
  margin: 5px 0 0;
  color: #606266;
}
</style>
