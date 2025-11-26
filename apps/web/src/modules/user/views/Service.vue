<template>
  <div class="service-page min-h-screen bg-gradient-to-b from-neutral-cream to-white pt-20">
    <AppHeader />

    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent-lavender py-24 text-white">
      <div class="absolute inset-0 opacity-15">
        <div
          class="absolute -left-20 top-20 h-64 w-64 rounded-full bg-gradient-to-br from-white to-accent-pink blur-3xl">
        </div>
        <div
          class="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-gradient-to-br from-accent-gold to-white blur-3xl">
        </div>
      </div>
      <div class="container relative">
        <div class="mx-auto max-w-3xl text-center">
          <h1 class="mb-4 text-5xl font-bold">客户服务中心</h1>
          <p class="text-xl opacity-90">专业团队全天候为您服务，解答您的每一个疑问</p>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="container max-w-6xl">
        <!-- 服务项目 -->
        <div class="mb-16 grid gap-8 md:grid-cols-3">
          <div
            class="group card transform cursor-pointer text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div
              class="mb-6 inline-block rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-6 transition-transform duration-300 group-hover:scale-110">
              <div class="text-6xl">📞</div>
            </div>
            <h3 class="mb-3 text-2xl font-bold text-gray-900">电话咨询</h3>
            <div class="mb-4 text-3xl font-bold text-primary">400-888-8888</div>
            <p class="mb-2 text-gray-600">工作日 9:00-18:00</p>
            <p class="text-sm text-gray-500">专业客服团队，为您提供一对一服务</p>
          </div>

          <div
            class="group card transform cursor-pointer text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div
              class="mb-6 inline-block rounded-full bg-gradient-to-br from-accent-pink/10 to-accent-pink/5 p-6 transition-transform duration-300 group-hover:scale-110">
              <div class="text-6xl">💬</div>
            </div>
            <h3 class="mb-3 text-2xl font-bold text-gray-900">在线客服</h3>
            <div class="mb-4 text-lg text-gray-700">7×24小时在线</div>
            <div class="px-4">
              <button class="btn btn-primary mt-2 w-full transition-transform hover:scale-105">
                立即咨询
              </button>
            </div>
            <p class="mt-3 text-sm text-gray-500">实时解答，快速响应</p>
          </div>

          <div
            class="group card transform cursor-pointer text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div
              class="mb-6 inline-block rounded-full bg-gradient-to-br from-secondary/10 to-secondary/5 p-6 transition-transform duration-300 group-hover:scale-110">
              <div class="text-6xl">📧</div>
            </div>
            <h3 class="mb-3 text-2xl font-bold text-gray-900">邮箱服务</h3>
            <div class="mb-4 text-lg font-semibold text-primary">service@yazhuang.com</div>
            <p class="mb-2 text-gray-600">24小时内必复</p>
            <p class="text-sm text-gray-500">详细问题，邮件沟通更高效</p>
          </div>
        </div>

        <!-- 服务承诺 -->
        <div class="mb-16 grid gap-6 md:grid-cols-4">
          <div
            class="rounded-xl bg-gradient-to-br from-primary/8 to-primary/3 p-6 text-center border border-primary/10 shadow-sm">
            <div class="mb-2 text-3xl">✓</div>
            <div class="font-semibold text-text-primary">正品保证</div>
            <div class="text-sm text-text-secondary">100%正品</div>
          </div>
          <div
            class="rounded-xl bg-gradient-to-br from-accent-pink/8 to-accent-pink/3 p-6 text-center border border-accent-pink/10 shadow-sm">
            <div class="mb-2 text-3xl">🚚</div>
            <div class="font-semibold text-text-primary">极速配送</div>
            <div class="text-sm text-text-secondary">48小时达</div>
          </div>
          <div
            class="rounded-xl bg-gradient-to-br from-accent-lavender/8 to-accent-lavender/3 p-6 text-center border border-accent-lavender/10 shadow-sm">
            <div class="mb-2 text-3xl">↩️</div>
            <div class="font-semibold text-text-primary">7天无忧退换</div>
            <div class="text-sm text-text-secondary">轻松退换</div>
          </div>
          <div
            class="rounded-xl bg-gradient-to-br from-accent-gold/8 to-accent-gold/3 p-6 text-center border border-accent-gold/10 shadow-sm">
            <div class="mb-2 text-3xl">🎁</div>
            <div class="font-semibold text-text-primary">积分返利</div>
            <div class="text-sm text-text-secondary">购物有礼</div>
          </div>
        </div>

        <!-- 常见问题 -->
        <div class="card overflow-hidden">
          <div class="bg-gradient-to-r from-primary/5 to-transparent p-8">
            <h2 class="mb-2 text-3xl font-bold text-gray-900">常见问题</h2>
            <p class="text-gray-600">快速找到您想要的答案</p>
          </div>
          <div class="p-8">
            <div class="space-y-3">
              <div v-for="(faq, index) in faqs" :key="index"
                class="overflow-hidden rounded-lg border-2 transition-all duration-300"
                :class="openFaqIndex === index ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'">
                <button class="flex w-full items-center justify-between p-5 text-left transition-colors"
                  @click="toggleFaq(index)">
                  <span class="flex items-center gap-3 font-semibold text-gray-900">
                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-white">
                      {{ index + 1 }}
                    </span>
                    {{ faq.question }}
                  </span>
                  <span
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xl font-bold transition-transform duration-300"
                    :class="openFaqIndex === index ? 'rotate-180 bg-primary text-white' : 'text-gray-600'">
                    {{ openFaqIndex === index ? '−' : '+' }}
                  </span>
                </button>
                <transition enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-96 opacity-100"
                  leave-active-class="transition-all duration-300 ease-in" leave-from-class="max-h-96 opacity-100"
                  leave-to-class="max-h-0 opacity-0">
                  <div v-if="openFaqIndex === index" class="overflow-hidden">
                    <div class="border-t border-gray-200 bg-white px-5 py-4">
                      <p class="text-gray-700 leading-relaxed">{{ faq.answer }}</p>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>

        <!-- 联系我们卡片 -->
        <div class="mt-12 rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-8 text-white">
          <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h3 class="mb-2 text-2xl font-bold">还有其他问题？</h3>
              <p class="opacity-90">我们的客服团队随时待命，为您提供帮助</p>
            </div>
            <button class="btn bg-white text-primary hover:bg-gray-100 whitespace-nowrap px-8 py-3 font-semibold">
              联系客服
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
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const openFaqIndex = ref<number | null>(null)

const faqs = ref([
  {
    question: '如何查询订单物流信息？',
    answer: '登录账户后，进入"我的订单"页面，点击具体订单即可查看物流详情。',
  },
  {
    question: '支持哪些支付方式？',
    answer: '我们支持微信支付、支付宝、银联支付等多种支付方式。',
  },
  {
    question: '如何申请退换货？',
    answer: '在订单页面点击"申请退换货"，填写相关信息即可。',
  },
  {
    question: '会员积分如何使用？',
    answer: '会员积分可在结算时抵扣现金，100积分=1元。',
  },
])

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}
</script>
