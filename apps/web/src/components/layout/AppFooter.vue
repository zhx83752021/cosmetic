<template>
  <footer class="border-t border-gray-200 bg-gray-50 py-12">
    <div class="container">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <!-- 品牌介绍 -->
        <div>
          <div class="mb-4 text-2xl font-bold text-primary-dark">雅妆</div>
          <p class="mb-4 text-sm text-gray-600">
            高端化妆品品牌，专注于为现代女性提供优质的护肤与彩妆产品。
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-primary-dark">
              <WechatIcon class="h-5 w-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-primary-dark">
              <WeiboIcon class="h-5 w-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-primary-dark">
              <InstagramIcon class="h-5 w-5" />
            </a>
          </div>
        </div>

        <!-- 产品分类 -->
        <div>
          <h3 class="mb-4 font-semibold text-gray-900">产品分类</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><RouterLink to="/products?category=skincare" class="hover:text-primary-dark">护肤系列</RouterLink></li>
            <li><RouterLink to="/products?category=makeup" class="hover:text-primary-dark">彩妆系列</RouterLink></li>
            <li><RouterLink to="/products?category=perfume" class="hover:text-primary-dark">香水系列</RouterLink></li>
            <li><RouterLink to="/products?category=gift" class="hover:text-primary-dark">礼盒套装</RouterLink></li>
          </ul>
        </div>

        <!-- 客户服务 -->
        <div>
          <h3 class="mb-4 font-semibold text-gray-900">客户服务</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><RouterLink to="/service?tab=shipping" class="hover:text-primary-dark">配送说明</RouterLink></li>
            <li><RouterLink to="/service?tab=return" class="hover:text-primary-dark">退换货政策</RouterLink></li>
            <li><RouterLink to="/service?tab=payment" class="hover:text-primary-dark">支付方式</RouterLink></li>
            <li><RouterLink to="/service?tab=faq" class="hover:text-primary-dark">常见问题</RouterLink></li>
          </ul>
        </div>

        <!-- 联系我们 -->
        <div>
          <h3 class="mb-4 font-semibold text-gray-900">联系我们</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li>客服热线：400-xxx-xxxx</li>
            <li>工作时间：周一至周日 9:00-21:00</li>
            <li>邮箱：service@elegance.com</li>
          </ul>
        </div>
      </div>

      <div class="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
        <p>&copy; 2025 雅妆 ELEGANCE. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import WechatIcon from '@/components/icons/WechatIcon.vue'
import WeiboIcon from '@/components/icons/WeiboIcon.vue'
import InstagramIcon from '@/components/icons/InstagramIcon.vue'
</script>
