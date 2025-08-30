/**
 * 预览管理模块
 * 负责文档预览、打印等功能
 */

// 显示文档预览
function showDocumentPreview(docId) {
    // 从全局变量获取文档数据库
    const documentDatabase = window.documentDatabase || {};
    
    // 获取文档详情
    const doc = documentDatabase[docId];
    if (!doc) {
        alert('文档不存在');
        return;
    }
    
    // 更新预览内容
    document.getElementById('previewTitle').textContent = doc.fileName;
    
    const highlightedContent = highlightKeywords(doc.content, currentSearchKeywords);
    
    document.getElementById('previewContent').innerHTML = `
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">文件信息</h6>
                <button class="btn btn-outline-warning btn-sm" onclick="openUpdateDocumentModal(${docId})">
                    <i class="bi bi-pencil-square me-1"></i>文件信息更新
                </button>
            </div>
            <div class="row g-2 mb-2">
                <div class="col-6"><strong>文件名:</strong> ${doc.fileName}</div>
                <div class="col-6"><strong>密级:</strong> ${getSecurityBadge(doc.securityLevel)}</div>
                <div class="col-6"><strong>保密时间:</strong> ${doc.securityPeriod ? doc.securityPeriod + '年' : '无保密期限'}</div>
                <div class="col-6"><strong>签发单位:</strong> ${doc.issueUnit || '未填写'}</div>
                <div class="col-6"><strong>发布时间:</strong> ${doc.publishDate}</div>
                <div class="col-6"><strong>效力状态:</strong> <span class="badge bg-${doc.effectStatus === '有效' ? 'success' : doc.effectStatus === '失效' ? 'danger' : 'warning'}">${doc.effectStatus}</span></div>
                <div class="col-6"><strong>有效开始时间:</strong> ${doc.effectiveStartDate || '未填写'}</div>
                <div class="col-6"><strong>有效终了时间:</strong> ${doc.effectiveEndDate || '未填写'}</div>
                <div class="col-6"><strong>文件编号:</strong> ${doc.fileNumber || '未填写'}</div>
                <div class="col-6"><strong>标签:</strong> ${doc.tags || '无标签'}</div>
            </div>
            ${doc.revisionHistory ? `<div class="row g-2 mb-2"><div class="col-12"><strong>历史修订信息:</strong> ${getRevisionHistoryDisplay(doc.revisionHistory)}</div></div>` : ''}
            ${doc.remarks ? `<div class="row g-2 mb-2"><div class="col-12"><strong>备注:</strong> ${doc.remarks}</div></div>` : ''}
        </div>
        <div class="mb-3">
            <h6>文件内容</h6>
            <div class="border p-3 bg-light preview-content">
                ${highlightedContent}
            </div>
        </div>
        <div class="d-flex gap-2">
            <button class="btn btn-outline-success btn-sm">
                <i class="bi bi-download me-1"></i>下载文件
            </button>
        </div>
    `;
    
    // 显示预览区域
    document.getElementById('contentPreview').classList.add('show');
    document.getElementById('mainContent').classList.add('main-content-with-preview');
    
    // 更新选中状态
    document.querySelectorAll('.document-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-doc-id="${docId}"]`).classList.add('active');
}

// 复制内容
function copyContent() {
    const content = document.querySelector('#previewContent .border').textContent;
    navigator.clipboard.writeText(content).then(() => {
        // 显示成功提示
        const toast = document.createElement('div');
        toast.className = 'position-fixed top-0 end-0 p-3';
        toast.style.zIndex = '9999';
        toast.innerHTML = `
            <div class="toast show" role="alert">
                <div class="toast-header">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    <strong class="me-auto">成功</strong>
                    <button type="button" class="btn-close" onclick="this.closest('.toast').remove()"></button>
                </div>
                <div class="toast-body">
                    文件内容已复制到剪贴板
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }).catch(() => {
        alert('复制失败，请手动选择内容复制');
    });
}

// 打印内容
function printContent() {
    const printWindow = window.open('', '_blank');
    const content = document.querySelector('#previewContent').innerHTML;
    const title = document.getElementById('previewTitle').textContent;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                body { font-family: 'Microsoft YaHei', sans-serif; line-height: 1.6; }
                .border { border: 1px solid #ccc; padding: 15px; margin: 10px 0; }
                .badge { padding: 5px 10px; border-radius: 4px; color: white; }
                .bg-success { background-color: #28a745; }
                .bg-danger { background-color: #dc3545; }
                .bg-warning { background-color: #ffc107; color: #212529; }
                @media print {
                    .btn { display: none; }
                }
            </style>
        </head>
        <body>
            <h2>${title}</h2>
            ${content}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// 关闭预览
function closePreview() {
    document.getElementById('contentPreview').classList.remove('show');
    document.getElementById('mainContent').classList.remove('main-content-with-preview');
    document.querySelectorAll('.document-item').forEach(item => {
        item.classList.remove('active');
    });
}
