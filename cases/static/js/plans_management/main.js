// 计划管理模块主JavaScript文件

// 全局变量
let currentPlanId = null;
let currentCheckType = 'leader';
let planData = []; // 存储计划数据
let unitData = []; // 存储部队信息数据
let currentEditUnitId = null; // 当前编辑的单位ID
let departmentData = []; // 存储部门信息数据
let currentEditDepartmentId = null; // 当前编辑的部门ID

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 1000);
    
    // 初始化标签下拉组件
    initializeTagsComponents();
    
    // 绑定检查类型切换事件
    bindCheckTypeEvents();
    
    // 绑定级别选择变化事件
    const unitLevelSelect = document.getElementById('unitLevel');
    if (unitLevelSelect) {
        unitLevelSelect.addEventListener('change', updateParentUnitOptions);
    }
    
    // 加载初始数据
    loadInitialData();
    
    // 初始化部队信息维护
    initializeUnitMaintenance();
    
    // 初始化部门信息维护
    initializeDepartmentMaintenance();
});

// 显示当前时间
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// 初始化标签下拉组件
function initializeTagsComponents() {
    // 筛选条件中的受检单位标签
    tagsDropdownManager.createTagsComponent({
        id: 'filterUnits',
        container: document.getElementById('filterUnitsContainer'),
        options: planManagementData.tags.checkUnits,
        placeholder: '请选择受检单位',
        selectedText: '已选择 {count} 个单位',
        previewLabel: '已选单位:',
        helpText: '点击选择受检单位，可多选。'
    });

    // 筛选条件中的牵头处标签
    tagsDropdownManager.createTagsComponent({
        id: 'filterLeadDept',
        container: document.getElementById('filterLeadDeptContainer'),
        options: planManagementData.tags.departments,
        placeholder: '请选择牵头处',
        selectedText: '已选择 {count} 个牵头处',
        previewLabel: '已选牵头处:',
        helpText: '点击选择牵头处，不支持自定义，如需追加请至组织架构信息维护页追加。'
    });

    // 筛选条件中的陪同处标签
    tagsDropdownManager.createTagsComponent({
        id: 'filterAccompanyDept',
        container: document.getElementById('filterAccompanyDeptContainer'),
        options: planManagementData.tags.departments,
        placeholder: '请选择陪同处',
        selectedText: '已选择 {count} 个陪同处',
        previewLabel: '已选陪同处:',
        helpText: '点击选择陪同处，不支持自定义，如需追加请至信息维护页追加。'
    });

    // 筛选条件中的检查处标签
    tagsDropdownManager.createTagsComponent({
        id: 'filterDept',
        container: document.getElementById('filterDeptContainer'),
        options: planManagementData.tags.departments,
        placeholder: '请选择检查处',
        selectedText: '已选择 {count} 个检查处',
        previewLabel: '已选检查处:',
        helpText: '点击选择检查处，不支持自定义，如需追加请至检查部门信息维护页追加。'
    });

    // 信息录入中的受检单位标签
    tagsDropdownManager.createTagsComponent({
        id: 'actualUnits',
        container: document.getElementById('actualUnitsContainer'),
        options: planManagementData.tags.checkUnits,
        placeholder: '请选择受检单位',
        selectedText: '已选择 {count} 个单位',
        previewLabel: '已选单位:',
        helpText: '点击选择单位，不支持自定义，如需追加请至组织架构信息维护页追加。'
    });

    // 信息录入中的牵头处标签
    tagsDropdownManager.createTagsComponent({
        id: 'actualLeadDept',
        container: document.getElementById('actualLeadDeptContainer'),
        options: planManagementData.tags.departments,
        placeholder: '请选择牵头处',
        selectedText: '已选择 {count} 个牵头处',
        previewLabel: '已选牵头处:',
        helpText: '点击选择牵头处，支持自定义。'
    });

    // 信息录入中的陪同处标签
    tagsDropdownManager.createTagsComponent({
        id: 'actualAccompanyDept',
        container: document.getElementById('actualAccompanyDeptContainer'),
        options: planManagementData.tags.departments,
        placeholder: '请选择陪同处',
        selectedText: '已选择 {count} 个陪同处',
        previewLabel: '已选陪同处:',
        helpText: '点击选择陪同处，支持自定义。'
    });

    // 信息录入中的检查处标签
    tagsDropdownManager.createTagsComponent({
        id: 'actualDept',
        container: document.getElementById('actualDeptContainer'),
        options: planManagementData.tags.departments,
        placeholder: '请选择检查处',
        selectedText: '已选择 {count} 个检查处',
        previewLabel: '已选检查处:',
        helpText: '点击选择检查处，支持自定义。'
    });
}

// 绑定检查类型切换事件
function bindCheckTypeEvents() {
    // 初期显示页面的检查类型切换
    document.querySelectorAll('input[name="checkType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentCheckType = this.value;
            updateFilterFields();
            loadPlanList();
        });
    });



    // 制定计划页面的检查类型切换
    document.querySelectorAll('input[name="createCheckType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // 清空生成的计划表单
            if (typeof resetPlans === 'function') {
                resetPlans();
            }
        });
    });
}

// 更新筛选字段显示
function updateFilterFields() {
    const leaderFields = document.querySelectorAll('#leaderFilterFields, #leaderFilterFields2, #leaderFilterFields3');
    const dailyFields = document.querySelectorAll('#dailyFilterFields, #dailyFilterFields2');
    
    if (currentCheckType === 'leader') {
        leaderFields.forEach(field => field.style.display = 'block');
        dailyFields.forEach(field => field.style.display = 'none');
    } else {
        leaderFields.forEach(field => field.style.display = 'none');
        dailyFields.forEach(field => field.style.display = 'block');
    }
}

// 加载初始数据
function loadInitialData() {
    // 从mock数据中获取计划数据
    planData = [...planManagementData.plans];
    
    loadPlanList();
}



// 显示成功提示消息
function showSuccessMessage(message) {
    // 创建提示元素
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // 添加到页面
    document.body.appendChild(alertDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 3000);
}
