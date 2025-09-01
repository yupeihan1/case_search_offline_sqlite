/**
 * 数据查询模块
 * 负责查询功能、结果处理和导出功能
 */

// 控制导出Excel按钮的显示
function updateExportExcelButtonVisibility() {
    const exportButton = document.querySelector('button[onclick="exportToExcel()"]');
    if (!exportButton) return;
    
    const incidentType = document.getElementById('queryIncidentType').value;
    const accidentSubType = document.getElementById('queryAccidentSubType').value;
    
    // 画面初期显示时，该按钮不显示
    if (!incidentType) {
        exportButton.style.display = 'none';
        return;
    }
    
    // 检查是否有查询结果
    if (currentQueryResults.length === 0) {
        exportButton.style.display = 'none';
        return;
    }
    
    // 根据类型判断是否显示导出按钮
    let shouldShow = false;
    
    if (incidentType === 'accident') {
        // 当类型选择了事故，事故类型选择了社会事故或者军队事故：显示导出Excel按钮
        if (accidentSubType === 'social' || accidentSubType === 'military') {
            shouldShow = true;
        }
    } else if (incidentType === 'case' || incidentType === 'suicide') {
        // 当类型选择了案件/自杀：显示导出Excel按钮
        shouldShow = true;
    } else if (incidentType === 'hazard') {
        // 当类型选择了问题隐患：显示导出Excel按钮
        shouldShow = true;
    }
    
    // 只有选择了单一类型时，才能使用导出excel功能
    exportButton.style.display = shouldShow ? 'inline-block' : 'none';
}

// 处理查询类型变化
function handleQueryTypeChange() {
    const incidentType = document.getElementById('queryIncidentType').value;
    const accidentSubTypeDiv = document.getElementById('queryAccidentSubTypeDiv');
    const generalQueryConditions = document.getElementById('generalQueryConditions');
    const hazardQueryConditions = document.getElementById('hazardQueryConditions');
    const otherQueryConditions = document.getElementById('otherQueryConditions');
    
    // 显示/隐藏事故子类型选择
    if (incidentType === 'accident') {
        accidentSubTypeDiv.style.display = 'block';
    } else {
        accidentSubTypeDiv.style.display = 'none';
        document.getElementById('queryAccidentSubType').value = '';
    }
    
    // 显示/隐藏查询条件
    if (incidentType === 'hazard') {
        generalQueryConditions.style.display = 'none';
        hazardQueryConditions.style.display = 'block';
        otherQueryConditions.style.display = 'none';
        updateQueryDropdowns();
        // 初始化问题隐患的单位选择组件
        setTimeout(() => {
            initQueryUnitDropdown();
        }, 100);
    } else if (incidentType === 'accident' || incidentType === 'case' || incidentType === 'suicide') {
        generalQueryConditions.style.display = 'none';
        hazardQueryConditions.style.display = 'none';
        otherQueryConditions.style.display = 'block';
        updateQueryDropdowns();
        // 初始化其他类型的单位选择组件
        setTimeout(() => {
            initQueryUnitDropdown();
        }, 100);
    } else {
        // 没有选择类型时，显示通用查询条件
        generalQueryConditions.style.display = 'block';
        hazardQueryConditions.style.display = 'none';
        otherQueryConditions.style.display = 'none';
    }
    
    // 当查询类型变化时，隐藏查询结果并清理分页器
    const queryResults = document.getElementById('queryResults');
    if (queryResults) {
        queryResults.style.display = 'none';
    }
    
    if (queryPagination) {
        queryPagination.destroy();
        queryPagination = null;
    }
    currentQueryResults = [];
    
    // 更新导出Excel按钮的显示状态
    updateExportExcelButtonVisibility();
    
    // 添加事故子类型变化的事件监听器
    const accidentSubTypeSelect = document.getElementById('queryAccidentSubType');
    if (accidentSubTypeSelect) {
        // 移除之前的事件监听器（如果存在）
        accidentSubTypeSelect.removeEventListener('change', updateExportExcelButtonVisibility);
        // 添加新的事件监听器
        accidentSubTypeSelect.addEventListener('change', updateExportExcelButtonVisibility);
    }
}

