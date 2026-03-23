// 下载功能模块
class FileDownloader {
    // 下载为 Markdown 文件
    downloadMarkdown(content, filename = 'translated.md') {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        this.downloadBlob(blob, filename);
    }
    
    // 下载为 HTML 文件
    downloadHTML(markdownContent, filename = 'translated.html') {
        // 简单的 Markdown 转 HTML
        const html = this.markdownToHTML(markdownContent);
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        this.downloadBlob(blob, filename);
    }
    
    // 下载为 PDF（使用浏览器打印功能）
    downloadPDF(markdownContent, filename = 'translated.pdf') {
        // 创建新窗口并打印
        const html = this.markdownToHTML(markdownContent);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
        
        // 等待内容加载后打印
        setTimeout(() => {
            printWindow.print();
        }, 250);
        
        // 提示用户保存为 PDF
        alert('请在打印对话框中选择"保存为 PDF"');
    }
    
    // 下载所有内容（打包）
    downloadPackage(originalContent, translatedContent, metadata = {}) {
        // 创建一个包含所有文件的对象
        const files = {
            'README-original.md': originalContent,
            'README-translated.md': translatedContent,
            'metadata.json': JSON.stringify(metadata, null, 2)
        };
        
        // 逐个下载文件
        Object.entries(files).forEach(([filename, content]) => {
            this.downloadMarkdown(content, filename);
        });
    }
    
    // 通用下载方法
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // 简单的 Markdown 转 HTML
    markdownToHTML(markdown) {
        let html = markdown;
        
        // 标题
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        
        // 粗体和斜体
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
        
        // 代码块
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>');
        html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
        
        // 链接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>');
        
        // 列表
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        
        // 段落
        html = html.replace(/\n\n/g, '</p><p>');
        
        // 完整的 HTML 模板
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Translated Document</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        h1, h2, h3, h4 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
        }
        pre {
            background-color: #f6f8fa;
            padding: 16px;
            overflow: auto;
            border-radius: 6px;
        }
        code {
            background-color: #f6f8fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
        }
        a {
            color: #0969da;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        @media print {
            body {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <p>${html}</p>
</body>
</html>`;
    }
}

// 导出到全局
window.FileDownloader = FileDownloader;
