<template>
  <section class="hero-banner relative h-[600px] overflow-hidden bg-gradient-to-r from-primary/10 to-primary-dark/10">
    <div class="swiper-container h-full">
      <div class="swiper-wrapper">
        <div v-for="(slide, index) in slides" :key="index" class="swiper-slide relative">
          <img :src="slide.image" :alt="slide.title" class="h-full w-full object-cover" />
          <div class="absolute inset-0 flex items-center bg-black/30">
            <div class="container">
              <div class="max-w-2xl text-white animate-fade-in">
                <h2 class="mb-4 text-5xl font-bold">{{ slide.title }}</h2>
                <p class="mb-8 text-xl">{{ slide.subtitle }}</p>
                <RouterLink v-if="slide.link" :to="slide.link" class="btn btn-primary btn-lg inline-block">
                  {{ slide.buttonText }}
                </RouterLink>
                <button v-else class="btn btn-primary btn-lg" disabled>
                  {{ slide.buttonText }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页器 -->
      <div class="swiper-pagination"></div>
      <!-- 导航按钮 -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Swiper from 'swiper'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Slide {
  image: string
  title: string
  subtitle: string
  buttonText: string
  link?: string // 可选的链接地址
}

const slides = ref<Slide[]>([
  {
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&q=80',
    title: '焕发肌肤光彩',
    subtitle: '专业护肤，由内而外的美丽蜕变',
    buttonText: '立即选购',
    link: '/products?category=skincare', // 跳转到护肤品分类
  },
  {
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80',
    title: '奢华彩妆系列',
    subtitle: '精致妆容，展现独特魅力',
    buttonText: '探索更多',
    link: '/products?category=makeup', // 跳转到彩妆分类
  },
  {
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1920&q=80',
    title: '新品上市',
    subtitle: '限时优惠，尊享会员专属礼遇',
    buttonText: '查看详情',
    link: '/products', // 跳转到产品列表
  },
])

// TODO: 从后台API获取轮播图数据
// const fetchBanners = async () => {
//   try {
//     const response = await fetch('/api/banners')
//     const data = await response.json()
//     slides.value = data.banners
//   } catch (error) {
//     console.error('获取轮播图失败:', error)
//   }
// }

let swiperInstance: Swiper | null = null

onMounted(() => {
  swiperInstance = new Swiper('.swiper-container', {
    modules: [Navigation, Pagination, Autoplay],
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    speed: 800,
  })
})
</script>

<style scoped>
.hero-banner :deep(.swiper-pagination-bullet) {
  background: white;
  opacity: 0.5;
}

.hero-banner :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: #e6c9b8;
}

.hero-banner :deep(.swiper-button-next),
.hero-banner :deep(.swiper-button-prev) {
  color: white;
}
</style>
