// GitHub API 集成模块
class GitHubUploader {
    constructor() {
        this.token = localStorage.getItem(CONFIG.app.storageKeys.githubToken) || '';
        this.username = localStorage.getItem(CONFIG.app.storageKeys.githubUsername) || '';
    }
    
    // 设置访问令牌
    setToken(token) {
        this.token = token;
        localStorage.setItem(CONFIG.app.storageKeys.githubToken, token);
    }
    
    // 设置用户名
    setUsername(username) {
        this.username = username;
        localStorage.setItem(CONFIG.app.storageKeys.githubUsername, username);
    }
    
    // 验证配置
    isValid() {
        return this.token.length > 0 && this.username.length > 0;
    }
    
    // 获取用户信息
    async getUserInfo() {
        try {
            const response = await fetch(`${CONFIG.github.apiEndpoint}/user`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Invalid GitHub token');
            }
            
            return await response.json();
        } catch (error) {
            console.error('GitHub API Error:', error);
            throw error;
        }
    }
    
    // 创建新仓库
    async createRepository(repoName, description = '', isPrivate = false) {
        try {
            const response = await fetch(`${CONFIG.github.apiEndpoint}/user/repos`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    name: repoName,
                    description: description,
                    private: isPrivate,
                    auto_init: true
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create repository');
            }
            
            return await response.json();
        } catch (error) {
            console.error('GitHub API Error:', error);
            throw error;
        }
    }
    
    // 上传文件到仓库
    async uploadFile(username, repoName, filePath, content, commitMessage = 'Upload translated markdown') {
        try {
            // 先检查文件是否存在
            const checkResponse = await fetch(
                `${CONFIG.github.apiEndpoint}/repos/${username}/${repoName}/contents/${filePath}`,
                {
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );
            
            let sha = null;
            if (checkResponse.ok) {
                const data = await checkResponse.json();
                sha = data.sha;
            }
            
            // 上传文件
            const response = await fetch(
                `${CONFIG.github.apiEndpoint}/repos/${username}/${repoName}/contents/${filePath}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify({
                        message: commitMessage,
                        content: btoa(unescape(encodeURIComponent(content))),
                        sha: sha
                    })
                }
            );
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to upload file');
            }
            
            return await response.json();
        } catch (error) {
            console.error('GitHub API Error:', error);
            throw error;
        }
    }
    
    // 创建完整的翻译项目
    async createTranslationProject(repoName, originalContent, translatedContent, options = {}) {
        const {
            description = 'Translated Markdown Documents',
            isPrivate = false,
            originalFileName = 'README-original.md',
            translatedFileName = 'README.md'
        } = options;
        
        try {
            // 1. 创建仓库
            console.log('Creating repository...');
            const repo = await this.createRepository(repoName, description, isPrivate);
            
            // 2. 上传原始文件
            console.log('Uploading original file...');
            await this.uploadFile(
                repo.owner.login,
                repo.name,
                originalFileName,
                originalContent,
                'Add original markdown file'
            );
            
            // 3. 上传翻译文件
            console.log('Uploading translated file...');
            await this.uploadFile(
                repo.owner.login,
                repo.name,
                translatedFileName,
                translatedContent,
                'Add translated markdown file'
            );
            
            return {
                success: true,
                repository: repo,
                url: repo.html_url
            };
        } catch (error) {
            console.error('Failed to create translation project:', error);
            throw error;
        }
    }
    
    // 清除保存的凭证
    clearCredentials() {
        this.token = '';
        this.username = '';
        localStorage.removeItem(CONFIG.app.storageKeys.githubToken);
        localStorage.removeItem(CONFIG.app.storageKeys.githubUsername);
    }
}

// 导出到全局
window.GitHubUploader = GitHubUploader;
