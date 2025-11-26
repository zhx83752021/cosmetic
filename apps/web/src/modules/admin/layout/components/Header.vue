<template>
    <header class="admin-header">
        <div class="header-left">
            <el-icon class="toggle-icon" @click="handleToggleSidebar">
                <Fold v-if="!collapsed" />
                <Expand v-else />
            </el-icon>

            <el-breadcrumb separator="/">
                <el-breadcrumb-item
                    v-for="(item, index) in breadcrumbs"
                    :key="index"
                    :to="index === breadcrumbs.length - 1 ? undefined : { path: item.path }"
                >
                    {{ item.title }}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="header-right">
            <el-tooltip content="刷新页面" placement="bottom">
                <el-icon class="header-icon" @click="handleRefresh">
                    <Refresh />
                </el-icon>
            </el-tooltip>

            <el-tooltip content="全屏" placement="bottom">
                <el-icon class="header-icon" @click="handleFullscreen">
                    <FullScreen />
                </el-icon>
            </el-tooltip>

            <el-dropdown @command="handleCommand">
                <div class="user-info">
                    <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <span class="username">管理员</span>
                    <el-icon><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                        <el-dropdown-item command="settings">账号设置</el-dropdown-item>
                        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Fold, Expand, Refresh, FullScreen, ArrowDown } from '@element-plus/icons-vue'

const emit = defineEmits<{
    toggleSidebar: []
}>()

const route = useRoute()
const router = useRouter()

// 面包屑导航
const breadcrumbs = computed(() => {
    const matched = route.matched.filter(item => item.meta?.title)
    return matched.map(item => ({
        title: item.meta?.title as string,
        path: item.path,
    }))
})

// 切换侧边栏
const handleToggleSidebar = () => {
    emit('toggleSidebar')
}

// 刷新页面
const handleRefresh = () => {
    window.location.reload()
}

// 全屏切换
const handleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        }
    }
}

// 用户下拉菜单操作
const handleCommand = (command: string) => {
    switch (command) {
        case 'profile':
            ElMessage.info('个人中心功能开发中')
            break
        case 'settings':
            ElMessage.info('账号设置功能开发中')
            break
        case 'logout':
            ElMessageBox.confirm('确定要退出登录吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                localStorage.removeItem('admin-token')
                router.push('/login')
                ElMessage.success('已退出登录')
            }).catch(() => {
                // 取消操作
            })
            break
    }
}

// 用于父组件传递的 collapsed 状态
const collapsed = computed(() => false)
</script>

<style scoped>
.admin-header {
    height: 60px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.toggle-icon {
    font-size: 20px;
    cursor: pointer;
    transition: color 0.3s;
}

.toggle-icon:hover {
    color: #409eff;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.header-icon {
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s;
}

.header-icon:hover {
    color: #409eff;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.user-info:hover {
    background-color: #f5f7fa;
}

.username {
    font-size: 14px;
    color: #303133;
}

:deep(.el-breadcrumb__inner) {
    color: #606266;
    font-weight: normal;
}

:deep(.el-breadcrumb__inner.is-link) {
    color: #409eff;
}

:deep(.el-breadcrumb__inner.is-link:hover) {
    color: #66b1ff;
}
</style>
