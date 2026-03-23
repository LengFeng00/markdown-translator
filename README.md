# Markdown Translator 🌐

一个基于 DeepLX API 的 Markdown 文档翻译工具，支持翻译后上传到 GitHub。

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-3DA639?logo=github)](https://lengfeng00.github.io/markdown-translator/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ 特性

- 🌍 **多语言翻译**: 使用 DeepLX API 支持 10+ 种语言互译
- 📝 **Markdown 智能解析**: 保留代码块、标题等格式，不翻译代码
- 🐙 **GitHub 集成**: 一键创建仓库并上传翻译结果
- 📥 **多种下载格式**: 支持 Markdown、HTML、PDF 下载
- 🔒 **安全存储**: API Key 本地存储，不上传服务器
- 💻 **纯静态前端**: 无需后端服务器，部署简单
- 🐛 **调试功能**: 内置 API 测试和调试工具

## 🚀 在线使用

直接访问 GitHub Pages 部署版本：

**🌐 https://lengfeng00.github.io/markdown-translator/**

无需安装，打开浏览器即可使用！

## 📸 快速预览

### 主界面
- 📤 文件上传或文本粘贴
- ⚙️ API 配置面板
- 🎯 语言选择
- 📊 实时翻译进度

### API 配置
- 🔑 DeepLX API Key 配置
- 🔗 支持多种 API 格式
- ✅ 内置连接测试功能
- 🐛 详细调试信息

### 结果处理
- 📥 下载为 Markdown/HTML/PDF
- 🐙 一键上传到 GitHub
- 📊 翻译质量统计

## ⚙️ 配置指南

### DeepLX API 配置

#### 支持的 API 格式

**1. deeplx.org 格式（推荐）**
```
API Key: xxxxxxxxxxxxxxxx
端点: 留空（自动使用默认值）
```

最终 URL: `https://api.deeplx.org/xxxxxxxxxxxxxxxxxx/translate`

**2. 官方 DeepL API**
```
API Key: 你的 DeepL API Key
端点: https://api-deepl.com/v2/translate
```

**3. DeepLX 自托管**
```
API Key: （可选）
端点: http://localhost:1188/translate
```

#### 配置步骤

1. **打开应用**: https://lengfeng00.github.io/markdown-translator/

2. **填写配置**:
   - 在 "DeepLX API 设置" 部分输入你的 API Key
   - API 端点可以留空（使用默认值）

3. **保存并测试**:
   - 点击 "保存 DeepLX 设置"
   - 点击 "测试 API 连接" 验证配置

4. **开始使用**: 配置成功后即可开始翻译

### GitHub API 配置（可选）

用于将翻译结果上传到 GitHub：

1. **生成 Personal Access Token**:
   - 访问: https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 选择权限: `repo` (full control of private repositories)
   - 生成并复制 Token

2. **配置应用**:
   - 在 "GitHub API 设置" 部分输入 Token
   - 输入你的 GitHub 用户名
   - 点击 "保存 GitHub 设置"

## 📖 使用说明

### 翻译流程

1. **输入内容**
   - 方式 A: 上传 Markdown 文件
   - 方式 B: 直接粘贴文本

2. **选择语言**
   - 选择目标语言（如：中文、英语、日语等）

3. **开始翻译**
   - 点击 "开始翻译" 按钮
   - 查看实时进度
   - 等待完成

4. **处理结果**
   - 下载为 Markdown 文件
   - 下载为 HTML 文件
   - 下载为 PDF（使用浏览器打印）
   - 或上传到 GitHub 创建新仓库

### 高级功能

#### 调试功能
- **显示调试信息**: 查看配置详情
- **测试 API 连接**: 验证 API Key 是否有效
- **浏览器控制台**: 查看详细请求日志

#### GitHub 集成
- 自动创建新仓库
- 上传原文和译文
- 支持 GitHub Pages 部署

## 🌐 支持的语言

| 语言 | 代码 |
|------|------|
| 🇨🇳 中文 | ZH |
| 🇺🇸 英语 | EN |
| 🇯🇵 日语 | JA |
| 🇰🇷 韩语 | KO |
| 🇫🇷 法语 | FR |
| 🇩🇪 德语 | DE |
| 🇪🇸 西班牙语 | ES |
| 🇮🇹 意大利语 | IT |
| 🇵🇹 葡萄牙语 | PT |
| 🇷🇺 俄语 | RU |

## 🔧 技术栈

- **前端**: 原生 HTML/CSS/JavaScript (ES6+)
- **API**: DeepLX API, GitHub REST API v3
- **存储**: localStorage (浏览器本地存储)
- **部署**: GitHub Pages / Nginx / Apache

## 📁 项目结构

```
markdown-translator/
├── index.html                 # 主页面
├── css/
│   └── style.css             # 样式文件
├── js/
│   ├── config.js             # 配置文件
│   ├── translator.js         # DeepLX 翻译模块
│   ├── github.js             # GitHub API 集成
│   ├── downloader.js         # 下载功能
│   └── app.js                # 主应用逻辑
├── README.md                 # 使用说明（本文件）
├── DEEPLX_CONFIG_GUIDE.md    # DeepLX 配置详细指南
├── TROUBLESHOOTING.md        # 故障排查指南
├── PROJECT_SUMMARY.md        # 项目总结
├── nginx.conf.example        # Nginx 配置示例
└── deploy.sh                 # 部署脚本
```

## 🚀 本地部署

### 方式 1: GitHub Pages（推荐）

1. Fork 或克隆本仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 `main` 分支和 `/root` 目录
4. 访问 `https://yourusername.github.io/markdown-translator/`

### 方式 2: Nginx

```bash
# 复制 Nginx 配置
sudo cp nginx.conf.example /etc/nginx/sites-available/markdown-translator

# 修改配置中的域名和路径
sudo nano /etc/nginx/sites-available/markdown-translator

# 启用站点
sudo ln -s /etc/nginx/sites-available/markdown-translator /etc/nginx/sites-enabled/

# 测试并重启
sudo nginx -t
sudo systemctl restart nginx
```

### 方式 3: Python HTTP Server

```bash
# Python 3
python3 -m http.server 8000

# 访问 http://localhost:8000
```

## 🔒 隐私与安全

- ✅ 所有 API Key 存储在浏览器 localStorage
- ✅ 不经过任何中间服务器
- ✅ 直接与 DeepLX 和 GitHub API 通信
- ✅ 可随时清除存储的凭证
- ⚠️ 建议使用 HTTPS 部署
- ⚠️ API Key 是敏感信息，请妥善保管

## ⚠️ 注意事项

1. **API 限制**
   - DeepLX API 可能有调用频率限制
   - 注意 API 配额使用情况
   - 大文件翻译可能需要较长时间

2. **文件大小**
   - 单文件最大 10MB
   - 建议大文件分段翻译

3. **浏览器兼容**
   - 推荐使用 Chrome、Firefox、Edge
   - 需要启用 JavaScript
   - PDF 下载需要支持打印功能

4. **GitHub Token**
   - 需要 `repo` 权限
   - 定期更新 Token
   - 不要分享给他人

## 🐛 故障排查

### API 连接失败 (401 错误)

**原因**: API Key 无效或配置错误

**解决方案**:
1. 检查 API Key 是否完整复制
2. 确认没有多余的空格或换行符
3. 使用"测试 API 连接"功能验证
4. 查看 [详细故障排查指南](TROUBLESHOOTING.md)

### 翻译失败

**检查清单**:
- [ ] API Key 配置正确
- [ ] 网络连接正常
- [ ] API 服务可用
- [ ] 浏览器控制台无错误

### GitHub 上传失败

**检查清单**:
- [ ] GitHub Token 有效
- [ ] Token 有 `repo` 权限
- [ ] 用户名正确
- [ ] 仓库名称不重复

更多问题请查看 [故障排查指南](TROUBLESHOOTING.md)。

## 📚 文档

- [DeepLX 配置详细指南](DEEPLX_CONFIG_GUIDE.md)
- [故障排查指南](TROUBLESHOOTING.md)
- [项目总结](PROJECT_SUMMARY.md)

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

### v1.1.0 (2026-03-23)
- ✨ 支持 deeplx.org API 格式
- ✨ 添加 API 连接测试功能
- ✨ 添加调试信息显示
- ✨ 改进错误处理和提示
- 🐛 修复 API Key 配置问题
- 📝 添加详细配置和故障排查文档

### v1.0.0 (2026-03-23)
- 🎉 初始版本发布
- ✅ 基础翻译功能
- ✅ GitHub 集成
- ✅ 多种下载格式

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 👨‍💻 作者

**LengFeng00** 

- GitHub: [@LengFeng00](https://github.com/LengFeng00)
- Email: [bioinfo_ss@163.com](mailto:bioinfo_ss@163.com)

## 🙏 致谢

- [DeepL](https://www.deepl.com/) - 优秀的翻译服务
- [GitHub](https://github.com/) - 代码托管和 API
- [Markdown](https://www.markdownguide.org/) - 标记语言

## 📧 联系方式

- 问题反馈: [GitHub Issues](https://github.com/LengFeng00/markdown-translator/issues)
- 邮箱: bioinfo_ss@163.com

---

**享受翻译！** 🎉

如果这个项目对你有帮助，请给个 ⭐ Star！
