<template>
  <div class="not-found-page flex min-h-screen flex-col items-center justify-center bg-neutral-gray">
    <div class="text-center">
      <div class="mb-8 text-9xl font-bold text-primary">404</div>
      <h1 class="mb-4 text-3xl font-bold text-gray-900">页面不存在</h1>
      <p class="mb-8 text-gray-600">抱歉，您访问的页面找不到了</p>
      <div class="flex justify-center gap-4">
        <button class="btn btn-secondary" @click="$router.back()">
          返回上一页
        </button>
        <RouterLink to="/" class="btn btn-primary">
          回到首页
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404页面
</script>
