// 计划显示模块

// 加载计划列表
function loadPlanList() {
    const planList = document.getElementById('planList');
    const filteredData = planData.filter(plan => plan.type === currentCheckType);
    
    // 按与当前时间最近排序（与当前时间最近的计划排在最前面）
    const currentDate = new Date();
    filteredData.sort((a, b) => {
        const dateA = new Date(a.planStartDate);
        const dateB = new Date(b.planStartDate);
        const diffA = Math.abs(currentDate - dateA);
        const diffB = Math.abs(currentDate - dateB);
        return diffA - diffB; // 时间差越小排在越前面
    });
    
    planList.innerHTML = '';
    
    filteredData.forEach(plan => {
        const planHtml = generatePlanItemHtml(plan);
        planList.innerHTML += planHtml;
    });
    
    // 更新执行率统计
    updateExecutionRateStats(filteredData);
}

// 生成计划项HTML
function generatePlanItemHtml(plan) {
    const isUrgent = isPlanUrgent(plan);
    const isCompleted = plan.actualDate !== null;
    
    let statusClass = '';
    if (isUrgent) statusClass = 'urgent';
    else if (isCompleted) statusClass = 'completed';
    
    let contentHtml = '';
    
    if (plan.type === 'leader') {
        contentHtml = generateLeaderPlanContent(plan);
    } else {
        contentHtml = generateDailyPlanContent(plan);
    }
    
    // 计算执行率（仅对已完成的计划）
    let executionRateHtml = '';
    if (isCompleted && plan.units && plan.actualUnits) {
        // 计算计划执行率（PCR）
        const pcrResult = executionRateCalculator.calculate(plan.units, plan.actualUnits);
        const pcrClass = pcrResult.rate >= 80 ? 'text-success' : pcrResult.rate >= 60 ? 'text-warning' : 'text-danger';
        
        // 计算实际执行率（AR）
        const arResult = executionRateCalculator.calculateAchievementRatio(plan.units, plan.actualUnits);
        const arClass = arResult.rate >= 100 ? 'text-success' : arResult.rate >= 80 ? 'text-warning' : 'text-danger';
        
        // 计算计划偏移率（OPR）
        const oprResult = executionRateCalculator.calculateOffPlanRate(plan.units, plan.actualUnits);
        const oprClass = oprResult.rate <= 20 ? 'text-success' : oprResult.rate <= 40 ? 'text-warning' : 'text-danger';
        
        executionRateHtml = `
            <div class="mt-2">
                <div class="d-flex flex-wrap gap-2">
                    <span class="badge border text-dark">
                        <i class="bi bi-percent me-1"></i>计划执行率：<span class="${pcrClass} fw-bold">${pcrResult.displayText}</span>
                    </span>
                    <span class="badge border text-dark">
                        <i class="bi bi-graph-up me-1"></i>实际执行率：<span class="${arClass} fw-bold">${arResult.displayText}</span>
                    </span>
                    <span class="badge border text-dark">
                        <i class="bi bi-graph-down me-1"></i>计划偏移率：<span class="${oprClass} fw-bold">${oprResult.displayText}</span>
                    </span>
                </div>
            </div>
        `;
    }
    
    let buttonHtml = '';
    if (isUrgent) {
        buttonHtml = `
            <button class="btn btn-warning btn-sm me-2" onclick="showInfoInputModal(${plan.id}, 'execution')">
                <i class="bi bi-check-circle me-1" aria-hidden="true"></i>执行确认
            </button>
            <button class="btn btn-danger btn-sm" onclick="stopPlan(${plan.id})">
                <i class="bi bi-stop-circle me-1" aria-hidden="true"></i>计划停止
            </button>
        `;
    } else if (isCompleted) {
        buttonHtml = `<button class="btn btn-info btn-sm" onclick="showInfoInputModal(${plan.id}, 'edit')">
            <i class="bi bi-pencil me-1" aria-hidden="true"></i>信息修改
        </button>`;
    }
    
    return `
        <div class="plan-item ${statusClass} position-relative" data-plan-id="${plan.id}" data-check-type="${plan.type}">
            <div class="row align-items-center">
                <div class="col-md-8">
                    ${contentHtml}
                    ${executionRateHtml}
                </div>
                <div class="col-md-4 text-end">
                    ${buttonHtml}
                </div>
            </div>
        </div>
    `;
}

