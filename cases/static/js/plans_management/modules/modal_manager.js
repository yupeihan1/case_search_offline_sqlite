// 模态框管理模块

// 显示信息录入模态框
function showInfoInputModal(planId, modalType) {
    currentPlanId = planId;
    
    const modal = document.getElementById('infoInputModal');
    const modalTitle = document.getElementById('infoInputModalLabel');
    
    // 根据模态框类型设置标题
    if (modalType === 'edit') {
        modalTitle.textContent = '信息修改';
    } else {
        modalTitle.textContent = '执行确认';
    }
    
    // 根据检查类型显示/隐藏相应字段
    const leaderFields = document.querySelectorAll('#leaderFields, #leaderFields2, #leaderFields3');
    const dailyFields = document.querySelectorAll('#dailyFields, #dailyFields2');
    
    if (currentCheckType === 'leader') {
        leaderFields.forEach(field => field.style.display = 'block');
        dailyFields.forEach(field => field.style.display = 'none');
        document.getElementById('actualInspector').required = false;
        document.getElementById('actualDept').required = false;
        document.getElementById('actualLeader').required = true;
    } else {
        leaderFields.forEach(field => field.style.display = 'none');
        dailyFields.forEach(field => field.style.display = 'block');
        document.getElementById('actualInspector').required = true;
        // 检查处字段现在是标签下拉组件，不需要设置required属性
        document.getElementById('actualLeader').required = false;
    }
    
    // 如果是编辑模式，加载已有数据
    if (modalType === 'edit' && planId) {
        loadPlanData(planId);
    } else {
        // 清空表单
        document.getElementById('infoInputForm').reset();
        tagsDropdownManager.clearSelectedTags('actualUnits');
        tagsDropdownManager.clearSelectedTags('actualLeadDept');
        tagsDropdownManager.clearSelectedTags('actualAccompanyDept');
        tagsDropdownManager.clearSelectedTags('actualDept');
    }
    
    // 显示模态框
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // 绑定模态框关闭事件，确保关闭时清空表单
    modal.addEventListener('hidden.bs.modal', function() {
        document.getElementById('infoInputForm').reset();
        tagsDropdownManager.clearSelectedTags('actualUnits');
        tagsDropdownManager.clearSelectedTags('actualLeadDept');
        tagsDropdownManager.clearSelectedTags('actualAccompanyDept');
    });
}

// 加载计划数据到表单
function loadPlanData(planId) {
    const plan = planData.find(p => p.id === planId);
    if (!plan) return;
    
    if (plan.actualDate) {
        document.getElementById('actualDate').value = plan.actualDate;
    }
    
    if (plan.type === 'leader') {
        if (plan.actualLeader) {
            document.getElementById('actualLeader').value = plan.actualLeader;
        }
        if (plan.actualLeadDept) {
            tagsDropdownManager.setSelectedTags('actualLeadDept', [plan.actualLeadDept]);
        }
        if (plan.actualAccompanyDept && plan.actualAccompanyDept.length > 0) {
            tagsDropdownManager.setSelectedTags('actualAccompanyDept', plan.actualAccompanyDept);
        }
    } else {
        if (plan.actualInspector) {
            document.getElementById('actualInspector').value = plan.actualInspector;
        }
        if (plan.actualDept) {
            tagsDropdownManager.setSelectedTags('actualDept', [plan.actualDept]);
        }
    }
    
    if (plan.actualUnits) {
        tagsDropdownManager.setSelectedTags('actualUnits', plan.actualUnits);
    }
    
    if (plan.issueCount !== undefined) {
        document.getElementById('issueCount').value = plan.issueCount;
    } else {
        document.getElementById('issueCount').value = '';
    }
    
    if (plan.remarks) {
        document.getElementById('remarks').value = plan.remarks;
    } else {
        document.getElementById('remarks').value = '';
    }
}

