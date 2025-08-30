// 计划创建模块（简化版本）

// 生成计划
function generatePlans() {
    const startDate = document.getElementById('startDate').value;
    const rounds = document.getElementById('rounds').value;
    const checkType = document.querySelector('input[name="createCheckType"]:checked').value;
    
    if (!startDate || !rounds) {
        alert('请填写开始时间和轮次');
        return;
    }
    
    if (rounds < 1 || rounds > 52) {
        alert('轮次必须在1-52之间');
        return;
    }
    
    // 生成计划列表
    const plansList = document.getElementById('plansList');
    plansList.innerHTML = '';
    
    for (let i = 0; i < rounds; i++) {
        const planHtml = generatePlanItem(i + 1, startDate, checkType);
        plansList.innerHTML += planHtml;
    }
    
    // 显示生成的计划
    document.getElementById('generatedPlans').style.display = 'block';
    
    // 延迟初始化标签下拉组件，确保DOM完全渲染
    setTimeout(() => {
        initializePlanTagsComponents(rounds, checkType);
    }, 200);
}

// 生成单个计划项
function generatePlanItem(round, startDate, checkType) {
    const start = new Date(startDate);
    start.setDate(start.getDate() + (round - 1) * 7);
    
    // 调整到周一
    const dayOfWeek = start.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    start.setDate(start.getDate() - daysToMonday);
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // 周日
    
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    
    // 从mock数据中获取预定义的数据
    const leaders = planManagementData.personnel.leaders;
    const inspectors = planManagementData.personnel.inspectors;
    const leadDepts = planManagementData.tags.departments;
    const accompanyDepts = planManagementData.tags.departments;
    const orgUnits = planManagementData.tags.orgUnits;
    const basicUnits = planManagementData.tags.basicUnits;
    const focusPoints = planManagementData.focusPoints;
    
    if (checkType === 'leader') {
        const leader = leaders[(round - 1) % leaders.length];
        const leadDept = leadDepts[(round - 1) % leadDepts.length];
        const accompanyDept = accompanyDepts[(round - 1) % accompanyDepts.length];
        const selectedOrgUnit = orgUnits[(round - 1) % orgUnits.length];
        const selectedBasicUnits = basicUnits.slice((round - 1) * 5 % basicUnits.length, ((round - 1) * 5 % basicUnits.length) + 5);
        if (selectedBasicUnits.length < 5) {
            selectedBasicUnits.push(...basicUnits.slice(0, 5 - selectedBasicUnits.length));
        }
        const focusPoint = focusPoints[(round - 1) % focusPoints.length];
        
        return `
            <div class="generated-plan-item">
                <div class="row">
                    <div class="col-md-2">
                        <label class="form-label">时间段</label>
                        <input type="text" class="form-control" value="${startStr} 至 ${endStr}" readonly>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">首长</label>
                        <select class="form-control plan-leader" data-round="${round}">
                            <option value="${leader}" selected>${leader}</option>
                            ${leaders.map(l => `<option value="${l}">${l}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">牵头处</label>
                        <select class="form-control plan-lead-dept" data-round="${round}">
                            <option value="${leadDept}" selected>${leadDept}</option>
                            ${leadDepts.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">陪同处</label>
                        <select class="form-control plan-accompany-dept" data-round="${round}">
                            <option value="${accompanyDept}" selected>${accompanyDept}</option>
                            ${accompanyDepts.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">机关单位</label>
                        <div class="plan-org-unit-container" data-round="${round}"></div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">基层单位</label>
                        <div class="plan-basic-units-container" data-round="${round}"></div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12">
                        <label class="form-label">检查重点</label>
                        <input type="text" class="form-control plan-focus-point" value="${focusPoint}" data-round="${round}">
                    </div>
                </div>
            </div>
        `;
    } else {
        const inspector = inspectors[(round - 1) % inspectors.length];
        const selectedOrgUnit = orgUnits[(round - 1) % orgUnits.length];
        const selectedBasicUnits = basicUnits.slice((round - 1) * 5 % basicUnits.length, ((round - 1) * 5 % basicUnits.length) + 5);
        if (selectedBasicUnits.length < 5) {
            selectedBasicUnits.push(...basicUnits.slice(0, 5 - selectedBasicUnits.length));
        }
        const focusPoint = focusPoints[(round - 1) % focusPoints.length];
        
        return `
            <div class="generated-plan-item">
                <div class="row">
                    <div class="col-md-3">
                        <label class="form-label">时间段</label>
                        <input type="text" class="form-control" value="${startStr} 至 ${endStr}" readonly>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">检查人</label>
                        <select class="form-control plan-inspector" data-round="${round}">
                            <option value="${inspector}" selected>${inspector}</option>
                            ${inspectors.map(i => `<option value="${i}">${i}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">机关单位</label>
                        <div class="plan-org-unit-container" data-round="${round}"></div>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">基层单位</label>
                        <div class="plan-basic-units-container" data-round="${round}"></div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12">
                        <label class="form-label">检查重点</label>
                        <input type="text" class="form-control plan-focus-point" value="${focusPoint}" data-round="${round}">
                    </div>
                </div>
            </div>
        `;
    }
}

// 确认计划
function confirmPlans() {
    const startDate = document.getElementById('startDate').value;
    const rounds = document.getElementById('rounds').value;
    const checkType = document.querySelector('input[name="createCheckType"]:checked').value;
    
    if (!startDate || !rounds) {
        alert('请先生成计划');
        return;
    }
    
    // 将生成的计划添加到planData中
    const start = new Date(startDate);
    
    for (let i = 0; i < rounds; i++) {
        const planStart = new Date(start);
        planStart.setDate(start.getDate() + i * 7);
        
        // 调整到周一
        const dayOfWeek = planStart.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        planStart.setDate(planStart.getDate() - daysToMonday);
        
        const planEnd = new Date(planStart);
        planEnd.setDate(planStart.getDate() + 6);
        
        const planStartStr = planStart.toISOString().split('T')[0];
        const planEndStr = planEnd.toISOString().split('T')[0];
        
        const newPlan = {
            id: Date.now() + i, // 临时ID
            type: checkType,
            planStartDate: planStartStr,
            planEndDate: planEndStr,
            actualDate: null,
            actualUnits: null
        };
        
        if (checkType === 'leader') {
            // 读取用户修改后的数据
            const leaderInput = document.querySelector(`.plan-leader[data-round="${i + 1}"]`);
            const leadDeptInput = document.querySelector(`.plan-lead-dept[data-round="${i + 1}"]`);
            const accompanyDeptInput = document.querySelector(`.plan-accompany-dept[data-round="${i + 1}"]`);
            const focusPointInput = document.querySelector(`.plan-focus-point[data-round="${i + 1}"]`);
            
            // 读取标签下拉组件的值
            const orgUnits = tagsDropdownManager.getSelectedTags(`planOrgUnit${i + 1}`);
            const basicUnits = tagsDropdownManager.getSelectedTags(`planBasicUnits${i + 1}`);
            
            newPlan.leader = leaderInput ? leaderInput.value : '张司令';
            newPlan.leadDept = leadDeptInput ? leadDeptInput.value : '作战处';
            newPlan.accompanyDept = accompanyDeptInput ? [accompanyDeptInput.value] : ['政治处'];
            newPlan.units = [...orgUnits, ...basicUnits];
            newPlan.focusPoint = focusPointInput ? focusPointInput.value : '战备训练情况';
        } else {
            // 读取用户修改后的数据
            const inspectorInput = document.querySelector(`.plan-inspector[data-round="${i + 1}"]`);
            const focusPointInput = document.querySelector(`.plan-focus-point[data-round="${i + 1}"]`);
            
            // 读取标签下拉组件的值
            const orgUnits = tagsDropdownManager.getSelectedTags(`planOrgUnit${i + 1}`);
            const basicUnits = tagsDropdownManager.getSelectedTags(`planBasicUnits${i + 1}`);
            
            newPlan.inspector = inspectorInput ? inspectorInput.value : '王参谋';
            newPlan.units = [...orgUnits, ...basicUnits];
            newPlan.focusPoint = focusPointInput ? focusPointInput.value : '战备训练情况';
        }
        
        planData.unshift(newPlan);
    }
    
    showSuccessMessage(`成功生成并确认 ${rounds} 个计划！`);
    resetPlans();
    
    // 切换到初期显示tab页
    const displayTab = document.getElementById('plan-display-tab');
    const displayTabInstance = new bootstrap.Tab(displayTab);
    displayTabInstance.show();
    
    // 重新加载计划列表
    loadPlanList();
}

// 重置计划
function resetPlans() {
    document.getElementById('generatedPlans').style.display = 'none';
    document.getElementById('startDate').value = '';
    document.getElementById('rounds').value = '';
    
    // 清理标签下拉组件
    const plansList = document.getElementById('plansList');
    if (plansList) {
        plansList.innerHTML = '';
    }
}

// 初始化制定计划页面的标签下拉组件
function initializePlanTagsComponents(rounds, checkType) {
    const orgUnits = planManagementData.tags.orgUnits;
    const basicUnits = planManagementData.tags.basicUnits;
    
    for (let i = 1; i <= rounds; i++) {
        // 初始化机关单位标签组件
        const orgUnitContainer = document.querySelector(`.plan-org-unit-container[data-round="${i}"]`);
        if (orgUnitContainer) {
            try {
                const component = tagsDropdownManager.createTagsComponent({
                    id: `planOrgUnit${i}`,
                    container: orgUnitContainer,
                    options: orgUnits,
                    selectedTags: [orgUnits[(i - 1) % orgUnits.length]]
                });
                
                // 立即更新组件显示状态
                setTimeout(() => {
                    tagsDropdownManager.updateTagsComponent(`planOrgUnit${i}`);
                    updateDropdownItemColors(`planOrgUnit${i}`);
                }, 50);
            } catch (error) {
                console.error(`机关单位组件 ${i} 初始化失败:`, error);
            }
        }
        
        // 初始化基层单位标签组件
        const basicUnitsContainer = document.querySelector(`.plan-basic-units-container[data-round="${i}"]`);
        if (basicUnitsContainer) {
            const selectedBasicUnits = basicUnits.slice((i - 1) * 5 % basicUnits.length, ((i - 1) * 5 % basicUnits.length) + 5);
            if (selectedBasicUnits.length < 5) {
                selectedBasicUnits.push(...basicUnits.slice(0, 5 - selectedBasicUnits.length));
            }
            
            try {
                const component = tagsDropdownManager.createTagsComponent({
                    id: `planBasicUnits${i}`,
                    container: basicUnitsContainer,
                    options: basicUnits,
                    selectedTags: selectedBasicUnits
                });
                
                // 立即更新组件显示状态
                setTimeout(() => {
                    tagsDropdownManager.updateTagsComponent(`planBasicUnits${i}`);
                    updateDropdownItemColors(`planBasicUnits${i}`);
                }, 50);
            } catch (error) {
                console.error(`基层单位组件 ${i} 初始化失败:`, error);
            }
        }
    }
}

// 更新下拉列表项的颜色，显示选中状态
function updateDropdownItemColors(componentId) {
    const component = tagsDropdownManager.components.get(componentId);
    if (!component) return;
    
    const menu = document.getElementById(`${componentId}_menu`);
    if (!menu) return;
    
    // 获取所有标签项
    const tagItems = menu.querySelectorAll('.tags-dropdown-item');
    
    tagItems.forEach(item => {
        const tagValue = item.getAttribute('data-value');
        
        // 移除之前的选中样式
        item.classList.remove('selected');
        item.style.backgroundColor = '';
        item.style.color = '';
        
        // 如果标签在已选列表中，添加选中样式
        if (component.selectedTags.includes(tagValue)) {
            item.classList.add('selected');
            item.style.backgroundColor = '#007bff';
            item.style.color = '#ffffff';
        }
    });
}
