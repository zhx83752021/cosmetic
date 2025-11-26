<template>
  <div class="product-list">
    <div class="page-header">
      <h2 class="page-title">商品列表</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon>
          <Plus />
        </el-icon>
        添加商品
      </el-button>
    </div>

    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="商品名称">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入商品名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable>
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="上架" value="active" />
            <el-option label="下架" value="inactive" />
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
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="商品ID" width="80" />
        <el-table-column label="商品图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="getProductImage(row.images)"
              :preview-src-list="row.images"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column label="分类" width="100">
          <template #default="{ row }">
            {{ row.category?.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getProducts,
  deleteProduct,
  getCategories,
  type Product,
  type Category,
} from '@/api/product'

const loading = ref(false)
const searchForm = reactive({
  keyword: '',
  categoryId: '',
  status: '',
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

const tableData = ref<Product[]>([])
const categories = ref<Category[]>([])

// 获取分类列表
const loadCategories = async () => {
  try {
    const res = await getCategories()
    if (res.success && res.data) {
      // 如果返回的是数组直接使用，否则提取 data 属性
      categories.value = res.data
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

// 获取商品列表
const loadProducts = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.size,
      keyword: searchForm.keyword || undefined,
      categoryId: searchForm.categoryId ? Number(searchForm.categoryId) : undefined,
      status: searchForm.status || undefined,
    }

    const res = await getProducts(params)
    if (res.success && res.data) {
      tableData.value = res.data.data.items
      pagination.total = res.data.data.pagination.total
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化图片
const getProductImage = (images: string[]) => {
  return images && images.length > 0 ? images[0] : 'https://via.placeholder.com/60'
}

const handleSearch = () => {
  pagination.page = 1
  loadProducts()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.categoryId = ''
  searchForm.status = ''
  pagination.page = 1
  loadProducts()
}

const handleAdd = () => {
  ElMessage.info('添加商品功能开发中')
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑商品: ${row.name}`)
}

const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm(`确定要删除商品 "${row.name}" 吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteProduct(row.id)
    ElMessage.success('删除成功')
    loadProducts()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>

<style scoped>
.product-list {
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
</style>
