<template>
    <div class="admin-layout">
        <Sidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
        <div class="layout-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
            <Header @toggle-sidebar="toggleSidebar" />
            <Main />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import Main from './components/Main.vue'

const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style scoped>
.admin-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f5f7fa;
}

.layout-content {
    flex: 1;
    margin-left: 240px;
    transition: margin-left 0.3s;
    display: flex;
    flex-direction: column;
}

.layout-content.sidebar-collapsed {
    margin-left: 64px;
}
</style>
