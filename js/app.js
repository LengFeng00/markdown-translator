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
        // 文件上传
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });
        
        // 文本输入
        document.getElementById('textInput').addEventListener('input', (e) => {
            this.originalContent = e.target.value;
            this.updateWordCount();
        });
        
        // DeepLX 设置
        document.getElementById('saveDeeplxSettings').addEventListener('click', () => {
            this.saveDeeplxSettings();
        });
        
        // GitHub 设置
        document.getElementById('saveGithubSettings').addEventListener('click', () => {
            this.saveGithubSettings();
        });
        
        // 翻译按钮
        document.getElementById('translateBtn').addEventListener('click', () => {
            this.startTranslation();
        });
        
        // 上传到 GitHub 按钮
        document.getElementById('uploadToGithubBtn').addEventListener('click', () => {
            this.uploadToGitHub();
        });
        
        // 下载按钮
        document.getElementById('downloadMarkdownBtn').addEventListener('click', () => {
            this.downloader.downloadMarkdown(this.translatedContent);
        });
        
        document.getElementById('downloadHTMLBtn').addEventListener('click', () => {
            this.downloader.downloadHTML(this.translatedContent);
        });
        
        document.getElementById('downloadPDFBtn').addEventListener('click', () => {
            this.downloader.downloadPDF(this.translatedContent);
        });
        
        // 清除按钮
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearAll();
        });
        
        // 测试 API 连接按钮（新增）
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
    }
    
    populateLanguageOptions() {
        const select = document.getElementById('targetLang');
        select.innerHTML = '';
        
        const languages = [
            { code: 'ZH', name: '中文 (Chinese)' },
            { code: 'EN-US', name: '英语 - 美式 (English - US)' },
            { code: 'EN-GB', name: '英语 - 英式 (English - UK)' },
            { code: 'JA', name: '日语 (Japanese)' },
            { code: 'KO', name: '韩语 (Korean)' },
            { code: 'FR', name: '法语 (French)' },
            { code: 'DE', name: '德语 (German)' },
            { code: 'ES', name: '西班牙语 (Spanish)' },
            { code: 'IT', name: '意大利语 (Italian)' },
            { code: 'PT-BR', name: '葡萄牙语 - 巴西 (Portuguese - Brazilian)' },
            { code: 'PT-PT', name: '葡萄牙语 - 欧洲 (Portuguese - European)' },
            { code: 'RU', name: '俄语 (Russian)' }
        ];
        
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            select.appendChild(option);
        });
    }
    
    loadSavedSettings() {
        // DeepLX 设置
        const deeplxKey = localStorage.getItem(CONFIG.app.storageKeys.deeplxKey);
        const deeplxEndpoint = localStorage.getItem(CONFIG.app.storageKeys.deeplxEndpoint);
        if (deeplxKey) {
            document.getElementById('deeplxKey').value = deeplxKey;
        }
        if (deeplxEndpoint) {
            document.getElementById('deeplxEndpoint').value = deeplxEndpoint;
        }
        
        // GitHub 设置
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
        // 更新按钮状态
        const hasContent = this.originalContent.length > 0;
        const hasTranslation = this.translatedContent.length > 0;
        const isConfigured = this.translator.isValid();
        
        document.getElementById('translateBtn').disabled = !hasContent || !isConfigured;
        document.getElementById('uploadToGithubBtn').disabled = !hasTranslation || !this.github.isValid();
        document.getElementById('downloadMarkdownBtn').disabled = !hasTranslation;
        document.getElementById('downloadHTMLBtn').disabled = !hasTranslation;
        document.getElementById('downloadPDFBtn').disabled = !hasTranslation;
        
        // 更新状态指示器
        const deeplxStatus = document.getElementById('deeplxStatus');
        const githubStatus = document.getElementById('githubStatus');
        
        if (deeplxStatus) {
            deeplxStatus.className = isConfigured ? 'status configured' : 'status not-configured';
            document.getElementById('deeplxStatusText').textContent = isConfigured ? '已配置' : '未配置';
        }
        
        if (githubStatus) {
            githubStatus.className = this.github.isValid() ? 'status configured' : 'status not-configured';
            document.getElementById('githubStatusText').textContent = this.github.isValid() ? '已配置' : '未配置';
        }
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // 检查文件大小
        if (file.size > CONFIG.app.maxFileSize * 1024 * 1024) {
            alert(`文件太大！最大支持 ${CONFIG.app.maxFileSize}MB`);
            return;
        }
        
        // 检查文件类型
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
            alert('请输入 DeepL API Key');
            return;
        }
        
        // 如果端点为空，使用默认值
        if (!endpoint) {
            endpoint = CONFIG.deeplx.defaultEndpoint;
        }
        
        this.translator.setApiKey(key);
        this.translator.setEndpoint(endpoint);
        
        this.updateUI();
        this.showMessage('DeepL 设置已保存', 'success');
    }
    
    async testAPIConnection() {
        const key = document.getElementById('deeplxKey').value.trim();
        let endpoint = document.getElementById('deeplxEndpoint').value.trim();
        
        if (!key) {
            alert('请先输入 DeepL API Key');
            return;
        }
        
        if (!endpoint) {
            endpoint = CONFIG.deeplx.defaultEndpoint;
        }
        
        this.showMessage('正在测试 API 连接...', 'info');
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `DeepL-Auth-Key ${key}`
                },
                body: JSON.stringify({
                    text: 'Hello',
                    target_lang: 'ZH'
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.translations && data.translations[0]) {
                    const translatedText = data.translations[0].text;
                    this.showMessage(`✅ API 连接成功！测试翻译: "Hello" → "${translatedText}"`, 'success');
                } else {
                    this.showMessage('❌ API 响应格式错误', 'error');
                }
            } else {
                const errorText = await response.text();
                this.showMessage(`❌ API 错误 (${response.status}): ${errorText}`, 'error');
            }
        } catch (error) {
            this.showMessage(`❌ 连接失败: ${error.message}`, 'error');
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
        this.showMessage('GitHub 设置已保存', 'success');
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
        
        // 禁用按钮
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
            
            // 显示结果
            const resultOutput = document.getElementById('resultOutput');
            const resultContainer = document.getElementById('resultContainer');
            
            if (resultOutput) {
                resultOutput.value = this.translatedContent;
            }
            if (resultContainer) {
                resultContainer.style.display = 'block';
            }
            
            this.updateUI();
            this.showMessage('翻译完成！', 'success');
        } catch (error) {
            console.error('Translation error:', error);
            this.showMessage(`翻译失败：${error.message}`, 'error');
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
            
            this.showMessage(`创建成功！仓库地址：${result.url}`, 'success');
            
            if (confirm('是否打开 GitHub 仓库？')) {
                window.open(result.url, '_blank');
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.showMessage(`上传失败：${error.message}`, 'error');
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
            messageBox.textContent = message;
            messageBox.className = `message-box ${type}`;
            messageBox.style.display = 'block';
            
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MarkdownTranslatorApp();
});
