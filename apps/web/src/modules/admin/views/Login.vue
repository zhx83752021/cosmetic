<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <h2>雅妆管理系统</h2>
                <p>后台管理登录</p>
            </div>

            <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入管理员账号" size="large" :prefix-icon="User" />
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" size="large"
                        :prefix-icon="Lock" @keyup.enter="handleLogin" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="large" :loading="loading" class="login-button" @click="handleLogin">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
    username: 'admin',
    password: '123456',
})

const rules: FormRules = {
    username: [
        { required: true, message: '请输入管理员账号', trigger: 'blur' },
        { min: 3, max: 30, message: '账号长度在 3 到 30 个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 50, message: '密码长度在 6 到 50 个字符', trigger: 'blur' },
    ],
}

const handleLogin = async () => {
    if (!loginFormRef.value) return

    try {
        // 先验证表单
        await loginFormRef.value.validate()

        loading.value = true

        // 调用登录 API
        const { login } = await import('@/api/auth')
        const response = await login({
            account: loginForm.username,
            password: loginForm.password,
        })

        if (response.success && response.data) {
            // 保存令牌
            localStorage.setItem('admin-token', response.data.accessToken)
            localStorage.setItem('admin-refresh-token', response.data.refreshToken)

            ElMessage.success('登录成功')
            router.push('/')
        }
    } catch (error: any) {
        console.error('登录失败:', error)
        ElMessage.error(error.message || '登录失败，请检查账号和密码')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.login-box {
    width: 420px;
    padding: 40px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
    text-align: center;
    margin-bottom: 40px;
}

.login-header h2 {
    font-size: 28px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 10px;
}

.login-header p {
    font-size: 14px;
    color: #909399;
    margin: 0;
}

.login-form {
    margin-top: 20px;
}

.login-button {
    width: 100%;
}

:deep(.el-input__wrapper) {
    padding: 12px 15px;
}
</style>
