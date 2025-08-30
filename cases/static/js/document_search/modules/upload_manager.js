/**
 * 上传管理模块
 * 负责文件上传相关功能
 */

// 文件上传处理
function handleFileUpload(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('uploadFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('请选择文件');
        return;
    }
    
    // 从全局变量获取配置
    const config = window.documentConfig || {};
    const maxFileSize = config.maxFileSize || 50;
    const allowedTypes = config.fileTypes || ['.doc', '.docx', '.pdf'];
    
    // 检查文件大小
    if (file.size > maxFileSize * 1024 * 1024) {
        alert(`文件大小不能超过${maxFileSize}MB`);
        return;
    }
    
    // 检查文件类型
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
        alert('只支持Word文档(.doc, .docx)和PDF文档(.pdf)');
        return;
    }
    
    // 显示进度条
    document.getElementById('uploadProgress').classList.remove('hidden');
    document.getElementById('uploadResult').classList.add('hidden');
    document.getElementById('uploadBtn').disabled = true;
    document.getElementById('uploadBtn').innerHTML = '<i class="bi bi-hourglass-split me-1"></i>上传中...';
    
    // 模拟上传过程
    setTimeout(() => {
        document.getElementById('uploadProgress').classList.add('hidden');
        document.getElementById('uploadBtn').disabled = false;
        document.getElementById('uploadBtn').innerHTML = '<i class="bi bi-upload me-1"></i>上传法规文件';
        
        document.getElementById('uploadResult').classList.remove('hidden');
        document.getElementById('resultContent').innerHTML = `
            <div class="alert alert-success">
                <i class="bi bi-check-circle me-2"></i>
                <strong>上传成功!</strong> 法规文件已成功上传并处理完成。
            </div>
        `;
        
        // 清空表单
        document.getElementById('uploadForm').reset();
    }, 2000);
}
