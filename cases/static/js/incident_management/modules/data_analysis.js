/**
 * 数据分析模块
 * 负责数据分析功能和AI分析
 */

// 处理分析类型变化
function handleAnalysisTypeChange() {
    const incidentType = document.getElementById('analysisIncidentType').value;
    const accidentSubTypeDiv = document.getElementById('analysisAccidentSubTypeDiv');
    const hazardConditions = document.getElementById('analysisHazardConditions');
    const otherConditions = document.getElementById('analysisOtherConditions');
    
    // 显示/隐藏事故子类型选择
    if (incidentType === 'accident') {
        accidentSubTypeDiv.style.display = 'block';
    } else {
        accidentSubTypeDiv.style.display = 'none';
        document.getElementById('analysisAccidentSubType').value = '';
    }
    
    // 显示/隐藏分析条件
    if (incidentType === 'hazard') {
        hazardConditions.style.display = 'block';
        otherConditions.style.display = 'none';
        updateAnalysisDropdowns();
    } else if (incidentType === 'accident' || incidentType === 'case' || incidentType === 'suicide') {
        hazardConditions.style.display = 'none';
        otherConditions.style.display = 'block';
        updateAnalysisDropdowns();
    } else {
        // 当类型为空或未选择时，隐藏所有特定条件
        hazardConditions.style.display = 'none';
        otherConditions.style.display = 'none';
    }
    
    // 隐藏分析结果
    document.getElementById('analysisResults').style.display = 'none';
}

// 更新分析下拉组件
function updateAnalysisDropdowns() {
    const incidentType = document.getElementById('analysisIncidentType').value;
    const accidentSubType = document.getElementById('analysisAccidentSubType').value;
    
    // 更新问题隐患问题类别下拉
    const hazardCategoryContainer = document.getElementById('analysisProblemCategoryContainer');
    if (hazardCategoryContainer && incidentType === 'hazard') {
        // 问题隐患的问题类别选项
        const hazardProblemCategories = [
            '安全检查', '消防安全', '装备安全', '训练安全', '车辆安全', 
            '人员安全', '信息安全', '保密安全', '食品安全', '医疗安全',
            '环境安全', '施工安全', '运输安全', '仓储安全', '通信安全',
            '电力安全', '燃气安全', '危险品安全', '特种设备安全', '其他'
        ];
        
        tagsDropdownManager.createTagsComponent({
            id: 'analysisProblemCategory',
            container: hazardCategoryContainer,
            options: hazardProblemCategories,
            placeholder: '点击选择问题类别',
            selectedText: '已选择 {count} 个问题类别',
            previewLabel: '已选问题类别:',
            allowCustom: true,
            helpText: '点击选择问题类别，支持多选和自定义。',
            maxCustomLength: 20
        });
    }
    
    // 更新问题类别下拉
    const categoryContainer = document.getElementById('analysisOtherProblemCategoryContainer');
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
                id: 'analysisOtherProblemCategory',
                container: categoryContainer,
                options: categories,
                placeholder: '请选择问题类别',
                selectedText: '已选择 {count} 个问题类别',
                previewLabel: '已选问题类别:',
                allowCustom: true,
                helpText: '点击选择问题类别，支持自定义。',
                maxCustomLength: 20
            });
        } else {
            // 当类型为空时，清空容器
            categoryContainer.innerHTML = '';
        }
    }
    
    // 更新问题等级下拉
    const levelContainer = document.getElementById('analysisProblemLevelContainer');
    if (levelContainer) {
        if (incidentType && incidentType !== 'hazard') {
            tagsDropdownManager.createTagsComponent({
                id: 'analysisProblemLevel',
                container: levelContainer,
                options: problemLevels,
                placeholder: '请选择问题等级',
                selectedText: '已选择 {count} 个问题等级',
                previewLabel: '已选问题等级:',
                allowCustom: false,
                helpText: '点击选择问题等级，支持自定义。'
            });
        } else {
            // 当类型为空时，清空容器
            levelContainer.innerHTML = '';
        }
    }
}

