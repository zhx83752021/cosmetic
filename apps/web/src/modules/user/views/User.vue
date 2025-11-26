<template>
  <div class="user-page min-h-screen bg-neutral-gray pt-20">
    <AppHeader />

    <section class="py-12">
      <div class="container">
        <div class="grid gap-8 lg:grid-cols-4">
          <!-- 侧边栏导航 -->
          <aside class="lg:col-span-1">
            <div class="card">
              <!-- 用户信息 -->
              <div class="mb-6 border-b border-gray-200 pb-6 text-center">
                <div class="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full bg-primary/20">
                  <img
                    v-if="userStore.userInfo?.avatar"
                    :src="userStore.userInfo.avatar"
                    alt="用户头像"
                    class="h-full w-full object-cover"
                  />
                  <div v-else class="flex h-full w-full items-center justify-center text-3xl text-primary">
                    👤
                  </div>
                </div>
                <h3 class="font-semibold text-gray-900">
                  {{ userStore.userInfo?.nickname || userStore.userInfo?.username || '用户' }}
                </h3>
                <p class="text-sm text-gray-500">VIP{{ userStore.userInfo?.level || 1 }}</p>
              </div>

              <!-- 导航菜单 -->
              <nav class="space-y-1">
                <RouterLink
                  v-for="item in menuItems"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors"
                  active-class="bg-primary text-white"
                  :class="$route.path === item.path ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <span class="text-xl">{{ item.icon }}</span>
                  <span>{{ item.label }}</span>
                </RouterLink>
              </nav>
            </div>
          </aside>

          <!-- 主内容区 -->
          <div class="lg:col-span-3">
            <RouterView />
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const userStore = useUserStore()

const menuItems = [
  { path: '/user/profile', label: '个人信息', icon: '👤' },
  { path: '/user/orders', label: '我的订单', icon: '📦' },
  { path: '/user/addresses', label: '收货地址', icon: '📍' },
  { path: '/user/coupons', label: '优惠券', icon: '🎫' },
  { path: '/user/points', label: '我的积分', icon: '⭐' },
]
</script>
