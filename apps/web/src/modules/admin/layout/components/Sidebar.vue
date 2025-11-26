<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-header">
      <div v-if="!collapsed" class="logo">
        <span class="logo-text">雅妆管理</span>
      </div>
      <div v-else class="logo">
        <span class="logo-text-short">雅</span>
      </div>
    </div>

    <el-scrollbar class="sidebar-menu-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        :unique-opened="true"
        router
        class="sidebar-menu"
      >
        <template v-for="route in menuRoutes" :key="route.path">
          <!-- 单层菜单 -->
          <el-menu-item v-if="!route.children || route.children.length === 0" :index="route.path">
            <el-icon v-if="route.meta?.icon">
              <component :is="route.meta.icon" />
            </el-icon>
            <template #title>{{ route.meta?.title }}</template>
          </el-menu-item>

          <!-- 多层菜单 -->
          <el-sub-menu v-else :index="route.path">
            <template #title>
              <el-icon v-if="route.meta?.icon">
                <component :is="route.meta.icon" />
              </el-icon>
              <span>{{ route.meta?.title }}</span>
            </template>
            <el-menu-item
              v-for="child in route.children"
              :key="child.path"
              :index="`${route.path}/${child.path}`"
            >
              {{ child.meta?.title }}
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Props {
  collapsed?: boolean
}

withDefaults(defineProps<Props>(), {
  collapsed: false,
})

const route = useRoute()
const router = useRouter()

// 当前激活的菜单
const activeMenu = computed(() => {
  const { path } = route
  return path
})

// 过滤需要显示的菜单路由
const menuRoutes = computed(() => {
  const routes = router.getRoutes()
  return routes.filter(routeItem => {
    // 过滤掉隐藏的路由和登录页
    return (
      !routeItem.meta?.hidden &&
      routeItem.path !== '/login' &&
      routeItem.path !== '/:pathMatch(.*)*'
    )
  })
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background-color: #304156;
  transition: width 0.3s;
  z-index: 1000;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #263445;
  color: #fff;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 2px;
}

.logo-text-short {
  font-size: 24px;
  font-weight: 600;
}

.sidebar-menu-wrapper {
  height: calc(100vh - 60px);
}

.sidebar-menu {
  border-right: none;
  background-color: #304156;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: #bfcbd9;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: #263445 !important;
  color: #fff;
}

:deep(.el-menu-item.is-active) {
  background-color: #409eff !important;
  color: #fff;
}

:deep(.el-sub-menu .el-menu-item) {
  background-color: #1f2d3d !important;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background-color: #001528 !important;
}
</style>
