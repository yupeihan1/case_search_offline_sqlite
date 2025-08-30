/**
 * 文档管理模块
 * 负责文档的加载、排序、分页等功能
 */

// 加载全部法规
function loadAllDocuments() {
    // 从全局变量获取文档数据库
    const documentDatabase = window.documentDatabase || {};
    
    // 存储所有文档数据
    allDocuments = Object.values(documentDatabase);
    
    // 初始化全局分页器
    initPagination();
    
    // 渲染文档列表
    renderDocumentsList();
}

// 排序文档
function sortDocuments(field) {
    if (currentSortField === field) {
        // 如果点击的是当前排序字段，则切换排序顺序
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        // 如果是新的排序字段，设置为升序
        currentSortField = field;
        currentSortOrder = 'asc';
    }
    
    // 更新排序按钮状态
    updateSortButtonStates();
    
    // 重置分页器到第一页并重新渲染列表
    if (documentPagination) {
        documentPagination.changePage(1);
    }
    renderDocumentsList();
}

// 更新排序按钮状态
function updateSortButtonStates() {
    // 移除所有按钮的active状态
    document.querySelectorAll('input[name="sortOptions"]').forEach(radio => {
        radio.checked = false;
    });
    
    // 根据当前排序字段设置对应按钮为选中状态
    const sortFieldMap = {
        'publishDate': 'sortDate',
        'fileName': 'sortName'
    };
    
    const targetRadio = document.getElementById(sortFieldMap[currentSortField]);
    if (targetRadio) {
        targetRadio.checked = true;
    }
    
    // 更新排序图标
    updateSortIcons();
}

// 更新排序图标
function updateSortIcons() {
    const sortFieldMap = {
        'publishDate': 'sortDate',
        'fileName': 'sortName'
    };
    
    // 重置所有图标
    Object.values(sortFieldMap).forEach(id => {
        const label = document.querySelector(`label[for="${id}"] i`);
        if (label) {
            label.className = 'bi bi-arrow-down-up me-1';
        }
    });
    
    // 设置当前排序字段的图标
    const currentLabel = document.querySelector(`label[for="${sortFieldMap[currentSortField]}"] i`);
    if (currentLabel) {
        currentLabel.className = currentSortOrder === 'asc' ? 
            'bi bi-arrow-up me-1' : 'bi bi-arrow-down me-1';
    }
}

// 渲染文档列表（使用全局分页器）
function renderDocumentsList() {
    // 排序文档
    const sortedDocuments = [...allDocuments].sort((a, b) => {
        let aValue = a[currentSortField];
        let bValue = b[currentSortField];
        
        // 对于日期字段，转换为Date对象进行比较
        if (currentSortField === 'publishDate') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }
        
        // 字符串比较
        if (aValue < bValue) {
            return currentSortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return currentSortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });
    
    // 使用全局分页器获取当前页数据
    const currentPageDocuments = documentPagination.getPageData(sortedDocuments);
    
    // 渲染文档列表
    const documentsList = document.getElementById('documentsList');
    if (documentsList) {
        documentsList.innerHTML = currentPageDocuments.map((doc, index) => generateDocumentItem(doc, index)).join('');
        document.getElementById('totalCount').textContent = allDocuments.length;
    } else {
        console.error('documentsList element not found');
    }
}

// 初始化全局分页器
function initPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
        console.error('Pagination container not found');
        return;
    }
    
    documentPagination = createPagination(paginationContainer, {
        itemsPerPage: 10,
        totalItems: allDocuments.length,
        onPageChange: function(page, range) {
            renderDocumentsList();
        }
    });
}

// 生成法规列表项（不显示正文内容）
function generateDocumentItem(doc, index, isSearchResult = false) {
    const securityBadge = getSecurityBadge(doc.securityLevel);
    const securityPeriodText = doc.securityPeriod ? `${doc.securityPeriod}年` : '无期限';
    
    // 根据是否为搜索结果使用不同的分页器计算显示序号
    let displayIndex;
    if (isSearchResult && searchResultsPagination) {
        // 搜索结果使用搜索结果分页器
        const currentPage = searchResultsPagination.options.currentPage;
        const itemsPerPage = searchResultsPagination.options.itemsPerPage;
        displayIndex = (currentPage - 1) * itemsPerPage + index + 1;
    } else {
        // 全部法规使用文档分页器
        const currentPage = documentPagination ? documentPagination.options.currentPage : 1;
        const itemsPerPage = documentPagination ? documentPagination.options.itemsPerPage : 10;
        displayIndex = (currentPage - 1) * itemsPerPage + index + 1;
    }
    
    // 如果是搜索结果且有关键词，显示正文预览
    let contentPreview = '';
    if (isSearchResult && currentSearchKeywords.length > 0) {
        const previewLines = extractContentPreview(doc.content, currentSearchKeywords);
        if (previewLines.length > 0) {
            contentPreview = `
                <div class="mt-2 p-2 bg-light border rounded">
                    <small class="text-muted mb-1 d-block">
                        <i class="bi bi-file-text me-1"></i>正文预览：
                    </small>
                    <div class="content-preview-lines">
                        ${previewLines.map(line => `
                            <div class="preview-line mb-1">
                                <span class="text-muted small">...</span>${line}<span class="text-muted small">...</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    return `
        <div class="list-group-item document-item" data-doc-id="${doc.id}" onclick="showDocumentPreview(${doc.id})">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="d-flex align-items-center">
                    <span class="badge bg-secondary me-2 document-index-badge">No.${displayIndex}</span>
                    <h6 class="mb-1">${doc.fileName}</h6>
                </div>
                <div>
                    ${securityBadge}
                    <small class="text-muted ms-2">${securityPeriodText}</small>
                </div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div class="text-muted small">
                    <i class="bi bi-calendar me-1"></i>${doc.publishDate}
                    <i class="bi bi-tag ms-3 me-1"></i>${doc.tags || '无标签'}
                </div>
                <div class="text-muted small">
                    <span class="badge bg-${doc.effectStatus === '有效' ? 'success' : doc.effectStatus === '失效' ? 'danger' : 'warning'}">${doc.effectStatus}</span>
                </div>
            </div>
            ${contentPreview}
        </div>
    `;
}
