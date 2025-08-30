// 计划显示模块

// 加载计划列表
function loadPlanList() {
    const planList = document.getElementById('planList');
    const filteredData = planData.filter(plan => plan.type === currentCheckType);
    
    // 按时间由新到旧排序
    filteredData.sort((a, b) => new Date(b.planStartDate) - new Date(a.planStartDate));
    
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
        const rateResult = executionRateCalculator.calculate(plan.units, plan.actualUnits);
        const rateClass = rateResult.rate >= 80 ? 'text-success' : rateResult.rate >= 60 ? 'text-warning' : 'text-danger';
        executionRateHtml = `
            <div class="mt-2">
                <span class="badge bg-light text-dark">
                    <i class="bi bi-percent me-1"></i>执行率：<span class="${rateClass} fw-bold">${rateResult.displayText}</span>
                </span>
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
    
    // 生成检查结果徽章
    let checkResultBadge = '';
    if (plan.checkResult && plan.checkResult.trim() !== '') {
        const badgeClass = plan.checkResult === '优秀' ? 'bg-success' : 
                          plan.checkResult === '良好' ? 'bg-primary' : 'bg-warning';
        checkResultBadge = `<span class="badge ${badgeClass} position-absolute top-0 end-0 m-2">${plan.checkResult}</span>`;
    }
    
    return `
        <div class="plan-item ${statusClass} position-relative" data-plan-id="${plan.id}" data-check-type="${plan.type}">
            ${checkResultBadge}
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
    
    let unitsHtml = `<p class="mb-1"><strong>检查单位：</strong>`;
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
    
    let checkResultHtml = '';
    if (plan.checkResult && plan.checkResult.trim() !== '') {
        const resultClass = plan.checkResult === '优秀' ? 'text-success' : 
                           plan.checkResult === '良好' ? 'text-primary' : 'text-warning';
        checkResultHtml = `<p class="mb-1"><strong>检查结果：</strong><span class="${resultClass} fw-bold">${plan.checkResult}</span></p>`;
    }
    
    return timeRangeHtml + leaderHtml + leadDeptHtml + accompanyDeptHtml + unitsHtml + checkResultHtml;
}

// 生成日常检查计划内容
function generateDailyPlanContent(plan) {
    let timeRangeHtml = `<h6 class="mb-2">检查时间段：${plan.planStartDate} 至 ${plan.planEndDate}`;
    if (plan.actualDate) {
        timeRangeHtml += ` <span class="text-success">（实际：${plan.actualDate}）</span>`;
    }
    timeRangeHtml += '</h6>';
    
    let inspectorHtml = `<p class="mb-1"><strong>检查人：</strong>`;
    if (plan.actualDate && plan.actualInspector && plan.actualInspector !== plan.inspector) {
        inspectorHtml += `<span class="text-danger">${plan.actualInspector}</span>`;
    } else {
        inspectorHtml += plan.inspector;
    }
    inspectorHtml += '</p>';
    
    let unitsHtml = `<p class="mb-1"><strong>检查单位：</strong>`;
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
    
    let checkResultHtml = '';
    if (plan.checkResult && plan.checkResult.trim() !== '') {
        const resultClass = plan.checkResult === '优秀' ? 'text-success' : 
                           plan.checkResult === '良好' ? 'text-primary' : 'text-warning';
        checkResultHtml = `<p class="mb-1"><strong>检查结果：</strong><span class="${resultClass} fw-bold">${plan.checkResult}</span></p>`;
    }
    
    return timeRangeHtml + inspectorHtml + unitsHtml + checkResultHtml;
}

// 执行检索
function performSearch() {
    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;
    const leader = document.getElementById('filterLeader').value;
    const leadDept = tagsDropdownManager.getSelectedTags('filterLeadDept');
    const accompanyDept = tagsDropdownManager.getSelectedTags('filterAccompanyDept');
    const inspector = document.getElementById('filterInspector').value;
    const units = tagsDropdownManager.getSelectedTags('filterUnits');
    const checkResult = document.getElementById('filterCheckResult').value;
    
    // 筛选数据
    let filteredData = planData.filter(plan => plan.type === currentCheckType);
    
    if (startDate) {
        filteredData = filteredData.filter(plan => plan.planStartDate >= startDate);
    }
    if (endDate) {
        filteredData = filteredData.filter(plan => plan.planEndDate <= endDate);
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
    }
    
    if (units.length > 0) {
        filteredData = filteredData.filter(plan => 
            units.some(unit => (plan.units || []).includes(unit))
        );
    }
    
    if (checkResult) {
        filteredData = filteredData.filter(plan => plan.checkResult === checkResult);
    }
    
    // 按时间由新到旧排序
    filteredData.sort((a, b) => new Date(b.planStartDate) - new Date(a.planStartDate));
    
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
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';
    document.getElementById('filterLeader').value = '';
    document.getElementById('filterInspector').value = '';
    document.getElementById('filterCheckResult').value = '';
    tagsDropdownManager.clearSelectedTags('filterUnits');
    tagsDropdownManager.clearSelectedTags('filterLeadDept');
    tagsDropdownManager.clearSelectedTags('filterAccompanyDept');
    
    // 重新加载完整列表
    loadPlanList();
}

// 更新执行率统计
function updateExecutionRateStats(plans) {
    const statsContainer = document.getElementById('executionRateStats');
    const overallRateElement = document.getElementById('overallRate');
    const totalPlansCountElement = document.getElementById('totalPlansCount');
    const completedPlansCountElement = document.getElementById('completedPlansCount');
    const totalPlannedUnitsElement = document.getElementById('totalPlannedUnits');
    const totalActualUnitsElement = document.getElementById('totalActualUnits');
    const excellentCountElement = document.getElementById('excellentCount');
    const goodCountElement = document.getElementById('goodCount');
    const improveCountElement = document.getElementById('improveCount');
    
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
    
    // 计算总体执行率（使用加权平均）
    const overallResult = executionRateCalculator.calculateOverallRate(completedPlans);
    
    // 更新统计显示
    overallRateElement.textContent = overallResult.displayText;
    completedPlansCountElement.textContent = completedPlans.length;
    totalPlannedUnitsElement.textContent = overallResult.details.totalPlannedCount;
    
    // 计算总实际检查单位数（用于显示）
    let totalActualUnits = 0;
    completedPlans.forEach(plan => {
        if (plan.actualUnits && Array.isArray(plan.actualUnits)) {
            // 去重计算实际单位数
            const uniqueActualUnits = [...new Set(plan.actualUnits.map(unit => String(unit).trim()))];
            totalActualUnits += uniqueActualUnits.length;
        }
    });
    totalActualUnitsElement.textContent = totalActualUnits;
    
    // 根据执行率设置颜色
    const rateClass = overallResult.rate >= 80 ? 'text-success' : 
                     overallResult.rate >= 60 ? 'text-warning' : 'text-danger';
    overallRateElement.className = `h4 mb-1 ${rateClass}`;
    
    // 计算检查结果分布
    let excellentCount = 0;
    let goodCount = 0;
    let improveCount = 0;
    
    completedPlans.forEach(plan => {
        if (plan.checkResult === '优秀') {
            excellentCount++;
        } else if (plan.checkResult === '良好') {
            goodCount++;
        } else if (plan.checkResult === '需改进') {
            improveCount++;
        }
        // 空白的检查结果不计入统计
    });
    
    // 更新检查结果分布显示
    excellentCountElement.textContent = `优秀 ${excellentCount}`;
    goodCountElement.textContent = `良好 ${goodCount}`;
    improveCountElement.textContent = `需改进 ${improveCount}`;
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