// 更新查询下拉组件
function updateQueryDropdowns() {
    // 检查 tagsDropdownManager 是否可用
    if (typeof tagsDropdownManager === 'undefined') {
        console.error('tagsDropdownManager 未初始化');
        return;
    }
    
    const incidentType = document.getElementById('queryIncidentType').value;
    const accidentSubType = document.getElementById('queryAccidentSubType').value;
    
    // 更新问题隐患问题类别下拉
    const hazardCategoryContainer = document.getElementById('queryProblemCategoryContainer');
    if (hazardCategoryContainer && incidentType === 'hazard') {
        // 问题隐患的问题类别选项
        const hazardProblemCategories = [
            '安全检查', '消防安全', '装备安全', '训练安全', '车辆安全', 
            '人员安全', '信息安全', '保密安全', '食品安全', '医疗安全',
            '环境安全', '施工安全', '运输安全', '仓储安全', '通信安全',
            '电力安全', '燃气安全', '危险品安全', '特种设备安全', '其他'
        ];
        
        hazardCategoryContainer.innerHTML = `
            <select class="form-control" id="queryProblemCategory">
                <option value="">请选择问题类别</option>
                ${hazardProblemCategories.map(category => `<option value="${category}">${category}</option>`).join('')}
            </select>
            <div class="form-text">点击选择问题类别，支持自定义。</div>
        `;
    }
    
    // 更新问题类别下拉
    const categoryContainer = document.getElementById('queryOtherProblemCategoryContainer');
    if (categoryContainer) {
        let categories = [];
        if (incidentType === 'accident') {
            if (accidentSubType === 'military') {
                categories = problemCategories.military;
            } else if (accidentSubType === 'social') {
                categories = problemCategories.social;
            } else {
                categories = [...problemCategories.military, ...problemCategories.social];
            }
        } else if (incidentType === 'case') {
            categories = problemCategories.case;
        } else if (incidentType === 'suicide') {
            categories = problemCategories.suicide;
        }
        
        if (categories.length > 0) {
            categoryContainer.innerHTML = `
                <select class="form-control" id="queryOtherProblemCategory">
                    <option value="">请选择问题类别</option>
                    ${categories.map(category => `<option value="${category}">${category}</option>`).join('')}
                </select>
                <div class="form-text">点击选择问题类别，支持自定义。</div>
            `;
        }
    }
    
    // 更新问题等级下拉
    const levelContainer = document.getElementById('queryProblemLevelContainer');
    if (levelContainer) {
        levelContainer.innerHTML = `
            <select class="form-control" id="queryProblemLevel">
                <option value="">请选择问题等级</option>
                ${problemLevels.map(level => `<option value="${level}">${level}</option>`).join('')}
            </select>
            <div class="form-text">点击选择问题等级。</div>
        `;
    }
}

// 初始化查询单位下拉组件
function initQueryUnitDropdown() {
    const incidentType = document.getElementById('queryIncidentType')?.value || '';
    
    // 根据查询类型选择对应的容器
    let containerId = '';
    let componentId = '';
    
    if (incidentType === 'hazard') {
        containerId = 'hazardQueryUnitContainer';
        componentId = 'hazardQueryUnit';
    } else if (incidentType === 'accident' || incidentType === 'case' || incidentType === 'suicide') {
        containerId = 'otherQueryUnitContainer';
        componentId = 'otherQueryUnit';
    } else {
        // 没有选择类型时，使用通用容器
        containerId = 'generalQueryUnitContainer';
        componentId = 'generalQueryUnit';
    }
    
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`未找到容器: ${containerId}`);
        return;
    }
    
    // 使用联动下拉组件替代标签下拉组件
    if (typeof cascadingDropdownManager !== 'undefined') {
        // 从mock_data.js获取数据
        const cascadingData = getCascadingDataFromMockData();
        
        cascadingDropdownManager.createCascadingComponent({
            id: componentId,
            container: container,
            data: cascadingData,
            showPath: true,
            showSearch: true,
            maxHeight: 250,
            enablePersistence: false, // 不启用持久化，避免影响其他组件
            storageKey: `${componentId}_temp`, // 使用临时存储键
            onSelectionChange: function(selectionData) {
                console.log('查询单位选择变化:', selectionData);
                // 可以在这里添加选择验证逻辑
            },
            onCustomAdd: function(level, value) {
                console.log('添加自定义单位:', level, value);
            }
        });
    } else {
        // 如果联动下拉组件未加载，回退到原来的标签下拉组件
        tagsDropdownManager.createTagsComponent({
            id: componentId,
            container: container,
            options: unitOptions,
            placeholder: '点击选择单位',
            selectedText: '已选择 {count} 个单位',
            previewLabel: '已选单位:',
            allowCustom: false,
            helpText: '点击选择单位，支持多选，不支持自定义。',
            onTagsChange: function(selectedTags) {
                // 标签选择回调
            }
        });
    }
}

