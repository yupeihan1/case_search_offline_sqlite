/**
 * 搜索管理模块
 * 负责搜索功能、搜索结果分页等功能
 */

// 初始化搜索结果分页器
function initSearchResultsPagination() {
    const searchPaginationContainer = document.getElementById('searchPagination');
    if (!searchPaginationContainer) {
        console.error('Search pagination container not found');
        return;
    }
    
    // 销毁之前的分页器实例
    if (searchResultsPagination) {
        searchResultsPagination.destroy();
    }
    
    searchResultsPagination = createPagination(searchPaginationContainer, {
        itemsPerPage: 10,
        totalItems: currentSearchResults.length,
        onPageChange: function(page, range) {
            renderSearchResults();
        }
    });
}

// 渲染搜索结果
function renderSearchResults() {
    const searchResultsContainer = document.getElementById('searchResults');
    if (!searchResultsContainer) {
        console.error('Search results container not found');
        return;
    }
    
    if (currentSearchResults.length === 0) {
        searchResultsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-search text-muted search-icon-large"></i>
                <p class="text-muted mt-3">未找到匹配的法规文件</p>
                <p class="text-muted small">请尝试调整搜索条件</p>
            </div>
        `;
        // 销毁分页器，因为没有结果
        if (searchResultsPagination) {
            searchResultsPagination.destroy();
            searchResultsPagination = null;
        }
        return;
    }
    
    // 确保分页器存在
    if (!searchResultsPagination) {
        initSearchResultsPagination();
    }
    
    // 使用分页器获取当前页数据
    const currentPageResults = searchResultsPagination.getPageData(currentSearchResults);
    
    // 渲染搜索结果列表
    searchResultsContainer.innerHTML = currentPageResults.map((doc, index) => {
        return generateDocumentItem(doc, index, true);
    }).join('');
}

// 执行搜索
function performSearch() {
    // 执行搜索时收起右侧预览
    closePreview();
    
    const searchContent = document.getElementById('searchContent').value;
    const searchFileName = document.getElementById('searchFileName').value;
    const manager = tagsDropdownManager || componentManager;
    const searchTags = (typeof manager !== 'undefined') ? 
        manager.getSelectedTags('searchTags') : []; // 使用共通组件API
    const searchIssueUnit = document.getElementById('searchIssueUnit').value;
    const searchEffectStatus = document.getElementById('searchEffectStatus').value;
    const searchEffectiveStartDate = document.getElementById('searchEffectiveStartDate').value;
    const searchEffectiveEndDate = document.getElementById('searchEffectiveEndDate').value;
    const searchPublishDate = document.getElementById('searchPublishDate').value;
    const searchFileNumber = document.getElementById('searchFileNumber').value;
    const searchRemarks = document.getElementById('searchRemarks').value;
    
    currentSearchKeywords = searchContent ? searchContent.split(' ') : [];
    
    // 从全局变量获取文档数据库
    const documentDatabase = window.documentDatabase || {};
    
    // 执行搜索逻辑
    const searchResults = [];
    Object.values(documentDatabase).forEach(doc => {
        let match = true;
        
        // 文件名完全匹配
        if (searchFileName && doc.fileName !== searchFileName) {
            match = false;
        }
        
        // 标签匹配（支持多选）
        if (searchTags && searchTags.length > 0) {
            const docTags = doc.tags ? doc.tags.split(',') : [];
            const hasMatchingTag = searchTags.some(searchTag => 
                docTags.some(docTag => docTag.trim() === searchTag)
            );
            if (!hasMatchingTag) {
                match = false;
            }
        }
        
        // 签发单位匹配
        if (searchIssueUnit && !doc.issueUnit.includes(searchIssueUnit)) {
            match = false;
        }
        
        // 效力状态匹配
        if (searchEffectStatus && doc.effectStatus !== searchEffectStatus) {
            match = false;
        }
        
        // 有效开始时间匹配
        if (searchEffectiveStartDate && doc.effectiveStartDate !== searchEffectiveStartDate) {
            match = false;
        }
        
        // 有效终了时间匹配
        if (searchEffectiveEndDate && doc.effectiveEndDate !== searchEffectiveEndDate) {
            match = false;
        }
        
        // 发布时间匹配
        if (searchPublishDate && doc.publishDate !== searchPublishDate) {
            match = false;
        }
        
        // 文件编号匹配
        if (searchFileNumber && !doc.fileNumber.includes(searchFileNumber)) {
            match = false;
        }
        
        // 备注匹配
        if (searchRemarks && !doc.remarks.includes(searchRemarks)) {
            match = false;
        }
        
        // 正文内容匹配（模拟IK分词器搜索）
        if (searchContent && currentSearchKeywords.length > 0) {
            const contentMatch = currentSearchKeywords.some(keyword => 
                doc.content.toLowerCase().includes(keyword.toLowerCase())
            );
            if (!contentMatch) {
                match = false;
            }
        }
        
        if (match) {
            searchResults.push(doc);
        }
    });
    
    // 存储搜索结果到全局变量
    currentSearchResults = searchResults;
    
    // 初始化搜索结果分页器
    initSearchResultsPagination();
    
    // 渲染搜索结果
    renderSearchResults();
    
    // 更新搜索结果计数
    document.getElementById('searchResultCount').textContent = searchResults.length;
}

// 清空搜索条件
function clearSearchForm() {
    // 清空搜索条件时收起右侧预览
    closePreview();
    
    document.getElementById('searchForm').reset();
    currentSearchKeywords = [];
    // 使用共通组件API清空标签
    const manager = tagsDropdownManager || componentManager;
    if (typeof manager !== 'undefined') {
        manager.clearSelectedTags('searchTags');
    }
    
    // 清空搜索结果数据
    currentSearchResults = [];
    
    // 清空搜索结果
    const searchResultsContainer = document.getElementById('searchResults');
    if (searchResultsContainer) {
        searchResultsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-search text-muted search-icon-large"></i>
                <p class="text-muted mt-3">请输入搜索条件开始检索</p>
                <p class="text-muted small">支持文件名、正文内容、标签等多种搜索方式</p>
            </div>
        `;
    }
    
    // 重置搜索结果计数
    const searchResultCount = document.getElementById('searchResultCount');
    if (searchResultCount) {
        searchResultCount.textContent = '0';
    }
    
    // 销毁搜索结果分页器
    if (searchResultsPagination) {
        searchResultsPagination.destroy();
        searchResultsPagination = null;
    }
}
