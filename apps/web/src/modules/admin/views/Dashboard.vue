<template>
    <div class="dashboard">
        <h2 class="page-title">数据仪表盘</h2>

        <!-- 统计卡片 -->
        <el-row :gutter="20" class="stat-cards">
            <el-col :span="6">
                <el-card shadow="hover" class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon sales">
                            <el-icon><TrendCharts /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">¥{{ formatNumber(todaySales) }}</div>
                            <div class="stat-label">今日销售额</div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card shadow="hover" class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon orders">
                            <el-icon><ShoppingCart /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">{{ todayOrders }}</div>
                            <div class="stat-label">今日订单</div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card shadow="hover" class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon users">
                            <el-icon><User /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">{{ newUsers }}</div>
                            <div class="stat-label">新增用户</div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card shadow="hover" class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon products">
                            <el-icon><Box /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">{{ totalProducts }}</div>
                            <div class="stat-label">商品总数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 图表区域 -->
        <el-row :gutter="20" class="charts-section">
            <el-col :span="12">
                <el-card shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>销售趋势</span>
                        </div>
                    </template>
                    <div ref="salesChartRef" class="chart"></div>
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>商品分类占比</span>
                        </div>
                    </template>
                    <div ref="categoryChartRef" class="chart"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { TrendCharts, ShoppingCart, User, Box } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

// 统计数据
const todaySales = ref(125680)
const todayOrders = ref(856)
const newUsers = ref(234)
const totalProducts = ref(1580)

// 图表实例
const salesChartRef = ref<HTMLElement>()
const categoryChartRef = ref<HTMLElement>()
let salesChart: ECharts | null = null
let categoryChart: ECharts | null = null

// 格式化数字
const formatNumber = (num: number) => {
    return num.toLocaleString('zh-CN')
}

// 初始化销售趋势图表
const initSalesChart = () => {
    if (!salesChartRef.value) return

    salesChart = echarts.init(salesChartRef.value)
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: '销售额',
                type: 'bar',
                data: [12000, 15600, 18900, 21500, 19800, 28900, 32000],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#83bff6' },
                        { offset: 0.5, color: '#188df0' },
                        { offset: 1, color: '#188df0' },
                    ]),
                },
            },
        ],
    }
    salesChart.setOption(option)
}

// 初始化分类占比图表
const initCategoryChart = () => {
    if (!categoryChartRef.value) return

    categoryChart = echarts.init(categoryChartRef.value)
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: '商品分类',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: 'bold',
                    },
                },
                labelLine: {
                    show: false,
                },
                data: [
                    { value: 335, name: '护肤品' },
                    { value: 310, name: '彩妆' },
                    { value: 234, name: '香水' },
                    { value: 135, name: '工具' },
                    { value: 180, name: '套装' },
                ],
            },
        ],
    }
    categoryChart.setOption(option)
}

// 监听窗口大小变化
const handleResize = () => {
    salesChart?.resize()
    categoryChart?.resize()
}

onMounted(() => {
    initSalesChart()
    initCategoryChart()
    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    salesChart?.dispose()
    categoryChart?.dispose()
    window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard {
    padding: 20px;
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 20px;
}

.stat-cards {
    margin-bottom: 20px;
}

.stat-card {
    border-radius: 8px;
}

.stat-content {
    display: flex;
    align-items: center;
    gap: 20px;
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #fff;
}

.stat-icon.sales {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.orders {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.users {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.products {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info {
    flex: 1;
}

.stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 5px;
}

.stat-label {
    font-size: 14px;
    color: #909399;
}

.charts-section {
    margin-top: 20px;
}

.card-header {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.chart {
    height: 350px;
}
</style>