// 生成首长检查计划内容
function generateLeaderPlanContent(plan) {
    let timeRangeHtml = `<h6 class="mb-2">检查时间段：${plan.planStartDate} 至 ${plan.planEndDate}`;
    if (plan.actualDate) {
        timeRangeHtml += ` <span class="text-success">（实际：${plan.actualDate}）</span>`;
    }
    timeRangeHtml += '</h6>';
    
    let leaderHtml = `<p class="mb-1"><strong>首长：</strong>`;
    if (plan.actualDate && plan.actualLeader && plan.actualLeader !== plan.leader) {
        leaderHtml += `<span class="text-danger">${plan.actualLeader}</span>`;
    } else {
        leaderHtml += plan.leader;
    }
    leaderHtml += '</p>';
    
    let leadDeptHtml = `<p class="mb-1"><strong>牵头处：</strong>`;
    if (plan.actualDate && plan.actualLeadDept && plan.actualLeadDept !== plan.leadDept) {
        leadDeptHtml += `<span class="text-danger">${plan.actualLeadDept}</span>`;
    } else {
        leadDeptHtml += plan.leadDept;
    }
    leadDeptHtml += '</p>';
    
    let accompanyDeptHtml = `<p class="mb-1"><strong>陪同处：</strong>`;
    if (plan.actualDate && plan.actualAccompanyDept && JSON.stringify(plan.actualAccompanyDept) !== JSON.stringify(plan.accompanyDept)) {
        accompanyDeptHtml += `<span class="text-danger">${(plan.actualAccompanyDept || []).join('、')}</span>`;
    } else {
        accompanyDeptHtml += (plan.accompanyDept || []).join('、');
    }
    accompanyDeptHtml += '</p>';
    
    let unitsHtml = `<p class="mb-1"><strong>受检单位：</strong>`;
    if (plan.actualDate && plan.actualUnits) {
        const planUnits = plan.units || [];
        const actualUnits = plan.actualUnits || [];
        const notChecked = planUnits.filter(unit => !actualUnits.includes(unit));
        const extraChecked = actualUnits.filter(unit => !planUnits.includes(unit));
        
        let unitDisplay = [];
        planUnits.forEach(unit => {
            if (notChecked.includes(unit)) {
                unitDisplay.push(`<span class="text-danger text-decoration-line-through">${unit}</span>`);
            } else {
                unitDisplay.push(unit);
            }
        });
        
        extraChecked.forEach(unit => {
            unitDisplay.push(`<span class="text-danger">${unit}</span>`);
        });
        
        unitsHtml += unitDisplay.join('、');
    } else {
        unitsHtml += (plan.units || []).join('、');
    }
    unitsHtml += '</p>';
    
    let issueCountHtml = '';
    if (plan.issueCount !== undefined && plan.issueCount !== null) {
        issueCountHtml = `<p class="mb-1"><strong>发现问题数：</strong>${plan.issueCount}</p>`;
    }
    
    let remarksHtml = '';
    if (plan.remarks && plan.remarks.trim() !== '') {
        remarksHtml = `<p class="mb-1"><strong>备注：</strong>${plan.remarks}</p>`;
    }
    
    return timeRangeHtml + leaderHtml + leadDeptHtml + accompanyDeptHtml + unitsHtml + issueCountHtml + remarksHtml;
}

// 生成日常检查计划内容
function generateDailyPlanContent(plan) {
    let timeRangeHtml = `<h6 class="mb-2">检查时间段：${plan.planStartDate} 至 ${plan.planEndDate}`;
    if (plan.actualDate) {
        timeRangeHtml += ` <span class="text-success">（实际：${plan.actualDate}）</span>`;
    }
    timeRangeHtml += '</h6>';
    
    let deptHtml = `<p class="mb-1"><strong>检查处：</strong>`;
    if (plan.actualDate && plan.actualDept && plan.actualDept !== plan.dept) {
        deptHtml += `<span class="text-danger">${plan.actualDept}</span>`;
    } else {
        deptHtml += plan.dept || '未指定';
    }
    deptHtml += '</p>';
    
    let inspectorHtml = `<p class="mb-1"><strong>检查人：</strong>`;
    if (plan.actualDate && plan.actualInspector && plan.actualInspector !== plan.inspector) {
        inspectorHtml += `<span class="text-danger">${plan.actualInspector}</span>`;
    } else {
        inspectorHtml += plan.inspector;
    }
    inspectorHtml += '</p>';
    
    let unitsHtml = `<p class="mb-1"><strong>受检单位：</strong>`;
    if (plan.actualDate && plan.actualUnits) {
        const planUnits = plan.units || [];
        const actualUnits = plan.actualUnits || [];
        const notChecked = planUnits.filter(unit => !actualUnits.includes(unit));
        const extraChecked = actualUnits.filter(unit => !planUnits.includes(unit));
        
        let unitDisplay = [];
        planUnits.forEach(unit => {
            if (notChecked.includes(unit)) {
                unitDisplay.push(`<span class="text-danger text-decoration-line-through">${unit}</span>`);
            } else {
                unitDisplay.push(unit);
            }
        });
        
        extraChecked.forEach(unit => {
            unitDisplay.push(`<span class="text-danger">${unit}</span>`);
        });
        
        unitsHtml += unitDisplay.join('、');
    } else {
        unitsHtml += (plan.units || []).join('、');
    }
    unitsHtml += '</p>';
    
    let issueCountHtml = '';
    if (plan.issueCount !== undefined && plan.issueCount !== null) {
        issueCountHtml = `<p class="mb-1"><strong>发现问题数：</strong>${plan.issueCount}</p>`;
    }
    
    let remarksHtml = '';
    if (plan.remarks && plan.remarks.trim() !== '') {
        remarksHtml = `<p class="mb-1"><strong>备注：</strong>${plan.remarks}</p>`;
    }
    
    return timeRangeHtml + deptHtml + inspectorHtml + unitsHtml + issueCountHtml + remarksHtml;
}

