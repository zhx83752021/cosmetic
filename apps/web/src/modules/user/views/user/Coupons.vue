<template>
  <div class="card">
    <h2 class="mb-6 text-2xl font-bold">优惠券</h2>

    <!-- 优惠券状态Tab -->
    <div class="mb-6 flex gap-4 border-b border-gray-200">
      <button
        v-for="status in couponStatuses"
        :key="status.value"
        :class="[
          'pb-3 text-sm font-medium transition-colors',
          currentStatus === status.value
            ? 'border-b-2 border-primary text-primary'
            : 'text-gray-600 hover:text-primary'
        ]"
        @click="currentStatus = status.value"
      >
        {{ status.label }}
        <span v-if="status.count" class="ml-1">({{ status.count }})</span>
      </button>
    </div>

    <div v-if="filteredCoupons.length === 0" class="py-20 text-center text-gray-500">
      <div class="mb-4 text-4xl">🎫</div>
      <p>暂无优惠券</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="coupon in filteredCoupons"
        :key="coupon.id"
        class="flex overflow-hidden rounded-lg border-2"
        :class="coupon.status === 'unused' ? 'border-primary' : 'border-gray-200'"
      >
        <!-- 左侧金额 -->
        <div
          class="flex w-32 flex-col items-center justify-center"
          :class="coupon.status === 'unused' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'"
        >
          <div class="text-sm">{{ coupon.type === 'discount' ? '折扣券' : '满减券' }}</div>
          <div class="my-2 text-3xl font-bold">
            {{ coupon.type === 'discount' ? `${coupon.discount}折` : `¥${coupon.amount}` }}
          </div>
          <div class="text-xs">
            {{ coupon.minAmount ? `满${coupon.minAmount}可用` : '无门槛' }}
          </div>
        </div>

        <!-- 右侧信息 -->
        <div class="flex flex-1 flex-col justify-between p-4">
          <div>
            <h3 class="mb-2 font-semibold text-gray-900">{{ coupon.name }}</h3>
            <p class="text-sm text-gray-600">{{ coupon.description }}</p>
          </div>

          <div class="mt-3 flex items-center justify-between">
            <span class="text-sm text-gray-500">
              有效期至：{{ formatDate(coupon.endTime) }}
            </span>
            <button
              v-if="coupon.status === 'unused'"
              class="btn btn-primary btn-sm"
              @click="useCoupon(coupon)"
            >
              立即使用
            </button>
            <span
              v-else
              class="rounded px-3 py-1 text-sm"
              :class="
                coupon.status === 'used'
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-red-100 text-red-600'
              "
            >
              {{ coupon.status === 'used' ? '已使用' : '已过期' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 兑换优惠券 -->
    <div class="mt-8 rounded-lg bg-neutral-gray p-6">
      <h3 class="mb-4 text-lg font-semibold">兑换优惠券</h3>
      <div class="flex gap-3">
        <input
          v-model="couponCode"
          type="text"
          class="input flex-1"
          placeholder="请输入优惠券兑换码"
        />
        <button class="btn btn-primary" @click="redeemCoupon">
          兑换
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStatus = ref('unused')
const couponCode = ref('')

interface Coupon {
  id: number
  name: string
  description: string
  type: 'amount' | 'discount'
  amount?: number
  discount?: number
  minAmount?: number
  startTime: string
  endTime: string
  status: 'unused' | 'used' | 'expired'
}

const couponStatuses = [
  { value: 'unused', label: '未使用', count: 3 },
  { value: 'used', label: '已使用', count: 1 },
  { value: 'expired', label: '已过期', count: 2 },
]

const coupons = ref<Coupon[]>([
  {
    id: 1,
    name: '新人专享券',
    description: '首次购买可用',
    type: 'amount',
    amount: 50,
    minAmount: 299,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'unused',
  },
  {
    id: 2,
    name: '会员专享9折券',
    description: '全场商品可用',
    type: 'discount',
    discount: 9,
    minAmount: 0,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'unused',
  },
  {
    id: 3,
    name: '满500减100',
    description: '护肤品类专用',
    type: 'amount',
    amount: 100,
    minAmount: 500,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'unused',
  },
])

const filteredCoupons = computed(() => {
  return coupons.value.filter(coupon => coupon.status === currentStatus.value)
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const useCoupon = (coupon: Coupon) => {
  router.push('/products')
}

const redeemCoupon = () => {
  if (!couponCode.value.trim()) {
    alert('请输入兑换码')
    return
  }

  // TODO: 调用兑换优惠券API
  console.log('兑换优惠券:', couponCode.value)
  alert('兑换成功！')
  couponCode.value = ''
}
</script>
