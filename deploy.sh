#!/bin/bash
# Markdown Translator 部署脚本

echo "========================================="
echo "Markdown Translator 部署助手"
echo "========================================="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "❌ 请使用 sudo 运行此脚本"
    exit 1
fi

# 项目目录
PROJECT_DIR="/public/home/wangxueqiang/markdown-translator"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"

echo "📁 项目目录: $PROJECT_DIR"
echo ""

# 检查项目目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 项目目录不存在: $PROJECT_DIR"
    exit 1
fi

# 设置文件权限
echo "🔧 设置文件权限..."
chown -R www-data:www-data "$PROJECT_DIR"
chmod -R 755 "$PROJECT_DIR"
find "$PROJECT_DIR" -type f -exec chmod 644 {} \;
echo "✅ 文件权限设置完成"
echo ""

# 复制 nginx 配置
echo "📝 配置 Nginx..."
read -p "请输入域名或 IP 地址: " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ 域名不能为空"
    exit 1
fi

# 创建 nginx 配置文件
cat > "$NGINX_SITES_AVAILABLE/markdown-translator" << EONGINX
server {
    listen 80;
    server_name $DOMAIN;
    
    root $PROJECT_DIR;
    index index.html;
    
    charset utf-8;
    
    access_log /var/log/nginx/markdown-translator-access.log;
    error_log /var/log/nginx/markdown-translator-error.log;
    
    location / {
        try_files \$uri \$uri/ =404;
    }
    
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location ~ /\. {
        deny all;
    }
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
EONGINX

# 创建软链接
ln -sf "$NGINX_SITES_AVAILABLE/markdown-translator" "$NGINX_SITES_ENABLED/markdown-translator"

echo "✅ Nginx 配置完成"
echo ""

# 测试 nginx 配置
echo "🧪 测试 Nginx 配置..."
if nginx -t; then
    echo "✅ Nginx 配置测试通过"
else
    echo "❌ Nginx 配置测试失败"
    exit 1
fi
echo ""

# 重启 nginx
echo "🔄 重启 Nginx..."
systemctl restart nginx
echo "✅ Nginx 已重启"
echo ""

# 完成
echo "========================================="
echo "✅ 部署完成！"
echo "========================================="
echo ""
echo "访问地址: http://$DOMAIN"
echo ""
echo "下一步："
echo "1. 在浏览器中打开 http://$DOMAIN"
echo "2. 配置 DeepLX API Key"
echo "3. 配置 GitHub Token（可选）"
echo "4. 开始翻译！"
echo ""
echo "如需配置 HTTPS，请使用 certbot:"
echo "  sudo certbot --nginx -d $DOMAIN"
echo ""
