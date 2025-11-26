<template>
  <div
    class="card group cursor-pointer overflow-hidden p-0 transition-transform hover:scale-105"
    @click="goToDetail"
  >
    <!-- 产品图片 -->
    <div class="relative overflow-hidden">
      <img
        :src="product.images[0]"
        :alt="product.name"
        class="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <!-- 标签 -->
      <div class="absolute left-4 top-4 flex flex-col gap-2">
        <span
          v-if="product.isNew"
          class="rounded-full bg-accent-pink px-3 py-1 text-xs font-semibold text-white"
        >
          NEW
        </span>
        <span
          v-if="product.isHot"
          class="rounded-full bg-accent-gold px-3 py-1 text-xs font-semibold text-white"
        >
          HOT
        </span>
      </div>
      <!-- 快速操作 -->
      <div
        class="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <button class="btn btn-primary flex-1" @click.stop="$emit('add-to-cart', product)">
          加入购物车
        </button>
      </div>
    </div>

    <!-- 产品信息 -->
    <div class="p-4">
      <h3 class="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">
        {{ product.name }}
      </h3>
      <p class="mb-3 text-sm text-gray-500 line-clamp-1">
        {{ product.subTitle }}
      </p>
      <div class="flex items-center justify-between">
        <div class="flex items-baseline gap-2">
          <span class="text-xl font-bold text-primary">¥{{ product.price }}</span>
          <span v-if="product.originalPrice" class="text-sm text-gray-400 line-through">
            ¥{{ product.originalPrice }}
          </span>
        </div>
        <div class="flex items-center gap-1 text-sm text-gray-500">
          <StarIcon class="h-4 w-4 text-accent-gold" />
          <span>{{ product.rating.toFixed(1) }}</span>
        </div>
      </div>
      <div class="mt-2 text-xs text-gray-500">已售 {{ product.sales }}+</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import StarIcon from '@/components/icons/StarIcon.vue'
import type { Product } from '@/types'

const props = defineProps<{
  product: Product
}>()

defineEmits<{
  'add-to-cart': [product: Product]
}>()

const router = useRouter()

const goToDetail = () => {
  router.push(`/product/${props.product.id}`)
}
</script>