// 执行检索
function performSearch() {
    const planStartDate = document.getElementById('filterPlanStartDate').value;
    const planEndDate = document.getElementById('filterPlanEndDate').value;
    const actualStartDate = document.getElementById('filterActualStartDate').value;
    const actualEndDate = document.getElementById('filterActualEndDate').value;
    const leader = document.getElementById('filterLeader').value;
    const leadDept = tagsDropdownManager.getSelectedTags('filterLeadDept');
    const accompanyDept = tagsDropdownManager.getSelectedTags('filterAccompanyDept');
    const inspector = document.getElementById('filterInspector').value;
    const dept = tagsDropdownManager.getSelectedTags('filterDept');
    const units = tagsDropdownManager.getSelectedTags('filterUnits');
    
    // 筛选数据
    let filteredData = planData.filter(plan => plan.type === currentCheckType);
    
    // 计划检查时间筛选
    if (planStartDate) {
        filteredData = filteredData.filter(plan => plan.planStartDate >= planStartDate);
    }
    if (planEndDate) {
        filteredData = filteredData.filter(plan => plan.planEndDate <= planEndDate);
    }
    
    // 实际检查时间筛选
    if (actualStartDate) {
        filteredData = filteredData.filter(plan => plan.actualDate && plan.actualDate >= actualStartDate);
    }
    if (actualEndDate) {
        filteredData = filteredData.filter(plan => plan.actualDate && plan.actualDate <= actualEndDate);
    }
    
    if (currentCheckType === 'leader') {
        if (leader) {
            filteredData = filteredData.filter(plan => plan.leader.includes(leader));
        }
        if (leadDept.length > 0) {
            filteredData = filteredData.filter(plan => 
                leadDept.some(dept => plan.leadDept.includes(dept))
            );
        }
        if (accompanyDept.length > 0) {
            filteredData = filteredData.filter(plan => 
                (plan.accompanyDept || []).some(planDept => 
                    accompanyDept.some(filterDept => planDept.includes(filterDept))
                )
            );
        }
    } else {
        if (inspector) {
            filteredData = filteredData.filter(plan => plan.inspector.includes(inspector));
        }
        if (dept.length > 0) {
            filteredData = filteredData.filter(plan => 
                plan.dept && dept.some(filterDept => plan.dept.includes(filterDept))
            );
        }
    }
    
    if (units.length > 0) {
        filteredData = filteredData.filter(plan => 
            units.some(unit => (plan.units || []).includes(unit))
        );
    }
    

    
    // 按与当前时间最近排序（与当前时间最近的计划排在最前面）
    const currentDate = new Date();
    filteredData.sort((a, b) => {
        const dateA = new Date(a.planStartDate);
        const dateB = new Date(b.planStartDate);
        const diffA = Math.abs(currentDate - dateA);
        const diffB = Math.abs(currentDate - dateB);
        return diffA - diffB; // 时间差越小排在越前面
    });
    
    // 更新显示
    const planList = document.getElementById('planList');
    planList.innerHTML = '';
    
    filteredData.forEach(plan => {
        const planHtml = generatePlanItemHtml(plan);
        planList.innerHTML += planHtml;
    });
    
    // 更新执行率统计
    updateExecutionRateStats(filteredData);
}

