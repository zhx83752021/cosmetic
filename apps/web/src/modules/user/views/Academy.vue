<template>
  <div class="academy-page min-h-screen bg-neutral-gray pt-20">
    <AppHeader />

    <section class="bg-primary-dark py-12 text-white">
      <div class="container">
        <h1 class="mb-2 text-4xl font-bold">美妆学院</h1>
        <p class="text-lg opacity-90">专业美妆知识，打造精致生活</p>
      </div>
    </section>

    <section class="py-12">
      <div class="container">
        <div class="mb-6 flex gap-6">
          <button
            v-for="category in categories"
            :key="category.value"
            :class="[
              'py-2 text-sm font-medium',
              currentCategory === category.value ? 'text-primary' : 'text-gray-600'
            ]"
            @click="currentCategory = category.value"
          >
            {{ category.label }}
          </button>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="article in articles"
            :key="article.id"
            class="card p-0 overflow-hidden"
          >
            <img :src="article.cover" :alt="article.title" class="h-48 w-full object-cover" />
            <div class="p-6">
              <h3 class="mb-3 text-lg font-semibold">{{ article.title }}</h3>
              <p class="text-sm text-gray-600">{{ article.summary }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const currentCategory = ref('all')
const categories = [
  { value: 'all', label: '全部' },
  { value: 'skincare', label: '护肤' },
  { value: 'makeup', label: '彩妆' },
]

const articles = ref([
  {
    id: 1,
    title: '护肤知识',
    summary: '专业护肤指导',
    cover: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
  },
])
</script>
