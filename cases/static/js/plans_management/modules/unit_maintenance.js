// 单位维护模块（简化版本）

// 初始化部队信息维护
function initializeUnitMaintenance() {
    // 初始化查询条件中的标签下拉组件
    tagsDropdownManager.createTagsComponent({
        id: 'searchTags',
        container: document.getElementById('searchTagsContainer'),
        options: planManagementData.tags.unitTags,
        placeholder: '请选择标签'
    });

    // 初始化单位信息编辑中的标签下拉组件
    tagsDropdownManager.createTagsComponent({
        id: 'unitTags',
        container: document.getElementById('unitTagsContainer'),
        options: planManagementData.tags.unitTags,
        placeholder: '请选择标签'
    });

    // 加载初始部队数据
    loadInitialUnitData();
}

// 加载初始部队数据
function loadInitialUnitData() {
    // 从mock数据中获取完整的部队信息数据
    unitData = generateCompleteUnitData();
    
    // 生成检查历史记录
    generateCheckHistory(unitData);
    
    // 显示所有单位
    displayUnits(unitData);
}

// 显示单位列表
function displayUnits(units) {
    const container = document.getElementById('unitListContainer');
    container.innerHTML = '';

    if (units.length === 0) {
        container.innerHTML = '<div class="alert alert-info">未找到符合条件的单位</div>';
        return;
    }

    // 构建树形结构
    const treeData = buildUnitTree(units);
    
    // 生成树形HTML
    const treeHtml = generateTreeHtml(treeData);
    container.innerHTML = treeHtml;
}

// 生成树形HTML
function generateTreeHtml(treeData, level = 0) {
    let html = '';
    
    treeData.forEach((unit, index) => {
        const hasChildren = unit.children && unit.children.length > 0;
        
        html += generateTreeNodeHtml(unit, level, hasChildren);
        
        if (hasChildren) {
            html += `<div class="unit-tree-children" id="children-${unit.id}">`;
            html += generateTreeHtml(unit.children, level + 1);
            html += '</div>';
        }
    });
    
    return html;
}

