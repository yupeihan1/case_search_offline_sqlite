// 部门维护模块（简化版本）

// 初始化部门信息维护
function initializeDepartmentMaintenance() {
    // 加载初始部门数据
    loadInitialDepartmentData();
}

// 加载初始部门数据
function loadInitialDepartmentData() {
    // 从mock数据中获取部门数据
    if (planManagementData && planManagementData.departments) {
        departmentData = [...planManagementData.departments];
    } else {
        // 如果没有部门数据，使用空数组
        departmentData = [];
    }
    
    // 显示部门列表
    displayDepartments(departmentData);
}

// 显示部门列表
function displayDepartments(departments) {
    const container = document.getElementById('departmentListContainer');
    container.innerHTML = '';

    if (departments.length === 0) {
        container.innerHTML = '<div class="alert alert-info">暂无部门数据</div>';
        return;
    }

    // 构建树形结构
    const treeData = buildDepartmentTree(departments);
    
    // 生成树形HTML
    const treeHtml = generateDepartmentTreeHtml(treeData);
    container.innerHTML = treeHtml;
}

// 生成部门树形HTML
function generateDepartmentTreeHtml(treeData, level = 0) {
    let html = '';
    
    treeData.forEach((dept, index) => {
        const hasChildren = dept.children && dept.children.length > 0;
        
        html += generateDepartmentNodeHtml(dept, level, hasChildren);
        
        if (hasChildren) {
            html += `<div class="department-tree-children" id="dept-children-${dept.id}">`;
            html += generateDepartmentTreeHtml(dept.children, level + 1);
            html += '</div>';
        }
    });
    
    return html;
}

// 生成部门节点HTML
function generateDepartmentNodeHtml(dept, level, hasChildren) {
    // 生成折叠箭头
    let toggleArrow = '';
    if (hasChildren) {
        toggleArrow = `<i class="bi bi-chevron-down department-tree-toggle" onclick="toggleDepartmentChildren(${dept.id})" title="点击折叠/展开"></i>`;
    }
    
    // 级别标识
    const levelBadgeClass = dept.level === '部' ? 'dept-level-badge dept-level-bu' : 
                           dept.level === '处' ? 'dept-level-badge dept-level-chu' : 
                           'dept-level-badge dept-level-ke';
    const levelBadge = `<span class="${levelBadgeClass}">${dept.level}</span>`;

    // 根据级别设置不同的样式
    const itemClass = level === 0 ? 'department-tree-item dept-item-bu' : 
                     level === 1 ? 'department-tree-item dept-item-chu' : 
                     'department-tree-item dept-item-ke';

    return `
        <div class="${itemClass}" data-dept-id="${dept.id}">
            <div class="department-tree-content">
                ${toggleArrow}
                <div class="department-tree-info">
                    <div class="department-name">
                        ${dept.name}${levelBadge}
                    </div>
                    <div class="department-meta">
                        <span class="me-3"><i class="bi bi-person me-1"></i>${dept.leader || '未设置'}</span>
                        <span class="me-3"><i class="bi bi-telephone me-1"></i>${dept.phone || '未设置'}</span>
                    </div>
                </div>
                <div class="department-actions">
                    <button class="btn btn-outline-primary btn-sm" onclick="editDepartment(${dept.id})">
                        <i class="bi bi-pencil me-1"></i>编辑
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="deleteDepartment(${dept.id})">
                        <i class="bi bi-trash me-1"></i>删除
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 切换部门子节点显示/隐藏
function toggleDepartmentChildren(deptId) {
    const childrenContainer = document.getElementById(`dept-children-${deptId}`);
    const toggleButton = document.querySelector(`[onclick="toggleDepartmentChildren(${deptId})"]`);
    
    if (childrenContainer && toggleButton) {
        const isCollapsed = childrenContainer.classList.contains('collapsed');
        
        if (isCollapsed) {
            // 展开
            childrenContainer.classList.remove('collapsed');
            toggleButton.classList.remove('collapsed');
        } else {
            // 折叠
            childrenContainer.classList.add('collapsed');
            toggleButton.classList.add('collapsed');
        }
    }
}

// 显示新增部门模态框
function showAddDepartmentModal() {
    currentEditDepartmentId = null;
    document.getElementById('departmentModalLabel').textContent = '新增部门';
    
    // 清空表单
    document.getElementById('departmentForm').reset();
    
    // 更新上级部门选项
    updateParentDepartmentOptions();
    
    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('departmentModal'));
    modal.show();
}

// 编辑部门
function editDepartment(deptId) {
    const dept = departmentData.find(d => d.id === deptId);
    if (!dept) return;

    currentEditDepartmentId = deptId;
    document.getElementById('departmentModalLabel').textContent = '编辑部门';
    
    // 填充表单数据
    document.getElementById('departmentName').value = dept.name;
    document.getElementById('departmentLevel').value = dept.level;
    document.getElementById('parentDepartment').value = dept.parentId ? dept.parentId.toString() : '';
    document.getElementById('departmentLeader').value = dept.leader || '';
    document.getElementById('departmentPhone').value = dept.phone || '';
    
    // 更新上级部门选项
    updateParentDepartmentOptions();
    
    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('departmentModal'));
    modal.show();
}

// 删除部门
function deleteDepartment(deptId) {
    if (!confirm('确定要删除这个部门吗？删除后将无法恢复。')) {
        return;
    }

    // 检查是否有子部门
    const dept = departmentData.find(d => d.id === deptId);
    if (dept && dept.children && dept.children.length > 0) {
        alert('该部门下有子部门，请先删除子部门');
        return;
    }

    // 从数据中删除
    departmentData = departmentData.filter(d => d.id !== deptId);
    
    // 重新生成树形结构
    rebuildDepartmentHierarchy();
    
    // 重新显示
    displayDepartments(departmentData);
    
    showSuccessMessage('部门删除成功！');
}

// 保存部门
function saveDepartment() {
    const deptName = document.getElementById('departmentName').value.trim();
    const deptLevel = document.getElementById('departmentLevel').value;
    const parentId = document.getElementById('parentDepartment').value;
    const leader = document.getElementById('departmentLeader').value.trim();
    const phone = document.getElementById('departmentPhone').value.trim();

    if (!deptName) {
        alert('请输入部门名称');
        return;
    }

    if (!deptLevel) {
        alert('请选择部门级别');
        return;
    }

    if (currentEditDepartmentId) {
        // 编辑现有部门
        const dept = departmentData.find(d => d.id === currentEditDepartmentId);
        if (dept) {
            dept.name = deptName;
            dept.level = deptLevel;
            dept.parentId = parentId ? parseInt(parentId) : null;
            dept.leader = leader;
            dept.phone = phone;
            
            // 重新生成层级结构
            rebuildDepartmentHierarchy();
        }
    } else {
        // 新增部门
        const newDept = {
            id: Date.now(),
            name: deptName,
            level: deptLevel,
            parentId: parentId ? parseInt(parentId) : null,
            leader: leader,
            phone: phone,
            children: []
        };
        
        departmentData.push(newDept);
        rebuildDepartmentHierarchy();
    }

    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('departmentModal'));
    modal.hide();
    
    // 重新显示
    displayDepartments(departmentData);
    
    showSuccessMessage(currentEditDepartmentId ? '部门更新成功！' : '部门添加成功！');
}
