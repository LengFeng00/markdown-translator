// 配置文件
const CONFIG = {
    // DeepLX API 配置
    deeplx: {
        // 官方 DeepL API 端点（免费和付费版本）
        defaultEndpoint: 'https://api-deepl.com/v2/translate',
        
        // 备用端点（如果上面的不可用）
        // 'https://api-free.deepl.com/v2/translate'  // 免费版专用
        
        // DeepLX 开源版（如果你自己部署）
        // 'http://localhost:1188/translate',
        
        // 支持的语言代码
        languages: {
            'ZH': 'Chinese',
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
        },
        
        // DeepL 支持的语言
        supportedTargetLangs: [
            'ZH', 'EN-US', 'EN-GB', 'JA', 'KO', 'FR', 'DE', 
            'ES', 'IT', 'PT-BR', 'PT-PT', 'RU'
        ]
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
        version: '1.0.1',
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
