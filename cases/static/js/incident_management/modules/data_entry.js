/**
 * 数据录入模块
 * 负责表单处理、数据收集和提交功能
 */

// 问题类别配置
const problemCategories = {
    military: ['装备事故', '火灾事故', '舰艇事故', '飞行事故', '车辆事故', '训练事故', '其他事故'],
    social: ['车辆交通事故', '火灾事故', '建筑事故', '工业事故', '其他事故'],
    case: ['强奸', '盗窃', '诈骗', '贪污', '受贿', '其他案件'],
    suicide: ['自缢', '跳楼', '持枪自杀', '服药自杀', '室内点火窒息', '其他自杀方式']
};

// 问题等级配置
const problemLevels = ['一般事故', '较大事故', '重大事故', '特大事故'];

// 单位配置
const unitOptions = [
    '某部队', '某基地', '某舰队', '某航空兵', '某陆军', '某海军', '某空军',
    '某军区', '某集团军', '某师', '某旅', '某团', '某营', '某连',
    '某训练基地', '某后勤基地', '某装备基地', '某通信站', '某雷达站',
    '某医院', '某学校', '某研究所', '某工厂', '某仓库', '某机场',
    '某港口', '某码头', '某车站', '某油库', '某弹药库', '某军械库'
];

// 处理类型变化
function handleTypeChange() {
    const incidentType = document.getElementById('incidentType').value;
    const accidentSubTypeDiv = document.getElementById('accidentSubTypeDiv');
    
    // 显示/隐藏事故子类型选择
    if (incidentType === 'accident') {
        accidentSubTypeDiv.style.display = 'block';
    } else {
        accidentSubTypeDiv.style.display = 'none';
        document.getElementById('accidentSubType').value = '';
    }
    
    // 根据类型自动切换表单模板
    switchFormTemplate(incidentType);
}

// 处理事故子类型变化
function handleSubTypeChange() {
    updateProblemCategoryDropdown();
}

// 处理问题隐患类型变化
function handleHazardTypeChange() {
    updatePlanSelectionVisibility();
}

// 处理附件选择变化
function handleFileSelection(inputId) {
    const fileInput = document.getElementById(inputId);
    const fileListContainer = document.getElementById(inputId + 'List');
    const displayInput = document.getElementById(inputId + 'Display');
    
    if (fileInput && fileListContainer) {
        // 获取当前已存储的文件列表
        let existingFiles = [];
        if (fileInput.dataset.existingFiles) {
            try {
                existingFiles = JSON.parse(fileInput.dataset.existingFiles);
            } catch (e) {
                existingFiles = [];
            }
        }
        
        // 添加新选择的文件到现有文件列表
        for (let i = 0; i < fileInput.files.length; i++) {
            const newFile = fileInput.files[i];
            // 检查文件是否已存在（通过文件名和大小判断）
            const isDuplicate = existingFiles.some(existingFile => 
                existingFile.name === newFile.name && existingFile.size === newFile.size
            );
            
            if (!isDuplicate) {
                existingFiles.push({
                    name: newFile.name,
                    size: newFile.size,
                    type: newFile.type,
                    lastModified: newFile.lastModified,
                    file: newFile
                });
            }
        }
        
        // 更新存储的文件列表
        fileInput.dataset.existingFiles = JSON.stringify(existingFiles);
        
        // 更新显示文本
        if (displayInput) {
            if (existingFiles.length === 0) {
                displayInput.value = '';
                displayInput.placeholder = '选择文件...';
            } else if (existingFiles.length === 1) {
                displayInput.value = existingFiles[0].name;
            } else {
                displayInput.value = `已选择 ${existingFiles.length} 个文件`;
            }
        }
        
        // 重新构建文件列表显示
        updateFileListDisplay(inputId, existingFiles);
        
        // 清空input的files，避免重复添加
        fileInput.value = '';
    }
}

