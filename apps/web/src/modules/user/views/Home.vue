<template>
  <div class="home min-h-screen bg-white pt-20">
    <AppHeader />
    <main>
      <HeroBanner />
      <ProductCategories />
      <FeaturedProducts />
      <BrandStory />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HeroBanner from '@/components/home/HeroBanner.vue'
import ProductCategories from '@/components/home/ProductCategories.vue'
import FeaturedProducts from '@/components/home/FeaturedProducts.vue'
import BrandStory from '@/components/home/BrandStory.vue'
</script>

<style scoped>
.home {
  min-height: 100vh;
}
</style>
