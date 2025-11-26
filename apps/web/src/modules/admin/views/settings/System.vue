<template>
    <div class="system-settings">
        <div class="page-header">
            <h2 class="page-title">系统设置</h2>
            <el-button type="primary" @click="handleSave" :loading="saving">保存设置</el-button>
        </div>

        <el-tabs v-model="activeTab" type="card">
            <!-- 网站基本信息 -->
            <el-tab-pane label="基本信息" name="basic">
                <el-card shadow="never" class="setting-card">
                    <el-form ref="basicFormRef" :model="basicForm" :rules="basicRules" label-width="120px">
                        <el-form-item label="网站名称" prop="siteName">
                            <el-input v-model="basicForm.siteName" placeholder="请输入网站名称" />
                        </el-form-item>
                        <el-form-item label="网站LOGO">
                            <el-input v-model="basicForm.siteLogo" placeholder="请输入LOGO图片URL" />
                        </el-form-item>
                        <el-form-item label="网站描述">
                            <el-input v-model="basicForm.siteDescription" type="textarea" :rows="3"
                                placeholder="请输入网站描述" />
                        </el-form-item>
                        <el-form-item label="关键词">
                            <el-input v-model="basicForm.siteKeywords" placeholder="多个关键词用逗号分隔" />
                        </el-form-item>
                        <el-form-item label="ICP备案号">
                            <el-input v-model="basicForm.icp" placeholder="请输入ICP备案号" />
                        </el-form-item>
                        <el-form-item label="版权信息">
                            <el-input v-model="basicForm.copyright" placeholder="例：© 2025 公司名称. All rights reserved." />
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-tab-pane>

            <!-- 联系方式 -->
            <el-tab-pane label="联系方式" name="contact">
                <el-card shadow="never" class="setting-card">
                    <el-form :model="contactForm" label-width="120px">
                        <el-form-item label="客服电话">
                            <el-input v-model="contactForm.phone" placeholder="例：400-888-8888" />
                        </el-form-item>
                        <el-form-item label="客服邮箱">
                            <el-input v-model="contactForm.email" placeholder="例：service@example.com" />
                        </el-form-item>
                        <el-form-item label="公司地址">
                            <el-input v-model="contactForm.address" placeholder="请输入公司地址" />
                        </el-form-item>
                        <el-form-item label="工作时间">
                            <el-input v-model="contactForm.workTime" placeholder="例：周一至周五 9:00-18:00" />
                        </el-form-item>
                        <el-form-item label="微信二维码">
                            <el-input v-model="contactForm.wechatQr" placeholder="请输入微信二维码图片URL" />
                        </el-form-item>
                        <el-form-item label="微博链接">
                            <el-input v-model="contactForm.weibo" placeholder="请输入微博链接" />
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-tab-pane>

            <!-- SEO配置 -->
            <el-tab-pane label="SEO配置" name="seo">
                <el-card shadow="never" class="setting-card">
                    <el-form :model="seoForm" label-width="120px">
                        <el-form-item label="首页标题">
                            <el-input v-model="seoForm.homeTitle" placeholder="请输入首页标题" />
                            <div class="form-tip">建议长度：60字符以内</div>
                        </el-form-item>
                        <el-form-item label="首页描述">
                            <el-input v-model="seoForm.homeDescription" type="textarea" :rows="3"
                                placeholder="请输入首页描述" />
                            <div class="form-tip">建议长度：150字符以内</div>
                        </el-form-item>
                        <el-form-item label="首页关键词">
                            <el-input v-model="seoForm.homeKeywords" placeholder="多个关键词用逗号分隔" />
                            <div class="form-tip">建议3-5个关键词</div>
                        </el-form-item>
                        <el-form-item label="网站验证码">
                            <el-input v-model="seoForm.siteVerification" type="textarea" :rows="2"
                                placeholder="Google/百度等搜索引擎验证码" />
                        </el-form-item>
                        <el-form-item label="统计代码">
                            <el-input v-model="seoForm.analyticsCode" type="textarea" :rows="3"
                                placeholder="请输入Google Analytics或百度统计代码" />
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-tab-pane>

            <!-- 其他设置 -->
            <el-tab-pane label="其他设置" name="other">
                <el-card shadow="never" class="setting-card">
                    <el-form :model="otherForm" label-width="120px">
                        <el-form-item label="是否开启维护">
                            <el-switch v-model="otherForm.maintenanceMode" />
                            <div class="form-tip">开启后，前台网站将显示维护页面</div>
                        </el-form-item>
                        <el-form-item label="维护提示信息">
                            <el-input v-model="otherForm.maintenanceMessage" type="textarea" :rows="2"
                                placeholder="请输入维护提示信息" />
                        </el-form-item>
                        <el-form-item label="是否开启注册">
                            <el-switch v-model="otherForm.allowRegister" />
                            <div class="form-tip">关闭后新用户将无法注册</div>
                        </el-form-item>
                        <el-form-item label="默认用户等级">
                            <el-select v-model="otherForm.defaultUserLevel" placeholder="请选择">
                                <el-option label="普通会员" :value="1" />
                                <el-option label="黄金会员" :value="2" />
                                <el-option label="铂金会员" :value="3" />
                                <el-option label="钻石会员" :value="4" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="默认积分">
                            <el-input-number v-model="otherForm.defaultPoints" :min="0" :step="10" />
                            <div class="form-tip">新用户注册送的积分</div>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 当前Tab
