<template>
  <section class="py-20 bg-gradient-to-b from-neutral-cream to-white">
    <div class="container">
      <div class="mb-12 text-center">
        <div
          class="mb-3 inline-block rounded-full bg-gradient-to-r from-primary/10 to-accent-pink/10 px-6 py-2 text-sm font-semibold text-primary">
          ✨ Featured Products
        </div>
        <h2 class="mb-4 text-4xl font-bold text-text-primary">精选推荐</h2>
        <p class="text-lg text-text-secondary">为您精心挑选的明星产品</p>
      </div>

      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="product in products" :key="product.id"
          class="card group cursor-pointer overflow-hidden p-0 transition-transform hover:scale-105"
          @click="goToProduct(product.id)">
          <!-- 产品图片 -->
          <div class="relative overflow-hidden">
            <img :src="product.image" :alt="product.name"
              class="h-80 w-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <!-- 标签 -->
            <div class="absolute left-4 top-4 flex flex-col gap-2">
              <span v-if="product.isNew"
                class="rounded-full bg-gradient-to-r from-accent-pink to-accent-coral px-3 py-1 text-xs font-semibold text-white shadow-sm">
                NEW
              </span>
              <span v-if="product.isHot"
                class="rounded-full bg-gradient-to-r from-accent-gold to-primary px-3 py-1 text-xs font-semibold text-white shadow-sm">
                HOT
              </span>
            </div>
            <!-- 快速操作按钮 -->
            <div
              class="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button class="btn btn-primary flex-1" @click.stop="addToCart(product)">
                加入购物车
              </button>
            </div>
          </div>

          <!-- 产品信息 -->
          <div class="p-6 bg-gradient-to-b from-white to-neutral-cream/30">
            <h3 class="mb-2 text-lg font-semibold text-text-primary line-clamp-2">
              {{ product.name }}
            </h3>
            <p class="mb-3 text-sm text-text-secondary line-clamp-1">
              {{ product.subtitle }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-bold text-primary">
                  ¥{{ product.price }}
                </span>
                <span v-if="product.originalPrice" class="text-sm text-gray-400 line-through">
                  ¥{{ product.originalPrice }}
                </span>
              </div>
              <div class="flex items-center gap-1 text-sm text-gray-500">
                <StarIcon class="h-4 w-4 text-accent-gold" />
                <span>{{ product.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 text-center">
        <RouterLink to="/products" class="btn btn-secondary btn-lg">
          查看全部产品
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import StarIcon from '@/components/icons/StarIcon.vue'

interface Product {
  id: number
  name: string
  subtitle: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  isNew: boolean
  isHot: boolean
}

const router = useRouter()
const cartStore = useCartStore()

const products = ref<Product[]>([
  {
    id: 1,
    name: '精华液 - 深层补水保湿',
    subtitle: '48小时持久保湿，修护肌肤屏障',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    price: 398,
    originalPrice: 498,
    rating: 4.8,
    isNew: true,
    isHot: true,
  },
  {
    id: 2,
    name: '口红 - 雾面哑光系列',
    subtitle: '丝滑质地，持久不脱色',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
    price: 199,
    rating: 4.9,
    isNew: false,
    isHot: true,
  },
  {
    id: 3,
    name: '面霜 - 抗衰老紧致',
    subtitle: '淡化细纹，提拉紧致',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    price: 568,
    originalPrice: 688,
    rating: 4.7,
    isNew: true,
    isHot: false,
  },
  {
    id: 4,
    name: '香水 - 玫瑰花语',
    subtitle: '优雅花香，持久留香',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
    price: 699,
    rating: 4.6,
    isNew: false,
    isHot: false,
  },
])

const goToProduct = (id: number) => {
  router.push(`/product/${id}`)
}

const addToCart = (product: Product) => {
  cartStore.addToCart({
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    quantity: 1,
    selected: true,
    stock: 999,
  })
  // TODO: 显示添加成功提示
  console.log('已添加到购物车:', product.name)
}
</script>