// 执行查询
function executeQuery() {
    const incidentType = document.getElementById('queryIncidentType').value;
    const accidentSubType = document.getElementById('queryAccidentSubType').value;
    const startDate = document.getElementById('queryStartDate').value;
    const endDate = document.getElementById('queryEndDate').value;
    
    // 获取选中的单位（联动下拉组件）
    let selectedUnits = [];
    if (typeof cascadingDropdownManager !== 'undefined') {
        // 根据查询类型获取对应的单位选择组件ID
        let unitComponentId = '';
        if (incidentType === 'hazard') {
            unitComponentId = 'hazardQueryUnit';
        } else if (incidentType === 'accident' || incidentType === 'case' || incidentType === 'suicide') {
            unitComponentId = 'otherQueryUnit';
        } else {
            unitComponentId = 'generalQueryUnit';
        }
        
        const selections = cascadingDropdownManager.getCascadingSelections(unitComponentId);
        if (selections && Object.keys(selections).length > 0) {
            // 将联动选择转换为单位路径字符串
            const cascadingData = getCascadingDataFromMockData();
            const selectionInfo = getSelectionInfo(selections, cascadingData);
            selectedUnits = selectionInfo.path;
        }
    } else if (typeof tagsDropdownManager !== 'undefined') {
        // 回退到标签下拉组件
        const unitComponentId = incidentType === 'hazard' ? 'hazardQueryUnit' : 
                               (incidentType === 'accident' || incidentType === 'case' || incidentType === 'suicide') ? 'otherQueryUnit' : 'generalQueryUnit';
        selectedUnits = tagsDropdownManager.getSelectedTags(unitComponentId);
    }
    
    // 先销毁旧的分页器，确保从第一页开始
    if (queryPagination) {
        queryPagination.destroy();
        queryPagination = null;
    }
    
    // 过滤数据
    let filteredData = mockData.filter(item => {
        // 基本类型过滤
        if (incidentType && item.type !== incidentType) return false;
        
        // 事故子类型过滤
        if (incidentType === 'accident' && accidentSubType && item.accidentSubType !== accidentSubType) return false;
        
        // 时间范围过滤
        if (startDate || endDate) {
            const itemDate = item.type === 'hazard' ? item.checkTime : item.time;
            if (startDate && itemDate < startDate) return false;
            if (endDate && itemDate > endDate) return false;
        }
        
        // 单位过滤（联动选择）
        if (selectedUnits.length > 0) {
            // 检查数据项的单位是否匹配选中的单位路径
            const itemUnitPath = Array.isArray(item.unit) ? item.unit : [item.unit];
            const hasMatchingUnit = selectedUnits.some(selectedUnit => {
                // 如果选中的是完整路径，检查是否包含数据项的单位
                if (Array.isArray(selectedUnit)) {
                    return selectedUnit.some(unit => itemUnitPath.includes(unit));
                } else {
                    return itemUnitPath.includes(selectedUnit);
                }
            });
            if (!hasMatchingUnit) return false;
        }
        
        // 问题隐患特定过滤
        if (incidentType === 'hazard') {
            const hazardType = document.getElementById('queryHazardType').value;
            let selectedProblemCategories = [];
            
            // 获取选中的问题类别
            const selectedProblemCategory = document.getElementById('queryProblemCategory').value;
            
            // 获取选中的通报条件
            const selectedTypical = document.querySelector('input[name="queryTypical"]:checked')?.value || '';
            
            if (hazardType && item.hazardType !== hazardType) return false;
            if (selectedProblemCategory && item.problemCategory !== selectedProblemCategory) return false;
            if (selectedTypical && item.typical.toString() !== selectedTypical) return false;
        }
        
        // 其他类型特定过滤
        if (incidentType !== 'hazard') {
            // 获取选中的问题类别和等级
            const selectedCategory = document.getElementById('queryOtherProblemCategory').value;
            const selectedLevel = document.getElementById('queryProblemLevel').value;
            
            if (selectedCategory && item.problemCategory !== selectedCategory) return false;
            if (selectedLevel && item.problemLevel !== selectedLevel) return false;
        }
        
        return true;
    });
    
    // 按时间倒序排序
    filteredData.sort((a, b) => {
        const dateA = a.type === 'hazard' ? a.checkTime : a.time;
        const dateB = b.type === 'hazard' ? b.checkTime : b.time;
        
        // 如果日期为空，将其排到最后
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        // 按时间倒序排列（最新的在前）
        return new Date(dateB) - new Date(dateA);
    });
    
    // 保存当前查询结果
    currentQueryResults = filteredData;
    
    // 初始化查询分页器
    initQueryPagination(filteredData);
    
    // 更新导出Excel按钮的显示状态
    updateExportExcelButtonVisibility();
}

