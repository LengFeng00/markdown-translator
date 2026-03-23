// DeepLX 翻译模块 - 支持官方 API 和 DeepLX 开源版
class MarkdownTranslator {
    constructor() {
        this.apiKey = localStorage.getItem(CONFIG.app.storageKeys.deeplxKey) || '';
        this.endpoint = localStorage.getItem(CONFIG.app.storageKeys.deeplxEndpoint) || CONFIG.deeplx.defaultEndpoint;
        this.apiType = this.detectAPIType();
    }
    
    // 自动检测 API 类型
    detectAPIType() {
        if (this.endpoint.includes('api.deepl.com') || this.endpoint.includes('api-deepl.com')) {
            return 'official';
        } else {
            return 'deeplx';
        }
    }
    
    // 设置 API Key
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem(CONFIG.app.storageKeys.deeplxKey, key);
        this.apiType = this.detectAPIType();
    }
    
    // 设置 API 端点
    setEndpoint(endpoint) {
        this.endpoint = endpoint;
        localStorage.setItem(CONFIG.app.storageKeys.deeplxEndpoint, endpoint);
        this.apiType = this.detectAPIType();
    }
    
    // 验证配置
    isValid() {
        return this.apiKey.length > 0 && this.endpoint.length > 0;
    }
    
    // 解析 Markdown 为段落
    parseMarkdown(text) {
        const lines = text.split('\n');
        const paragraphs = [];
        let currentParagraph = [];
        let inCodeBlock = false;
        
        for (let line of lines) {
            if (line.startsWith('```')) {
                if (inCodeBlock) {
                    currentParagraph.push(line);
                    paragraphs.push({
                        type: 'code',
                        content: currentParagraph.join('\n'),
                        translatable: false
                    });
                    currentParagraph = [];
                    inCodeBlock = false;
                } else {
                    if (currentParagraph.length > 0) {
                        paragraphs.push({
                            type: 'text',
                            content: currentParagraph.join('\n'),
                            translatable: true
                        });
                        currentParagraph = [];
                    }
                    inCodeBlock = true;
                    currentParagraph.push(line);
                }
                continue;
            }
            
            if (inCodeBlock) {
                currentParagraph.push(line);
                continue;
            }
            
            if (line.startsWith('#')) {
                if (currentParagraph.length > 0) {
                    paragraphs.push({
                        type: 'text',
                        content: currentParagraph.join('\n'),
                        translatable: true
                    });
                    currentParagraph = [];
                }
                paragraphs.push({
                    type: 'heading',
                    content: line,
                    translatable: false
                });
                continue;
            }
            
            if (line.trim() === '') {
                if (currentParagraph.length > 0) {
                    paragraphs.push({
                        type: 'text',
                        content: currentParagraph.join('\n'),
                        translatable: true
                    });
                    currentParagraph = [];
                }
                paragraphs.push({
                    type: 'empty',
                    content: '',
                    translatable: false
                });
                continue;
            }
            
            currentParagraph.push(line);
        }
        
        if (currentParagraph.length > 0) {
            paragraphs.push({
                type: 'text',
                content: currentParagraph.join('\n'),
                translatable: true
            });
        }
        
        return paragraphs;
    }
    
    // 翻译单个文本 - 官方 DeepL API
    async translateTextOfficial(text, targetLang = 'ZH') {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `DeepL-Auth-Key ${this.apiKey}`
                },
                body: JSON.stringify({
                    text: text,
                    target_lang: targetLang
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`DeepL API Error ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            return data.translations[0].text;
        } catch (error) {
            console.error('Official API translation error:', error);
            throw error;
        }
    }
    
    // 翻译单个文本 - DeepLX 开源版
    async translateTextDeepLX(text, targetLang = 'ZH') {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    source_lang: 'EN',  // DeepLX 会自动检测
                    target_lang: targetLang,
                    auth_key: this.apiKey
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`DeepLX API Error ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            
            // DeepLX 可能的响应格式
            if (data.data) {
                return data.data;
            } else if (data.translations && data.translations[0]) {
                return data.translations[0].text;
            } else if (typeof data === 'string') {
                return data;
            } else {
                throw new Error('Unknown response format: ' + JSON.stringify(data));
            }
        } catch (error) {
            console.error('DeepLX translation error:', error);
            throw error;
        }
    }
    
    // 统一的翻译接口
    async translateText(text, targetLang = 'ZH') {
        if (this.apiType === 'official') {
            return await this.translateTextOfficial(text, targetLang);
        } else {
            return await this.translateTextDeepLX(text, targetLang);
        }
    }
    
    // 批量翻译 Markdown
    async translateMarkdown(markdown, targetLang = 'ZH', onProgress = null) {
        const paragraphs = this.parseMarkdown(markdown);
        const translatedParagraphs = [];
        
        let completed = 0;
        const total = paragraphs.filter(p => p.translatable).length;
        
        console.log(`API Type: ${this.apiType}`);
        console.log(`Endpoint: ${this.endpoint}`);
        console.log(`Total paragraphs to translate: ${total}`);
        
        for (let paragraph of paragraphs) {
            if (!paragraph.translatable) {
                translatedParagraphs.push(paragraph.content);
                continue;
            }
            
            try {
                const translated = await this.translateText(paragraph.content, targetLang);
                translatedParagraphs.push(translated);
                
                completed++;
                if (onProgress) {
                    onProgress(completed, total, paragraph.content);
                }
                
                await this.delay(300);
            } catch (error) {
                console.error('Failed to translate paragraph:', error);
                translatedParagraphs.push(paragraph.content);
                completed++;
                
                if (onProgress) {
                    onProgress(completed, total, `Error: ${error.message}`);
                }
            }
        }
        
        return translatedParagraphs.join('\n');
    }
    
    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 测试 API 连接
    async testConnection() {
        try {
            const testText = 'Hello';
            const result = await this.translateText(testText, 'ZH');
            console.log('API test successful:', result);
            return true;
        } catch (error) {
            console.error('API test failed:', error);
            return false;
        }
    }
}

// 导出到全局
window.MarkdownTranslator = MarkdownTranslator;
