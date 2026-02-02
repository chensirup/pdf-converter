#!/bin/bash

# PDF 转换工具部署脚本
# 使用方法: ./deploy.sh [服务器IP] [域名]

set -e

# 配置变量
SERVER_IP=${1:-"your-server-ip"}
DOMAIN=${2:-"your-domain.com"}
REMOTE_USER="root"
REMOTE_DIR="/var/www/pdf-converter"
NGINX_CONF="/etc/nginx/sites-available/pdf-converter"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== PDF 转换工具部署脚本 ===${NC}"
echo "服务器: $SERVER_IP"
echo "域名: $DOMAIN"
echo ""

# 1. 本地构建
echo -e "${YELLOW}步骤 1: 本地构建应用...${NC}"
npm ci
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}构建失败，dist 目录不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 构建成功${NC}"
echo ""

# 2. 上传到服务器
echo -e "${YELLOW}步骤 2: 上传文件到服务器...${NC}"

# 创建远程目录
ssh $REMOTE_USER@$SERVER_IP "mkdir -p $REMOTE_DIR"

# 使用 rsync 上传构建产物
rsync -avz --delete dist/ $REMOTE_USER@$SERVER_IP:$REMOTE_DIR/

echo -e "${GREEN}✓ 上传完成${NC}"
echo ""

# 3. 配置 Nginx
echo -e "${YELLOW}步骤 3: 配置 Nginx...${NC}"

# 生成 Nginx 配置
cat > /tmp/nginx-pdf-converter.conf << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    root $REMOTE_DIR;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 缓存静态资源
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    # 主应用 - 前端路由支持
    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # 安全响应头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF

# 上传 Nginx 配置
scp /tmp/nginx-pdf-converter.conf $REMOTE_USER@$SERVER_IP:/tmp/

# 在服务器上应用配置
ssh $REMOTE_USER@$SERVER_IP << EOF
    # 移动配置文件
    mv /tmp/nginx-pdf-converter.conf $NGINX_CONF
    
    # 启用站点（如果是 Ubuntu/Debian）
    if [ -d /etc/nginx/sites-enabled ]; then
        ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
    fi
    
    # 测试 Nginx 配置
    nginx -t
    
    # 重载 Nginx
    systemctl reload nginx
EOF

echo -e "${GREEN}✓ Nginx 配置完成${NC}"
echo ""

# 4. 配置 SSL 证书（使用 Certbot）
echo -e "${YELLOW}步骤 4: 配置 SSL 证书...${NC}"
read -p "是否配置 SSL 证书? (y/n): " setup_ssl

if [ "$setup_ssl" = "y" ] || [ "$setup_ssl" = "Y" ]; then
    ssh $REMOTE_USER@$SERVER_IP << EOF
        # 安装 Certbot（如果未安装）
        if ! command -v certbot &> /dev/null; then
            apt-get update
            apt-get install -y certbot python3-certbot-nginx
        fi
        
        # 获取证书
        certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
        
        # 设置自动续期
        systemctl enable certbot.timer
EOF
    echo -e "${GREEN}✓ SSL 证书配置完成${NC}"
else
    echo -e "${YELLOW}跳过 SSL 配置${NC}"
fi

echo ""
echo -e "${GREEN}=== 部署完成! ===${NC}"
echo "网站地址: http://$DOMAIN"
echo ""
echo "后续步骤:"
echo "1. 确保域名已解析到服务器 IP: $SERVER_IP"
echo "2. 访问网站测试功能"
echo "3. 如需更新，重新运行此脚本"