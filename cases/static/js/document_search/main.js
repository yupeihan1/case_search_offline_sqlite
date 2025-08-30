/**
 * 文档搜索模块主JavaScript文件
 * 负责页面初始化、事件绑定和全局状态管理
 */

// 全局变量
let currentSearchKeywords = [];
let allDocuments = []; // 存储所有文档数据
let currentSortField = 'publishDate'; // 当前排序字段
let currentSortOrder = 'desc'; // 当前排序顺序
let documentPagination = null; // 文档分页器实例
let searchResultsPagination = null; // 搜索结果分页器实例
let currentSearchResults = []; // 存储当前搜索结果

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化时间显示
    updateTime();
    setInterval(updateTime, 1000);
    
    // 初始化历史修订选择模式
    window.currentRevisionSelectionMode = 'upload';
    
    // 初始化搜索结果状态
    initializeSearchResults();
    
    // 绑定事件
    bindEvents();
    
    // 确保默认显示全部法规部分
    showSection('viewAllSection', document.getElementById('btnViewAll'));
    
    // 初始化表单选项
    initializeFormOptions();
    
    // 加载全部法规
    loadAllDocuments();
    
    // 初始化排序图标
    updateSortIcons();
    
    // 先获取标签数据，然后初始化组件
    initializeWithTags();
});

// 显示当前时间
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('currentTime').textContent = timeString;
}

// 绑定事件
function bindEvents() {
    // 功能按钮事件
    document.getElementById('btnViewAll').addEventListener('click', (e) => showSection('viewAllSection', e.target));
    document.getElementById('btnUpload').addEventListener('click', (e) => showSection('uploadSection', e.target));
    document.getElementById('btnSearch').addEventListener('click', (e) => showSection('searchSection', e.target));
    
    // 排序按钮事件
    document.getElementById('sortDate').addEventListener('change', () => sortDocuments('publishDate'));
    document.getElementById('sortName').addEventListener('change', () => sortDocuments('fileName'));
    
    // 表单事件
    document.getElementById('uploadForm').addEventListener('submit', handleFileUpload);
    document.getElementById('searchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch();
    });
    document.getElementById('clearSearch').addEventListener('click', clearSearchForm);
    document.getElementById('closePreview').addEventListener('click', closePreview);
    
    // 历史修订搜索输入框回车事件
    document.getElementById('revisionSearchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchRevisionFiles();
        }
    });
}

// 切换内容区域
function showSection(sectionId, targetButton) {
    // 隐藏所有内容区域
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // 显示指定区域
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    } else {
        console.error('Section not found:', sectionId);
    }
    
    // 更新按钮状态
    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (targetButton) {
        targetButton.classList.add('active');
    }
    
    // 切换tab页时收起右侧预览
    closePreview();
}

// 初始化搜索结果状态
function initializeSearchResults() {
    // 初始化搜索结果数据
    currentSearchResults = [];
    
    // 设置搜索结果的初始显示
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
    
    // 确保搜索结果分页器为空
    if (searchResultsPagination) {
        searchResultsPagination.destroy();
        searchResultsPagination = null;
    }
}

// 初始化表单选项
function initializeFormOptions() {
    const config = window.documentConfig || {};
    
    // 初始化密级选项
    const securityLevels = config.securityLevels || ['公开', '内部', '秘密', '机密', '绝密'];
    const securitySelect = document.getElementById('securityLevel');
    if (securitySelect) {
        securitySelect.innerHTML = '<option value="">请选择密级</option>' + 
            securityLevels.map(level => `<option value="${level}">${level}</option>`).join('');
    }
    
    // 初始化更新表单的密级选项
    const updateSecuritySelect = document.getElementById('updateSecurityLevel');
    if (updateSecuritySelect) {
        updateSecuritySelect.innerHTML = '<option value="">请选择密级</option>' + 
            securityLevels.map(level => `<option value="${level}">${level}</option>`).join('');
    }
    
    // 初始化效力状态选项
    const effectStatuses = config.effectStatuses || ['有效', '失效', '待生效'];
    const effectStatusSelect = document.getElementById('effectStatus');
    if (effectStatusSelect) {
        effectStatusSelect.innerHTML = '<option value="">请选择效力状态</option>' + 
            effectStatuses.map(status => `<option value="${status}">${status}</option>`).join('');
    }
    
    // 初始化更新表单的效力状态选项
    const updateEffectStatusSelect = document.getElementById('updateEffectStatus');
    if (updateEffectStatusSelect) {
        updateEffectStatusSelect.innerHTML = '<option value="">请选择效力状态</option>' + 
            effectStatuses.map(status => `<option value="${status}">${status}</option>`).join('');
    }
    
    // 初始化搜索表单的效力状态选项
    const searchEffectStatusSelect = document.getElementById('searchEffectStatus');
    if (searchEffectStatusSelect) {
        searchEffectStatusSelect.innerHTML = '<option value="">全部状态</option>' + 
            effectStatuses.map(status => `<option value="${status}">${status}</option>`).join('');
    }
}

