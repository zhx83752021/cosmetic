<template>
    <div id="app">
        <RouterView />
    </div>
</template>

<script setup lang="ts">
// 根据当前路由决定是否使用 Element Plus 的全局配置
</script>

<style>
#app {
    font-family: PingFang SC, Microsoft YaHei, sans-serif;
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