// 重置筛选条件
function resetFilter() {
    document.getElementById('filterPlanStartDate').value = '';
    document.getElementById('filterPlanEndDate').value = '';
    document.getElementById('filterActualStartDate').value = '';
    document.getElementById('filterActualEndDate').value = '';
    document.getElementById('filterLeader').value = '';
    document.getElementById('filterInspector').value = '';
    tagsDropdownManager.clearSelectedTags('filterUnits');
    tagsDropdownManager.clearSelectedTags('filterLeadDept');
    tagsDropdownManager.clearSelectedTags('filterAccompanyDept');
    tagsDropdownManager.clearSelectedTags('filterDept');
    
    // 重新加载完整列表
    loadPlanList();
}

// 更新执行率统计
function updateExecutionRateStats(plans) {
    const statsContainer = document.getElementById('executionRateStats');
    const totalPlansCountElement = document.getElementById('totalPlansCount');
    const completedPlansCountElement = document.getElementById('completedPlansCount');
    const incompletePlansCountElement = document.getElementById('incompletePlansCount');
    const totalPlannedUnitsElement = document.getElementById('totalPlannedUnits');
    const totalActualUnitsElement = document.getElementById('totalActualUnits');
    const totalOffPlanUnitsElement = document.getElementById('totalOffPlanUnits');
    const totalIssuesCountElement = document.getElementById('totalIssuesCount');
    
    // 更新总计划数
    totalPlansCountElement.textContent = plans.length;
    
    // 筛选已完成的计划
    const completedPlans = plans.filter(plan => plan.actualDate !== null);
    
    if (completedPlans.length === 0) {
        // 没有已完成的计划，隐藏统计区域
        statsContainer.style.display = 'none';
        return;
    }
    
    // 显示统计区域
    statsContainer.style.display = 'block';
    
    // 计算总体执行率（使用加权平均）用于获取计划单位总数
    const overallResult = executionRateCalculator.calculateOverallRate(completedPlans);
    
    // 更新统计显示
    completedPlansCountElement.textContent = completedPlans.length;
    incompletePlansCountElement.textContent = plans.length - completedPlans.length;
    totalPlannedUnitsElement.textContent = overallResult.details.totalPlannedCount;
    
    // 计算总实际受检单位数（用于显示）
    let totalActualUnits = 0;
    completedPlans.forEach(plan => {
        if (plan.actualUnits && Array.isArray(plan.actualUnits)) {
            // 去重计算实际单位数
            const uniqueActualUnits = [...new Set(plan.actualUnits.map(unit => String(unit).trim()))];
            totalActualUnits += uniqueActualUnits.length;
        }
    });
    totalActualUnitsElement.textContent = totalActualUnits;
    
    // 计算总偏离单位数
    let totalOffPlanUnits = 0;
    completedPlans.forEach(plan => {
        if (plan.units && plan.actualUnits && Array.isArray(plan.units) && Array.isArray(plan.actualUnits)) {
            const uniquePlannedUnits = [...new Set(plan.units.map(unit => String(unit).trim()))];
            const uniqueActualUnits = [...new Set(plan.actualUnits.map(unit => String(unit).trim()))];
            const symmetricDifference = uniquePlannedUnits.filter(unit => !uniqueActualUnits.includes(unit))
                .concat(uniqueActualUnits.filter(unit => !uniquePlannedUnits.includes(unit)));
            totalOffPlanUnits += symmetricDifference.length;
        }
    });
    totalOffPlanUnitsElement.textContent = totalOffPlanUnits;
    
    // 计算问题总数
    let totalIssuesCount = 0;
    completedPlans.forEach(plan => {
        if (plan.issueCount !== undefined && plan.issueCount !== null) {
            totalIssuesCount += plan.issueCount;
        }
    });
    totalIssuesCountElement.textContent = totalIssuesCount;
}



// 计划检索链接点击事件
document.addEventListener('DOMContentLoaded', function() {
    const planSearchLink = document.getElementById('planSearchLink');
    if (planSearchLink) {
        planSearchLink.addEventListener('click', function(e) {
            e.preventDefault();
            const filterSection = document.getElementById('filterSection');
            if (filterSection.style.display === 'none') {
                filterSection.style.display = 'block';
                this.innerHTML = '<i class="bi bi-chevron-up me-1" aria-hidden="true"></i>收起检索';
            } else {
                filterSection.style.display = 'none';
                this.innerHTML = '<i class="bi bi-search me-1" aria-hidden="true"></i>计划检索';
            }
        });
    }
});
