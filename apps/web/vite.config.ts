import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
            resolvers: [ElementPlusResolver()],
            dts: 'src/auto-imports.d.ts',
            eslintrc: {
                enabled: true,
            },
        }),
        Components({
            resolvers: [ElementPlusResolver()],
            dts: 'src/components.d.ts',
            dirs: ['src/components/common', 'src/modules/user/components', 'src/modules/admin/components'],
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@user': fileURLToPath(new URL('./src/modules/user', import.meta.url)),
            '@admin': fileURLToPath(new URL('./src/modules/admin', import.meta.url)),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vue: ['vue', 'vue-router', 'pinia'],
                    'element-plus': ['element-plus', '@element-plus/icons-vue'],
                    echarts: ['echarts'],
                },
            },
        },
    },
})
