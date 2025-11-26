<template>
  <div class="checkout-page min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
    <AppHeader />

    <section class="py-12 px-4">
      <div class="container max-w-6xl mx-auto">
        <!-- 页面标题 -->
        <div class="mb-10 text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">确认订单</h1>
          <p class="text-gray-500">请确认订单信息并完成支付</p>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <!-- 左侧主要内容 -->
          <div class="lg:col-span-2 space-y-6">
            <!-- 收货地址 -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div class="mb-5 flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-900 flex items-center">
                  <span class="mr-2">📍</span>
                  收货地址
                </h2>
                <button
                  class="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                  @click="showAddressModal = true"
                >
                  + 新增地址
                </button>
              </div>

              <div v-if="addresses.length === 0" class="py-12 text-center">
                <div class="text-gray-400 text-6xl mb-4">📦</div>
                <p class="text-gray-500 mb-4">暂无收货地址</p>
                <button
                  class="btn btn-primary btn-sm"
                  @click="showAddressModal = true"
                >
                  立即添加
                </button>
              </div>

              <div v-else class="grid gap-3">
                <div
                  v-for="address in addresses"
                  :key="address.id"
                  :class="[
                    'cursor-pointer rounded-xl border-2 p-5 transition-all hover:shadow-sm',
                    selectedAddress?.id === address.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-gray-200 hover:border-primary/50'
                  ]"
                  @click="selectedAddress = address"
                >
                  <div class="mb-3 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-gray-900">{{ address.name }}</span>
                      <span class="text-gray-500">{{ address.phone }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span
                        v-if="address.isDefault"
                        class="rounded-full bg-primary px-3 py-1 text-xs text-white font-medium"
                      >
                        默认
                      </span>
                      <span
                        v-if="selectedAddress?.id === address.id"
                        class="text-primary text-xl"
                      >
                        ✓
                      </span>
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    {{ address.province }} {{ address.city }} {{ address.district }}
                    {{ address.detail }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 商品清单 -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h2 class="mb-5 text-xl font-bold text-gray-900 flex items-center">
                <span class="mr-2">🛍️</span>
                商品清单
              </h2>
              <div class="divide-y divide-gray-100">
                <div
                  v-for="item in cartStore.selectedItems"
                  :key="`${item.id}-${item.skuId || ''}`"
                  class="flex gap-4 py-4 first:pt-0 last:pb-0 hover:bg-gray-50/50 px-3 -mx-3 rounded-lg transition-colors"
                >
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="h-24 w-24 rounded-xl object-cover shadow-sm"
                  />
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 mb-1">{{ item.name }}</h3>
                    <p v-if="item.specs" class="text-sm text-gray-500 mb-2">
                      <span v-for="spec in item.specs" :key="spec.name" class="mr-2">
                        {{ spec.name }}: {{ spec.value }}
                      </span>
                    </p>
                    <div class="mt-3 flex items-center justify-between">
                      <span class="text-primary font-bold text-lg">¥{{ item.price }}</span>
                      <span class="text-gray-600 font-medium">x{{ item.quantity }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 支付方式 -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h2 class="mb-5 text-xl font-bold text-gray-900 flex items-center">
                <span class="mr-2">💳</span>
                支付方式
              </h2>
              <div class="space-y-3">
                <label
                  v-for="method in paymentMethods"
                  :key="method.value"
                  class="flex cursor-pointer items-center rounded-xl border-2 p-4 transition-all hover:shadow-sm"
                  :class="
                    selectedPayment === method.value
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-gray-200 hover:border-primary/50'
                  "
                >
                  <input
                    v-model="selectedPayment"
                    type="radio"
                    :value="method.value"
                    class="mr-3 w-4 h-4 text-primary"
                  />
                  <span class="text-3xl mr-3">{{ method.icon }}</span>
                  <span class="font-medium text-gray-900">{{ method.label }}</span>
                  <span
                    v-if="selectedPayment === method.value"
                    class="ml-auto text-primary text-xl"
                  >
                    ✓
                  </span>
                </label>
              </div>
            </div>

            <!-- 订单备注 -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h2 class="mb-5 text-xl font-bold text-gray-900 flex items-center">
                <span class="mr-2">📝</span>
                订单备注
              </h2>
              <textarea
                v-model="remark"
                rows="4"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                placeholder="选填，如有特殊需求请在此说明..."
              ></textarea>
            </div>
          </div>

          <!-- 右侧订单摘要 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-md border border-gray-100 p-6 sticky top-24">
              <h2 class="mb-6 text-xl font-bold text-gray-900 flex items-center">
                <span class="mr-2">💰</span>
                订单金额
              </h2>
              <div class="space-y-4">
                <div class="flex justify-between text-gray-600">
                  <span>商品总价</span>
                  <span class="font-medium">¥{{ cartStore.selectedTotalPrice.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>运费</span>
                  <span class="font-medium">{{ shippingFee === 0 ? '免运费' : `¥${shippingFee.toFixed(2)}` }}</span>
                </div>
                <div v-if="cartStore.selectedTotalPrice >= 299" class="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  🎉 已满¥299，享受免运费！
                </div>
                <div v-else class="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                  💡 再购¥{{ (299 - cartStore.selectedTotalPrice).toFixed(2) }} 即可免运费
                </div>
                <div class="flex justify-between border-t-2 border-gray-200 pt-4 text-xl font-bold">
                  <span class="text-gray-900">应付总额</span>
                  <span class="text-primary text-2xl">¥{{ totalAmount.toFixed(2) }}</span>
                </div>
              </div>


              <!-- 提交订单按钮 -->
              <div class="mt-6 space-y-3">
                <button
                  class="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  :disabled="!canSubmit"
                  @click="submitOrder"
                >
                  <span v-if="canSubmit">立即支付</span>
                  <span v-else>请完善订单信息</span>
                </button>
                <button
                  class="w-full py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  @click="$router.back()"
                >
                  返回购物车
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import type { Address } from '@/types'

const router = useRouter()
const cartStore = useCartStore()

// 收货地址
const addresses = ref<Address[]>([
  {
    id: 1,
    userId: 1,
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '某某街道某某小区1号楼101室',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
])

const selectedAddress = ref<Address | null>(addresses.value[0] || null)
const showAddressModal = ref(false)

// 支付方式
const paymentMethods = [
  { value: 'wechat', label: '微信支付', icon: '💚' },
  { value: 'alipay', label: '支付宝', icon: '💙' },
  { value: 'unionpay', label: '银联支付', icon: '🏦' },
]

const selectedPayment = ref('wechat')
const remark = ref('')

// 计算运费和总额
const shippingFee = computed(() => {
  return cartStore.selectedTotalPrice >= 299 ? 0 : 15
})

const totalAmount = computed(() => {
  return cartStore.selectedTotalPrice + shippingFee.value
})

const canSubmit = computed(() => {
  return selectedAddress.value && selectedPayment.value && cartStore.selectedItems.length > 0
})

const submitOrder = async () => {
  if (!canSubmit.value) {
    alert('请完善订单信息')
    return
  }

  // TODO: 调用创建订单API
  const orderData = {
    items: cartStore.selectedItems,
    address: selectedAddress.value,
    payment: selectedPayment.value,
    remark: remark.value,
    totalAmount: totalAmount.value,
  }

  console.log('提交订单:', orderData)

  // 模拟提交成功
  alert('订单提交成功！')

  // 清空购物车中已结算的商品
  cartStore.selectedItems.forEach(item => {
    cartStore.removeFromCart(item.id, item.skuId)
  })

  // 跳转到订单列表
  router.push('/user/orders')
}
</script>
