<template>
  <div class="products-page min-h-screen bg-gradient-to-b from-neutral-cream to-white pt-20">
    <AppHeader />
    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent-lavender py-20 text-white"
    >
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-white to-accent-pink blur-3xl"
        ></div>
        <div
          class="absolute right-1/4 bottom-10 h-96 w-96 rounded-full bg-gradient-to-br from-accent-gold to-white blur-3xl"
        ></div>
      </div>
      <div class="container relative">
        <div class="mx-auto max-w-3xl text-center">
          <h1 class="mb-4 text-5xl font-bold">产品中心</h1>
          <p class="text-xl opacity-90">甄选全球优质原料，演绎东方美学精髓</p>
          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <span
              class="rounded-full bg-white/30 px-5 py-2 text-sm backdrop-blur-md shadow-sm border border-white/40"
              >🌿 天然成分</span
            >
            <span
              class="rounded-full bg-white/30 px-5 py-2 text-sm backdrop-blur-md shadow-sm border border-white/40"
              >🔬 科研实力</span
            >
            <span
              class="rounded-full bg-white/30 px-5 py-2 text-sm backdrop-blur-md shadow-sm border border-white/40"
              >✨ 品质保证</span
            >
          </div>
        </div>
      </div>
    </section>
    <!-- 产品列表 -->
    <section class="py-12">
      <div class="container">
        <div class="flex flex-col gap-8 lg:flex-row">
          <!-- 侧边栏筛选 -->
          <aside class="w-full lg:w-64">
            <div class="card sticky top-24 overflow-hidden">
              <div class="bg-gradient-to-r from-primary/10 to-transparent p-4">
                <h3 class="text-xl font-bold text-gray-900">筛选条件</h3>
              </div>
              <div class="p-6">
                <!-- 分类筛选 -->
                <div class="mb-6">
                  <h4 class="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                    <span class="text-primary">📦</span> 产品分类
                  </h4>
                  <div class="space-y-2">
                    <label
                      v-for="cat in categories"
                      :key="cat.value"
                      class="flex cursor-pointer items-center rounded-lg p-3 transition-colors hover:bg-primary/5"
                      :class="filters.category === cat.value ? 'bg-primary/10' : ''"
                    >
                      <input
                        v-model="filters.category"
                        type="radio"
                        :value="cat.value"
                        class="mr-3 h-4 w-4 text-primary"
                      />
                      <span
                        :class="
                          filters.category === cat.value
                            ? 'font-semibold text-primary'
                            : 'text-gray-700'
                        "
                        >{{ cat.label }}</span
                      >
                    </label>
                  </div>
                </div>
                <!-- 价格筛选 -->
                <div class="mb-6">
                  <h4 class="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                    <span class="text-primary">💰</span> 价格区间
                  </h4>
                  <div class="space-y-2">
                    <label
                      v-for="price in priceRanges"
                      :key="price.value"
                      class="flex cursor-pointer items-center rounded-lg p-3 transition-colors hover:bg-primary/5"
                      :class="filters.priceRange === price.value ? 'bg-primary/10' : ''"
                    >
                      <input
                        v-model="filters.priceRange"
                        type="radio"
                        :value="price.value"
                        class="mr-3 h-4 w-4 text-primary"
                      />
                      <span
                        :class="
                          filters.priceRange === price.value
                            ? 'font-semibold text-primary'
                            : 'text-gray-700'
                        "
                        >{{ price.label }}</span
                      >
                    </label>
                  </div>
                </div>
                <!-- 排序 -->
                <div class="mb-6">
                  <h4 class="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                    <span class="text-primary">⚡</span> 排序方式
                  </h4>
                  <select
                    v-model="filters.sort"
                    class="input w-full border-2 transition-colors focus:border-primary"
                  >
                    <option value="default">默认排序</option>
                    <option value="price-asc">价格从低到高</option>
                    <option value="price-desc">价格从高到低</option>
                    <option value="sales">销量最高</option>
                    <option value="rating">评分最高</option>
                  </select>
                </div>
                <div class="px-2">
                  <button
                    class="btn btn-secondary w-full transition-all hover:scale-105"
                    @click="resetFilters"
                  >
                    🔄 重置筛选
                  </button>
                </div>
              </div>
            </div>
          </aside>
          <!-- 产品网格 -->
          <div class="flex-1">
            <!-- 结果统计和视图切换 -->
            <div
              class="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">🎯</span>
                <p class="text-gray-700">
                  找到
                  <span class="text-2xl font-bold text-primary">{{ filteredProducts.length }}</span>
                  个产品
                </p>
              </div>
              <div class="text-sm text-gray-500">第 {{ currentPage }} / {{ totalPages }} 页</div>
            </div>
            <!-- 产品列表 -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <ProductCard
                v-for="product in paginatedProducts"
                :key="product.id"
                :product="product"
                class="transform transition-all duration-300 hover:-translate-y-2"
                @add-to-cart="handleAddToCart"
              />
            </div>
            <!-- 分页 -->
            <div v-if="totalPages > 1" class="mt-12 flex justify-center">
              <div class="inline-flex gap-2 rounded-lg bg-white p-2 shadow-md">
                <button
                  :disabled="currentPage === 1"
                  class="rounded-lg px-4 py-2 font-medium transition-all"
                  :class="
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-primary hover:text-white'
                  "
                  @click="currentPage--"
                >
                  ← 上一页
                </button>
                <div class="flex gap-1">
                  <button
                    v-for="page in displayPages"
                    :key="page"
                    class="min-w-[40px] rounded-lg px-3 py-2 font-medium transition-all"
                    :class="[
                      currentPage === page
                        ? 'bg-primary text-white shadow-lg scale-110'
                        : 'text-gray-700 hover:bg-primary/10',
                    ]"
                    @click="currentPage = page"
                  >
                    {{ page }}
                  </button>
                </div>
                <button
                  :disabled="currentPage === totalPages"
                  class="rounded-lg px-4 py-2 font-medium transition-all"
                  :class="
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-primary hover:text-white'
                  "
                  @click="currentPage++"
                >
                  下一页 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <AppFooter />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import type { Product } from '@/types'