// 执行数据分析
function executeAnalysis() {
    const incidentType = document.getElementById('analysisIncidentType').value;
    const accidentSubType = document.getElementById('analysisAccidentSubType').value;
    const startDate = document.getElementById('analysisStartDate').value;
    const endDate = document.getElementById('analysisEndDate').value;
    const unit = document.getElementById('analysisUnit').value;
    const reason = document.getElementById('analysisReason').value;
    
    // 过滤数据
    let filteredData = mockData.filter(item => {
        // 基本类型过滤 - 如果选择了类型才过滤，否则包含所有类型
        if (incidentType && item.type !== incidentType) return false;
        
        // 事故子类型过滤 - 只有在选择了事故类型时才过滤
        if (incidentType === 'accident' && accidentSubType && item.accidentSubType !== accidentSubType) return false;
        
        // 时间范围过滤
        if (startDate || endDate) {
            const itemDate = item.type === 'hazard' ? item.checkTime : item.time;
            if (startDate && itemDate < startDate) return false;
            if (endDate && itemDate > endDate) return false;
        }
        
        // 单位过滤
        if (unit && !item.unit.includes(unit)) return false;
        
        // 原因过滤
        if (reason && item.reasonAnalysis !== reason) return false;
        
        // 问题隐患特定过滤 - 只有在选择了问题隐患类型时才过滤
        if (incidentType === 'hazard') {
            const hazardType = document.getElementById('analysisHazardType').value;
            let selectedProblemCategories = [];
            
            // 安全地获取选中的问题类别标签
            if (typeof tagsDropdownManager !== 'undefined') {
                selectedProblemCategories = tagsDropdownManager.getSelectedTags('analysisProblemCategory');
            }
            
            if (hazardType && item.hazardType !== hazardType) return false;
            if (selectedProblemCategories.length > 0) {
                // 处理problemCategory可能是数组或字符串的情况
                const itemCategories = Array.isArray(item.problemCategory) ? item.problemCategory : [item.problemCategory];
                if (!itemCategories.some(cat => selectedProblemCategories.includes(cat))) return false;
            }
        }
        
        // 其他类型特定过滤 - 只有在选择了非问题隐患类型时才过滤
        if (incidentType && incidentType !== 'hazard') {
            let selectedCategories = [];
            let selectedLevels = [];
            
            if (typeof tagsDropdownManager !== 'undefined') {
                selectedCategories = tagsDropdownManager.getSelectedTags('analysisOtherProblemCategory');
                selectedLevels = tagsDropdownManager.getSelectedTags('analysisProblemLevel');
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
    
    // 保存分析数据
    analysisData = filteredData;
    
    // 显示分析结果
    document.getElementById('analysisResults').style.display = 'block';
    document.getElementById('analysisResultCount').textContent = `共分析 ${filteredData.length} 条记录`;
    
    // 生成图表 - 传入时间范围参数用于确定图表类型
    generateCharts(filteredData, startDate, endDate);
    
    // 调用AI分析
    callAIAnalysis(filteredData);
}

// 调用AI分析
function callAIAnalysis(data) {
    const aiContent = document.getElementById('aiAnalysisContent');
    
    // 模拟AI分析过程
    setTimeout(() => {
        const analysisText = generateAIAnalysis(data);
        aiContent.innerHTML = `
            <div class="analysis-content">
                <h6>分析摘要</h6>
                <p>${analysisText.summary}</p>
                
                <h6>主要发现</h6>
                <ul>
                    ${analysisText.findings.map(finding => `<li>${finding}</li>`).join('')}
                </ul>
                
                <h6>建议措施</h6>
                <ul>
                    ${analysisText.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
                
                <h6>风险评估</h6>
                <p>${analysisText.riskAssessment}</p>
            </div>
        `;
    }, 2000);
}

// 生成AI分析文本
function generateAIAnalysis(data) {
    const totalCount = data.length;
    const reasonStats = {};
    const unitStats = {};
    
    data.forEach(item => {
        reasonStats[item.reasonAnalysis] = (reasonStats[item.reasonAnalysis] || 0) + 1;
        unitStats[item.unit] = (unitStats[item.unit] || 0) + 1;
    });
    
    const mainReason = Object.keys(reasonStats).reduce((a, b) => reasonStats[a] > reasonStats[b] ? a : b);
    const mainUnit = Object.keys(unitStats).reduce((a, b) => unitStats[a] > unitStats[b] ? a : b);
    
    return {
        summary: `基于对${totalCount}条记录的分析，发现主要问题集中在${mainReason}方面，${mainUnit}是问题多发单位。`,
        findings: [
            `共发现${totalCount}起事件，其中${mainReason}类问题占比最高`,
            `${mainUnit}是问题多发单位，需要重点关注`,
            `时间分布显示问题存在周期性特征`,
            `管理原因和环境原因也是重要影响因素`
        ],
        recommendations: [
            `加强${mainUnit}的安全管理，定期开展安全检查`,
            `针对${mainReason}类问题制定专项整改措施`,
            `建立问题预警机制，及时发现和处置隐患`,
            `加强人员培训，提高安全意识`
        ],
        riskAssessment: `当前风险等级：中等。建议加强预防措施，定期评估风险变化。`
    };
}

// 导出分析PDF
function exportAnalysisPDF() {
    if (analysisData.length === 0) {
        showMessage('请先执行数据分析', 'warning');
        return;
    }
    
    // 模拟PDF导出
    showMessage('PDF导出功能开发中，请稍候...', 'info');
    
    // 这里可以集成实际的PDF导出库，如jsPDF
    // 导出包含图表和分析结果的PDF报告
}
