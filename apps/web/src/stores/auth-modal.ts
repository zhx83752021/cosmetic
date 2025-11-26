import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthModalStore = defineStore('auth-modal', () => {
  const showLoginModal = ref(false)
  const showRegisterModal = ref(false)

  const openLoginModal = () => {
    showRegisterModal.value = false
    showLoginModal.value = true
  }

  const openRegisterModal = () => {
    showLoginModal.value = false
    showRegisterModal.value = true
  }

  const closeAllModals = () => {
    showLoginModal.value = false
    showRegisterModal.value = false
  }

  const switchToRegister = () => {
    showLoginModal.value = false
    showRegisterModal.value = true
  }

  const switchToLogin = () => {
    showRegisterModal.value = false
    showLoginModal.value = true
  }

  return {
    showLoginModal,
    showRegisterModal,
    openLoginModal,
    openRegisterModal,
    closeAllModals,
    switchToRegister,
    switchToLogin,
  }
})