// 初始化查询分页器
function initQueryPagination(data) {
    const resultsDiv = document.getElementById('queryResults');
    const resultCount = document.getElementById('resultCount');
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (data.length === 0) {
        showMessage('未找到符合条件的记录', 'warning');
        resultsDiv.style.display = 'none';
        return;
    }
    
    // 更新结果数量
    resultCount.textContent = `共找到 ${data.length} 条记录`;
    
    // 创建分页器，强制从第一页开始
    queryPagination = createPagination(paginationContainer, {
        itemsPerPage: 10,
        totalItems: data.length,
        currentPage: 1, // 强制设置为第一页
        urlSync: false, // 禁用URL同步，避免页码信息保存在URL中
        onPageChange: function(page, range) {
            renderQueryResults();
        }
    });
    
    // 强制确保分页器在第一页
    if (queryPagination && queryPagination.options.currentPage !== 1) {
        queryPagination.options.currentPage = 1;
    }
    
    // 显示第一页数据
    renderQueryResults();
    resultsDiv.style.display = 'block';
}

// 渲染查询结果（使用全局分页器）
function renderQueryResults() {
    const tableBody = document.getElementById('resultsTableBody');
    const tableHead = document.querySelector('#resultsTable thead tr');
    
    // 使用全局分页器获取当前页数据
    const currentPageData = queryPagination.getPageData(currentQueryResults);
    
    // 根据查询类型更新表头
    const incidentType = document.getElementById('queryIncidentType').value;
    if (incidentType === 'hazard') {
        // 问题隐患类型：包含通报列
        tableHead.innerHTML = `
            <th>序号</th>
            <th>类型</th>
            <th>时间</th>
            <th>单位</th>
            <th>问题描述</th>
            <th>通报</th>
            <th>原因分析</th>
            <th>操作</th>
        `;
    } else {
        // 其他类型：不包含通报列
        tableHead.innerHTML = `
            <th>序号</th>
            <th>类型</th>
            <th>时间</th>
            <th>单位</th>
            <th>问题描述</th>
            <th>原因分析</th>
            <th>操作</th>
        `;
    }
    
    // 清空表格
    tableBody.innerHTML = '';
    
    // 生成表格行
    currentPageData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = 'result-row';
        
        const typeText = getTypeText(item);
        const timeText = item.type === 'hazard' ? item.checkTime : item.time;
        const problemText = item.type === 'hazard' ? item.problem : item.process;
        
        // 计算全局序号（考虑分页）
        const globalIndex = (queryPagination.options.currentPage - 1) * queryPagination.options.itemsPerPage + index + 1;
        
        // 根据类型生成不同的表格行
        if (item.type === 'hazard') {
            // 问题隐患类型：包含通报信息
            row.innerHTML = `
                <td>${globalIndex}</td>
                <td>${typeText}</td>
                <td>${timeText}</td>
                <td>${item.unit}</td>
                <td>${problemText}</td>
                <td>${item.typical ? '是' : '否'}</td>
                <td>
                    <div class="reason-stamp ${getReasonStampClass(item.reasonAnalysis)}">${item.reasonAnalysis}</div>
                </td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" onclick="showDetail(${index})" title="查看详情">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button type="button" class="btn btn-outline-warning" onclick="editRecord(${index})" title="修改">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteRecord(${index})" title="删除">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;
        } else {
            // 其他类型：不包含通报信息
            row.innerHTML = `
                <td>${globalIndex}</td>
                <td>${typeText}</td>
                <td>${timeText}</td>
                <td>${item.unit}</td>
                <td>${problemText}</td>
                <td>
                    <div class="reason-stamp ${getReasonStampClass(item.reasonAnalysis)}">${item.reasonAnalysis}</div>
                </td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" onclick="showDetail(${index})" title="查看详情">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button type="button" class="btn btn-outline-warning" onclick="editRecord(${index})" title="修改">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteRecord(${index})" title="删除">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;
        }
        
        tableBody.appendChild(row);
    });
}

