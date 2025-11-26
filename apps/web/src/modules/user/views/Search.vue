<template>
  <div class="search-page min-h-screen bg-neutral-gray pt-20">
    <AppHeader />

    <section class="py-12">
      <div class="container">
        <!-- 搜索框 -->
        <div class="mb-8">
          <div class="mx-auto max-w-2xl">
            <div class="flex gap-3">
              <input
                v-model="keyword"
                type="text"
                class="input flex-1"
                placeholder="搜索商品、文章..."
                @keyup.enter="handleSearch"
              />
              <button class="btn btn-primary" @click="handleSearch">
                搜索
              </button>
            </div>
          </div>
        </div>

        <!-- 搜索结果 -->
        <div v-if="hasSearched">
          <p class="mb-6 text-gray-600">
            找到 <span class="font-semibold">{{ results.length }}</span> 个结果
          </p>

          <div v-if="results.length === 0" class="py-20 text-center text-gray-500">
            <div class="mb-4 text-6xl">🔍</div>
            <p class="text-xl">没有找到相关内容</p>
            <p class="mt-2">试试其他关键词吧</p>
          </div>

          <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="item in results"
              :key="item.id"
              class="card cursor-pointer p-0 overflow-hidden"
              @click="goToDetail(item)"
            >
              <img :src="item.image" :alt="item.name" class="h-48 w-full object-cover" />
              <div class="p-4">
                <h3 class="mb-2 font-semibold line-clamp-2">{{ item.name }}</h3>
                <p class="text-primary font-bold">¥{{ item.price }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 热门搜索 -->
        <div v-else class="mx-auto max-w-2xl">
          <h3 class="mb-4 font-semibold">热门搜索</h3>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="tag in hotTags"
              :key="tag"
              class="rounded-full bg-gray-100 px-4 py-2 text-sm hover:bg-primary hover:text-white"
              @click="searchByTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const router = useRouter()
const keyword = ref('')
const hasSearched = ref(false)
const results = ref<any[]>([])

const hotTags = ref([
  '精华液',
  '口红',
  '面霜',
  '防晒',
  '洁面',
  '眼霜',
])

const handleSearch = () => {
  hasSearched.value = true
  // TODO: 调用搜索API
  results.value = []
}

const searchByTag = (tag: string) => {
  keyword.value = tag
  handleSearch()
}

const goToDetail = (item: any) => {
  router.push(`/product/${item.id}`)
}
</script>
