// DeepLX 翻译模块
class MarkdownTranslator {
    constructor() {
        this.apiKey = localStorage.getItem(CONFIG.app.storageKeys.deeplxKey) || '';
        this.endpoint = localStorage.getItem(CONFIG.app.storageKeys.deeplxEndpoint) || CONFIG.deeplx.defaultEndpoint;
    }
    
    // 设置 API Key
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem(CONFIG.app.storageKeys.deeplxKey, key);
    }
    
    // 设置 API 端点
    setEndpoint(endpoint) {
        this.endpoint = endpoint;
        localStorage.setItem(CONFIG.app.storageKeys.deeplxEndpoint, endpoint);
    }
    
    // 验证配置
    isValid() {
        return this.apiKey.length > 0;
    }
    
    // 解析 Markdown 为段落
    parseMarkdown(text) {
        // 将 Markdown 分割为可翻译的段落
        const lines = text.split('\n');
        const paragraphs = [];
        let currentParagraph = [];
        let inCodeBlock = false;
        let codeBlockLang = '';
        
        for (let line of lines) {
            // 检测代码块
            if (line.startsWith('```')) {
                if (inCodeBlock) {
                    // 代码块结束
                    currentParagraph.push(line);
                    paragraphs.push({
                        type: 'code',
                        content: currentParagraph.join('\n'),
                        translatable: false
                    });
                    currentParagraph = [];
                    inCodeBlock = false;
                } else {
                    // 代码块开始
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
            
            // 检测标题（不翻译）
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
            
            // 检测列表项
            if (line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim())) {
                if (currentParagraph.length > 0 && !currentParagraph[currentParagraph.length - 1].trim().startsWith('-')) {
                    paragraphs.push({
                        type: 'text',
                        content: currentParagraph.join('\n'),
                        translatable: true
                    });
                    currentParagraph = [];
                }
                currentParagraph.push(line);
                continue;
            }
            
            // 空行
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
        
        // 处理最后一个段落
        if (currentParagraph.length > 0) {
            paragraphs.push({
                type: 'text',
                content: currentParagraph.join('\n'),
                translatable: true
            });
        }
        
        return paragraphs;
    }
    
    // 翻译单个文本
    async translateText(text, targetLang = 'ZH') {
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
                throw new Error(`DeepLX API Error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.translations[0].text;
        } catch (error) {
            console.error('Translation error:', error);
            throw error;
        }
    }
    
    // 批量翻译 Markdown
    async translateMarkdown(markdown, targetLang = 'ZH', onProgress = null) {
        const paragraphs = this.parseMarkdown(markdown);
        const translatedParagraphs = [];
        
        let completed = 0;
        const total = paragraphs.filter(p => p.translatable).length;
        
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
                
                // 添加延迟以避免 API 限流
                await this.delay(300);
            } catch (error) {
                // 翻译失败时保留原文
                console.error('Failed to translate paragraph:', error);
                translatedParagraphs.push(paragraph.content);
                completed++;
            }
        }
        
        return translatedParagraphs.join('\n');
    }
    
    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 导出到全局
window.MarkdownTranslator = MarkdownTranslator;