// 导出Excel
function exportToExcel() {
    const incidentType = document.getElementById('queryIncidentType').value;
    
    // 检查是否有查询结果
    if (currentQueryResults.length === 0) {
        showMessage('请先执行查询', 'warning');
        return;
    }
    
    if (incidentType === 'hazard') {
        exportHazardExcel();
    } else if (incidentType) {
        exportOtherExcel();
    } else {
        // 如果没有选择类型，导出所有数据
        exportAllDataExcel();
    }
}

// 导出问题隐患Excel
function exportHazardExcel() {
    // 使用当前查询结果
    const data = currentQueryResults.filter(item => item.type === 'hazard');
    
    if (data.length === 0) {
        showMessage('当前查询结果中没有问题隐患数据', 'warning');
        return;
    }
    
    // 生成Excel内容
    let excelContent = '问题隐患月度汇总表\n\n';
    excelContent += '序号,检查类型,单位,检查时间,问题类别,具体问题,是否典型,原因分析\n';
    
    data.forEach((item, index) => {
        const problemCategoryText = Array.isArray(item.problemCategory) ? item.problemCategory.join('、') : item.problemCategory;
        excelContent += `${index + 1},${getTypeText(item)},${item.unit},${item.checkTime},${problemCategoryText},${item.problem},${item.typical ? '是' : '否'},${item.reasonAnalysis}\n`;
    });
    
    // 创建下载链接
    const blob = new Blob([excelContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `问题隐患月度汇总表_${new Date().toISOString().slice(0, 7)}.csv`;
    link.click();
    
    showMessage(`问题隐患汇总表导出成功！共导出 ${data.length} 条记录`, 'success');
}

// 导出其他类型Excel
function exportOtherExcel() {
    const incidentType = document.getElementById('queryIncidentType').value;
    const accidentSubType = document.getElementById('queryAccidentSubType').value;
    
    // 使用当前查询结果
    let data = currentQueryResults.filter(item => item.type === incidentType);
    
    if (data.length === 0) {
        showMessage(`当前查询结果中没有${getTypeText({ type: incidentType, accidentSubType })}数据`, 'warning');
        return;
    }
    
    if (incidentType === 'accident' && accidentSubType) {
        data = data.filter(item => item.accidentSubType === accidentSubType);
    }
    
    // 生成Excel内容
    let excelContent = `${getTypeText({ type: incidentType, accidentSubType })}统计表\n\n`;
    excelContent += '序号,时间,单位,问题类别,问题等级,经过,亡人,责任人,原因分析\n';
    
    data.forEach((item, index) => {
        const responsible = item.responsible.map(p => p.identity).join(';');
        const problemCategoryText = Array.isArray(item.problemCategory) ? item.problemCategory.join('、') : item.problemCategory;
        excelContent += `${index + 1},${item.time},${item.unit},${problemCategoryText},${item.problemLevel},${item.process},${item.deaths || 0},${responsible},${item.reasonAnalysis}\n`;
    });
    
    // 创建下载链接
    const blob = new Blob([excelContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${getTypeText({ type: incidentType, accidentSubType })}统计表_${new Date().toISOString().slice(0, 7)}.csv`;
    link.click();
    
    showMessage(`${getTypeText({ type: incidentType, accidentSubType })}统计表导出成功！共导出 ${data.length} 条记录`, 'success');
}

// 导出所有数据Excel
function exportAllDataExcel() {
    // 使用当前查询结果
    const data = currentQueryResults;
    
    if (data.length === 0) {
        showMessage('当前查询结果中没有数据', 'warning');
        return;
    }
    
    // 生成Excel内容
    let excelContent = '所有问题数据统计表\n\n';
    excelContent += '序号,类型,时间,单位,问题描述,原因分析\n';
    
    data.forEach((item, index) => {
        const typeText = getTypeText(item);
        const timeText = item.type === 'hazard' ? item.checkTime : item.time;
        const problemText = item.type === 'hazard' ? item.problem : item.process;
        
        excelContent += `${index + 1},${typeText},${timeText},${item.unit},${problemText},${item.reasonAnalysis}\n`;
    });
    
    // 创建下载链接
    const blob = new Blob([excelContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `所有问题数据统计表_${new Date().toISOString().slice(0, 7)}.csv`;
    link.click();
    
    showMessage(`所有问题数据统计表导出成功！共导出 ${data.length} 条记录`, 'success');
}

// 重置查询条件
function resetQueryForm() {
    // 重置基本查询条件
    document.getElementById('queryIncidentType').value = '';
    document.getElementById('queryAccidentSubType').value = '';
    document.getElementById('queryStartDate').value = '';
    document.getElementById('queryEndDate').value = '';
    
    // 重置联动下拉组件
    if (typeof cascadingDropdownManager !== 'undefined') {
        // 清空所有查询单位选择组件
        const unitComponentIds = ['hazardQueryUnit', 'otherQueryUnit', 'generalQueryUnit'];
        unitComponentIds.forEach(id => {
            cascadingDropdownManager.clearCascadingSelections(id);
        });
    } else if (typeof tagsDropdownManager !== 'undefined') {
        // 回退到标签下拉组件
        const unitComponentIds = ['hazardQueryUnit', 'otherQueryUnit', 'generalQueryUnit'];
        unitComponentIds.forEach(id => {
            tagsDropdownManager.clearSelectedTags(id);
        });
    }
    
    // 重置问题隐患查询条件
    document.getElementById('queryHazardType').value = '';
    document.getElementById('queryProblemCategory').value = '';
    document.querySelector('input[name="queryTypical"][value=""]').checked = true;
    
    // 重置其他类型查询条件
    if (typeof tagsDropdownManager !== 'undefined') {
        tagsDropdownManager.clearSelectedTags('queryOtherProblemCategory');
        tagsDropdownManager.clearSelectedTags('queryProblemLevel');
    }
    
    // 隐藏查询结果
    document.getElementById('queryResults').style.display = 'none';
    
    // 销毁分页器
    if (queryPagination) {
        queryPagination.destroy();
        queryPagination = null;
    }
    
    showMessage('查询条件已重置', 'info');
}

// 获取联动下拉组件的显示文本
function getQueryUnitDisplayText() {
    if (typeof cascadingDropdownManager === 'undefined') {
        return '';
    }
    
    const selections = cascadingDropdownManager.getCascadingSelections('queryUnit');
    if (!selections || Object.keys(selections).length === 0) {
        return '';
    }
    
    const cascadingData = getCascadingDataFromMockData();
    const selectionInfo = getSelectionInfo(selections, cascadingData);
    return selectionInfo.path.join(' > ');
}

// 验证联动下拉组件的选择
function validateQueryUnitSelection() {
    if (typeof cascadingDropdownManager === 'undefined') {
        return { isValid: true, message: '' };
    }
    
    const selections = cascadingDropdownManager.getCascadingSelections('queryUnit');
    if (!selections || Object.keys(selections).length === 0) {
        return { isValid: true, message: '' }; // 允许不选择单位
    }
    
    // 检查是否选择了完整的路径（至少选择到基层级别）
    const requiredLevels = ['military_branch', 'theater', 'base', 'department', 'unit'];
    for (const level of requiredLevels) {
        if (!selections[level]) {
            return { isValid: false, message: `请选择完整的单位路径，当前缺少${level}级别` };
        }
    }
    
    return { isValid: true, message: '' };
}
