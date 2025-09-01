/**
 * 弹窗管理模块
 * 负责历史修订、文件更新等弹窗功能
 */

// 历史修订信息选择相关变量和函数
let selectedRevisionFiles = [];
let revisionModal;

function openRevisionHistoryModal() {
    // 每次都创建新的modal实例，确保正确的层级关系
    const modalElement = document.getElementById('revisionHistoryModal');
    if (!modalElement) {
        console.error('历史修订文件选择弹窗元素未找到');
        return;
    }
    
    // 清空已选文件数组，确保每次打开都是干净的状态
    selectedRevisionFiles = [];
    updateSelectedRevisionFilesDisplay();
    
    // 创建新的modal实例
    revisionModal = new bootstrap.Modal(modalElement, {
        backdrop: 'static', // 防止点击背景关闭
        keyboard: false // 防止按ESC键关闭
    });
    
    // 监听弹窗关闭事件
    modalElement.addEventListener('hidden.bs.modal', function () {
        // 重置搜索输入框
        document.getElementById('revisionSearchInput').value = '';
        // 清空搜索结果
        document.getElementById('revisionSearchResults').innerHTML = '';
        // 清空已选文件数组
        selectedRevisionFiles = [];
        // 重置已选文件显示
        updateSelectedRevisionFilesDisplay();
        // 重置操作模式
        window.currentRevisionSelectionMode = 'upload';
    }, { once: true }); // 只监听一次
    
    // 显示弹窗
    revisionModal.show();
    
    // 加载默认搜索结果
    searchRevisionFiles();
}

function searchRevisionFiles() {
    const searchKeyword = document.getElementById('revisionSearchInput').value.trim();
    
    // 从全局变量获取历史修订文件数据库
    const documentDatabase = window.revisionFileDatabase || [];
    
    // 过滤搜索结果
    const filteredResults = documentDatabase.filter(doc => {
        if (!searchKeyword) return true;
        return doc.fileName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
               doc.publishUnit.toLowerCase().includes(searchKeyword.toLowerCase());
    });
    
    // 显示搜索结果
    const resultsContainer = document.getElementById('revisionSearchResults');
    resultsContainer.innerHTML = filteredResults.map(doc => `
        <div class="list-group-item list-group-item-action revision-file-item d-flex justify-content-between align-items-center" 
             onclick="selectRevisionFile(${doc.id}, '${doc.fileName}')">
            <div>
                <h6 class="mb-1">${doc.fileName}</h6>
                <small class="text-muted">
                    <i class="bi bi-building me-1"></i>${doc.publishUnit}
                    <i class="bi bi-calendar ms-3 me-1"></i>${doc.publishDate}
                    <span class="badge bg-secondary ms-2">${doc.securityLevel}</span>
                </small>
            </div>
            <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); selectRevisionFile(${doc.id}, '${doc.fileName}')">
                <i class="bi bi-plus"></i>选择
            </button>
        </div>
    `).join('');
}

function selectRevisionFile(fileId, fileName) {
    // 检查是否已经选择
    const existingIndex = selectedRevisionFiles.findIndex(file => file.id === fileId);
    if (existingIndex === -1) {
        // 从历史修订文件数据库中获取完整信息
        const revisionFileDatabase = window.revisionFileDatabase || [];
        const fileInfo = revisionFileDatabase.find(file => file.id === fileId);
        
        if (fileInfo) {
            selectedRevisionFiles.push({ 
                id: fileId, 
                fileName: fileName,
                publishDate: fileInfo.publishDate,
                publishUnit: fileInfo.publishUnit,
                securityLevel: fileInfo.securityLevel,
                effectiveStartDate: fileInfo.effectiveStartDate,
                effectiveEndDate: fileInfo.effectiveEndDate
            });
        } else {
            selectedRevisionFiles.push({ id: fileId, fileName: fileName });
        }
        updateSelectedRevisionFilesDisplay();
    }
}

function removeRevisionFile(fileId) {
    selectedRevisionFiles = selectedRevisionFiles.filter(file => file.id !== fileId);
    updateSelectedRevisionFilesDisplay();
}

function updateSelectedRevisionFilesDisplay() {
    const container = document.getElementById('selectedRevisionFiles');
    if (selectedRevisionFiles.length === 0) {
        container.innerHTML = '<div class="text-muted text-center py-3">暂未选择文件</div>';
    } else {
        container.innerHTML = selectedRevisionFiles.map(file => `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <span>${file.fileName}</span>
                <button class="btn btn-sm btn-outline-danger" onclick="removeRevisionFile(${file.id})">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `).join('');
    }
}