// 更新文件列表显示
function updateFileListDisplay(inputId, files) {
    const fileListContainer = document.getElementById(inputId + 'List');
    
    if (fileListContainer) {
        fileListContainer.innerHTML = '';
        
        if (files.length > 0) {
            const fileList = document.createElement('div');
            fileList.className = 'mt-2';
            
            files.forEach((fileInfo, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'd-flex align-items-center justify-content-between p-2 border rounded mb-1 bg-light';
                fileItem.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="bi bi-file-earmark me-2"></i>
                        <span class="small">${fileInfo.name}</span>
                        <span class="badge bg-secondary ms-2">${formatFileSize(fileInfo.size)}</span>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeFile('${inputId}', ${index})">
                        <i class="bi bi-x"></i>
                    </button>
                `;
                fileList.appendChild(fileItem);
            });
            
            fileListContainer.appendChild(fileList);
        }
    }
}

// 移除文件
function removeFile(inputId, index) {
    const fileInput = document.getElementById(inputId);
    const displayInput = document.getElementById(inputId + 'Display');
    
    // 获取当前已存储的文件列表
    let existingFiles = [];
    if (fileInput.dataset.existingFiles) {
        try {
            existingFiles = JSON.parse(fileInput.dataset.existingFiles);
        } catch (e) {
            existingFiles = [];
        }
    }
    
    // 移除指定索引的文件
    existingFiles.splice(index, 1);
    
    // 更新存储的文件列表
    fileInput.dataset.existingFiles = JSON.stringify(existingFiles);
    
    // 更新显示文本
    if (displayInput) {
        if (existingFiles.length === 0) {
            displayInput.value = '';
            displayInput.placeholder = '选择文件...';
        } else if (existingFiles.length === 1) {
            displayInput.value = existingFiles[0].name;
        } else {
            displayInput.value = `已选择 ${existingFiles.length} 个文件`;
        }
    }
    
    // 重新构建文件列表显示
    updateFileListDisplay(inputId, existingFiles);
}

// 更新计划选择和检查处的可见性和必填状态
function updatePlanSelectionVisibility() {
    const hazardType = document.getElementById('hazardType').value;
    const planRequired = document.getElementById('planRequired');
    const planHelpText = document.getElementById('planHelpText');
    const selectedPlanName = document.getElementById('selectedPlanName');
    const planSelectDiv = document.getElementById('planSelectDiv');
    const planSelectButton = document.querySelector('#planSelectDiv button');
    
    // 检查处相关元素
    const checkLocationDiv = document.getElementById('checkLocationDiv');
    const checkLocationInput = document.getElementById('hazardCheckLocation');
    const checkLocationRequired = document.getElementById('checkLocationRequired');
    const checkLocationHelpText = document.getElementById('checkLocationHelpText');
    
    if (hazardType === 'comprehensive' || hazardType === 'other') {
        // 综合检查或其他 - 计划选择变为非活性，检查处显示
        if (planSelectDiv) {
            planSelectDiv.style.display = 'block';
            planSelectDiv.style.opacity = '0.6';
        }
        if (planSelectButton) {
            planSelectButton.disabled = true;
            planSelectButton.classList.add('disabled');
        }
        if (planRequired) {
            planRequired.style.display = 'none';
        }
        if (planHelpText) {
            planHelpText.textContent = '';
            planHelpText.style.display = 'block';
        }
        // 清除已选择的计划
        if (selectedPlanName) {
            selectedPlanName.textContent = '';
            selectedPlanName.style.display = 'none';
        }
        
        // 检查处控制 - 显示检查处
        if (checkLocationDiv) {
            checkLocationDiv.style.display = 'block';
        }
        if (checkLocationInput) {
            checkLocationInput.disabled = false;
            checkLocationInput.required = true;
        }
    } else if (hazardType === 'daily' || hazardType === 'chief') {
        // 日常检查或首长检查 - 必须选择计划，检查处隐藏
        if (planSelectDiv) {
            planSelectDiv.style.display = 'block';
            planSelectDiv.style.opacity = '1';
        }
        if (planSelectButton) {
            planSelectButton.disabled = false;
            planSelectButton.classList.remove('disabled');
        }
        if (planRequired) {
            planRequired.style.display = 'inline';
        }
        if (planHelpText) {
            planHelpText.textContent = '日常检查和首长检查必须选择计划';
            planHelpText.style.display = 'block';
        }
        
        // 检查处控制 - 隐藏检查处
        if (checkLocationDiv) {
            checkLocationDiv.style.display = 'none';
        }
        if (checkLocationInput) {
            checkLocationInput.value = '';
        }
    } else {
        // 未选择类型 - 显示计划选择区域但不显示必填标记，检查处隐藏
        if (planSelectDiv) {
            planSelectDiv.style.display = 'block';
            planSelectDiv.style.opacity = '1';
        }
        if (planSelectButton) {
            planSelectButton.disabled = false;
            planSelectButton.classList.remove('disabled');
        }
        if (planRequired) {
            planRequired.style.display = 'none';
        }
        if (planHelpText) {
            planHelpText.style.display = 'none';
        }
        
        // 检查处控制 - 隐藏检查处
        if (checkLocationDiv) {
            checkLocationDiv.style.display = 'none';
        }
        if (checkLocationInput) {
            checkLocationInput.value = '';
        }
    }
}

// 根据类型切换表单模板
function switchFormTemplate(incidentType) {
    const hazardForm = document.getElementById('hazardForm');
    const otherForm = document.getElementById('otherForm');
    const planSelectDiv = document.getElementById('planSelectDiv');
    
    // 隐藏所有表单
    hazardForm.style.display = 'none';
    otherForm.style.display = 'none';
    
    // 清除选择的计划名称显示
    const selectedPlanNameSpan = document.getElementById('selectedPlanName');
    if (selectedPlanNameSpan) {
        selectedPlanNameSpan.textContent = '';
        selectedPlanNameSpan.style.display = 'none';
    }
    
    // 根据类型显示对应的表单
    if (incidentType === 'hazard') {
        // 问题隐患类型 - 显示问题隐患表单
        hazardForm.style.display = 'block';
        // 显示计划选择区域
        if (planSelectDiv) {
            planSelectDiv.style.display = 'block';
        }
        // 初始状态下不显示必填标记和帮助文本
        updatePlanSelectionVisibility();
        // 初始化问题隐患表单的单位下拉组件
        updateHazardUnitDropdown();
        // 初始化问题隐患表单的问题类别下拉组件
        updateHazardProblemCategoryDropdown();
    } else if (incidentType === 'accident' || incidentType === 'case' || incidentType === 'suicide') {
        // 事故、案件、自杀类型 - 显示问题隐患以外表单
        otherForm.style.display = 'block';
        updateProblemCategoryDropdown();
        updateProblemLevelDropdown();
        // 初始化其他表单的单位下拉组件
        updateOtherUnitDropdown();
    }
}

// 更新问题类别下拉组件
function updateProblemCategoryDropdown() {
    const incidentType = document.getElementById('incidentType').value;
    const accidentSubType = document.getElementById('accidentSubType').value;
    const container = document.getElementById('otherProblemCategoryContainer');
    
    if (!container) return;
    
    let categories = [];
    
    if (incidentType === 'accident') {
        if (accidentSubType === 'military') {
            categories = problemCategories.military;
        } else if (accidentSubType === 'social') {
            categories = problemCategories.social;
        }
    } else if (incidentType === 'case') {
        categories = problemCategories.case;
    } else if (incidentType === 'suicide') {
        categories = problemCategories.suicide;
    }
    
    // 创建单选下拉组件
    if (categories.length > 0) {
        container.innerHTML = `
            <select class="form-control" id="otherProblemCategory">
                <option value="">请选择问题类别</option>
                ${categories.map(category => `<option value="${category}">${category}</option>`).join('')}
            </select>
            <div class="form-text">点击选择问题类别，支持自定义。</div>
        `;
    } else {
        container.innerHTML = '<p class="text-muted">请先选择类型和事故类型</p>';
    }
}

// 更新问题等级下拉组件
function updateProblemLevelDropdown() {
    const container = document.getElementById('otherProblemLevelContainer');
    
    if (!container) return;
    
    container.innerHTML = `
        <select class="form-control" id="otherProblemLevel">
            <option value="">请选择问题等级</option>
            ${problemLevels.map(level => `<option value="${level}">${level}</option>`).join('')}
        </select>
        <div class="form-text">点击选择问题等级。</div>
    `;
}

// 更新问题隐患表单的单位下拉组件
function updateHazardUnitDropdown() {
    const container = document.getElementById('hazardUnitContainer');
    
    if (!container) return;
    
    // 使用联动下拉组件替代标签下拉组件
    if (typeof cascadingDropdownManager !== 'undefined') {
        // 从mock_data.js获取数据
        const cascadingData = getCascadingDataFromMockData();
        
        cascadingDropdownManager.createCascadingComponent({
            id: 'hazardUnit',
            container: container,
            data: cascadingData,
            showPath: true,
            showSearch: true,
            maxHeight: 250,
            enablePersistence: false, // 不启用持久化，避免影响其他组件
            storageKey: 'hazardUnit_temp', // 使用临时存储键
            onSelectionChange: function(selectionData) {
                console.log('问题隐患单位选择变化:', selectionData);
                // 可以在这里添加选择验证逻辑
            },
            onCustomAdd: function(level, value) {
                console.log('添加自定义单位:', level, value);
            }
        });
    } else {
        // 如果联动下拉组件未加载，回退到原来的标签下拉组件
        tagsDropdownManager.createTagsComponent({
            id: 'hazardUnit',
            container: container,
            options: unitOptions,
            placeholder: '点击选择单位',
            selectedText: '已选择 {count} 个单位',
            previewLabel: '已选单位:',
            allowCustom: false,
            helpText: '点击选择单位，不支持自定义，如需追加请至组织架构信息维护页追加。',
            onTagsChange: function(selectedTags) {
                // 标签选择回调
            }
        });
    }
}

// 更新问题隐患表单的问题类别下拉组件
function updateHazardProblemCategoryDropdown() {
    const container = document.getElementById('hazardProblemCategoryContainer');
    
    if (!container) return;
    
    // 问题隐患的问题类别选项
    const hazardProblemCategories = [
        '安全检查', '消防安全', '装备安全', '训练安全', '车辆安全', 
        '人员安全', '信息安全', '保密安全', '食品安全', '医疗安全',
        '环境安全', '施工安全', '运输安全', '仓储安全', '通信安全',
        '电力安全', '燃气安全', '危险品安全', '特种设备安全', '其他'
    ];
    
    container.innerHTML = `
        <select class="form-control" id="hazardProblemCategory">
            <option value="">请选择问题类别</option>
            ${hazardProblemCategories.map(category => `<option value="${category}">${category}</option>`).join('')}
        </select>
        <div class="form-text">点击选择问题类别，支持自定义。</div>
    `;
}

// 更新其他表单的单位下拉组件
function updateOtherUnitDropdown() {
    const container = document.getElementById('otherUnitContainer');
    
    if (!container) return;
    
    // 使用联动下拉组件替代标签下拉组件
    if (typeof cascadingDropdownManager !== 'undefined') {
        // 从mock_data.js获取数据
        const cascadingData = getCascadingDataFromMockData();
        
        cascadingDropdownManager.createCascadingComponent({
            id: 'otherUnit',
            container: container,
            data: cascadingData,
            showPath: true,
            showSearch: true,
            maxHeight: 250,
            enablePersistence: false, // 不启用持久化，避免影响其他组件
            storageKey: 'otherUnit_temp', // 使用临时存储键
            onSelectionChange: function(selectionData) {
                console.log('其他表单单位选择变化:', selectionData);
                // 可以在这里添加选择验证逻辑
            },
            onCustomAdd: function(level, value) {
                console.log('添加自定义单位:', level, value);
            }
        });
    } else {
        // 如果联动下拉组件未加载，回退到原来的标签下拉组件
        tagsDropdownManager.createTagsComponent({
            id: 'otherUnit',
            container: container,
            options: unitOptions,
            placeholder: '点击选择单位',
            selectedText: '已选择 {count} 个单位',
            previewLabel: '已选单位:',
            allowCustom: false,
            helpText: '点击选择单位，不支持自定义，如需追加请至组织架构信息维护页追加。',
            onTagsChange: function(selectedTags) {
                // 标签选择回调
            }
        });
    }
}

// 更新责任人字段
function updateResponsibleFields() {
    const count = parseInt(document.getElementById('otherResponsibleCount').value) || 0;
    const container = document.getElementById('responsibleFieldsContainer');
    
    container.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'responsible-field-group';
        fieldGroup.innerHTML = `
            <h6>责任人 ${i}</h6>
            <div class="row g-3">
                <div class="col-md-4">
                    <label for="responsible_identity_${i}" class="form-label">责任人身份</label>
                    <input type="text" class="form-control" id="responsible_identity_${i}" placeholder="请输入责任人身份">
                </div>
                <div class="col-md-4">
                    <label for="responsible_rank_${i}" class="form-label">责任人军衔</label>
                    <input type="text" class="form-control" id="responsible_rank_${i}" placeholder="请输入责任人军衔">
                </div>
                <div class="col-md-4">
                    <label for="responsible_position_${i}" class="form-label">责任人职务</label>
                    <input type="text" class="form-control" id="responsible_position_${i}" placeholder="请输入责任人职务">
                </div>
            </div>
        `;
        container.appendChild(fieldGroup);
    }
}

// 收集表单数据
function collectFormData() {
    const incidentType = document.getElementById('incidentType').value;
    const formData = {
        incidentType: incidentType,
        accidentSubType: document.getElementById('accidentSubType').value,
        timestamp: new Date().toISOString()
    };
    
    // 根据类型收集不同的数据
    if (incidentType === 'hazard') {
        // 获取联动下拉组件的选择数据
        let unitData = [];
        if (typeof cascadingDropdownManager !== 'undefined') {
            const selections = cascadingDropdownManager.getCascadingSelections('hazardUnit');
            if (selections && Object.keys(selections).length > 0) {
                // 将联动选择转换为单位路径字符串
                const cascadingData = getCascadingDataFromMockData();
                const selectionInfo = getSelectionInfo(selections, cascadingData);
                unitData = selectionInfo.path;
            }
        } else {
            // 回退到标签下拉组件
            unitData = tagsDropdownManager.getSelectedTags('hazardUnit');
        }
        
        formData.hazard = {
            type: document.getElementById('hazardType').value,
            unit: unitData,
            unitSelections: typeof cascadingDropdownManager !== 'undefined' ? cascadingDropdownManager.getCascadingSelections('hazardUnit') : null,
            checkTime: document.getElementById('hazardCheckTime').value,
            checkLocation: document.getElementById('hazardCheckLocation').value,
            problemCategory: document.getElementById('hazardProblemCategory').value,
            problem: document.getElementById('hazardProblem').value,
            typical: document.querySelector('input[name="hazardTypical"]:checked')?.value === 'true',
            remarks: document.getElementById('hazardRemarks').value,
            attachments: collectFileData('hazardAttachments')
        };
    } else if (incidentType === 'accident' || incidentType === 'case' || incidentType === 'suicide') {
        // 获取联动下拉组件的选择数据
        let unitData = [];
        if (typeof cascadingDropdownManager !== 'undefined') {
            const selections = cascadingDropdownManager.getCascadingSelections('otherUnit');
            if (selections && Object.keys(selections).length > 0) {
                // 将联动选择转换为单位路径字符串
                const cascadingData = getCascadingDataFromMockData();
                const selectionInfo = getSelectionInfo(selections, cascadingData);
                unitData = selectionInfo.path;
            }
        } else {
            // 回退到标签下拉组件
            unitData = tagsDropdownManager.getSelectedTags('otherUnit');
        }
        
        formData.other = {
            time: document.getElementById('otherTime').value,
            problemCategory: document.getElementById('otherProblemCategory').value,
            problemLevel: document.getElementById('otherProblemLevel').value,
            unit: unitData,
            unitSelections: typeof cascadingDropdownManager !== 'undefined' ? cascadingDropdownManager.getCascadingSelections('otherUnit') : null,
            process: document.getElementById('otherProcess').value,
            deaths: document.getElementById('otherDeaths').value,
            responsibleCount: document.getElementById('otherResponsibleCount').value,
            responsible: collectResponsibleData(),
            remarks: document.getElementById('otherRemarks').value,
            attachments: collectFileData('otherAttachments')
        };
    }
    
    return formData;
}

// 收集文件数据
function collectFileData(inputId) {
    const fileInput = document.getElementById(inputId);
    if (!fileInput || !fileInput.dataset.existingFiles) {
        return [];
    }
    
    try {
        const existingFiles = JSON.parse(fileInput.dataset.existingFiles);
        return existingFiles.map(fileInfo => ({
            name: fileInfo.name,
            size: fileInfo.size,
            type: fileInfo.type,
            lastModified: fileInfo.lastModified
        }));
    } catch (e) {
        return [];
    }
}

// 收集责任人数据
function collectResponsibleData() {
    const responsible = [];
    const count = parseInt(document.getElementById('otherResponsibleCount').value) || 0;
    
    for (let i = 1; i <= count; i++) {
        responsible.push({
            identity: document.getElementById(`responsible_identity_${i}`)?.value || '',
            rank: document.getElementById(`responsible_rank_${i}`)?.value || '',
            position: document.getElementById(`responsible_position_${i}`)?.value || ''
        });
    }
    
    return responsible;
}

// 验证表单数据
function validateFormData(formData) {
    const errors = [];
    
    // 验证事故类型
    if (!formData.incidentType) {
        errors.push('请选择事故类型');
    }
    
    // 根据类型验证不同字段
    if (formData.incidentType === 'hazard') {
        if (!formData.hazard.type) {
            errors.push('请选择检查类型');
        }
        if (!formData.hazard.unit || formData.hazard.unit.length === 0) {
            errors.push('请选择单位');
        }
        if (!formData.hazard.checkTime) {
            errors.push('请选择检查时间');
        }
        if (!formData.hazard.problemCategory) {
            errors.push('请选择问题类别');
        }
        if (!formData.hazard.problem) {
            errors.push('请填写具体问题');
        }
    } else if (formData.incidentType === 'accident' || formData.incidentType === 'case' || formData.incidentType === 'suicide') {
        if (!formData.other.time) {
            errors.push('请选择时间');
        }
        if (!formData.other.problemCategory) {
            errors.push('请选择问题类别');
        }
        if (!formData.other.problemLevel) {
            errors.push('请选择问题等级');
        }
        if (!formData.other.unit || formData.other.unit.length === 0) {
            errors.push('请选择单位');
        }
        if (!formData.other.process) {
            errors.push('请填写经过');
        }
    }
    
    return errors;
}

// 验证联动下拉组件的选择
function validateCascadingSelection(componentId, requiredLevels = []) {
    if (typeof cascadingDropdownManager === 'undefined') {
        return { isValid: true, message: '' };
    }
    
    const selections = cascadingDropdownManager.getCascadingSelections(componentId);
    if (!selections || Object.keys(selections).length === 0) {
        return { isValid: false, message: '请选择完整的单位路径' };
    }
    
    // 检查是否选择了所有必需层级
    if (requiredLevels.length > 0) {
        for (const level of requiredLevels) {
            if (!selections[level]) {
                return { isValid: false, message: `请选择${level}级别` };
            }
        }
    }
    
    return { isValid: true, message: '' };
}

// 获取联动下拉组件的显示文本
function getCascadingDisplayText(componentId) {
    if (typeof cascadingDropdownManager === 'undefined') {
        return '';
    }
    
    const selections = cascadingDropdownManager.getCascadingSelections(componentId);
    if (!selections || Object.keys(selections).length === 0) {
        return '';
    }
    
    const cascadingData = getCascadingDataFromMockData();
    const selectionInfo = getSelectionInfo(selections, cascadingData);
    return selectionInfo.path.join(' > ');
}

// 重置联动下拉组件
function resetCascadingComponent(componentId) {
    if (typeof cascadingDropdownManager !== 'undefined') {
        cascadingDropdownManager.clearCascadingSelections(componentId);
    }
}

// 设置联动下拉组件的选择
function setCascadingSelection(componentId, selections) {
    if (typeof cascadingDropdownManager !== 'undefined') {
        cascadingDropdownManager.setCascadingSelections(componentId, selections);
    }
}

// 提交表单数据
function submitFormData(formData) {
    // 这里可以添加实际的数据提交逻辑
    
    // 模拟提交成功
    showMessage('数据提交成功！', 'success');
    
    // 重置表单
    document.getElementById('dataEntryForm').reset();
    
    // 重置单选下拉框
    document.getElementById('otherProblemCategory').value = '';
    document.getElementById('otherProblemLevel').value = '';
    document.getElementById('hazardProblemCategory').value = '';
    
    // 清空多选组件
    tagsDropdownManager.clearSelectedTags('hazardUnit');
    tagsDropdownManager.clearSelectedTags('otherUnit');
    updateResponsibleFields();
    
    // 隐藏所有表单
    document.getElementById('hazardForm').style.display = 'none';
    document.getElementById('otherForm').style.display = 'none';
    document.getElementById('accidentSubTypeDiv').style.display = 'none';
    
    // 清除选择的计划名称显示和帮助文本
    const selectedPlanNameSpan = document.getElementById('selectedPlanName');
    const planRequired = document.getElementById('planRequired');
    const planHelpText = document.getElementById('planHelpText');
    const planSelectDiv = document.getElementById('planSelectDiv');
    const planSelectButton = document.querySelector('#planSelectDiv button');
    
    // 检查处相关元素
    const checkLocationDiv = document.getElementById('checkLocationDiv');
    const checkLocationInput = document.getElementById('hazardCheckLocation');
    
    if (selectedPlanNameSpan) {
        selectedPlanNameSpan.textContent = '';
        selectedPlanNameSpan.style.display = 'none';
    }
    if (planRequired) {
        planRequired.style.display = 'none';
    }
    if (planHelpText) {
        planHelpText.style.display = 'none';
    }
    if (planSelectDiv) {
        planSelectDiv.style.display = 'none';
        planSelectDiv.style.opacity = '1';
    }
    if (planSelectButton) {
        planSelectButton.disabled = false;
        planSelectButton.classList.remove('disabled');
    }
    
    // 重置检查处字段
    if (checkLocationDiv) {
        checkLocationDiv.style.display = 'none';
    }
    if (checkLocationInput) {
        checkLocationInput.value = '';
    }
    
    // 重置文件列表
    const hazardAttachments = document.getElementById('hazardAttachments');
    const otherAttachments = document.getElementById('otherAttachments');
    const hazardAttachmentsList = document.getElementById('hazardAttachmentsList');
    const otherAttachmentsList = document.getElementById('otherAttachmentsList');
    const hazardAttachmentsDisplay = document.getElementById('hazardAttachmentsDisplay');
    const otherAttachmentsDisplay = document.getElementById('otherAttachmentsDisplay');
    
    if (hazardAttachments) {
        hazardAttachments.value = '';
        delete hazardAttachments.dataset.existingFiles;
    }
    if (otherAttachments) {
        otherAttachments.value = '';
        delete otherAttachments.dataset.existingFiles;
    }
    if (hazardAttachmentsList) {
        hazardAttachmentsList.innerHTML = '';
    }
    if (otherAttachmentsList) {
        otherAttachmentsList.innerHTML = '';
    }
    if (hazardAttachmentsDisplay) {
        hazardAttachmentsDisplay.value = '';
        hazardAttachmentsDisplay.placeholder = '选择文件...';
    }
    if (otherAttachmentsDisplay) {
        otherAttachmentsDisplay.value = '';
        otherAttachmentsDisplay.placeholder = '选择文件...';
    }
}

// 清空表单记忆
function clearFormMemory() {
    console.log('清空表单记忆...');
    
    // 清空联动下拉组件的自定义数据
    if (typeof cascadingDropdownManager !== 'undefined') {
        // 清空所有联动组件的选择
        cascadingDropdownManager.components.forEach((component, id) => {
            cascadingDropdownManager.clearCascadingSelections(id);
        });
        
        // 清空自定义数据
        cascadingDropdownManager.customData.clear();
        cascadingDropdownManager.saveCustomData();
        
        // 清空临时存储数据
        const tempStorageKeys = [
            'hazardUnit_temp', 'otherUnit_temp', 
            'hazardQueryUnit_temp', 'otherQueryUnit_temp', 'generalQueryUnit_temp'
        ];
        tempStorageKeys.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.warn('清空临时存储失败:', key, error);
            }
        });
    }
    
    // 清空标签下拉组件的选择
    if (typeof tagsDropdownManager !== 'undefined') {
        // 获取所有标签组件ID并清空
        const tagComponentIds = [
            'hazardUnit', 'otherUnit', 'hazardProblemCategory', 
            'otherProblemCategory', 'otherProblemLevel'
        ];
        
        tagComponentIds.forEach(id => {
            try {
                tagsDropdownManager.clearSelectedTags(id);
            } catch (error) {
                // 忽略不存在的组件
            }
        });
    }
    
    // 清空表单字段
    const formFields = [
        'incidentType', 'accidentSubType', 'hazardType', 'planSelection',
        'hazardCheckTime', 'hazardCheckLocation', 'hazardProblem',
        'hazardReasonAnalysis', 'hazardRemark', 'hazardAttachment',
        'otherTime', 'otherProblemCategory', 'otherProblemLevel',
        'otherProcess', 'otherDeaths', 'otherResponsibleCount',
        'otherReasonAnalysis', 'otherRemark', 'otherAttachment'
    ];
    
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (field.type === 'file') {
                // 清空文件输入
                field.value = '';
                // 清空文件列表显示
                const fileListContainer = document.getElementById(fieldId + 'List');
                if (fileListContainer) {
                    fileListContainer.innerHTML = '';
                }
                const displayInput = document.getElementById(fieldId + 'Display');
                if (displayInput) {
                    displayInput.value = '';
                    displayInput.placeholder = '选择文件...';
                }
            } else {
                field.value = '';
            }
        }
    });
    
    // 清空责任人信息
    const responsibleContainer = document.getElementById('responsibleContainer');
    if (responsibleContainer) {
        responsibleContainer.innerHTML = '';
    }
    
    // 重置表单类型
    const incidentTypeField = document.getElementById('incidentType');
    if (incidentTypeField) {
        incidentTypeField.value = '';
        // 触发类型变化事件，重置表单模板
        handleTypeChange();
    }
    
    // 隐藏所有表单模板
    const formTemplates = [
        'hazardForm', 'accidentForm', 'caseForm', 'suicideForm'
    ];
    
    formTemplates.forEach(templateId => {
        const template = document.getElementById(templateId);
        if (template) {
            template.style.display = 'none';
        }
    });
    
    // 重置查询表单
    const queryForm = document.getElementById('queryForm');
    if (queryForm) {
        queryForm.reset();
        
        // 隐藏查询结果
        const queryResults = document.getElementById('queryResults');
        if (queryResults) {
            queryResults.style.display = 'none';
        }
        
        // 隐藏查询条件区域
        const generalQueryConditions = document.getElementById('generalQueryConditions');
        const hazardQueryConditions = document.getElementById('hazardQueryConditions');
        const otherQueryConditions = document.getElementById('otherQueryConditions');
        
        if (generalQueryConditions) generalQueryConditions.style.display = 'none';
        if (hazardQueryConditions) hazardQueryConditions.style.display = 'none';
        if (otherQueryConditions) otherQueryConditions.style.display = 'none';
        
        // 清空查询单位选择
        if (typeof cascadingDropdownManager !== 'undefined') {
            cascadingDropdownManager.clearCascadingSelections('queryUnit');
        } else if (typeof tagsDropdownManager !== 'undefined') {
            tagsDropdownManager.clearSelectedTags('queryUnit');
        }
    }
    
    console.log('表单记忆已清空');
}
