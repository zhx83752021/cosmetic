# 修复 CORS 错误

## 当前状态

✅ 后端已运行（不再崩溃）
❌ 登录时出现 CORS 错误
✅ 代码已更新并推送

## 问题原因

前端域名 `www.hi-ultra.com` 未在后端 CORS 白名单中，或环境变量未正确配置。

---

## 🚀 立即修复（2步，3分钟）

### 步骤 1：配置 CORS 环境变量（2分钟）

1. **访问 Vercel Dashboard**
   - 🔗 https://vercel.com/dashboard

2. **进入后端项目**
   - 点击 `cosmetic-ve-server` 项目

3. **配置环境变量**
   - 点击 **Settings** → **Environment Variables**

4. **添加/更新 CORS_ORIGINS**

   查看是否已有 `CORS_ORIGINS` 变量：
   - **如果已存在**：点击编辑，更新值为：

     ```
     https://hi-ultra.com,https://www.hi-ultra.com,https://cosmetic-ve.vercel.app
     ```

   - **如果不存在**：点击 **Add New**
     ```
     名称：CORS_ORIGINS
     值：https://hi-ultra.com,https://www.hi-ultra.com,https://cosmetic-ve.vercel.app
     环境：Production ✓ Preview ✓ Development ✓（全选）
     ```

5. **保存**

### 步骤 2：重新部署（1分钟）

1. 点击 **Deployments** 标签
2. 找到最新的部署（第一个）
3. 点击右侧的 **···** 菜单
4. 选择 **Redeploy**
5. 等待 1-2 分钟

---

## ✅ 验证修复

部署完成后：

1. **访问登录页面**
   - 🔗 https://www.hi-ultra.com/admin/login

2. **尝试登录**
   - 用户名：`admin`
   - 密码：`123456`

3. **检查浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Network 标签
   - login 请求应该成功（状态码 200）

---

## 🔍 代码改进说明

我已经更新了 `apps/server/src/index.ts` 中的 CORS 配置：

### 改进内容

1. **支持环境变量控制**
   - 可以通过 `CORS_ORIGINS` 环境变量配置允许的域名
   - 多个域名用逗号分隔

2. **更好的默认值**
   - 如果未配置环境变量，使用默认白名单：
     - `https://hi-ultra.com`
     - `https://www.hi-ultra.com`
     - `https://cosmetic-ve.vercel.app`

3. **更好的错误信息**
   - 当 CORS 被拒绝时，会显示具体的来源域名
   - 便于调试

### 配置优先级

```
1. CORS_ORIGINS 环境变量（如果设置）
2. 代码中的默认白名单
```

---

## 📋 完整环境变量清单

当前应该配置的所有环境变量：

| 变量名         | 值                                                                             | 说明                          |
| -------------- | ------------------------------------------------------------------------------ | ----------------------------- |
| `DATABASE_URL` | `postgresql://...`                                                             | 数据库连接（Vercel Postgres） |
| `JWT_SECRET`   | `your-32-char-secret`                                                          | JWT 密钥（至少32位）          |
| `NODE_ENV`     | `production`                                                                   | 环境标识                      |
| `CORS_ORIGINS` | `https://hi-ultra.com,https://www.hi-ultra.com,https://cosmetic-ve.vercel.app` | CORS 白名单                   |

可选：

| 变量名           | 值   | 说明           |
| ---------------- | ---- | -------------- |
| `JWT_EXPIRES_IN` | `7d` | Token 过期时间 |

---

## 🆘 如果还是失败

### 检查 1：确认环境变量

Settings → Environment Variables → 确认：

- ✅ `CORS_ORIGINS` 已配置
- ✅ 值包含 `https://www.hi-ultra.com`
- ✅ Environment 选择了 Production

### 检查 2：查看部署日志

Deployments → 最新部署 → View Function Logs

查找 CORS 相关的错误信息。

### 检查 3：测试不同域名

尝试从不同域名访问：

- https://cosmetic-ve.vercel.app/admin/login
- https://www.hi-ultra.com/admin/login
- https://hi-ultra.com/admin/login

查看哪个可以正常工作。

### 检查 4：浏览器控制台

F12 → Console 标签，查看是否有其他错误信息。

---

## 🔧 临时测试方法

如果需要快速测试后端 API 是否正常：

```powershell
# 测试健康检查
Invoke-WebRequest -Uri https://cosmetic-ve-server.vercel.app/health

# 测试登录 API（不受 CORS 限制）
$body = @{
    account = "admin"
    password = "123456"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://cosmetic-ve-server.vercel.app/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

**优先级**：🔥 高
**预计修复时间**：3 分钟
**关键步骤**：配置 CORS_ORIGINS → 重新部署
