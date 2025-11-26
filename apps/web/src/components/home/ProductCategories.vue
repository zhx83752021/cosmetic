<template>
  <section class="py-20 bg-white">
    <div class="container">
      <div class="mb-12 text-center">
        <div
          class="mb-3 inline-block rounded-full bg-gradient-to-r from-accent-lavender/10 to-primary/10 px-6 py-2 text-sm font-semibold text-primary-dark">
          🌸 Categories
        </div>
        <h2 class="mb-4 text-4xl font-bold text-text-primary">产品分类</h2>
        <p class="text-lg text-text-secondary">探索我们的全系列产品</p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <RouterLink v-for="category in categories" :key="category.id" :to="`/products?category=${category.slug}`"
          class="card group cursor-pointer overflow-hidden p-0 transition-transform hover:scale-105">
          <div class="relative h-64 overflow-hidden">
            <img :src="category.image" :alt="category.name"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/40 to-transparent">
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 class="mb-2 text-2xl font-bold drop-shadow-lg">{{ category.name }}</h3>
              <p class="text-sm opacity-90 drop-shadow-md">{{ category.description }}</p>
            </div>
          </div>
          <div class="p-6 text-center bg-gradient-to-b from-neutral-cream/50 to-white">
            <span class="text-primary hover:text-primary-dark font-medium transition-colors">
              查看全部 {{ category.count }}+ 产品 →
            </span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
  count: number
}

const categories = ref<Category[]>([
  {
    id: 1,
    name: '护肤系列',
    slug: 'skincare',
    description: '专业护肤，呵护每一寸肌肤',
    image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800&q=80',
    count: 120,
  },
  {
    id: 2,
    name: '彩妆系列',
    slug: 'makeup',
    description: '精致彩妆，展现独特魅力',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
    count: 95,
  },
  {
    id: 3,
    name: '香水系列',
    slug: 'perfume',
    description: '迷人香氛，留下优雅印记',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    count: 48,
  },
  {
    id: 4,
    name: '礼盒套装',
    slug: 'gift',
    description: '精选组合，完美礼赠之选',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80',
    count: 32,
  },
])
</script>
