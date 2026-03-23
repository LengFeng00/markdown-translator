// 配置文件
const CONFIG = {
    // DeepLX API 配置
    deeplx: {
        // 默认端点（deeplx.org 格式）
        // 占位符 {api_key} 会被替换为实际的 API Key
        defaultEndpoint: 'https://api.deeplx.org/{api_key}/translate',
        
        // 官方 DeepL API 端点
        // 'https://api-deepl.com/v2/translate',
        
        // DeepLX 开源版
        // 'http://localhost:1188/translate',
        
        // 支持的语言代码
        languages: {
            'ZH': 'Chinese',
            'EN': 'English',
            'EN-US': 'English (American)',
            'EN-GB': 'English (British)',
            'JA': 'Japanese',
            'KO': 'Korean',
            'FR': 'French',
            'DE': 'German',
            'ES': 'Spanish',
            'IT': 'Italian',
            'PT-BR': 'Portuguese (Brazilian)',
            'PT-PT': 'Portuguese (European)',
            'RU': 'Russian'
        }
    },
    
    // GitHub API 配置
    github: {
        apiEndpoint: 'https://api.github.com'
    },
    
    // 应用配置
    app: {
        name: 'Markdown Translator',
        version: '1.1.0',
        // 文件大小限制（MB）
        maxFileSize: 10,
        // 支持的文件类型
        supportedTypes: ['.md', '.markdown', '.txt'],
        // 本地存储 key
        storageKeys: {
            deeplxKey: 'deeplx_api_key',
            deeplxEndpoint: 'deeplx_endpoint',
            githubToken: 'github_token',
            githubUsername: 'github_username'
        }
    }
};
