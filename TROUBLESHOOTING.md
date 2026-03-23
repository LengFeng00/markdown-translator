# 故障排查指南

## ❌ API 错误 (401): invalid api key

这个错误表示 API Key 无效。请按以下步骤排查：

---

## 🔍 步骤 1: 检查 API Key

### ✅ 正确的 API Key 格式
- 长度通常在 20-50 个字符
- 只包含字母和数字
- 示例: `abcd1234efgh5678`

### ❌ 常见错误
1. **不完整的 Key**: 只复制了一部分
2. **多余的空格**: 前后有空格或换行符
3. **错误的 Key**: 复制了其他内容
4. **过期的 Key**: API Key 已失效

---

## 🔧 步骤 2: 重新输入 API Key

1. **清除旧 Key**
   - 删除输入框中的所有内容
   - 确保没有空格或换行符

2. **重新复制**
   - 回到提供 API Key 的地方
   - 完整选中整个 Key
   - 使用 Ctrl+C (或 Cmd+C) 复制
   - 使用 Ctrl+V (或 Cmd+V) 粘贴

3. **验证长度**
   - API Key 应该是完整的长字符串
   - 检查前后是否有不可见字符

---

## 🛠️ 步骤 3: 使用调试功能

更新后的应用现在有两个调试按钮：

### 1. "显示调试信息" 按钮

点击后会显示：
- API Key 的前 8 位和后 4 位
- API Key 的总长度
- 最终构建的 URL

**用途**: 检查 API Key 是否完整

### 2. "测试 API 连接" 按钮

**步骤**:
1. 点击"测试 API 连接"
2. 打开浏览器控制台 (按 F12)
3. 切换到 Console 标签
4. 查看详细的请求和响应信息

**控制台会显示**:
```
=== Translation Request ===
API Type: deeplx_org
Text: "Hello"
Target Language: ZH
API Key: abcd1234...
Endpoint: https://api.deeplx.org/{api_key}/translate
========================
```

---

## 📋 步骤 4: 常见问题清单

请检查以下各项：

- [ ] API Key 完整复制，没有遗漏
- [ ] API Key 前后没有空格
- [ ] API Key 没有多余的换行符
- [ ] API Key 仍然有效（未过期）
- [ ] 网络连接正常
- [ ] API 服务地址正确

---

## 🧪 步骤 5: 手动测试 API

使用 curl 或 Postman 手动测试：

```bash
curl -X POST \
  "https://api.deeplx.org/YOUR_API_KEY/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello",
    "source_lang": "EN",
    "target_lang": "ZH"
  }'
```

**预期响应**:
```json
{
  "data": "你好"
}
```

**如果返回 401**:
```json
{
  "code": 401,
  "message": "invalid api key"
}
```
这说明 API Key 确实无效。

---

## 💡 解决方案

### 方案 1: 重新获取 API Key

如果 API Key 无效或过期，需要重新获取：

1. 访问提供 API Key 的网站
2. 登录你的账号
3. 找到 API Key 管理页面
4. 生成新的 API Key
5. 复制并粘贴到应用中

### 方案 2: 联系 API 提供商

如果重新获取后仍然无效：

1. 检查账号状态
2. 查看是否达到使用限制
3. 联系技术支持

---

## 📞 需要更多帮助？

如果以上步骤都无法解决问题，请：

1. **查看浏览器控制台**
   - 按 F12 打开开发者工具
   - 切换到 Console 标签
   - 截图或复制错误信息

2. **使用调试功能**
   - 点击"显示调试信息"
   - 截图显示的配置信息

3. **提供详细信息**
   - API Key 长度（不要提供实际 Key）
   - 错误的完整信息
   - 控制台的日志

---

## ✅ 成功的标志

配置正确后，你应该看到：

```
✅ API 连接成功！
测试翻译: "Hello" → "你好"
API 配置正确，可以开始使用了！
```

---

**记住**: API Key 是敏感信息，请妥善保管，不要分享给他人！🔒
