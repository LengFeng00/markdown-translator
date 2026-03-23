// 主应用逻辑
class MarkdownTranslatorApp {
    constructor() {
        this.translator = new MarkdownTranslator();
        this.github = new GitHubUploader();
        this.downloader = new FileDownloader();
        
        this.originalContent = '';
        this.translatedContent = '';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadSavedSettings();
        this.updateUI();
        this.populateLanguageOptions();
    }
    
    bindEvents() {
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });
        
        document.getElementById('textInput').addEventListener('input', (e) => {
            this.originalContent = e.target.value;
            this.updateWordCount();
        });
        
        document.getElementById('saveDeeplxSettings').addEventListener('click', () => {
            this.saveDeeplxSettings();
        });
        
        document.getElementById('saveGithubSettings').addEventListener('click', () => {
            this.saveGithubSettings();
        });
        
        document.getElementById('translateBtn').addEventListener('click', () => {
            this.startTranslation();
        });
        
        document.getElementById('uploadToGithubBtn').addEventListener('click', () => {
            this.uploadToGitHub();
        });
        
        document.getElementById('downloadMarkdownBtn').addEventListener('click', () => {
            this.downloader.downloadMarkdown(this.translatedContent);
        });
        
        document.getElementById('downloadHTMLBtn').addEventListener('click', () => {
            this.downloader.downloadHTML(this.translatedContent);
        });
        
        document.getElementById('downloadPDFBtn').addEventListener('click', () => {
            this.downloader.downloadPDF(this.translatedContent);
        });
        
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearAll();
        });
        
        // 添加测试 API 按钮
        const testApiBtn = document.createElement('button');
        testApiBtn.id = 'testApiBtn';
        testApiBtn.className = 'btn btn-secondary';
        testApiBtn.textContent = '测试 API 连接';
        testApiBtn.style.marginTop = '10px';
        testApiBtn.addEventListener('click', () => {
            this.testAPIConnection();
        });
        
        const deeplxSection = document.querySelector('.config-group:first-child');
        const saveBtn = document.getElementById('saveDeeplxSettings');
        saveBtn.parentNode.insertBefore(testApiBtn, saveBtn.nextSibling);
        
        // 添加调试信息按钮
        const debugBtn = document.createElement('button');
        debugBtn.id = 'debugBtn';
        debugBtn.className = 'btn btn-secondary';
        debugBtn.textContent = '显示调试信息';
        debugBtn.style.marginTop = '10px';
        debugBtn.addEventListener('click', () => {
            this.showDebugInfo();
        });
        
        saveBtn.parentNode.insertBefore(debugBtn, testApiBtn.nextSibling);
    }
    
    populateLanguageOptions() {
        const select = document.getElementById('targetLang');
        select.innerHTML = '';
        
        const languages = [
            { code: 'ZH', name: '中文' },
            { code: 'EN', name: '英语' },
            { code: 'JA', name: '日语' },
            { code: 'KO', name: '韩语' },
            { code: 'FR', name: '法语' },
            { code: 'DE', name: '德语' },
            { code: 'ES', name: '西班牙语' },
            { code: 'IT', name: '意大利语' },
            { code: 'PT', name: '葡萄牙语' },
            { code: 'RU', name: '俄语' }
        ];
        
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            select.appendChild(option);
        });
    }
    
    loadSavedSettings() {
        const deeplxKey = localStorage.getItem(CONFIG.app.storageKeys.deeplxKey);
        const deeplxEndpoint = localStorage.getItem(CONFIG.app.storageKeys.deeplxEndpoint);
        if (deeplxKey) {
            document.getElementById('deeplxKey').value = deeplxKey;
        }
        if (deeplxEndpoint) {
            document.getElementById('deeplxEndpoint').value = deeplxEndpoint;
        }
        
        const githubToken = localStorage.getItem(CONFIG.app.storageKeys.githubToken);
        const githubUsername = localStorage.getItem(CONFIG.app.storageKeys.githubUsername);
        if (githubToken) {
            document.getElementById('githubToken').value = githubToken;
        }
        if (githubUsername) {
            document.getElementById('githubUsername').value = githubUsername;
        }
    }
    
    updateUI() {
        const hasContent = this.originalContent.length > 0;
        const hasTranslation = this.translatedContent.length > 0;
        const isConfigured = this.translator.isValid();
        
        document.getElementById('translateBtn').disabled = !hasContent || !isConfigured;
        document.getElementById('uploadToGithubBtn').disabled = !hasTranslation || !this.github.isValid();
        document.getElementById('downloadMarkdownBtn').disabled = !hasTranslation;
        document.getElementById('downloadHTMLBtn').disabled = !hasTranslation;
        document.getElementById('downloadPDFBtn').disabled = !hasTranslation;
        
        const deeplxStatus = document.getElementById('deeplxStatus');
        const githubStatus = document.getElementById('githubStatus');
        
        if (deeplxStatus) {
            deeplxStatus.className = isConfigured ? 'status configured' : 'status not-configured';
            const statusText = document.getElementById('deeplxStatusText');
            if (statusText) statusText.textContent = isConfigured ? '已配置' : '未配置';
        }
        
        if (githubStatus) {
            githubStatus.className = this.github.isValid() ? 'status configured' : 'status not-configured';
            const statusText = document.getElementById('githubStatusText');
            if (statusText) statusText.textContent = this.github.isValid() ? '已配置' : '未配置';
        }
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.size > CONFIG.app.maxFileSize * 1024 * 1024) {
            alert(`文件太大！最大支持 ${CONFIG.app.maxFileSize}MB`);
            return;
        }
        
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!CONFIG.app.supportedTypes.includes(ext)) {
            alert(`不支持的文件类型。支持：${CONFIG.app.supportedTypes.join(', ')}`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalContent = e.target.result;
            document.getElementById('textInput').value = this.originalContent;
            this.updateWordCount();
            this.updateUI();
        };
        reader.readAsText(file);
    }
    
    updateWordCount() {
        const words = this.originalContent.split(/\s+/).filter(w => w.length > 0).length;
        const chars = this.originalContent.length;
        const wordCount = document.getElementById('wordCount');
        if (wordCount) {
            wordCount.textContent = `${words} 词, ${chars} 字符`;
        }
    }
    
    saveDeeplxSettings() {
        const key = document.getElementById('deeplxKey').value.trim();
        let endpoint = document.getElementById('deeplxEndpoint').value.trim();
        
        if (!key) {
            alert('❌ 请输入 API Key\n\nAPI Key 是必需的认证信息。');
            return;
        }
        
        if (endpoint && endpoint.includes('{api_key}')) {
            // 保留模板格式
        } else if (!endpoint) {
            // 使用默认值
            endpoint = CONFIG.deeplx.defaultEndpoint;
        }
        
        this.translator.setApiKey(key);
        this.translator.setEndpoint(endpoint);
        
        this.updateUI();
        this.showMessage('✅ DeepL 设置已保存\n\n建议：点击"测试 API 连接"验证配置', 'success');
    }
    
    showDebugInfo() {
        const key = document.getElementById('deeplxKey').value.trim();
        let endpoint = document.getElementById('deeplxEndpoint').value.trim();
        
        if (!endpoint) {
            endpoint = CONFIG.deeplx.defaultEndpoint;
        }
        
        let finalUrl = endpoint;
        if (endpoint.includes('{api_key}')) {
            finalUrl = endpoint.replace('{api_key}', key);
        }
        
        const debugInfo = `
=== 调试信息 ===

API Key: ${key ? key.substring(0, 8) + '...' + key.substring(key.length - 4) : '(未设置)'}
API Key 长度: ${key.length} 字符

端点模板: ${endpoint}

最终 URL: ${finalUrl.replace(key, '***')}

建议:
1. 检查 API Key 是否完整复制
2. 确认没有多余的空格或换行符
3. 验证 API Key 是否有效
4. 打开浏览器控制台 (F12) 查看详细日志

==========
        `.trim();
        
        alert(debugInfo);
        console.log(debugInfo);
    }
    
    async testAPIConnection() {
        const key = document.getElementById('deeplxKey').value.trim();
        let endpoint = document.getElementById('deeplxEndpoint').value.trim();
        
        if (!key) {
            alert('❌ 请先输入 API Key');
            return;
        }
        
        if (!endpoint) {
            endpoint = CONFIG.deeplx.defaultEndpoint;
        }
        
        this.showMessage('⏳ 正在测试 API 连接...\n\n请查看浏览器控制台 (F12) 获取详细日志', 'info');
        
        // 配置 translator
        this.translator.setApiKey(key);
        this.translator.setEndpoint(endpoint);
        
        try {
            const response = await fetch(endpoint.includes('{api_key}') ? 
                endpoint.replace('{api_key}', key) : 
                endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: 'Hello',
                    source_lang: 'EN',
                    target_lang: 'ZH'
                })
            });
            
            console.log('Test Response Status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Test Response Data:', data);
                
                let translatedText = '';
                if (data.data) {
                    translatedText = data.data;
                } else if (data.translations && data.translations[0]) {
                    translatedText = data.translations[0].text;
                }
                
                this.showMessage(`✅ API 连接成功！\n\n测试翻译: "Hello" → "${translatedText}"\n\nAPI 配置正确，可以开始使用了！`, 'success');
            } else {
                const errorText = await response.text();
                console.error('Test Error Response:', errorText);
                
                let errorMsg = `❌ API 错误 (${response.status})\n\n`;
                
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson.message) {
                        errorMsg += `错误信息: ${errorJson.message}\n\n`;
                    }
                } catch (e) {
                    errorMsg += `错误详情: ${errorText.substring(0, 200)}\n\n`;
                }
                
                errorMsg += `可能的原因:\n`;
                errorMsg += `1. API Key 不正确或已过期\n`;
                errorMsg += `2. API Key 复制时不完整\n`;
                errorMsg += `3. API Key 包含多余的空格或换行符\n`;
                errorMsg += `4. API 服务暂时不可用\n\n`;
                errorMsg += `建议操作:\n`;
                errorMsg += `1. 重新复制 API Key，确保完整\n`;
                errorMsg += `2. 点击"显示调试信息"查看详情\n`;
                errorMsg += `3. 打开浏览器控制台 (F12) 查看详细日志`;
                
                this.showMessage(errorMsg, 'error');
            }
        } catch (error) {
            console.error('Test Connection Error:', error);
            this.showMessage(`❌ 连接失败\n\n错误: ${error.message}\n\n请检查:\n1. 网络连接\n2. API 端点地址\n3. 浏览器控制台 (F12)`, 'error');
        }
    }
    
    saveGithubSettings() {
        const token = document.getElementById('githubToken').value.trim();
        const username = document.getElementById('githubUsername').value.trim();
        
        if (!token || !username) {
            alert('请输入 GitHub Token 和用户名');
            return;
        }
        
        this.github.setToken(token);
        this.github.setUsername(username);
        
        this.updateUI();
        this.showMessage('✅ GitHub 设置已保存', 'success');
    }
    
    async startTranslation() {
        if (!this.translator.isValid()) {
            alert('请先配置 DeepL API Key');
            return;
        }
        
        if (!this.originalContent) {
            alert('请输入或上传要翻译的内容');
            return;
        }
        
        const targetLang = document.getElementById('targetLang').value;
        
        document.getElementById('translateBtn').disabled = true;
        const progressContainer = document.getElementById('progressContainer');
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
        
        try {
            this.translatedContent = await this.translator.translateMarkdown(
                this.originalContent,
                targetLang,
                (completed, total, current) => {
                    this.updateProgress(completed, total, current);
                }
            );
            
            const resultOutput = document.getElementById('resultOutput');
            const resultContainer = document.getElementById('resultContainer');
            
            if (resultOutput) {
                resultOutput.value = this.translatedContent;
            }
            if (resultContainer) {
                resultContainer.style.display = 'block';
            }
            
            this.updateUI();
            this.showMessage('✅ 翻译完成！', 'success');
        } catch (error) {
            console.error('Translation error:', error);
            this.showMessage(`❌ 翻译失败：${error.message}\n\n请查看浏览器控制台 (F12) 获取详细信息`, 'error');
        } finally {
            document.getElementById('translateBtn').disabled = false;
            if (progressContainer) {
                progressContainer.style.display = 'none';
            }
        }
    }
    
    updateProgress(completed, total, current) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const currentSegment = document.getElementById('currentSegment');
        
        if (progressBar) {
            const percentage = Math.round((completed / total) * 100);
            progressBar.style.width = percentage + '%';
        }
        
        if (progressText) {
            progressText.textContent = `翻译中... ${completed}/${total} (${Math.round((completed / total) * 100)}%)`;
        }
        
        if (currentSegment) {
            currentSegment.textContent = current.substring(0, 100) + '...';
        }
    }
    
    async uploadToGitHub() {
        if (!this.github.isValid()) {
            alert('请先配置 GitHub Token 和用户名');
            return;
        }
        
        if (!this.translatedContent) {
            alert('请先完成翻译');
            return;
        }
        
        const repoName = prompt('请输入新仓库名称：', 'translated-markdown');
        if (!repoName) return;
        
        const description = prompt('请输入仓库描述：', 'Translated Markdown Documents');
        
        try {
            const result = await this.github.createTranslationProject(
                repoName,
                this.originalContent,
                this.translatedContent,
                { description }
            );
            
            this.showMessage(`✅ 创建成功！\n\n仓库地址：${result.url}`, 'success');
            
            if (confirm('是否打开 GitHub 仓库？')) {
                window.open(result.url, '_blank');
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.showMessage(`❌ 上传失败：${error.message}`, 'error');
        }
    }
    
    clearAll() {
        if (!confirm('确定要清除所有内容吗？')) return;
        
        this.originalContent = '';
        this.translatedContent = '';
        
        document.getElementById('textInput').value = '';
        const resultOutput = document.getElementById('resultOutput');
        if (resultOutput) {
            resultOutput.value = '';
        }
        document.getElementById('fileInput').value = '';
        
        const resultContainer = document.getElementById('resultContainer');
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }
        
        this.updateWordCount();
        this.updateUI();
    }
    
    showMessage(message, type = 'info') {
        const messageBox = document.getElementById('messageBox');
        if (messageBox) {
            messageBox.innerHTML = message.replace(/\n/g, '<br>');
            messageBox.className = `message-box ${type}`;
            messageBox.style.display = 'block';
            
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 10000);
        } else {
            alert(message);
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MarkdownTranslatorApp();
});
