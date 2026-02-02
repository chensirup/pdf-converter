# PDF 转换工具部署指南

## 目录
1. [准备工作](#准备工作)
2. [服务器要求](#服务器要求)
3. [部署方式](#部署方式)
   - [方式一：自动化脚本部署（推荐）](#方式一自动化脚本部署推荐)
   - [方式二：手动部署](#方式二手动部署)
   - [方式三：Docker 部署](#方式三docker-部署)
4. [域名配置](#域名配置)
5. [SSL 证书配置](#ssl-证书配置)
6. [常见问题](#常见问题)

---

## 准备工作

### 1. 购买服务器
推荐使用以下云服务商：
- **阿里云** / **腾讯云** / **华为云**（国内）
- **AWS** / **Google Cloud** / **DigitalOcean**（国外）

**推荐配置**：
- CPU: 1-2 核
- 内存: 2-4 GB
- 硬盘: 20-50 GB SSD
- 带宽: 3-5 Mbps
- 系统: Ubuntu 20.04/22.04 LTS

### 2. 购买域名
- 在 [阿里云](https://wanwang.aliyun.com/) / [腾讯云](https://dnspod.cloud.tencent.com/) / [GoDaddy](https://www.godaddy.com/) 等平台购买域名
- 推荐后缀：`.com`、`.cn`、`.net`

### 3. 域名解析
在域名管理后台添加 A 记录：
```
主机记录: @      记录值: 你的服务器IP
主机记录: www    记录值: 你的服务器IP
```

---

## 服务器要求

### 必需软件
- **Nginx** - Web 服务器
- **Node.js** 18+ - 构建环境（可选，如果用预构建文件则不需要）
- **Certbot** - SSL 证书管理（可选）

### 安装依赖（Ubuntu/Debian）
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Nginx
sudo apt install nginx -y

# 安装 Node.js（如果使用构建）
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 部署方式

### 方式一：自动化脚本部署（推荐）

#### 1. 配置 SSH 免密登录
```bash
# 在本地生成 SSH 密钥（如果还没有）
ssh-keygen -t rsa -b 4096

# 将公钥复制到服务器
ssh-copy-id root@你的服务器IP
```

#### 2. 修改部署脚本配置
编辑 `deploy.sh` 文件，修改以下变量：
```bash
SERVER_IP="你的服务器IP"
DOMAIN="你的域名.com"
```

#### 3. 执行部署
```bash
./deploy.sh 你的服务器IP 你的域名.com
```

脚本会自动完成：
- ✅ 本地构建应用
- ✅ 上传文件到服务器
- ✅ 配置 Nginx
- ✅ 可选：配置 SSL 证书

---

### 方式二：手动部署

#### 步骤 1：本地构建
```bash
# 安装依赖
npm ci

# 构建应用
npm run build

# 确认 dist 目录已生成
ls -la dist/
```

#### 步骤 2：上传到服务器
```bash
# 创建远程目录
ssh root@你的服务器IP "mkdir -p /var/www/pdf-converter"

# 上传文件（使用 scp 或 rsync）
scp -r dist/* root@你的服务器IP:/var/www/pdf-converter/

# 或者使用 rsync（推荐，支持增量更新）
rsync -avz --delete dist/ root@你的服务器IP:/var/www/pdf-converter/
```

#### 步骤 3：配置 Nginx
在服务器上创建配置文件：
```bash
sudo nano /etc/nginx/sites-available/pdf-converter
```

粘贴以下内容（替换 `your-domain.com`）：
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    root /var/www/pdf-converter;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

启用配置：
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/pdf-converter /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

---

### 方式三：Docker 部署

#### 步骤 1：安装 Docker
```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### 步骤 2：构建镜像
```bash
# 在项目目录下
docker build -t pdf-converter .
```

#### 步骤 3：运行容器
```bash
# 运行容器
docker run -d \
  --name pdf-converter \
  -p 80:80 \
  -p 443:443 \
  --restart unless-stopped \
  pdf-converter
```

#### 使用 Docker Compose（推荐）
创建 `docker-compose.yml`：
```yaml
version: '3.8'

services:
  pdf-converter:
    build: .
    container_name: pdf-converter
    ports:
      - "80:80"
      - "443:443"
    restart: unless-stopped
    volumes:
      - ./ssl:/etc/nginx/ssl:ro  # SSL 证书挂载
```

运行：
```bash
docker-compose up -d
```

---

## 域名配置

### 1. 确认域名解析生效
```bash
# 检查域名解析
nslookup your-domain.com

# 应该返回你的服务器 IP
```

### 2. 等待 DNS 传播
DNS 传播通常需要 5 分钟到 48 小时，一般在 10-30 分钟内生效。

### 3. 测试访问
```bash
# 测试 HTTP 访问
curl -I http://your-domain.com

# 应该返回 200 OK
```

---

## SSL 证书配置

### 使用 Let's Encrypt（免费）

#### 1. 安装 Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y
```

#### 2. 获取证书
```bash
# 自动配置 Nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 按提示操作，输入邮箱地址
```

#### 3. 自动续期
Certbot 会自动添加定时任务，无需手动操作。测试续期：
```bash
sudo certbot renew --dry-run
```

#### 4. 强制 HTTPS
编辑 Nginx 配置，添加重定向：
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 常见问题

### Q1: 部署后页面空白？
**原因**：构建时 `base` 路径配置错误
**解决**：检查 `vite.config.ts` 中的 `base: '/'` 配置

### Q2: 刷新页面 404？
**原因**：Nginx 未配置前端路由支持
**解决**：确保 Nginx 配置中有：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Q3: 静态资源加载失败？
**原因**：路径问题或缓存
**解决**：
- 检查浏览器开发者工具的 Network 面板
- 清除浏览器缓存（Ctrl+Shift+R）
- 检查 Nginx 的 root 路径配置

### Q4: SSL 证书续期失败？
**解决**：
```bash
# 手动续期
sudo certbot renew

# 检查定时任务
sudo systemctl status certbot.timer
```

### Q5: 如何更新部署？
```bash
# 方法 1：重新运行部署脚本
./deploy.sh 你的服务器IP 你的域名.com

# 方法 2：手动更新
npm run build
rsync -avz --delete dist/ root@你的服务器IP:/var/www/pdf-converter/
```

---

## 安全建议

1. **定期更新系统**：`sudo apt update && sudo apt upgrade`
2. **配置防火墙**：只开放 80、443 端口
3. **启用 HTTPS**：强制使用 SSL
4. **备份数据**：定期备份服务器配置

---

## 联系方式

如有问题，请检查：
1. Nginx 错误日志：`/var/log/nginx/error.log`
2. 浏览器开发者工具 Console
3. 确认所有配置已正确替换

祝你部署顺利！🚀