// 计划管理模块工具函数

// 获取类型文本
function getTypeText(item) {
    if (item.type === 'hazard') {
        const typeMap = {
            'chief': '首长检查',
            'daily': '日常检查',
            'comprehensive': '综合检查',
            'other': '其他'
        };
        return `问题隐患-${typeMap[item.hazardType] || ''}`;
    } else if (item.type === 'accident') {
        const subTypeMap = {
            'military': '军队事故',
            'social': '社会事故'
        };
        return `事故-${subTypeMap[item.accidentSubType] || ''}`;
    } else if (item.type === 'case') {
        return '案件';
    } else if (item.type === 'suicide') {
        return '自杀';
    }
    return '';
}

// 获取原因分析对应的CSS类
function getReasonStampClass(reason) {
    const reasonMap = {
        '人': 'reason-person',
        '物': 'reason-object',
        '环': 'reason-environment',
        '管': 'reason-management',
        '任': 'reason-responsibility'
    };
    return reasonMap[reason] || 'reason-person'; // 默认为人因
}

// 判断计划是否紧急（需要录入执行信息）
function isPlanUrgent(plan) {
    if (plan.actualDate) return false; // 已录入执行信息
    
    const planEndDate = new Date(plan.planEndDate);
    const now = new Date();
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);
    
    // 如果计划结束时间在上周，且未录入执行信息，则标记为紧急
    return planEndDate <= lastWeek;
}

// 生成检查历史提示
function generateCheckTooltip(checkHistory) {
    if (!checkHistory || checkHistory.length === 0) {
        return '暂无检查记录';
    }

    const recentChecks = checkHistory.slice(0, 5); // 只显示最近5次
    const checkItems = recentChecks.map(check => 
        `${check.date} ${check.type} (${check.inspector}) - ${check.result}`
    ).join('<br>');

    return `最近检查记录：<br>${checkItems}${checkHistory.length > 5 ? '<br>...' : ''}`;
}

// 构建单位树形结构
function buildUnitTree(units) {
    const unitMap = new Map();
    const rootUnits = [];

    // 创建单位映射
    units.forEach(unit => {
        unitMap.set(unit.id, { ...unit, children: [] });
    });

    // 构建父子关系
    units.forEach(unit => {
        const unitNode = unitMap.get(unit.id);
        if (unit.parentId && unitMap.has(unit.parentId)) {
            const parentNode = unitMap.get(unit.parentId);
            parentNode.children.push(unitNode);
        } else {
            rootUnits.push(unitNode);
        }
    });

    return rootUnits;
}

// 构建部门树形结构
function buildDepartmentTree(departments) {
    const deptMap = new Map();
    const rootDepartments = [];

    // 创建部门映射
    departments.forEach(dept => {
        deptMap.set(dept.id, { ...dept, children: [] });
    });

    // 构建父子关系
    departments.forEach(dept => {
        const deptNode = deptMap.get(dept.id);
        if (dept.parentId && deptMap.has(dept.parentId)) {
            const parentNode = deptMap.get(dept.parentId);
            parentNode.children.push(deptNode);
        } else {
            rootDepartments.push(deptNode);
        }
    });

    return rootDepartments;
}

// 生成层级路径
function generateHierarchyPath(unit) {
    const path = [unit.name];
    let current = unit;
    
    while (current.parentId) {
        const parent = unitData.find(u => u.id == current.parentId);
        if (parent) {
            path.unshift(parent.name);
            current = parent;
        } else {
            break;
        }
    }
    
    return path;
}

// 重建单位层级结构
function rebuildUnitHierarchy() {
    // 清空所有子单位
    unitData.forEach(unit => {
        unit.children = [];
        unit.hierarchy = [];
    });

    // 重新构建层级关系
    unitData.forEach(unit => {
        if (unit.parentId) {
            const parent = unitData.find(u => u.id == unit.parentId);
            if (parent) {
                parent.children.push(unit);
            }
        }
    });

    // 重新生成层级路径
    unitData.forEach(unit => {
        unit.hierarchy = generateHierarchyPath(unit);
    });
}

// 重建部门层级结构
function rebuildDepartmentHierarchy() {
    // 清空所有子部门
    departmentData.forEach(dept => {
        dept.children = [];
    });

    // 重新构建层级关系
    departmentData.forEach(dept => {
        if (dept.parentId) {
            const parent = departmentData.find(d => d.id == dept.parentId);
            if (parent) {
                parent.children.push(dept);
            }
        }
    });
}

// 更新上级单位选项
function updateParentUnitOptions() {
    const parentSelect = document.getElementById('parentUnit');
    const currentLevel = document.getElementById('unitLevel').value;
    
    if (!parentSelect) return;
    
    // 清空现有选项
    parentSelect.innerHTML = '<option value="">无上级单位</option>';
    
    // 根据当前级别添加合适的上级单位选项
    if (currentLevel === '机关') {
        // 机关只能选择基地作为上级
        const baseUnits = unitData.filter(u => u.level === '基地');
        baseUnits.forEach(unit => {
            const option = document.createElement('option');
            option.value = unit.id;
            option.textContent = unit.name;
            parentSelect.appendChild(option);
        });
    } else if (currentLevel === '基层') {
        // 基层可以选择机关作为上级
        const orgUnits = unitData.filter(u => u.level === '机关');
        orgUnits.forEach(unit => {
            const option = document.createElement('option');
            option.value = unit.id;
            option.textContent = unit.name;
            parentSelect.appendChild(option);
        });
    }
}

// 更新上级部门选项
function updateParentDepartmentOptions() {
    const parentSelect = document.getElementById('parentDepartment');
    const currentLevel = document.getElementById('departmentLevel').value;
    
    if (!parentSelect) return;
    
    // 清空现有选项
    parentSelect.innerHTML = '<option value="">无上级部门</option>';
    
    // 根据当前级别添加合适的上级部门选项
    if (currentLevel === '处') {
        // 处只能选择部作为上级
        const buDepartments = departmentData.filter(d => d.level === '部');
        buDepartments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name;
            parentSelect.appendChild(option);
        });
    } else if (currentLevel === '科') {
        // 科可以选择处作为上级
        const chuDepartments = departmentData.filter(d => d.level === '处');
        chuDepartments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name;
            parentSelect.appendChild(option);
        });
    }
}
