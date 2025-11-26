<template>
  <div class="article-page min-h-screen bg-white pt-20">
    <AppHeader />

    <article v-if="article" class="py-12">
      <div class="container max-w-4xl">
        <!-- 文章头部 -->
        <header class="mb-8">
          <div class="mb-4 flex items-center gap-3">
            <span class="rounded bg-primary px-3 py-1 text-sm font-semibold text-white">
              {{ article.category }}
            </span>
            <span class="text-gray-500">{{ formatDate(article.publishedAt) }}</span>
          </div>
          <h1 class="mb-4 text-4xl font-bold text-gray-900">{{ article.title }}</h1>
          <div class="flex items-center gap-6 text-gray-600">
            <span>👁️ {{ article.views }} 次浏览</span>
            <span>👍 {{ article.likes }} 个赞</span>
          </div>
        </header>

        <!-- 文章封面 -->
        <div class="mb-8 overflow-hidden rounded-lg">
          <img :src="article.cover" :alt="article.title" class="h-96 w-full object-cover" />
        </div>

        <!-- 文章内容 -->
        <div class="prose max-w-none" v-html="article.content"></div>

        <!-- 文章底部操作 -->
        <footer class="mt-12 border-t border-gray-200 pt-8">
          <div class="flex items-center justify-between">
            <button class="btn btn-secondary" @click="$router.back()">
              ← 返回列表
            </button>
            <button class="btn btn-primary" @click="likeArticle">
              👍 点赞 ({{ article.likes }})
            </button>
          </div>
        </footer>
      </div>
    </article>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()

interface Article {
  id: number
  title: string
  cover: string
  category: string
  content: string
  views: number
  likes: number
  publishedAt: string
}

const article = ref<Article | null>(null)

onMounted(() => {
  const articleId = route.params.id
  // TODO: 从API获取文章详情
  article.value = {
    id: Number(articleId),
    title: '夏季护肤必备：如何选择合适的防晒霜',
    cover: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80',
    category: '护肤知识',
    content: `
      <p>防晒是护肤的重要一步，选择合适的防晒霜对保护肌肤至关重要。</p>
      <h2>为什么要防晒？</h2>
      <p>紫外线是导致皮肤老化的主要原因之一...</p>
      <h2>如何选择防晒霜？</h2>
      <p>根据肤质和使用场景选择合适的防晒产品...</p>
    `,
    views: 1250,
    likes: 89,
    publishedAt: new Date().toISOString(),
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const likeArticle = () => {
  if (article.value) {
    article.value.likes++
    // TODO: 调用点赞API
  }
}
</script>
