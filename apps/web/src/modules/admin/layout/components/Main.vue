<template>
    <main class="main-content">
        <div class="content-wrapper">
            <router-view v-slot="{ Component }">
                <transition name="fade-transform" mode="out-in">
                    <keep-alive :include="cachedViews">
                        <component :is="Component" :key="route.path" />
                    </keep-alive>
                </transition>
            </router-view>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 需要缓存的视图列表
const cachedViews = ref<string[]>([
    'Dashboard',
    'ProductList',
    'OrderList',
    'UserList',
])
</script>

<style scoped>
.main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #f5f7fa;
}

.content-wrapper {
    min-height: calc(100vh - 100px);
    background-color: #fff;
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 页面切换动画 */
.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all 0.3s;
}

.fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
