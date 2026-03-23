# 快速开始指南

## 🚀 3 步开始使用

### 第 1 步：打开应用

访问：**https://lengfeng00.github.io/markdown-translator/**

### 第 2 步：配置 API

在 "DeepLX API 设置" 部分：

1. **输入 API Key**
   ```
   你的 API Key（20-50个字符）
   ```

2. **API 端点**
   ```
   留空即可（自动使用默认值）
   ```

3. **点击 "保存 DeepLX 设置"**

4. **点击 "测试 API 连接"**

### 第 3 步：开始翻译

1. 上传或粘贴 Markdown 内容
2. 选择目标语言（如：中文）
3. 点击 "开始翻译"
4. 等待完成，下载结果

---

## ✅ 配置成功的标志

- ✅ 状态显示 "已配置"（绿色圆点）
- ✅ 测试连接显示：`"Hello" → "你好"`
- ✅ "开始翻译" 按钮可点击

---

## ❓ 常见问题

### Q: API Key 从哪里获取？

**A**: 取决于你使用的服务：

- **deeplx.org**: 从提供者处获取
- **官方 DeepL**: https://www.deepl.com/pro-api
- **自托管**: 使用你部署的服务

### Q: 测试连接失败 (401)？

**A**: 检查：
1. API Key 是否完整复制
2. 前后没有空格
3. API Key 仍然有效

详见：[故障排查指南](TROUBLESHOOTING.md)

### Q: 如何上传到 GitHub？

**A**: 需要额外配置：
1. 生成 GitHub Personal Access Token
2. 在 "GitHub API 设置" 中配置
3. 翻译完成后点击 "上传到 GitHub"

---

## 📚 更多文档

- [完整 README](README.md)
- [配置详细指南](DEEPLX_CONFIG_GUIDE.md)
- [故障排查指南](TROUBLESHOOTING.md)

---

**需要帮助？** [提交 Issue](https://github.com/LengFeng00/markdown-translator/issues)
