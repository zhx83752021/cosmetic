<template>
  <div id="app">
    <RouterView />
    <!-- 全局弹窗组件 -->
    <LoginModal />
    <RegisterModal />
  </div>
</template>

<script setup lang="ts">
import LoginModal from '@/modules/user/components/auth/LoginModal.vue'
import RegisterModal from '@/modules/user/components/auth/RegisterModal.vue'
</script>

<style>
#app {
  font-family:
    PingFang SC,
    Microsoft YaHei,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 重置一些全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
