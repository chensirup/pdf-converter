# Vercel 部署指南

## 方式一：通过 Vercel CLI 部署（推荐）

### 步骤 1：安装 Vercel CLI
```bash
npm i -g vercel
```

### 步骤 2：登录 Vercel
```bash
vercel login
```
按提示完成登录

### 步骤 3：部署项目
```bash
# 在项目根目录执行
vercel

# 首次部署会询问一些问题：
# ? Set up and deploy "~/Downloads/app"? [Y/n] → 输入 Y
# ? Which scope do you want to deploy to? → 选择你的账户
# ? Link to existing project? [y/N] → 输入 N（首次部署）
# ? What's your project name? [app] → 可以改名字，比如 pdf-converter
```

### 步骤 4：获取部署地址
部署完成后会显示类似：
```
🔍  Inspect: https://vercel.com/yourname/pdf-converter/xxxxx [1s]
✅  Production: https://pdf-converter-xxxxx.vercel.app [copied to clipboard]
```

---

## 方式二：通过 Git 仓库部署（推荐用于持续集成）

### 步骤 1：创建 Git 仓库
```bash
# 初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库（GitHub/GitLab/Gitee）
git remote add origin https://github.com/yourusername/pdf-converter.git

# 推送
git push -u origin main
```

### 步骤 2：在 Vercel 网站导入项目
1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择你的 GitHub/GitLab 账号
4. 选择 `pdf-converter` 仓库
5. 点击 "Import"

### 步骤 3：配置项目
- **Framework Preset**: 选择 `Vite`
- **Build Command**: 保持默认或填写 `npm run build`
- **Output Directory**: 填写 `dist`
- 点击 "Deploy"

### 步骤 4：等待部署完成
大约 1-2 分钟后，你会获得一个 `.vercel.app` 的域名

---

## 方式三：拖拽部署（最简单，适合快速预览）

### 步骤 1：本地构建
```bash
npm run build
```

### 步骤 2：拖拽部署
1. 访问 https://vercel.com/new
2. 直接将 `dist` 文件夹拖拽到页面上
3. 等待上传和部署完成

---

## 配置自定义域名（免费）

### 步骤 1：在 Vercel 添加域名
1. 进入项目 Dashboard
2. 点击 "Settings" → "Domains"
3. 输入你的域名，点击 "Add"

### 步骤 2：配置 DNS
在你的域名服务商后台添加记录：
```
类型: A
主机: @
值: 76.76.21.21

类型: CNAME
主机: www
值: cname.vercel-dns.com
```

### 步骤 3：等待生效
通常 5-30 分钟内生效，Vercel 会自动配置 SSL 证书

---

## 自动部署配置

### 启用 Git 集成自动部署
在 Vercel 项目设置中：
1. 进入 "Git" 设置页
2. 确保 "Production Branch" 设置为 `main`
3. 开启 "Auto Deploy" 

这样每次推送代码到 main 分支，Vercel 会自动重新部署

---

## 环境变量配置（如需要）

如果项目需要环境变量：

### 通过 CLI
```bash
vercel env add MY_VARIABLE
```

### 通过 Web 界面
1. 进入项目 Settings → Environment Variables
2. 添加变量名和值
3. 选择环境（Production/Preview/Development）

---

## 常见问题

### Q: 部署后页面空白？
**解决**: 检查 `vercel.json` 中的 `routes` 配置是否正确

### Q: 刷新页面 404？
**解决**: `vercel.json` 已配置路由重写，确保文件已提交

### Q: 静态资源加载失败？
**解决**: 检查 `vite.config.ts` 中的 `base` 是否为 `/`

### Q: 如何查看部署日志？
```bash
vercel logs --tail
```

### Q: 如何回滚到上一版本？
1. 在 Vercel Dashboard 进入项目
2. 点击 "Deployments"
3. 找到之前的版本，点击菜单选择 "Promote to Production"

---

## Vercel 免费版限制

| 功能 | 限制 |
|------|------|
| 带宽 | 100 GB/月 |
| 构建时间 | 6000 分钟/月 |
| 并发构建 | 2 个 |
| 函数执行时间 | 10 秒 |
| 自定义域名 | ✅ 支持 |
| SSL 证书 | ✅ 自动 |
| 全球 CDN | ✅ 支持 |

对于纯前端项目（如这个 PDF 转换器），免费版完全够用！

---

## 快速开始

最简单的部署方式：

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel --prod
```

部署完成后会获得一个 HTTPS 链接，可以直接访问！🚀