const activeTab = ref('basic')
const saving = ref(false)

// 基本信息表单
const basicFormRef = ref<FormInstance>()
const basicForm = reactive({
    siteName: '化妆品官网',
    siteLogo: '',
    siteDescription: '高品质化妆品，呈现自然美',
    siteKeywords: '化妆品,护肤,彩妆,美容',
    icp: '',
    copyright: '© 2025 化妆品官网. All rights reserved.',
})

const basicRules: FormRules = {
    siteName: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
}

// 联系方式表单
const contactForm = reactive({
    phone: '400-888-8888',
    email: 'service@example.com',
    address: '上海市静安区南京西路 XXX 号',
    workTime: '周一至周五 9:00-18:00',
    wechatQr: '',
    weibo: '',
})

// SEO配置表单
const seoForm = reactive({
    homeTitle: '化妆品官网 - 高品质化妆品',
    homeDescription: '提供高品质的护肤品、彩妆产品，让你呈现自然美丽',
    homeKeywords: '化妆品,护肤,彩妆,美容,女性',
    siteVerification: '',
    analyticsCode: '',
})

// 其他设置表单
const otherForm = reactive({
    maintenanceMode: false,
    maintenanceMessage: '网站正在升级维护中，请稍后访问',
    allowRegister: true,
    defaultUserLevel: 1,
    defaultPoints: 100,
})

// 加载设置
const loadSettings = async () => {
    try {
        // TODO: 从后端API加载设置
        // 目前使用localStorage模拟
        const saved = localStorage.getItem('systemSettings')
        if (saved) {
            const settings = JSON.parse(saved)
            Object.assign(basicForm, settings.basic || {})
            Object.assign(contactForm, settings.contact || {})
            Object.assign(seoForm, settings.seo || {})
            Object.assign(otherForm, settings.other || {})
        }
    } catch (error) {
        console.error('加载设置失败:', error)
    }
}

// 保存设置
const handleSave = async () => {
    if (!basicFormRef.value) return

    try {
        // 验证基本信息
        await basicFormRef.value.validate()

        saving.value = true

        // TODO: 调用后端API保存
        // 目前使用localStorage模拟
        const settings = {
            basic: basicForm,
            contact: contactForm,
            seo: seoForm,
            other: otherForm,
        }
        localStorage.setItem('systemSettings', JSON.stringify(settings))

        setTimeout(() => {
            saving.value = false
            ElMessage.success('保存成功')
        }, 500)
    } catch (error) {
        saving.value = false
        console.error('保存失败:', error)
        ElMessage.error('请检查必填项')
    }
}

onMounted(() => {
    loadSettings()
})
</script>

<style scoped>
.system-settings {
    padding: 20px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin: 0;
}

.setting-card {
    margin-bottom: 20px;
}

.form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 5px;
    line-height: 1.5;
}

:deep(.el-tabs__content) {
    padding-top: 20px;
}

:deep(.el-form-item) {
    margin-bottom: 24px;
}
</style>