// 生成树节点HTML
function generateTreeNodeHtml(unit, level, hasChildren) {
    // 生成折叠箭头
    let toggleArrow = '';
    if (hasChildren) {
        toggleArrow = `<i class="bi bi-chevron-down unit-tree-toggle" onclick="toggleUnitChildren(${unit.id})" title="点击折叠/展开"></i>`;
    }
    
    const tagsHtml = unit.tags.map(tag => 
        `<span class="badge bg-secondary me-1">${tag}</span>`
    ).join('');

    const checkCount = unit.checkHistory ? unit.checkHistory.length : 0;
    const checkTooltip = generateCheckTooltip(unit.checkHistory || []);

    // 级别标识
    const levelBadgeClass = unit.level === '基地' ? 'base' : unit.level === '机关' ? 'org' : 'basic';
    const levelBadge = `<span class="unit-level-badge ${levelBadgeClass}">${unit.level}</span>`;

    // 根据级别设置不同的样式
    const itemClass = level === 0 ? 'unit-tree-item base-item' : 
                     level === 1 ? 'unit-tree-item org-item' : 
                     'unit-tree-item basic-item';

    return `
        <div class="${itemClass}" data-unit-id="${unit.id}">
            <div class="unit-tree-content">
                ${toggleArrow}
                <div class="unit-tree-info">
                    <div class="unit-name">
                        ${unit.name}${levelBadge}
                    </div>
                    <div class="unit-meta">
                        <span class="me-3"><i class="bi bi-geo-alt me-1"></i>${unit.location}</span>
                        <span class="me-3"><i class="bi bi-arrow-right me-1"></i>${unit.distance}公里</span>
                        <span class="me-3"><i class="bi bi-people me-1"></i>${unit.personnel}人</span>
                        <span class="me-2">${tagsHtml}</span>
                    </div>
                </div>
                <div class="unit-actions">
                    <div class="check-count" title="${checkTooltip}">
                        <i class="bi bi-clipboard-check me-1"></i>${checkCount}次
                        <div class="check-tooltip">${checkTooltip}</div>
                    </div>
                    <button class="btn btn-outline-primary btn-sm" onclick="editUnit(${unit.id})">
                        <i class="bi bi-pencil me-1"></i>编辑
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="deleteUnit(${unit.id})">
                        <i class="bi bi-trash me-1"></i>删除
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 查询单位
function searchUnits() {
    const unitName = document.getElementById('searchUnitName').value.toLowerCase();
    const unitLevel = document.getElementById('searchUnitLevel').value;
    const location = document.getElementById('searchLocation').value.toLowerCase();
    const distance = parseFloat(document.getElementById('searchDistance').value) || 0;
    const selectedTags = tagsDropdownManager.getSelectedTags('searchTags');

    let filteredUnits = unitData.filter(unit => {
        // 单位名称筛选
        if (unitName && !unit.name.toLowerCase().includes(unitName)) {
            return false;
        }

        // 级别筛选
        if (unitLevel && unit.level !== unitLevel) {
            return false;
        }

        // 驻地筛选
        if (location && !unit.location.toLowerCase().includes(location)) {
            return false;
        }

        // 距离筛选
        if (distance > 0 && unit.distance > distance) {
            return false;
        }

        // 标签筛选
        if (selectedTags.length > 0) {
            const hasMatchingTag = selectedTags.some(tag => unit.tags.includes(tag));
            if (!hasMatchingTag) {
                return false;
            }
        }

        return true;
    });

    displayUnits(filteredUnits);
}

// 重置查询条件
function resetUnitSearch() {
    document.getElementById('searchUnitName').value = '';
    document.getElementById('searchUnitLevel').value = '';
    document.getElementById('searchLocation').value = '';
    document.getElementById('searchDistance').value = '';
    tagsDropdownManager.clearSelectedTags('searchTags');
    
    displayUnits(unitData);
}

// 显示新增单位模态框
function showAddUnitModal() {
    currentEditUnitId = null;
    document.getElementById('unitModalLabel').textContent = '新增单位';
    
    // 清空表单
    document.getElementById('unitForm').reset();
    tagsDropdownManager.clearSelectedTags('unitTags');
    
    // 更新上级单位选项
    updateParentUnitOptions();
    
    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('unitModal'));
    modal.show();
}

// 编辑单位
function editUnit(unitId) {
    const unit = unitData.find(u => u.id === unitId);
    if (!unit) return;

    currentEditUnitId = unitId;
    document.getElementById('unitModalLabel').textContent = '编辑单位';
    
    // 填充表单数据
    document.getElementById('unitName').value = unit.name;
    document.getElementById('unitLevel').value = unit.level;
    document.getElementById('parentUnit').value = unit.parentId || '';
    document.getElementById('unitLocation').value = unit.location;
    document.getElementById('unitDistance').value = unit.distance || '';
    document.getElementById('unitPersonnel').value = unit.personnel || '';
    tagsDropdownManager.setSelectedTags('unitTags', unit.tags);
    
    // 更新上级单位选项
    updateParentUnitOptions();
    
    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('unitModal'));
    modal.show();
}

// 删除单位
function deleteUnit(unitId) {
    if (!confirm('确定要删除这个单位吗？删除后将无法恢复。')) {
        return;
    }

    // 检查是否有子单位
    const unit = unitData.find(u => u.id === unitId);
    if (unit && unit.children && unit.children.length > 0) {
        alert('该单位下有子单位，请先删除子单位');
        return;
    }

    // 从数据中删除
    unitData = unitData.filter(u => u.id !== unitId);
    
    // 重新生成树形结构
    rebuildUnitHierarchy();
    
    // 重新显示
    displayUnits(unitData);
    
    showSuccessMessage('单位删除成功！');
}

// 保存单位
function saveUnit() {
    const unitName = document.getElementById('unitName').value.trim();
    const unitLevel = document.getElementById('unitLevel').value;
    const parentId = document.getElementById('parentUnit').value;
    const location = document.getElementById('unitLocation').value.trim();
    const distance = parseFloat(document.getElementById('unitDistance').value) || 0;
    const personnel = parseInt(document.getElementById('unitPersonnel').value) || 0;
    const tags = tagsDropdownManager.getSelectedTags('unitTags');

    if (!unitName) {
        alert('请输入单位名称');
        return;
    }

    if (currentEditUnitId) {
        // 编辑现有单位
        const unit = unitData.find(u => u.id === currentEditUnitId);
        if (unit) {
            unit.name = unitName;
            unit.level = unitLevel;
            unit.parentId = parentId || null;
            unit.location = location;
            unit.distance = distance;
            unit.personnel = personnel;
            unit.tags = tags;
            
            // 重新生成层级结构
            rebuildUnitHierarchy();
        }
    } else {
        // 新增单位
        const newUnit = {
            id: Date.now(),
            name: unitName,
            level: unitLevel,
            parentId: parentId || null,
            hierarchy: [],
            location: location,
            distance: distance,
            personnel: personnel,
            tags: tags,
            checkHistory: []
        };
        
        unitData.push(newUnit);
        rebuildUnitHierarchy();
    }

    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('unitModal'));
    modal.hide();
    
    // 重新显示
    displayUnits(unitData);
    
    showSuccessMessage(currentEditUnitId ? '单位更新成功！' : '单位添加成功！');
}

// 切换单位子节点显示/隐藏
function toggleUnitChildren(unitId) {
    const childrenContainer = document.getElementById(`children-${unitId}`);
    const toggleButton = document.querySelector(`[onclick="toggleUnitChildren(${unitId})"]`);
    
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

// 展开所有单位
function expandAllUnits() {
    const childrenContainers = document.querySelectorAll('.unit-tree-children');
    const toggleButtons = document.querySelectorAll('.unit-tree-toggle');
    
    childrenContainers.forEach(container => {
        container.classList.remove('collapsed');
    });
    
    toggleButtons.forEach(button => {
        button.classList.remove('collapsed');
    });
}

// 折叠所有单位
function collapseAllUnits() {
    const childrenContainers = document.querySelectorAll('.unit-tree-children');
    const toggleButtons = document.querySelectorAll('.unit-tree-toggle');
    
    childrenContainers.forEach(container => {
        container.classList.add('collapsed');
    });
    
    toggleButtons.forEach(button => {
        button.classList.add('collapsed');
    });
}
