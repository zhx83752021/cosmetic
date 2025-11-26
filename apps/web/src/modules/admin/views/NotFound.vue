<template>
    <div class="not-found">
        <div class="not-found-content">
            <h1 class="error-code">404</h1>
            <h2 class="error-title">页面不存在</h2>
            <p class="error-message">抱歉,您访问的页面不存在或已被删除</p>
            <el-button type="primary" @click="goHome">返回首页</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
    router.push('/')
}
</script>

<style scoped>
.not-found {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f7fa;
}

.not-found-content {
    text-align: center;
}

.error-code {
    font-size: 120px;
    font-weight: 700;
    color: #409eff;
    margin: 0;
    line-height: 1;
}

.error-title {
    font-size: 32px;
    font-weight: 600;
    color: #303133;
    margin: 20px 0 10px;
}

.error-message {
    font-size: 16px;
    color: #606266;
    margin: 0 0 30px;
}
</style>
