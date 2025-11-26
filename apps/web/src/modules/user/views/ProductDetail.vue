<template>
  <div class="product-detail min-h-screen bg-white pt-20">
    <AppHeader />

    <section v-if="product" class="py-12">
      <div class="container">
        <div class="grid gap-12 lg:grid-cols-2">
          <!-- 产品图片 -->
          <div>
            <!-- 主图 -->
            <div class="mb-4 overflow-hidden rounded-card">
              <img :src="currentImage" :alt="product.name" class="h-[600px] w-full object-cover" />
            </div>
            <!-- 缩略图 -->
            <div class="grid grid-cols-4 gap-4">
              <div
                v-for="(image, index) in product.images"
                :key="index"
                :class="[
                  'cursor-pointer overflow-hidden rounded-lg border-2 transition-colors',
                  currentImage === image ? 'border-primary' : 'border-transparent',
                ]"
                @click="currentImage = image"
              >
                <img
                  :src="image"
                  :alt="`${product.name} ${index + 1}`"
                  class="h-24 w-full object-cover"
                />
              </div>
            </div>
          </div>

          <!-- 产品信息 -->
          <div>
            <!-- 标签 -->
            <div class="mb-4 flex gap-2">
              <span
                v-if="product.isNew"
                class="rounded-full bg-accent-pink px-3 py-1 text-xs font-semibold text-white"
              >
                NEW
              </span>
              <span
                v-if="product.isHot"
                class="rounded-full bg-accent-gold px-3 py-1 text-xs font-semibold text-white"
              >
                HOT
              </span>
            </div>

            <h1 class="mb-2 text-3xl font-bold text-gray-900">{{ product.name }}</h1>
            <p class="mb-4 text-lg text-gray-600">{{ product.subTitle }}</p>

            <!-- 评分 -->
            <div class="mb-6 flex items-center gap-4">
              <div class="flex items-center gap-1">
                <StarIcon class="h-5 w-5 text-accent-gold" />
                <span class="font-semibold">{{ product.rating }}</span>
              </div>
              <span class="text-gray-500">{{ product.reviewCount }} 条评价</span>
              <span class="text-gray-500">已售 {{ product.sales }}+</span>
            </div>

            <!-- 价格 -->
            <div class="mb-8 rounded-lg bg-neutral-gray p-6">
              <div class="flex items-baseline gap-4">
                <span class="text-4xl font-bold text-primary">¥{{ product.price }}</span>
                <span v-if="product.originalPrice" class="text-xl text-gray-400 line-through">
                  ¥{{ product.originalPrice }}
                </span>
              </div>
              <p class="mt-2 text-sm text-gray-600">VIP会员可享受更多优惠</p>
            </div>

            <!-- SKU选择 -->
            <div v-if="product.skus && product.skus.length" class="mb-6">
              <h3 class="mb-3 font-semibold">选择规格</h3>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="sku in product.skus"
                  :key="sku.id"
                  :class="[
                    'rounded-lg border-2 px-4 py-2 transition-colors',
                    selectedSku?.id === sku.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-300 hover:border-primary',
                  ]"
                  @click="selectedSku = sku"
                >
                  {{ sku.name }}
                </button>
              </div>
            </div>

            <!-- 数量选择 -->
            <div class="mb-6">
              <h3 class="mb-3 font-semibold">数量</h3>
              <div class="flex items-center gap-3">
                <button
                  class="btn btn-secondary h-10 w-10 p-0"
                  :disabled="quantity <= 1"
                  @click="quantity--"
                >
                  -
                </button>
                <input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="product.stock"
                  class="input h-10 w-20 text-center"
                />
                <button
                  class="btn btn-secondary h-10 w-10 p-0"
                  :disabled="quantity >= product.stock"
                  @click="quantity++"
                >
                  +
                </button>
                <span class="text-sm text-gray-500">库存 {{ product.stock }} 件</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-4">
              <button class="btn btn-primary flex-1 btn-lg" @click="addToCart">加入购物车</button>
              <button class="btn btn-secondary btn-lg" @click="buyNow">立即购买</button>
            </div>
          </div>
        </div>

        <!-- 产品详情 -->
        <div class="mt-16">
          <div class="mb-8 border-b border-gray-200">
            <div class="flex gap-8">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                :class="[
                  'pb-4 text-lg font-semibold transition-colors',
                  activeTab === tab.value
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-primary',
                ]"
                @click="activeTab = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <div class="prose max-w-none">
            <div v-if="activeTab === 'description'" v-html="product.description"></div>
            <div v-if="activeTab === 'details'" v-html="product.details"></div>
            <div v-if="activeTab === 'ingredients'" v-html="product.ingredients"></div>
            <div v-if="activeTab === 'usage'" v-html="product.usage"></div>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import StarIcon from '@/components/icons/StarIcon.vue'
import type { Product, ProductSku } from '@/types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const currentImage = ref('')
const selectedSku = ref<ProductSku | null>(null)
const quantity = ref(1)
const activeTab = ref('description')

const tabs = [
  { value: 'description', label: '产品介绍' },
  { value: 'details', label: '产品详情' },
  { value: 'ingredients', label: '成分说明' },
  { value: 'usage', label: '使用方法' },
]

onMounted(async () => {
  // TODO: 从API获取产品详情
  const productId = route.params.id
  console.log('加载产品:', productId)

  // 模拟数据
  product.value = {
    id: Number(productId),
    name: '精华液 - 深层补水保湿',
    subTitle: '48小时持久保湿，修护肌肤屏障',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80',
      'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=1200&q=80',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200&q=80',
    ],
    price: 398,
    originalPrice: 498,
    categoryId: 1,
    categoryName: '护肤系列',
    sales: 12580,
    stock: 999,
    rating: 4.8,
    reviewCount: 3250,
    description: '<p>这是一款高效补水保湿的精华液...</p>',
    details: '<p>产品详细说明...</p>',
    ingredients: '<p>主要成分：玻尿酸、胶原蛋白...</p>',
    usage: '<p>早晚洁面后使用...</p>',
    skus: [
      { id: 1, productId: 1, name: '30ml', price: 398, stock: 500, specs: [] },
      { id: 2, productId: 1, name: '50ml', price: 598, stock: 300, specs: [] },
    ],
    isNew: true,
    isHot: true,
    createdAt: new Date().toISOString(),
  }

  currentImage.value = product.value.images[0]
  if (product.value.skus && product.value.skus.length > 0) {
    selectedSku.value = product.value.skus[0]
  }
})

const addToCart = () => {
  if (!product.value) return

  cartStore.addToCart({
    id: product.value.id,
    skuId: selectedSku.value?.id,
    name: product.value.name,
    image: product.value.images[0],
    price: selectedSku.value?.price || product.value.price,
    quantity: quantity.value,
    selected: true,
    stock: product.value.stock,
    specs: selectedSku.value ? [{ name: '规格', value: selectedSku.value.name }] : undefined,
  })

  // TODO: 显示添加成功提示
  console.log('已添加到购物车')
}

const buyNow = () => {
  addToCart()
  router.push('/checkout')
}
</script>
