/**
 * 数据查询模块
 * 负责查询功能、结果处理和导出功能
 */

// 处理查询类型变化
function handleQueryTypeChange() {
    const incidentType = document.getElementById('queryIncidentType').value;
    const accidentSubTypeDiv = document.getElementById('queryAccidentSubTypeDiv');
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
        hazardQueryConditions.style.display = 'block';
        otherQueryConditions.style.display = 'none';
        updateQueryDropdowns();
    } else if (incidentType === 'accident' || incidentType === 'case' || incidentType === 'suicide') {
        hazardQueryConditions.style.display = 'none';
        otherQueryConditions.style.display = 'block';
        updateQueryDropdowns();
    } else {
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
        
        tagsDropdownManager.createTagsComponent({
            id: 'queryProblemCategory',
            container: hazardCategoryContainer,
            options: hazardProblemCategories,
            placeholder: '点击选择问题类别',
            allowCustom: true,
            helpText: '点击选择问题类别，支持多选和自定义。',
            maxCustomLength: 20
        });
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
            tagsDropdownManager.createTagsComponent({
                id: 'queryOtherProblemCategory',
                container: categoryContainer,
                options: categories,
                placeholder: '请选择问题类别',
                allowCustom: true,
                helpText: '点击选择问题类别，支持自定义。',
                maxCustomLength: 20
            });
        }
    }
    
    // 更新问题等级下拉
    const levelContainer = document.getElementById('queryProblemLevelContainer');
    if (levelContainer) {
        tagsDropdownManager.createTagsComponent({
            id: 'queryProblemLevel',
            container: levelContainer,
            options: problemLevels,
            placeholder: '请选择问题等级',
            allowCustom: false,
            helpText: '点击选择问题等级，支持自定义。'
        });
    }
}

// 初始化查询单位下拉组件
function initQueryUnitDropdown() {
    const container = document.getElementById('queryUnitContainer');
    
    if (!container) return;
    
    tagsDropdownManager.createTagsComponent({
        id: 'queryUnit',
        container: container,
        options: unitOptions,
        placeholder: '点击选择单位',
        allowCustom: false,
        helpText: '点击选择单位，支持多选，不支持自定义。',
        onTagsChange: function(selectedTags) {
            // 标签选择回调
        }
    });
}

// 执行查询
function executeQuery() {
    const incidentType = document.getElementById('queryIncidentType').value;
    const accidentSubType = document.getElementById('queryAccidentSubType').value;
    const startDate = document.getElementById('queryStartDate').value;
    const endDate = document.getElementById('queryEndDate').value;
    
    // 获取选中的单位（多选）
    let selectedUnits = [];
    if (typeof tagsDropdownManager !== 'undefined') {
        selectedUnits = tagsDropdownManager.getSelectedTags('queryUnit');
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
        
        // 单位过滤（多选）
        if (selectedUnits.length > 0 && !selectedUnits.includes(item.unit)) return false;
        
        // 问题隐患特定过滤
        if (incidentType === 'hazard') {
            const hazardType = document.getElementById('queryHazardType').value;
            let selectedProblemCategories = [];
            
            // 安全地获取选中的问题类别标签
            if (typeof tagsDropdownManager !== 'undefined') {
                selectedProblemCategories = tagsDropdownManager.getSelectedTags('queryProblemCategory');
            }
            
            if (hazardType && item.hazardType !== hazardType) return false;
            if (selectedProblemCategories.length > 0) {
                // 处理problemCategory可能是数组或字符串的情况
                const itemCategories = Array.isArray(item.problemCategory) ? item.problemCategory : [item.problemCategory];
                if (!itemCategories.some(cat => selectedProblemCategories.includes(cat))) return false;
            }
        }
        
        // 其他类型特定过滤
        if (incidentType !== 'hazard') {
            let selectedCategories = [];
            let selectedLevels = [];
            
            // 安全地获取选中的标签
            if (typeof tagsDropdownManager !== 'undefined') {
                selectedCategories = tagsDropdownManager.getSelectedTags('queryOtherProblemCategory');
                selectedLevels = tagsDropdownManager.getSelectedTags('queryProblemLevel');
            }
            
            if (selectedCategories.length > 0) {
                // 处理problemCategory可能是数组或字符串的情况
                const itemCategories = Array.isArray(item.problemCategory) ? item.problemCategory : [item.problemCategory];
                if (!itemCategories.some(cat => selectedCategories.includes(cat))) return false;
            }
            if (selectedLevels.length > 0 && !selectedLevels.includes(item.problemLevel)) return false;
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
    
    // 使用全局分页器获取当前页数据
    const currentPageData = queryPagination.getPageData(currentQueryResults);
    
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
