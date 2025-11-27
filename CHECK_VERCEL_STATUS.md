# 检查 Vercel 部署状态

## 当前状态

✅ 代码已提交并推送到 GitHub
⏳ Vercel 正在部署中（可能需要 3-5 分钟）

## 快速检查步骤

### 1. 访问 Vercel Dashboard

🔗 **链接**：https://vercel.com/dashboard

### 2. 找到后端项目

项目名称：`cosmetic-ve-server` 或类似名称

### 3. 查看最新部署状态

在项目页面查看：

- ✅ **绿色勾号 (Ready)**：部署成功
- ⏳ **橙色时钟 (Building)**：正在构建
- ❌ **红色叉号 (Failed)**：部署失败

### 4. 如果显示 "Building"

**正常情况**：等待 2-3 分钟

**超过 5 分钟**：

1. 点击部署查看详细日志
2. 查找错误信息（通常在 Build Logs 中）

### 5. 如果显示 "Failed"

点击失败的部署，查看错误日志，常见问题：

#### 问题 A：构建超时

**错误信息**：`Build exceeded maximum time`

**解决方案**：

- Vercel 免费版有构建时间限制
- 可能需要优化构建流程或升级计划

#### 问题 B：环境变量缺失

**错误信息**：`DATABASE_URL is not defined`

**解决方案**：

1. Settings → Environment Variables
2. 添加缺失的环境变量
3. Redeploy

#### 问题 C：依赖安装失败

**错误信息**：`pnpm install failed`

**解决方案**：

1. 检查 package.json 是否有错误
2. 确认 pnpm-lock.yaml 是否提交
3. 可能需要清除构建缓存

#### 问题 D：TypeScript 编译错误

**错误信息**：`error TS...`

**解决方案**：

1. 在本地运行 `pnpm run build` 检查
2. 修复编译错误后重新提交

### 6. 如果显示 "Ready"

测试后端健康检查：

```powershell
# PowerShell
Invoke-WebRequest -Uri https://cosmetic-ve-server.vercel.app/health
```

**预期响应**：

```json
{
  "status": "ok",
  "timestamp": "2024-11-27..."
}
```

如果返回 200 OK，说明后端部署成功！

### 7. 检查前端部署

前端项目名称：`cosmetic-ve`

确认前端也重新部署了（因为我们更新了 `.env.production`）

## 测试登录

当前后端都显示 "Ready" 后：

1. 访问：https://cosmetic-ve.vercel.app/admin/login
2. 输入账号：`admin` / `123456`
3. 点击登录

### 可能的结果

#### ✅ 登录成功

问题完全解决！

#### ❌ 数据库错误（400/500）

需要初始化数据库，参考：`VERCEL_DATABASE_SETUP.md`

#### ❌ 网络错误

1. 检查浏览器控制台（F12 → Console）
2. 查看具体的错误信息
3. 确认 API 地址是否正确

#### ❌ CORS 错误

在后端项目环境变量中添加/检查：

```env
CORS_ORIGINS=https://cosmetic-ve.vercel.app
```

然后 Redeploy 后端

## 手动测试脚本

如果自动监控脚本还在运行，你也可以手动测试：

```powershell
# 测试后端健康检查
Invoke-WebRequest -Uri https://cosmetic-ve-server.vercel.app/health

# 测试 API 端点
Invoke-WebRequest -Uri https://cosmetic-ve-server.vercel.app/api -Method Options
```

## 需要帮助？

如果遇到问题，请提供：

1. **Vercel 部署状态截图**
2. **Build Logs 中的错误信息**
3. **浏览器控制台的错误信息**

---

**Vercel Dashboard**：https://vercel.com/dashboard
**后端项目**：cosmetic-ve-server
**前端项目**：cosmetic-ve