function confirmRevisionSelection() {
    if (selectedRevisionFiles.length > 0) {
        // 构建历史修订信息的显示文本
        const revisionHistoryDisplay = selectedRevisionFiles.map(file => {
            const effectiveDateText = file.effectiveStartDate && file.effectiveEndDate ? 
                `${file.effectiveStartDate} 至 ${file.effectiveEndDate}` : 
                (file.publishDate || '未知');
            
            return `${file.fileName} | 发布时间：${file.publishDate} | 有效时间：${effectiveDateText}`;
        }).join('; ');
        
        // 根据当前操作模式确定要更新的输入框和相关操作
        const isUpdateMode = window.currentRevisionSelectionMode === 'update';
        const targetInput = isUpdateMode ? 'updateRevisionHistory' : 'revisionHistory';
        document.getElementById(targetInput).value = revisionHistoryDisplay;
        
        // 更新对应的已选文件数组
        if (isUpdateMode) {
            selectedUpdateRevisionFiles = [...selectedRevisionFiles];
        }
        
        // 显示选中文件的详细信息（仅在上传表单中）
        if (!isUpdateMode) {
            const selectedFile = selectedRevisionFiles[0]; // 假设只选择一个文件
            const infoContainer = document.getElementById('selectedRevisionFileInfo');
            
            if (infoContainer && selectedFile) {
                // 更新显示的信息
                document.getElementById('selectedFileName').textContent = selectedFile.fileName || '未知';
                document.getElementById('selectedPublishDate').textContent = selectedFile.publishDate || '未知';
                
                // 显示有效时间范围
                const effectiveDateText = selectedFile.effectiveStartDate && selectedFile.effectiveEndDate ? 
                    `${selectedFile.effectiveStartDate} 至 ${selectedFile.effectiveEndDate}` : 
                    (selectedFile.publishDate || '未知');
                document.getElementById('selectedEffectiveDate').textContent = effectiveDateText;
                
                // 显示信息区域
                infoContainer.classList.remove('hidden');
            }
        }
        
        revisionModal.hide();
    } else {
        alert('请至少选择一个文件');
    }
}

function clearRevisionHistory() {
    document.getElementById('revisionHistory').value = '';
    selectedRevisionFiles = [];
    
    // 隐藏选中文件的详细信息显示区域
    const infoContainer = document.getElementById('selectedRevisionFileInfo');
    if (infoContainer) {
        infoContainer.classList.add('hidden');
    }
}

// 文件信息更新相关变量和函数
let currentUpdateDocId = null;
let selectedUpdateRevisionFiles = [];

