<template>
  <div class="card">
    <h2 class="mb-6 text-2xl font-bold">个人信息</h2>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div class="grid gap-6 md:grid-cols-2">
        <!-- 用户名 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">用户名</label>
          <input
            v-model="form.username"
            type="text"
            disabled
            class="input w-full bg-gray-50"
          />
          <p class="mt-1 text-xs text-gray-500">用户名不可修改</p>
        </div>

        <!-- 昵称 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">昵称</label>
          <input
            v-model="form.nickname"
            type="text"
            class="input w-full"
            placeholder="请输入昵称"
          />
        </div>

        <!-- 邮箱 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">邮箱</label>
          <input
            v-model="form.email"
            type="email"
            class="input w-full"
            placeholder="请输入邮箱"
          />
        </div>

        <!-- 手机号 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">手机号</label>
          <input
            v-model="form.phone"
            type="tel"
            class="input w-full"
            placeholder="请输入手机号"
          />
        </div>

        <!-- 性别 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">性别</label>
          <div class="flex gap-4">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="form.gender"
                type="radio"
                value="male"
                class="mr-2"
              />
              <span>男</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                v-model="form.gender"
                type="radio"
                value="female"
                class="mr-2"
              />
              <span>女</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                v-model="form.gender"
                type="radio"
                value="other"
                class="mr-2"
              />
              <span>保密</span>
            </label>
          </div>
        </div>

        <!-- 生日 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">生日</label>
          <input
            v-model="form.birthday"
            type="date"
            class="input w-full"
          />
        </div>
      </div>

      <!-- 会员信息 -->
      <div class="rounded-lg bg-gradient-to-r from-primary/10 to-primary-dark/10 p-6">
        <h3 class="mb-4 text-lg font-semibold">会员信息</h3>
        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <p class="text-sm text-gray-600">会员等级</p>
            <p class="text-2xl font-bold text-primary">VIP{{ form.level }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">当前积分</p>
            <p class="text-2xl font-bold text-primary">{{ form.points }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">注册时间</p>
            <p class="text-sm text-gray-700">{{ formatDate(form.createdAt) }}</p>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end gap-4">
        <button type="button" class="btn btn-secondary" @click="resetForm">
          取消
        </button>
        <button type="submit" class="btn btn-primary">
          保存修改
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

interface ProfileForm {
  username: string
  nickname?: string
  email: string
  phone?: string
  gender?: string
  birthday?: string
  level: number
  points: number
  createdAt: string
}

const form = ref<ProfileForm>({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  gender: '',
  birthday: '',
  level: 1,
  points: 0,
  createdAt: new Date().toISOString(),
})

onMounted(() => {
  if (userStore.userInfo) {
    form.value = {
      username: userStore.userInfo.username,
      nickname: userStore.userInfo.nickname,
      email: userStore.userInfo.email,
      phone: userStore.userInfo.phone || '',
      gender: userStore.userInfo.gender,
      birthday: userStore.userInfo.birthday,
      level: userStore.userInfo.level,
      points: userStore.userInfo.points,
      createdAt: userStore.userInfo.createdAt,
    }
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const handleSubmit = async () => {
  try {
    // TODO: 调用更新用户信息API
    console.log('更新用户信息:', form.value)
    alert('保存成功！')
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败，请重试')
  }
}

const resetForm = () => {
  if (userStore.userInfo) {
    form.value = {
      username: userStore.userInfo.username,
      nickname: userStore.userInfo.nickname,
      email: userStore.userInfo.email,
      phone: userStore.userInfo.phone || '',
      gender: userStore.userInfo.gender,
      birthday: userStore.userInfo.birthday,
      level: userStore.userInfo.level,
      points: userStore.userInfo.points,
      createdAt: userStore.userInfo.createdAt,
    }
  }
}
</script>
