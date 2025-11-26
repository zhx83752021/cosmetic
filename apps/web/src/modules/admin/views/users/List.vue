<template>
  <div class="user-list">
    <div class="page-header">
      <h2 class="page-title">用户列表</h2>
    </div>

    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="搜索">
          <el-input
            v-model="searchForm.keyword"
            placeholder="用户名/手机号/邮箱"
            clearable
            @keyup.enter="handleSearch"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="全部状态"
            clearable
            style="width: 150px"
          >
            <el-option label="正常" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select
            v-model="searchForm.level"
            placeholder="全部等级"
            clearable
            style="width: 150px"
          >
            <el-option label="普通会员" :value="1" />
            <el-option label="黄金会员" :value="2" />
            <el-option label="铂金会员" :value="3" />
            <el-option label="钻石会员" :value="4" />
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
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="用户信息" min-width="200">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :src="row.avatar" :size="40">
                {{ row.username?.charAt(0) }}
              </el-avatar>
              <div class="user-details">
                <div class="username">{{ row.username }}</div>
                <div class="nickname">{{ row.nickname || '-' }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column label="会员等级" width="120">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ getLevelText(row.level) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" width="100" />
        <el-table-column label="订单数" width="100">
          <template #default="{ row }">
            {{ row._count?.orders || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              :type="row.status === 'active' ? 'danger' : 'success'"
              size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button link type="primary" size="small" @click="handleViewOrders(row)"
              >订单</el-button
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsers, updateUserStatus, type User } from '@/api/user'

const loading = ref(false)
const searchForm = reactive({
  keyword: '',
  status: '',
  level: undefined as number | undefined,
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

const tableData = ref<User[]>([])

// 获取用户列表
const loadUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.size,
      keyword: searchForm.keyword || undefined,
      status: searchForm.status || undefined,
      level: searchForm.level,
    }

    const res = await getUsers(params)
    if (res.success && res.data) {
      tableData.value = res.data.data.items
      pagination.total = res.data.data.pagination.total
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 会员等级类型
type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

const getLevelType = (level: number): TagType => {
  const map: Record<number, TagType> = {
    1: 'info',
    2: 'warning',
    3: 'primary',
    4: 'success',
  }
  return map[level] || 'info'
}

// 会员等级文本
const getLevelText = (level: number) => {
  const map: Record<number, string> = {
    1: '普通会员',
    2: '黄金会员',
    3: '铂金会员',
    4: '钻石会员',
  }
  return map[level] || '普通会员'
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
  loadUsers()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.level = undefined
  pagination.page = 1
  loadUsers()
}

// 切换用户状态
const handleToggleStatus = async (row: User) => {
  const newStatus = row.status === 'active' ? 'inactive' : 'active'
  const actionText = newStatus === 'inactive' ? '禁用' : '启用'

  try {
    await ElMessageBox.confirm(`确定要${actionText}用户 "${row.username}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await updateUserStatus(row.id, newStatus)
    ElMessage.success(`${actionText}成功`)
    loadUsers()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error(`${actionText}失败:`, error)
      ElMessage.error(`${actionText}失败`)
    }
  }
}

// 查看用户订单
const handleViewOrders = (row: User) => {
  ElMessage.info(`查看用户 ${row.username} 的订单`)
  // TODO: 跳转到订单列表并筛选该用户
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-list {
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

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.username {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.nickname {
  font-size: 12px;
  color: #909399;
}
</style>
