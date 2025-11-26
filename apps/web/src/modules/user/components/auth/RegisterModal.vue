<template>
  <!-- 遮罩层 -->
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="handleClose">
      <!-- 模态窗口 -->
      <Transition name="modal-slide">
        <div v-if="isOpen" class="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div class="card overflow-hidden shadow-2xl">
            <!-- 关闭按钮 -->
            <button
              class="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-600 transition-all hover:bg-white hover:text-gray-900"
              @click="handleClose">
              ✕
            </button>

            <!-- 头部装饰 -->
            <div class="bg-gradient-to-r from-accent-pink to-primary p-8 text-center text-white">
              <div
                class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <span class="text-3xl">✨</span>
              </div>
              <h2 class="text-2xl font-bold">加入我们</h2>
              <p class="mt-2 text-sm opacity-90">注册账户，开启您的美丽之旅</p>
            </div>

            <!-- 注册表单 -->
            <div class="p-6">
              <form @submit.prevent="handleRegister">
                <!-- 手机号 -->
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700">
                    <span class="flex items-center gap-2">
                      <span>📱</span>
                      手机号
                    </span>
                  </label>
                  <input v-model="formData.phone" type="tel" placeholder="请输入手机号" class="input w-full" required
                    pattern="[0-9]{11}" />
                </div>

                <!-- 密码 -->
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700">
                    <span class="flex items-center gap-2">
                      <span>🔒</span>
                      密码
                    </span>
                  </label>
                  <div class="relative">
                    <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="请输入密码"
                      class="input w-full pr-12" required minlength="6" />
                    <button type="button"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      @click="showPassword = !showPassword">
                      {{ showPassword ? '🙈' : '👁️' }}
                    </button>
                  </div>
                  <div class="mt-2 flex gap-1">
                    <div v-for="level in 3" :key="level" class="h-1 flex-1 rounded-full transition-colors" :class="[
                      passwordStrength >= level ?
                        passwordStrength === 1 ? 'bg-red-500' :
                          passwordStrength === 2 ? 'bg-yellow-500' :
                            'bg-green-500'
                        : 'bg-gray-200'
                    ]"></div>
                  </div>
                </div>

                <!-- 确认密码 -->
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700">
                    <span class="flex items-center gap-2">
                      <span>🔐</span>
                      确认密码
                    </span>
                  </label>
                  <input v-model="formData.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="请再次输入密码" class="input w-full" required />
                  <p v-if="formData.confirmPassword && formData.password !== formData.confirmPassword"
                    class="mt-1 text-xs text-red-500">
                    两次输入的密码不一致
                  </p>
                </div>

                <!-- 验证码 -->
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700">
                    <span class="flex items-center gap-2">
                      <span>🔢</span>
                      验证码
                    </span>
                  </label>
                  <div class="flex gap-2">
                    <input v-model="formData.captcha" type="text" placeholder="请输入验证码" class="input flex-1" required
                      maxlength="6" />
                    <button type="button" class="btn btn-secondary whitespace-nowrap text-sm" :disabled="countdown > 0"
                      @click="sendCaptcha">
                      {{ countdown > 0 ? `${countdown}秒` : '获取' }}
                    </button>
                  </div>
                </div>

                <!-- 服务条款 -->
                <div class="mb-5">
                  <label class="flex cursor-pointer items-start gap-2">
                    <input v-model="formData.agreement" type="checkbox"
                      class="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" required />
                    <span class="text-xs text-gray-600">
                      我已阅读并同意
                      <a href="#" class="text-primary hover:underline">用户协议</a>
                      和
                      <a href="#" class="text-primary hover:underline">隐私政策</a>
                    </span>
                  </label>
                </div>

                <!-- 注册按钮 -->
                <div class="px-3">
                  <button type="submit" class="btn btn-primary btn-lg w-full shadow-lg transition-all hover:scale-105"
                    :disabled="isLoading || !isFormValid">
                    <span v-if="isLoading" class="inline-flex items-center gap-2">
                      <svg class="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      注册中...
                    </span>
                    <span v-else>立即注册</span>
                  </button>
                </div>
              </form>

              <!-- 登录提示 -->
              <div class="mt-6 text-center text-sm text-gray-600">
                已有账户？
                <button type="button" class="font-semibold text-primary hover:text-primary-dark hover:underline"
                  @click="switchToLogin">
                  立即登录
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'switch-to-login': []
}>()

const formData = ref({
  phone: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  agreement: false,
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const countdown = ref(0)

// 密码强度计算
const passwordStrength = computed(() => {
  const pwd = formData.value.password
  if (!pwd) return 0

  let strength = 0
  if (pwd.length >= 6) strength++
  if (/[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd)) strength++
  if (/[^a-zA-Z0-9]/.test(pwd)) strength++

  return strength
})

// 表单验证
const isFormValid = computed(() => {
  return (
    formData.value.phone.length === 11 &&
    formData.value.password.length >= 6 &&
    formData.value.password === formData.value.confirmPassword &&
    formData.value.captcha.length === 6 &&
    formData.value.agreement
  )
})

const handleClose = () => {
  emit('update:isOpen', false)
}

const switchToLogin = () => {
  emit('switch-to-login')
}

// 发送验证码
const sendCaptcha = () => {
  if (!formData.value.phone) {
    alert('请先输入手机号')
    return
  }

  if (!/^[0-9]{11}$/.test(formData.value.phone)) {
    alert('请输入正确的手机号')
    return
  }

  console.log('发送验证码到:', formData.value.phone)

  // 开始倒计时
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)

  alert('验证码已发送到您的手机')
}

// 处理注册
const handleRegister = async () => {
  if (!isFormValid.value) {
    return
  }

  isLoading.value = true

  try {
    // 模拟注册
    await new Promise(resolve => setTimeout(resolve, 1500))

    alert('注册成功！请登录')

    // 切换到登录模态窗口
    switchToLogin()
  } catch (error) {
    console.error('注册失败:', error)
    alert('注册失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 模态窗口淡入淡出动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 模态窗口滑入滑出动画 */
.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all 0.3s ease;
}

.modal-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