// 保存信息
function saveInfo() {
    const actualDate = document.getElementById('actualDate').value;
    
    if (!actualDate) {
        alert('请填写实际执行时间');
        return;
    }
    
    if (currentCheckType === 'leader') {
        const actualLeader = document.getElementById('actualLeader').value;
        const actualLeadDept = tagsDropdownManager.getSelectedTags('actualLeadDept');
        
        if (!actualLeader || actualLeadDept.length === 0) {
            alert('请填写首长和牵头处');
            return;
        }
    } else {
        const actualInspector = document.getElementById('actualInspector').value;
        const actualDept = document.getElementById('actualDept').value;
        if (!actualInspector || !actualDept) {
            alert('请填写检查人和检查处');
            return;
        }
    }
    
    const actualUnits = tagsDropdownManager.getSelectedTags('actualUnits');
    if (actualUnits.length === 0) {
        alert('请选择受检单位');
        return;
    }
    
    const issueCount = document.getElementById('issueCount').value;
    const remarks = document.getElementById('remarks').value;
    
    // 保存数据
    if (currentPlanId) {
        // 更新现有计划
        const plan = planData.find(p => p.id === currentPlanId);
        if (plan) {
            plan.actualDate = actualDate;
            plan.actualUnits = actualUnits;
            plan.issueCount = issueCount ? parseInt(issueCount) : null;
            plan.remarks = remarks;
            
            if (currentCheckType === 'leader') {
                plan.actualLeader = document.getElementById('actualLeader').value;
                const selectedLeadDept = tagsDropdownManager.getSelectedTags('actualLeadDept');
                plan.actualLeadDept = selectedLeadDept.length > 0 ? selectedLeadDept[0] : null;
                plan.actualAccompanyDept = tagsDropdownManager.getSelectedTags('actualAccompanyDept');
            } else {
                plan.actualInspector = document.getElementById('actualInspector').value;
                const selectedDept = tagsDropdownManager.getSelectedTags('actualDept');
                plan.actualDept = selectedDept.length > 0 ? selectedDept[0] : null;
            }
        }
    }
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('infoInputModal'));
    modal.hide();
    
    // 重新加载计划列表以显示变更内容
    loadPlanList();
    
    // 显示成功提示
    showSuccessMessage('信息保存成功！');
}

// 计划停止功能
function stopPlan(planId) {
    // 显示自定义确认对话框
    showStopPlanConfirmModal(planId);
}

// 显示停止计划确认对话框
function showStopPlanConfirmModal(planId) {
    // 创建模态框HTML
    const modalHtml = `
        <div class="modal fade" id="stopPlanConfirmModal" tabindex="-1" aria-labelledby="stopPlanConfirmModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="stopPlanConfirmModalLabel">确认</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="mb-0">确定要停止这个计划吗？停止后执行率将为0%。</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="cancelStopPlan()">取消</button>
                        <button type="button" class="btn btn-primary" onclick="confirmStopPlan(${planId})">确定</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 移除已存在的模态框
    const existingModal = document.getElementById('stopPlanConfirmModal');
    if (existingModal) {
        existingModal.remove();
    }

    // 添加新的模态框到页面
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('stopPlanConfirmModal'));
    modal.show();

    // 模态框关闭时清理
    document.getElementById('stopPlanConfirmModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// 取消停止计划
function cancelStopPlan() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('stopPlanConfirmModal'));
    if (modal) {
        modal.hide();
    }
}

// 确认停止计划
function confirmStopPlan(planId) {
    const plan = planData.find(p => p.id === planId);
    if (!plan) {
        alert('未找到指定计划');
        return;
    }

    // 设置计划为停止状态：执行率为0%
    plan.actualDate = new Date().toISOString().split('T')[0]; // 设置为今天
    plan.actualUnits = []; // 空数组表示没有检查任何单位
    plan.issueCount = null; // 清空发现问题数
    plan.remarks = ''; // 清空备注
    
    // 根据计划类型设置其他必要字段
    if (plan.type === 'leader') {
        plan.actualLeader = plan.leader;
        plan.actualLeadDept = plan.leadDept;
        plan.actualAccompanyDept = plan.accompanyDept;
    } else {
        plan.actualInspector = plan.inspector;
        plan.actualDept = plan.dept || ''; // 假设计划中有dept字段，如果没有则为空字符串
    }

    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('stopPlanConfirmModal'));
    modal.hide();

    // 重新加载计划列表以显示变更内容
    loadPlanList();
    
    // 显示成功提示
    showSuccessMessage('计划已停止，执行率为0%！');
}