// 初始化标签和组件
async function initializeWithTags() {
    try {
        // 获取标签数据
        await fetchTagsFromAPI();
        
        // 延迟初始化共通组件，确保页面基本功能先加载
        setTimeout(() => {
            console.log('Attempting to initialize components...');
            console.log('tagsDropdownManager:', typeof tagsDropdownManager);
            console.log('componentManager:', typeof componentManager);
            
            // 检查tagsDropdownManager或componentManager是否已加载
            const manager = window.tagsDropdownManager || window.componentManager || tagsDropdownManager || componentManager;
            if (typeof manager !== 'undefined') {
                console.log('Manager found, initializing components...');
                initializeComponents();
            } else {
                console.log('Manager not found, retrying...');
                // 如果还没加载，再等一会儿
                setTimeout(() => {
                    const manager = window.tagsDropdownManager || window.componentManager || tagsDropdownManager || componentManager;
                    if (typeof manager !== 'undefined') {
                        console.log('Manager found on retry, initializing components...');
                        initializeComponents();
                    } else {
                        console.log('Manager still not found, final retry...');
                        // 最后尝试：等待更长时间
                        setTimeout(() => {
                            const manager = window.tagsDropdownManager || window.componentManager || tagsDropdownManager || componentManager;
                            if (typeof manager !== 'undefined') {
                                console.log('Manager found on final retry, initializing components...');
                                initializeComponents();
                            } else {
                                console.error('Dropdown manager not available after multiple retries');
                                console.error('tagsDropdownManager:', typeof tagsDropdownManager);
                                console.error('componentManager:', typeof componentManager);
                            }
                        }, 1000);
                    }
                }, 500);
            }
        }, 100);
    } catch (error) {
        console.error('初始化标签数据失败:', error);
    }
}

// 共通组件初始化
function initializeComponents() {
    // 优先使用tagsDropdownManager，如果不存在则使用componentManager
    const manager = window.tagsDropdownManager || window.componentManager || tagsDropdownManager || componentManager;
    
    console.log('Initializing components with manager:', manager);
    
    // 检查管理器是否可用
    if (typeof manager === 'undefined') {
        console.error('Neither tagsDropdownManager nor componentManager is available');
        return;
    }
    
    // 检查容器元素是否存在
    const uploadContainer = document.getElementById('uploadTagsContainer');
    const searchContainer = document.getElementById('searchTagsContainer');
    
    if (!uploadContainer) {
        console.error('uploadTagsContainer not found');
    }
    
    if (!searchContainer) {
        console.error('searchTagsContainer not found');
    }

    // 创建上传表单标签组件
    if (uploadContainer) {
        try {
            const uploadTagsComponent = manager.createTagsComponent(getTagsComponentConfig('uploadTags', uploadContainer));
        } catch (error) {
            console.error('Error creating upload tags component:', error);
        }
    }

    // 创建搜索表单标签组件
    if (searchContainer) {
        try {
            const searchTagsComponent = manager.createTagsComponent(getTagsComponentConfig('searchTags', searchContainer));
        } catch (error) {
            console.error('Error creating search tags component:', error);
        }
    }

    // 监听共享数据变化事件
    document.addEventListener('sharedDataChanged', function(e) {
        const { key, data } = e.detail;
        if (key === 'customTags') {
            // 当自定义标签数据变化时，更新所有组件
            manager.updateTagsComponentOptions('uploadTags');
            manager.updateTagsComponentOptions('searchTags');
            // 如果更新表单的标签组件存在，也更新它
            if (isTagsComponentExists('updateTags')) {
                manager.updateTagsComponentOptions('updateTags');
            }
        }
    });
}

// 获取统一的标签组件配置
function getTagsComponentConfig(id, container) {
    // 从API获取标签数据
    const tagOptions = window.tagOptionsFromAPI || [];
    
    return {
        id: id,
        container: container,
        options: tagOptions,
        placeholder: '请选择标签',
        allowCustom: true,
        maxCustomLength: 20,
        onTagsChange: function(selectedTags) {
            console.log(`${id} tags changed:`, selectedTags);
        },
        onCustomTagAdd: function(customTag) {
            console.log(`Custom tag added to ${id}:`, customTag);
            // 当添加自定义标签时，同步到其他表单
            const manager = window.tagsDropdownManager || window.componentManager || tagsDropdownManager || componentManager;
            if (typeof manager !== 'undefined') {
                try {
                    // 同步到其他组件
                    if (id !== 'uploadTags' && isTagsComponentExists('uploadTags')) {
                        manager.addComponentOption('uploadTags', customTag);
                    }
                    if (id !== 'searchTags' && isTagsComponentExists('searchTags')) {
                        manager.addComponentOption('searchTags', customTag);
                    }
                    if (id !== 'updateTags' && isTagsComponentExists('updateTags')) {
                        manager.addComponentOption('updateTags', customTag);
                    }
                } catch (error) {
                    console.warn('同步自定义标签失败:', error);
                }
            }
        }
    };
}

// 从API获取标签数据
async function fetchTagsFromAPI() {
    try {
        const response = await fetch('/document_search/get_all_tags/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.recode === 200 && result.data) {
            // 提取标签名称
            const tagNames = result.data.map(tag => tag.tag_name);
            window.tagOptionsFromAPI = tagNames;
            console.log('标签数据获取成功:', tagNames);
            return tagNames;
        } else {
            console.error('API返回错误:', result.message);
            return [];
        }
    } catch (error) {
        console.error('获取标签数据失败:', error);
        return [];
    }
}
