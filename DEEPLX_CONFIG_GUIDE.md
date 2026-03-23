# DeepLX API 配置指南

## 📋 deeplx.org 格式配置

### API 端点格式
```
https://api.deeplx.org/{api_key}/translate
```

其中 `{api_key}` 需要替换为你实际的 API Key。

---

## 🔧 配置步骤

### 1. 打开应用
访问：https://lengfeng00.github.io/markdown-translator/

### 2. 填写 DeepLX API 设置

在 **DeepLX API 设置** 部分：

**API Key**:
```
输入你的 API Key（例如：xxxxxxxxxxxxxxxxxx）
```

**API 端点**:
```
留空即可，系统会自动使用默认值：
https://api.deeplx.org/{api_key}/translate
```

### 3. 保存设置

点击 **"保存 DeepLX 设置"** 按钮

### 4. 测试连接

点击 **"测试 API 连接"** 按钮

如果配置正确，会显示：
```
✅ API 连接成功！测试翻译: "Hello" → "你好"
```

---

## 📝 示例

假设你的 API Key 是：`abcd1234efgh5678`

**配置**:
- **API Key**: `abcd1234efgh5678`
- **API 端点**: 留空（或填写 `https://api.deeplx.org/{api_key}/translate`）

系统会自动将 `{api_key}` 替换为你的实际 Key，最终请求地址为：
```
https://api.deeplx.org/abcd1234efgh5678/translate
```

---

## ✅ 验证配置成功

配置成功后，你应该看到：

1. ✅ 状态指示器显示"已配置"（绿色圆点）
2. ✅ 测试连接显示成功翻译结果
3. ✅ "开始翻译"按钮变为可点击状态

---

## 🌍 支持的语言

- ZH: 中文
- EN: 英语
- JA: 日语
- KO: 韩语
- FR: 法语
- DE: 德语
- ES: 西班牙语
- IT: 意大利语
- PT: 葡萄牙语
- RU: 俄语

---

## ❓ 常见问题

### Q: API Key 应该填在哪里？
A: 只需在"API Key"输入框填写，端点可以留空。

### Q: 测试连接失败怎么办？
A: 
1. 检查 API Key 是否正确
2. 确认 API Key 格式（通常是长字符串）
3. 打开浏览器控制台 (F12) 查看详细错误信息

### Q: 翻译时提示错误？
A:
1. 确认 API Key 有效
2. 检查网络连接
3. 查看 API 服务是否正常

### Q: 可以使用其他 API 服务吗？
A: 可以！支持的格式：
- 官方 DeepL: `https://api-deepl.com/v2/translate`
- DeepLX 自托管: `http://localhost:1188/translate`
- 其他 DeepLX 服务：在端点框中填写完整地址

---

## 🚀 开始翻译

配置完成后：

1. 上传或粘贴 Markdown 内容
2. 选择目标语言
3. 点击"开始翻译"
4. 等待翻译完成
5. 下载或上传到 GitHub

---

**配置愉快！** 🎉
