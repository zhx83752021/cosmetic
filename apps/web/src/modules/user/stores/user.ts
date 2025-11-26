import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types'

export const useUserStore = defineStore(
    'user',
    () => {
        const token = ref<string>('')
        const userInfo = ref<UserInfo | null>(null)

        const isLoggedIn = computed(() => !!token.value)

        const setToken = (newToken: string) => {
            token.value = newToken
            if (newToken) {
                localStorage.setItem('token', newToken)
            } else {
                localStorage.removeItem('token')
            }
        }

        const setUserInfo = (info: UserInfo | null) => {
            userInfo.value = info
        }

        const login = async (username: string, password: string) => {
            try {
                // TODO: 调用登录API
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                })

                const data = await response.json()

                if (data.success) {
                    setToken(data.token)
                    setUserInfo(data.user)
                    return { success: true }
                } else {
                    return { success: false, message: data.message }
                }
            } catch (error) {
                console.error('登录失败:', error)
                return { success: false, message: '网络错误' }
            }
        }

        const logout = () => {
            setToken('')
            setUserInfo(null)
        }

        const fetchUserInfo = async () => {
            if (!token.value) return

            try {
                const response = await fetch('/api/user/info', {
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                    },
                })

                const data = await response.json()

                if (data.success) {
                    setUserInfo(data.user)
                }
            } catch (error) {
                console.error('获取用户信息失败:', error)
            }
        }

        return {
            token,
            userInfo,
            isLoggedIn,
            setToken,
            setUserInfo,
            login,
            logout,
            fetchUserInfo,
        }
    },
    {
        persist: {
            key: 'user-store',
            storage: localStorage,
            paths: ['token'],
        },
    }
)