// 打开文件信息更新弹窗
function openUpdateDocumentModal(docId) {
    currentUpdateDocId = docId;
    
    // 检查Bootstrap是否可用
    if (typeof bootstrap === 'undefined') {
        alert('Bootstrap未加载，无法打开弹窗');
        return;
    }
    
    // 从全局变量获取文档数据库
    const documentDatabase = window.documentDatabase || {};
    const doc = documentDatabase[docId];
    
    if (!doc) {
        alert('文档不存在');
        return;
    }
    
    // 每次打开弹窗时都创建新的实例，确保弹窗能正常工作
    const modalElement = document.getElementById('updateDocumentModal');
    if (!modalElement) {
        alert('弹窗元素未找到');
        return;
    }
    
    try {
        // 创建模态框实例
        const modal = new bootstrap.Modal(modalElement);
        
        // 监听弹窗关闭事件
        modalElement.addEventListener('hidden.bs.modal', function () {
            // 重置表单
            document.getElementById('updateDocumentForm').reset();
            // 清空已选修订文件
            selectedUpdateRevisionFiles = [];
            // 重置标签组件 - 延迟执行
            setTimeout(() => {
                try {
                    tagsDropdownManager.clearSelectedTags('updateTags');
                } catch (error) {
                    console.warn('重置标签失败:', error);
                    // 如果标签管理器不可用，清空标签容器
                    const updateContainer = document.getElementById('updateTagsContainer');
                    if (updateContainer) {
                        updateContainer.innerHTML = '';
                    }
                }
            }, 100);
        }, { once: true }); // 只监听一次，避免重复绑定
        
        // 填充表单数据
        document.getElementById('updateFileName').value = doc.fileName;
        document.getElementById('updatePublishDate').value = doc.publishDate;
        document.getElementById('updateSecurityLevel').value = doc.securityLevel;
        document.getElementById('updateSecurityPeriod').value = doc.securityPeriod || '';
        document.getElementById('updateIssueUnit').value = doc.issueUnit || '';
        document.getElementById('updateEffectStatus').value = doc.effectStatus;
        document.getElementById('updateEffectiveStartDate').value = doc.effectiveStartDate || '';
        document.getElementById('updateEffectiveEndDate').value = doc.effectiveEndDate || '';
        document.getElementById('updateFileNumber').value = doc.fileNumber || '';
        document.getElementById('updateRevisionHistory').value = doc.revisionHistory || '';
        document.getElementById('updateRemarks').value = doc.remarks || '';
        
        // 初始化更新表单的标签组件
        const updateContainer = document.getElementById('updateTagsContainer');
        if (updateContainer) {
            // 检查组件是否已存在，如果存在则先移除
            if (isTagsComponentExists('updateTags')) {
                console.log('Removing existing update tags component...');
                const manager = window.tagsDropdownManager || window.componentManager || tagsDropdownManager || componentManager;
                if (manager && manager.components) {
                    manager.components.delete('updateTags');
                }
            }
            
            console.log('Initializing update tags component...');
            try {
                // 清空容器，确保没有残留内容
                updateContainer.innerHTML = '';
                
                // 从API获取标签数据
                const tagOptions = window.tagOptionsFromAPI || [];
                
                // 准备初始选中的标签
                let initialSelectedTags = [];
                if (doc.tags && doc.tags.trim()) {
                    initialSelectedTags = doc.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                    console.log('Initial selected tags:', initialSelectedTags);
                }
                
                tagsDropdownManager.createTagsComponent({
                    id: 'updateTags',
                    container: updateContainer,
                    options: tagOptions,
                    selectedTags: initialSelectedTags, // 在创建时直接设置选中的标签
                    placeholder: '请选择标签',
                    selectedText: '已选择 {count} 个标签',
                    previewLabel: '已选标签:',
                    helpText: '点击选择标签，支持自定义标签'
                });
                console.log('Update tags component initialized successfully with selected tags');
                
                // 手动更新组件显示，确保已选标签正确显示
                setTimeout(() => {
                    try {
                        tagsDropdownManager.updateTagsComponent('updateTags');
                        console.log('Component display updated successfully');
                    } catch (error) {
                        console.warn('更新组件显示失败:', error);
                    }
                }, 50); // 参照 plans_management.html 的延迟时间
            } catch (error) {
                console.error('Error initializing update tags component:', error);
                // 如果创建失败，显示错误信息
                updateContainer.innerHTML = `
                    <div class="alert alert-warning">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        标签组件初始化失败，请刷新页面重试
                    </div>
                `;
            }
        } else {
            console.error('updateTagsContainer not found');
        }
        
        // 备用方案：延迟检查标签是否正确设置和显示
        setTimeout(() => {
            try {
                const selectedTags = tagsDropdownManager.getSelectedTags('updateTags');
                console.log('Final selected tags check:', selectedTags);
                
                // 如果标签没有正确设置，尝试重新设置
                if (selectedTags.length === 0 && doc.tags && doc.tags.trim()) {
                    const tags = doc.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                    console.log('Retry setting tags after delay:', tags);
                    tagsDropdownManager.setSelectedTags('updateTags', tags);
                }
                
                // 再次更新组件显示，确保标签正确显示
                tagsDropdownManager.updateTagsComponent('updateTags');
                console.log('Component display updated in retry');
            } catch (error) {
                console.warn('标签检查失败:', error);
            }
        }, 200); // 减少延迟时间，参照 plans_management.html 的做法
        
        // 设置已选修订文件
        selectedUpdateRevisionFiles = [];
        if (doc.revisionHistory) {
            // 解析历史修订信息，查找对应的修订文件
            const revisionFiles = parseRevisionHistory(doc.revisionHistory);
            selectedUpdateRevisionFiles = revisionFiles;
            
            // 更新历史修订信息输入框的显示
            const revisionHistoryDisplay = getRevisionHistoryDisplay(doc.revisionHistory);
            document.getElementById('updateRevisionHistory').value = revisionHistoryDisplay;
        } else {
            // 如果没有历史修订信息，清空输入框
            document.getElementById('updateRevisionHistory').value = '';
        }
        
        // 显示弹窗
        modal.show();
        
    } catch (error) {
        console.error('Error creating or showing modal:', error);
        alert('创建或显示弹窗时出错: ' + error.message);
    }
}

// 清除更新表单的历史修订信息
function clearUpdateRevisionHistory() {
    document.getElementById('updateRevisionHistory').value = '';
    selectedUpdateRevisionFiles = [];
}

// 打开更新表单的历史修订选择弹窗
function openUpdateRevisionHistoryModal() {
    // 设置当前操作模式为更新模式
    window.currentRevisionSelectionMode = 'update';
    openRevisionHistoryModal();
}

