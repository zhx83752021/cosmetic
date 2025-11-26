<template>
  <div class="about-page min-h-screen bg-white pt-20">
    <AppHeader />

    <main>
      <!-- Hero Section -->
      <section class="bg-primary-dark py-20 text-white">
        <div class="container text-center">
          <h1 class="mb-4 text-5xl font-bold">雅妆品牌故事</h1>
          <p class="text-xl opacity-90">演绎东方美学，传承匠心精神</p>
        </div>
      </section>

      <!-- Brand Story -->
      <section class="py-16">
        <div class="container max-w-4xl">
          <div class="prose max-w-none">
            <h2>品牌起源</h2>
            <p>
              2015年，雅妆诞生于充满人文气息的杭州。创始人深耕化妆品行业十余年，
              怀揣着"让每个女性都能享受高品质护肤体验"的理念，创立了雅妆品牌。
            </p>

            <h2>品牌理念</h2>
            <p>
              雅妆秉承"自然之美，由内而外"的品牌理念，坚持使用天然草本成分，
              融合现代生物科技，为现代女性提供安全、有效的护肤解决方案。
            </p>

            <h2>产品理念</h2>
            <p>
              我们深入研究东方女性的肌肤特点，针对不同肤质和年龄段的需求，
              精心研发每一款产品。从护肤到彩妆，从日常保养到专业护理，
              雅妆致力于为您提供全方位的美丽解决方案。
            </p>
          </div>
        </div>
      </section>

      <!-- Milestones -->
      <section class="bg-neutral-gray py-16">
        <div class="container">
          <h2 class="mb-12 text-center text-3xl font-bold">品牌历程</h2>
          <div class="space-y-8">
            <div v-for="milestone in milestones" :key="milestone.year" class="flex gap-8">
              <div class="w-24 flex-shrink-0 text-right">
                <div class="text-2xl font-bold text-primary">{{ milestone.year }}</div>
              </div>
              <div class="flex-1 rounded-lg bg-white p-6">
                <h3 class="mb-2 text-xl font-semibold">{{ milestone.title }}</h3>
                <p class="text-gray-600">{{ milestone.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const milestones = ref([
  {
    year: '2015',
    title: '品牌创立',
    description: '雅妆品牌在杭州正式成立，开启东方美妆新篇章',
  },
  {
    year: '2017',
    title: '产品线扩展',
    description: '推出护肤、彩妆、香水三大产品线',
  },
  {
    year: '2019',
    title: '国际化布局',
    description: '产品远销日本、韩国、东南亚等20多个国家和地区',
  },
  {
    year: '2022',
    title: '用户突破500万',
    description: '获得超过500万用户的信赖和支持',
  },
  {
    year: '2025',
    title: '持续创新',
    description: '不断研发新品，为用户提供更优质的产品和服务',
  },
])
</script>
