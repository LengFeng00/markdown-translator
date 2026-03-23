// 配置文件
const CONFIG = {
    // DeepLX API 配置
    deeplx: {
        // 默认 API 端点（用户可以修改）
        defaultEndpoint: 'https://api.deepl.com/v2/translate',
        // 或者使用本地 DeepLX 服务器
        // defaultEndpoint: 'http://localhost:1188/translate',
        
        // 支持的语言
        languages: {
            'ZH': 'Chinese',
            'EN': 'English',
            'JA': 'Japanese',
            'KO': 'Korean',
            'FR': 'French',
            'DE': 'German',
            'ES': 'Spanish',
            'IT': 'Italian',
            'PT': 'Portuguese',
            'RU': 'Russian'
        }
    },
    
    // GitHub API 配置
    github: {
        apiEndpoint: 'https://api.github.com',
        // OAuth App 配置（需要申请）
        // clientId: 'your_client_id',
        // redirectUri: window.location.origin + '/callback.html'
    },
    
    // 应用配置
    app: {
        name: 'Markdown Translator',
        version: '1.0.0',
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