// 解析历史修订信息，返回修订文件数组
function parseRevisionHistory(revisionHistoryText) {
    if (!revisionHistoryText) return [];
    
    // 从全局变量获取历史修订文件数据库
    const revisionFileDatabase = window.revisionFileDatabase || [];
    
    // 如果修订历史是文件名列表（用分号分隔），则查找对应的文件
    const fileNames = revisionHistoryText.split(';').map(name => name.trim()).filter(name => name.length > 0);
    
    const revisionFiles = [];
    fileNames.forEach(fileName => {
        const revisionFile = revisionFileDatabase.find(file => file.fileName === fileName);
        if (revisionFile) {
            revisionFiles.push({
                id: revisionFile.id,
                fileName: revisionFile.fileName,
                publishDate: revisionFile.publishDate,
                publishUnit: revisionFile.publishUnit,
                securityLevel: revisionFile.securityLevel,
                effectiveStartDate: revisionFile.effectiveStartDate,
                effectiveEndDate: revisionFile.effectiveEndDate
            });
        }
    });
    
    return revisionFiles;
}

// 获取历史修订信息的显示文本
function getRevisionHistoryDisplay(revisionHistoryText) {
    if (!revisionHistoryText) return '';
    
    const revisionFiles = parseRevisionHistory(revisionHistoryText);
    if (revisionFiles.length === 0) {
        // 如果没有找到对应的修订文件，显示原始文本
        return revisionHistoryText;
    }
    
    // 显示修订文件的详细信息
    return revisionFiles.map(file => {
        const effectiveDateText = file.effectiveStartDate && file.effectiveEndDate ? 
            `${file.effectiveStartDate} 至 ${file.effectiveEndDate}` : 
            (file.publishDate || '未知');
        
        return `${file.fileName} | 发布时间：${file.publishDate} | 有效时间：${effectiveDateText}`;
    }).join('; ');
}

// 更新文档信息
function updateDocumentInfo() {
    // 获取表单数据
    const formData = new FormData(document.getElementById('updateDocumentForm'));
    const securityLevel = document.getElementById('updateSecurityLevel').value;
    const securityPeriod = document.getElementById('updateSecurityPeriod').value;
    const issueUnit = document.getElementById('updateIssueUnit').value;
    const effectStatus = document.getElementById('updateEffectStatus').value;
    const effectiveStartDate = document.getElementById('updateEffectiveStartDate').value;
    const effectiveEndDate = document.getElementById('updateEffectiveEndDate').value;
    const fileNumber = document.getElementById('updateFileNumber').value;
    const revisionHistory = document.getElementById('updateRevisionHistory').value;
    const remarks = document.getElementById('updateRemarks').value;
    
    // 获取标签
    let tags = '';
    try {
        const selectedTags = tagsDropdownManager.getSelectedTags('updateTags');
        if (Array.isArray(selectedTags)) {
            tags = selectedTags.join(',');
        } else {
            tags = '';
        }
    } catch (error) {
        console.warn('获取标签失败:', error);
        tags = '';
    }
    
    // 验证必填字段
    if (!securityLevel || !issueUnit || !effectStatus || !effectiveStartDate || !effectiveEndDate) {
        alert('请填写所有必填字段');
        return;
    }
    
    // 从全局变量获取文档数据库
    const documentDatabase = window.documentDatabase || {};
    const doc = documentDatabase[currentUpdateDocId];
    
    if (!doc) {
        alert('文档不存在');
        return;
    }
    
    // 更新文档信息
    doc.securityLevel = securityLevel;
    doc.securityPeriod = securityPeriod ? parseInt(securityPeriod) : null;
    doc.issueUnit = issueUnit;
    doc.effectStatus = effectStatus;
    doc.effectiveStartDate = effectiveStartDate;
    doc.effectiveEndDate = effectiveEndDate;
    doc.fileNumber = fileNumber;
    doc.tags = tags;
    doc.revisionHistory = revisionHistory;
    doc.remarks = remarks;
    
    // 更新全局数据库
    documentDatabase[currentUpdateDocId] = doc;
    window.documentDatabase = documentDatabase;
    
    // 更新allDocuments数组
    const docIndex = allDocuments.findIndex(d => d.id === currentUpdateDocId);
    if (docIndex !== -1) {
        allDocuments[docIndex] = doc;
    }
    
    // 关闭弹窗
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('updateDocumentModal'));
    if (modalInstance) {
        modalInstance.hide();
    }
    
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
                文件信息已成功更新
            </div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
    
    // 重新渲染文档列表以显示更新后的信息
    renderDocumentsList();
    
    // 如果当前正在预览该文档，更新预览内容
    const activeDocItem = document.querySelector('.document-item.active');
    if (activeDocItem && activeDocItem.getAttribute('data-doc-id') === currentUpdateDocId.toString()) {
        showDocumentPreview(currentUpdateDocId);
    }
}
