<template>
  <header class="fixed top-0 z-50 w-full border-b border-gray-200/50 bg-white/95 backdrop-blur-md shadow-sm">
    <div class="container">
      <div class="flex h-20 items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-2 group">
          <div
            class="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent group-hover:from-primary-dark group-hover:to-accent-pink transition-all">
            雅妆</div>
          <div class="text-sm text-text-secondary">ELEGANCE</div>
        </RouterLink>

        <!-- 导航菜单 -->
        <nav class="hidden space-x-8 lg:flex">
          <RouterLink v-for="item in navItems" :key="item.path" :to="item.path"
            class="text-gray-700 transition-colors hover:text-primary-dark">
            {{ item.label }}
          </RouterLink>
        </nav>

        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-4">
          <!-- 搜索 -->
          <button class="rounded-full p-2 hover:bg-gray-100" @click="openSearch">
            <SearchIcon class="h-5 w-5" />
          </button>

          <!-- 购物车 -->
          <RouterLink to="/cart" class="relative rounded-full p-2 hover:bg-gray-100">
            <ShoppingCartIcon class="h-5 w-5" />
            <span v-if="cartStore.itemCount > 0"
              class="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-accent-pink text-xs text-white">
              {{ cartStore.itemCount }}
            </span>
          </RouterLink>

          <!-- 用户 -->
          <div v-if="userStore.isLoggedIn" class="relative">
            <button class="flex items-center space-x-2 rounded-full p-2 hover:bg-gray-100"
              @click="showUserMenu = !showUserMenu">
              <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" alt="用户头像"
                class="h-8 w-8 rounded-full object-cover" />
              <UserIcon v-else class="h-5 w-5" />
            </button>

            <!-- 用户下拉菜单 -->
            <div v-if="showUserMenu"
              class="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-100"
              @click="showUserMenu = false">
              <div class="p-4 border-b border-gray-100">
                <div class="font-semibold text-gray-900">{{ userStore.userInfo?.username }}</div>
                <div class="text-sm text-gray-500">VIP {{ userStore.userInfo?.level || 1 }}</div>
              </div>
              <div class="py-2">
                <RouterLink to="/user"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary">
                  <span>👤</span> 用户中心
                </RouterLink>
                <RouterLink to="/user/orders"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary">
                  <span>📦</span> 我的订单
                </RouterLink>
                <RouterLink to="/user/coupons"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary">
                  <span>🎟️</span> 优惠券
                </RouterLink>
                <button class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  @click="handleLogout">
                  <span>🚪</span> 退出登录
                </button>
              </div>
            </div>
          </div>
          <div v-else class="flex items-center gap-2">
            <button class="btn btn-secondary btn-sm" @click="authModalStore.openLoginModal()">
              登录
            </button>
            <button class="btn btn-primary btn-sm" @click="authModalStore.openRegisterModal()">
              注册
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useAuthModalStore } from '@/stores/auth-modal'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import ShoppingCartIcon from '@/components/icons/ShoppingCartIcon.vue'
import UserIcon from '@/components/icons/UserIcon.vue'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const authModalStore = useAuthModalStore()

const showUserMenu = ref(false)

const navItems = [
  { path: '/', label: '首页' },
  { path: '/products', label: '产品中心' },
  { path: '/academy', label: '美妆学院' },
  { path: '/about', label: '品牌故事' },
  { path: '/service', label: '客户服务' },
]

const openSearch = () => {
  router.push('/search')
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    localStorage.removeItem('token')
    showUserMenu.value = false
    router.push('/')
  }
}
</script>
