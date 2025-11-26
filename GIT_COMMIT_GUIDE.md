# Git 提交指南

## 📦 当前状态

你的 Git 仓库：https://github.com/zhx83752021/cosmetic-vue.git

## ✅ 需要提交的重要文件

### 核心项目
```
apps/web/              ← 🆕 统一前端项目（必须提交）
apps/server/           ← 后端项目（必须提交）
```

### 配置文件
```
vercel.json            ← 前端部署配置（已更新）
apps/server/vercel.json ← 后端部署配置（新增）
apps/web/.env.example  ← 环境变量示例
apps/web/.env.development
apps/web/.env.production
```

### 文档
```
START_HERE.md          ← 开始文档
QUICK_START.md         ← 快速开始
README_DEPLOYMENT.md   ← 部署指南
DEPLOYMENT.md          ← 详细部署文档
DEPLOYMENT_SUMMARY.md  ← 重组总结
GIT_COMMIT_GUIDE.md    ← 本文件
```

---

## 🔄 推荐的提交流程

### 步骤 1: 查看当前状态
```bash
git status
```

### 步骤 2: 添加新文件
```bash
# 添加 web 项目（新的统一前端）
git add apps/web/

# 添加更新的配置文件
git add vercel.json
git add apps/server/vercel.json

# 添加文档
git add START_HERE.md
git add QUICK_START.md
git add README_DEPLOYMENT.md
git add DEPLOYMENT.md
git add DEPLOYMENT_SUMMARY.md
git add GIT_COMMIT_GUIDE.md
```

### 步骤 3: 提交
```bash
git commit -m "refactor: 重组项目结构，合并前端项目以适配 Vercel 部署

- 创建统一的 web 项目（合并 frontend 和 admin）
- 用户端路由: /
- 管理后台路由: /admin
- 更新 Vercel 部署配置
- 添加完整的部署文档
- 构建验证通过
"
```

### 步骤 4: 推送
```bash
git push origin main
```

---

## 🗑️ 删除旧文件夹（可选）

**建议：先推送新代码，确认部署成功后再删除旧文件夹**

### 方式一：保留在 Git 历史中（推荐）
```bash
# 从 Git 中删除，但保留本地文件
git rm -r --cached apps/frontend
git rm -r --cached apps/admin

# 提交删除
git commit -m "chore: 移除废弃的 frontend 和 admin 项目（已迁移到 web）"

# 推送
git push origin main
```

### 方式二：完全删除
```bash
# 从 Git 和本地都删除
git rm -r apps/frontend
git rm -r apps/admin

# 提交删除
git commit -m "chore: 删除废弃的 frontend 和 admin 项目"

# 推送
git push origin main
```

---

## ⚠️ 重要提醒

### ✅ 必须保留的文件夹
- `apps/web/` - 新的统一前端项目
- `apps/server/` - 后端 API 项目

### ⚠️ 可以删除的文件夹
- `apps/frontend/` - 已废弃（功能已迁移到 web）
- `apps/admin/` - 已废弃（功能已迁移到 web）

### 📝 删除前的检查清单
- [ ] 新的 web 项目已提交到 Git
- [ ] 本地测试通过（`pnpm dev`）
- [ ] 构建成功（`pnpm build`）
- [ ] 已部署到 Vercel 并验证
- [ ] 确认所有功能正常

---

## 🚀 完整的 Git 操作示例

```bash
# 1. 查看状态
git status

# 2. 添加所有新文件和修改
git add apps/web/
git add apps/server/vercel.json
git add vercel.json
git add *.md

# 3. 提交
git commit -m "refactor: 重组项目为 Vercel 部署优化结构

主要改动：
- 新增 apps/web 统一前端项目（user + admin）
- 用户端路由: /
- 管理后台路由: /admin
- 更新 Vercel 部署配置
- 添加完整部署文档
- 构建验证通过

迁移说明：
- apps/frontend → apps/web/src/modules/user
- apps/admin → apps/web/src/modules/admin
- apps/server 保持不变
"

# 4. 推送到远程
git push origin main

# 5. （可选）部署成功后删除旧文件夹
# 先在本地备份，确认无误后再执行
git rm -r apps/frontend
git rm -r apps/admin
git commit -m "chore: 移除已迁移的旧项目"
git push origin main
```

---

## 📊 项目结构对比

### 之前
```
apps/
├── frontend/    (用户端)
├── admin/       (管理后台)
└── server/      (后端)
```

### 现在
```
apps/
├── web/         (用户端 + 管理后台) ← 新增
├── server/      (后端)
├── frontend/    ← 可删除
└── admin/       ← 可删除
```

---

## 🔗 相关资源

- **GitHub 仓库**: https://github.com/zhx83752021/cosmetic-vue.git
- **部署指南**: README_DEPLOYMENT.md
- **快速开始**: QUICK_START.md

---

## 💡 提示

1. **先提交新代码**: 确保 `apps/web` 安全地提交到 Git
2. **验证部署**: 在 Vercel 上测试新结构
3. **再删除旧代码**: 确认一切正常后删除 frontend 和 admin
4. **保留备份**: 删除前可以先创建本地备份

---

## ❓ 常见问题

**Q: 为什么不直接删除 frontend 和 admin？**
A: 保险起见，先确保新项目正常运行后再删除。

**Q: 删除后能恢复吗？**
A: 可以，Git 历史中有记录：`git checkout <commit-hash> -- apps/frontend`

**Q: .gitignore 需要更新吗？**
A: 不需要，现有配置已足够。主要忽略 node_modules 和 dist。

**Q: 需要更新 GitHub README 吗？**
A: 建议更新，说明新的项目结构和部署方式。

---

**准备好了就开始提交吧！** 🎉
