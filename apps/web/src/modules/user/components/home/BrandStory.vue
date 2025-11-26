<template>
  <section class="py-20 bg-gradient-to-b from-white to-neutral-cream">
    <div class="container">
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <!-- 图片部分 -->
        <div class="relative">
          <div class="relative overflow-hidden rounded-card">
            <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80" alt="品牌故事"
              class="h-[500px] w-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-primary/30 to-transparent"></div>
          </div>
          <!-- 装饰元素 -->
          <div
            class="absolute -bottom-6 -right-6 h-48 w-48 rounded-full bg-gradient-to-br from-accent-pink/30 to-primary/20 blur-3xl">
          </div>
          <div class="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-accent-lavender/20 blur-2xl"></div>
        </div>

        <!-- 文字部分 -->
        <div>
          <div class="mb-6">
            <div
              class="mb-3 inline-block rounded-full bg-gradient-to-r from-primary/10 to-accent-lavender/10 px-6 py-2 text-sm font-semibold text-primary">
              🌺 About Us
            </div>
            <h2 class="mt-2 text-4xl font-bold text-text-primary">
              雅妆，演绎东方美学
            </h2>
          </div>

          <div class="space-y-4 text-text-secondary">
            <p class="text-lg leading-relaxed">
              自2015年创立以来，雅妆始终秉承"自然之美，由内而外"的品牌理念，
              致力于为现代女性提供高品质的护肤与彩妆产品。
            </p>
            <p class="leading-relaxed">
              我们深入研究东方女性的肌肤特点，融合传统草本精华与现代科技，
              精心打造每一款产品。从护肤到彩妆，从日常保养到专业护理，
              雅妆为您提供全方位的美丽解决方案。
            </p>
            <p class="leading-relaxed">
              十年来，我们获得了超过500万用户的信赖，产品远销全球20多个国家和地区。
              这份信任，是我们不断前行的动力。
            </p>
          </div>

          <div class="mt-8 grid grid-cols-3 gap-6">
            <div class="text-center rounded-xl bg-gradient-to-br from-primary/5 to-transparent p-4">
              <div
                class="mb-2 text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                500万+</div>
              <div class="text-sm text-text-secondary">用户信赖</div>
            </div>
            <div class="text-center rounded-xl bg-gradient-to-br from-accent-pink/5 to-transparent p-4">
              <div
                class="mb-2 text-3xl font-bold bg-gradient-to-r from-accent-pink to-primary bg-clip-text text-transparent">
                20+</div>
              <div class="text-sm text-text-secondary">国家地区</div>
            </div>
            <div class="text-center rounded-xl bg-gradient-to-br from-accent-lavender/5 to-transparent p-4">
              <div
                class="mb-2 text-3xl font-bold bg-gradient-to-r from-primary-dark to-accent-lavender bg-clip-text text-transparent">
                10年</div>
              <div class="text-sm text-text-secondary">匠心传承</div>
            </div>
          </div>

          <div class="mt-8">
            <RouterLink to="/about" class="btn btn-primary btn-lg">
              了解更多
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 品牌故事组件
</script>