const route = useRoute()
const cartStore = useCartStore()
const filters = ref({
  category: (route.query.category as string) || 'all',
  priceRange: 'all',
  sort: 'default',
})
const currentPage = ref(1)
const pageSize = 12
const categories = [
  { value: 'all', label: '全部产品' },
  { value: 'skincare', label: '护肤系列' },
  { value: 'makeup', label: '彩妆系列' },
  { value: 'perfume', label: '香水系列' },
  { value: 'gift', label: '礼盒套装' },
]
const priceRanges = [
  { value: 'all', label: '全部价格' },
  { value: '0-200', label: '¥0 - ¥200' },
  { value: '200-500', label: '¥200 - ¥500' },
  { value: '500-1000', label: '¥500 - ¥1000' },
  { value: '1000+', label: '¥1000以上' },
]
// 模拟产品数据 - 使用实际的Unsplash图片ID
const productImages = [
  'photo-1620916566398-39f1143ab7be', // 精华液
  'photo-1586495777744-4413f21062fa', // 口红
  'photo-1556228720-195a672e8a03', // 面霜
  'photo-1592945403244-b3fbafd7f539', // 香水
  'photo-1596755389378-c31d21fd1273', // 护肤品
  'photo-1512496015851-a90fb38ba796', // 化妆品
  'photo-1571875257727-256c39da42af', // 彩妆
  'photo-1570172619644-dfd03ed5d881', // 精华
  'photo-1598440947619-2c35fc9aa908', // 乳液
  'photo-1617897903246-719242758050', // 面膜
  'photo-1608248543803-ba4f8c70ae0b', // 美容产品
  'photo-1522335789203-aabd1fc54bc9', // 化妆刷
]
const allProducts = ref<Product[]>([
  // 这里应该从API获取数据
  ...Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: `产品名称 ${i + 1}`,
    subTitle: '产品副标题描述',
    images: [`https://images.unsplash.com/${productImages[i % productImages.length]}?w=800&q=80`],
    price: Math.floor(Math.random() * 900) + 100,
    originalPrice: undefined,
    categoryId: Math.floor(Math.random() * 4) + 1,
    categoryName: ['护肤系列', '彩妆系列', '香水系列', '礼盒套装'][Math.floor(Math.random() * 4)],
    sales: Math.floor(Math.random() * 10000),
    stock: 100,
    rating: 4 + Math.random(),
    reviewCount: Math.floor(Math.random() * 500),
    description: '产品描述',
    details: '产品详情',
    isNew: Math.random() > 0.7,
    isHot: Math.random() > 0.8,
    createdAt: new Date().toISOString(),
  })),
])
const filteredProducts = computed(() => {
  let result = allProducts.value
  // 分类筛选
  if (filters.value.category !== 'all') {
    result = result.filter(p => p.categoryName === filters.value.category)
  }
  // 价格筛选
  if (filters.value.priceRange !== 'all') {
    const [min, max] = filters.value.priceRange.split('-').map(Number)
    result = result.filter(p => {
      if (max) {
        return p.price >= min && p.price <= max
      } else {
        return p.price >= min
      }
    })
  }
  // 排序
  switch (filters.value.sort) {
    case 'price-asc':
      result = [...result].sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result = [...result].sort((a, b) => b.price - a.price)
      break
    case 'sales':
      result = [...result].sort((a, b) => b.sales - a.sales)
      break
    case 'rating':
      result = [...result].sort((a, b) => b.rating - a.rating)
      break
  }
  return result
})
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})
// 智能显示页码范围
const displayPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxDisplay = 5 // 最多显示5个页码
  if (total <= maxDisplay) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (current <= 3) {
    return [1, 2, 3, 4, 5]
  }
  if (current >= total - 2) {
    return [total - 4, total - 3, total - 2, total - 1, total]
  }
  return [current - 2, current - 1, current, current + 1, current + 2]
})
const resetFilters = () => {
  filters.value = {
    category: 'all',
    priceRange: 'all',
    sort: 'default',
  }
  currentPage.value = 1
}
const handleAddToCart = (product: Product) => {
  // 添加到购物车
  cartStore.addToCart({
    id: product.id,
    name: product.name,
    image: product.images[0],
    price: product.price,
    quantity: 1,
    stock: product.stock,
    selected: true,
  })
  // 移除alert提示弹窗
  // alert(`${product.name} 已加入购物车！`)
}
</script>
