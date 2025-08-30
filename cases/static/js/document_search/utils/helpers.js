/**
 * 工具函数模块
 * 包含各种辅助函数
 */

// 生成密级徽章
function getSecurityBadge(level) {
    const classMap = {
        '公开': 'security-public',
        '内部': 'security-internal',
        '秘密': 'security-secret',
        '机密': 'security-confidential',
        '绝密': 'security-top-secret'
    };
    return `<span class="badge security-level ${classMap[level] || 'security-public'}">${level}</span>`;
}

// 高亮搜索关键词
function highlightKeywords(text, keywords) {
    if (!keywords || keywords.length === 0) return text;
    
    let highlightedText = text;
    keywords.forEach(keyword => {
        if (keyword.trim()) {
            const regex = new RegExp(`(${keyword.trim()})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark class="highlight">$1</mark>');
        }
    });
    return highlightedText;
}

// 提取包含关键词的正文预览行
function extractContentPreview(content, keywords) {
    if (!content || !keywords || keywords.length === 0) return [];
    
    const lines = content.split('\n');
    const previewLines = [];
    const maxLines = 3; // 最多显示3行预览
    const maxLineLength = 100; // 每行最大长度
    
    for (let i = 0; i < lines.length && previewLines.length < maxLines; i++) {
        const line = lines[i].trim();
        if (line.length === 0) continue;
        
        // 检查这一行是否包含任何关键词
        const hasKeyword = keywords.some(keyword => 
            keyword.trim() && line.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (hasKeyword) {
            // 高亮这一行中的关键词
            let highlightedLine = highlightKeywords(line, keywords);
            
            // 如果行太长，截断并添加省略号
            if (highlightedLine.length > maxLineLength) {
                // 找到第一个关键词的位置
                let firstKeywordPos = -1;
                for (const keyword of keywords) {
                    if (keyword.trim()) {
                        const pos = line.toLowerCase().indexOf(keyword.toLowerCase());
                        if (pos !== -1 && (firstKeywordPos === -1 || pos < firstKeywordPos)) {
                            firstKeywordPos = pos;
                        }
                    }
                }
                
                if (firstKeywordPos !== -1) {
                    // 以关键词为中心截取
                    const start = Math.max(0, firstKeywordPos - 30);
                    const end = Math.min(line.length, firstKeywordPos + 70);
                    highlightedLine = highlightKeywords(line.substring(start, end), keywords);
                    if (start > 0) highlightedLine = '...' + highlightedLine;
                    if (end < line.length) highlightedLine = highlightedLine + '...';
                } else {
                    highlightedLine = highlightedLine.substring(0, maxLineLength) + '...';
                }
            }
            
            previewLines.push(highlightedLine);
        }
    }
    
    return previewLines;
}

// 检查标签组件是否已存在
function isTagsComponentExists(id) {
    if (typeof tagsDropdownManager !== 'undefined' && tagsDropdownManager.components) {
        return tagsDropdownManager.components.has(id);
    }
    return false;
}

// 清除保密时间
function clearSecurityPeriod() {
    document.getElementById('securityPeriod').value = '';
}

// 清除更新表单的保密时间
function clearUpdateSecurityPeriod() {
    document.getElementById('updateSecurityPeriod').value = '';
}
