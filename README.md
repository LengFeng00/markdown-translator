# Markdown Translator 🌐

一个基于 DeepLX API 的 Markdown 文档翻译工具，支持翻译后上传到 GitHub。

## ✨ 特性

- 🌍 **多语言翻译**: 使用 DeepLX API 支持 10+ 种语言互译
- 📝 **Markdown 智能解析**: 保留代码块、标题等格式
- 🐙 **GitHub 集成**: 一键创建仓库并上传翻译结果
- 📥 **多种下载格式**: 支持 Markdown、HTML、PDF 下载
- 🔒 **安全存储**: API Key 本地存储，不上传服务器
- 💻 **纯静态前端**: 无需后端服务器，部署简单

## 🚀 快速开始

### 1. 克隆或下载项目

```bash
git clone https://github.com/yourusername/markdown-translator.git
cd markdown-translator
```

### 2. 部署到服务器

使用 nginx 或 Apache 部署：

**Nginx 配置示例:**
```nginx
server {
    listen 80;
    server_name translator.yourdomain.com;
    root /path/to/markdown-translator;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

**Apache 配置示例:**
```apache
<VirtualHost *:80>
    ServerName translator.yourdomain.com
    DocumentRoot /path/to/markdown-translator
    
    <Directory /path/to/markdown-translator>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### 3. 访问应用

在浏览器中打开: `http://translator.yourdomain.com`

## ⚙️ 配置

### DeepLX API 设置

1. 获取 DeepLX API Key: https://www.deepl.com/pro-api
2. 在应用中输入 API Key
3. 可选：使用自定义 DeepLX 服务器端点

### GitHub API 设置

1. 生成 GitHub Personal Access Token:
   - 访问: https://github.com/settings/tokens
   - 选择 `repo` 权限
   - 生成并复制 Token
2. 在应用中输入 Token 和用户名

## 📖 使用说明

### 翻译文档

1. **上传文件** 或 **粘贴文本**
2. **选择目标语言**
3. **点击"开始翻译"**
4. **等待翻译完成**

### 下载结果

翻译完成后，可以选择：
- 下载为 Markdown 文件
- 下载为 HTML 文件
- 下载为 PDF（使用浏览器打印功能）

### 上传到 GitHub

1. 确保 GitHub Token 已配置
2. 点击"上传到 GitHub"
3. 输入仓库名称和描述
4. 自动创建仓库并上传原文和译文

## 🔧 技术栈

- **前端**: 原生 HTML/CSS/JavaScript
- **API**: DeepLX API, GitHub API
- **存储**: localStorage
- **部署**: nginx/Apache

## 📁 项目结构

```
markdown-translator/
├── index.html          # 主页面
├── css/
│   └── style.css      # 样式文件
├── js/
│   ├── config.js      # 配置文件
│   ├── translator.js  # DeepLX 翻译模块
│   ├── github.js      # GitHub API 集成
│   ├── downloader.js  # 下载功能
│   └── app.js         # 主应用逻辑
└── README.md          # 使用说明
```

## 🌐 支持的语言

- 中文 (Chinese)
- 英语 (English)
- 日语 (Japanese)
- 韩语 (Korean)
- 法语 (French)
- 德语 (German)
- 西班牙语 (Spanish)
- 意大利语 (Italian)
- 葡萄牙语 (Portuguese)
- 俄语 (Russian)

## 🔒 隐私与安全

- 所有 API Key 存储在浏览器 localStorage
- 不经过任何中间服务器
- 直接与 DeepLX 和 GitHub API 通信
- 可随时清除存储的凭证

## ⚠️ 注意事项

1. DeepLX API 有调用限制，请注意配额
2. 大文件翻译可能需要较长时间
3. PDF 下载使用浏览器打印功能
4. GitHub Token 需要 `repo` 权限

## 🐛 故障排除

### 翻译失败
- 检查 API Key 是否正确
- 确认 API 配额是否用尽
- 检查网络连接

### GitHub 上传失败
- 验证 Token 是否有 `repo` 权限
- 确认用户名是否正确
- 检查仓库名称是否重复

### 文件上传问题
- 确认文件大小不超过 10MB
- 检查文件格式是否支持

## 📝 开发计划

- [ ] 支持批量翻译
- [ ] 添加翻译缓存
- [ ] 支持更多翻译服务
- [ ] 添加翻译历史记录
- [ ] 支持自定义 Markdown 样式

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- GitHub: @yourusername
- Email: your.email@example.com

---

**享受翻译！** 🎉
