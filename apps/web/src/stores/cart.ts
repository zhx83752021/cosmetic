import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@/types'

export const useCartStore = defineStore(
    'cart',
    () => {
        const items = ref<CartItem[]>([])

        const itemCount = computed(() => {
            return items.value.reduce((total, item) => total + item.quantity, 0)
        })

        const totalPrice = computed(() => {
            return items.value.reduce((total, item) => {
                return total + item.price * item.quantity
            }, 0)
        })

        const addToCart = (product: CartItem) => {
            const existingItem = items.value.find(
                item => item.id === product.id && item.skuId === product.skuId
            )

            if (existingItem) {
                existingItem.quantity += product.quantity
            } else {
                items.value.push({ ...product })
            }
        }

        const removeFromCart = (id: number, skuId?: number) => {
            const index = items.value.findIndex(item => item.id === id && item.skuId === skuId)
            if (index > -1) {
                items.value.splice(index, 1)
            }
        }

        const updateQuantity = (id: number, quantity: number, skuId?: number) => {
            const item = items.value.find(item => item.id === id && item.skuId === skuId)
            if (item) {
                item.quantity = quantity
                if (item.quantity <= 0) {
                    removeFromCart(id, skuId)
                }
            }
        }

        const clearCart = () => {
            items.value = []
        }

        const toggleSelected = (id: number, skuId?: number) => {
            const item = items.value.find(item => item.id === id && item.skuId === skuId)
            if (item) {
                item.selected = !item.selected
            }
        }

        const toggleAllSelected = (selected: boolean) => {
            items.value.forEach(item => {
                item.selected = selected
            })
        }

        const selectedItems = computed(() => {
            return items.value.filter(item => item.selected)
        })

        const selectedTotalPrice = computed(() => {
            return selectedItems.value.reduce((total, item) => {
                return total + item.price * item.quantity
            }, 0)
        })

        return {
            items,
            itemCount,
            totalPrice,
            selectedItems,
            selectedTotalPrice,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            toggleSelected,
            toggleAllSelected,
        }
    },
    {
        persist: {
            key: 'cart-store',
            storage: localStorage,
        },
    }
)
