/**
 * 弹窗管理模块
 * 负责计划选择、详情查看和编辑弹窗功能
 */

// 显示计划选择模态框
function showPlanModal() {
    const modal = new bootstrap.Modal(document.getElementById('planModal'));
    modal.show();
}

// 选择计划
function selectPlan() {
    const selectedPlan = document.querySelector('input[name="planSelect"]:checked');
    
    if (!selectedPlan) {
        showMessage('请选择一个计划', 'warning');
        return;
    }
    
    const planName = selectedPlan.closest('tr').querySelector('td:nth-child(2)').textContent;
    const selectedPlanNameSpan = document.getElementById('selectedPlanName');
    
    if (selectedPlanNameSpan) {
        selectedPlanNameSpan.textContent = planName;
        selectedPlanNameSpan.style.display = 'inline';
    }
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('planModal'));
    if (modal) {
        modal.hide();
    }
    
    showMessage(`已选择计划：${planName}`, 'success');
}

// 显示详情
function showDetail(index) {
    const item = currentQueryResults[index];
    if (!item) {
        showMessage('记录不存在', 'error');
        return;
    }
    
    const modalBody = document.getElementById('detailModalBody');
    const modal = new bootstrap.Modal(document.getElementById('detailModal'));
    
    // 生成详情内容
    let detailContent = '';
    
    if (item.type === 'hazard') {
        detailContent = `
            <div class="row">
                <div class="col-md-6">
                    <h6>基本信息</h6>
                    <table class="table table-sm">
                        <tr><td><strong>类型：</strong></td><td>${getTypeText(item)}</td></tr>
                        <tr><td><strong>单位：</strong></td><td>${item.unit}</td></tr>
                        <tr><td><strong>检查时间：</strong></td><td>${item.checkTime}</td></tr>
                        <tr><td><strong>检查处：</strong></td><td>${item.checkLocation || '未填写'}</td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6>问题信息</h6>
                    <table class="table table-sm">
                        <tr><td><strong>问题类别：</strong></td><td>${Array.isArray(item.problemCategory) ? item.problemCategory.join('、') : item.problemCategory}</td></tr>
                        <tr><td><strong>具体问题：</strong></td><td>${item.problem}</td></tr>
                        <tr><td><strong>是否典型：</strong></td><td>${item.typical ? '是' : '否'}</td></tr>
                        <tr><td><strong>原因分析：</strong></td><td><span class="reason-stamp ${getReasonStampClass(item.reasonAnalysis)}">${item.reasonAnalysis}</span></td></tr>
                    </table>
                </div>
            </div>
            ${item.remarks ? `<div class="mt-3"><h6>备注</h6><p>${item.remarks}</p></div>` : ''}
        `;
    } else {
        detailContent = `
            <div class="row">
                <div class="col-md-6">
                    <h6>基本信息</h6>
                    <table class="table table-sm">
                        <tr><td><strong>类型：</strong></td><td>${getTypeText(item)}</td></tr>
                        <tr><td><strong>时间：</strong></td><td>${item.time}</td></tr>
                        <tr><td><strong>单位：</strong></td><td>${item.unit}</td></tr>
                        <tr><td><strong>问题类别：</strong></td><td>${Array.isArray(item.problemCategory) ? item.problemCategory.join('、') : item.problemCategory}</td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6>详细信息</h6>
                    <table class="table table-sm">
                        <tr><td><strong>问题等级：</strong></td><td>${item.problemLevel}</td></tr>
                        <tr><td><strong>经过：</strong></td><td>${item.process}</td></tr>
                        <tr><td><strong>亡人：</strong></td><td>${item.deaths || 0}</td></tr>
                        <tr><td><strong>原因分析：</strong></td><td><span class="reason-stamp ${getReasonStampClass(item.reasonAnalysis)}">${item.reasonAnalysis}</span></td></tr>
                    </table>
                </div>
            </div>
            ${item.responsible && item.responsible.length > 0 ? `
                <div class="mt-3">
                    <h6>责任人信息</h6>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>序号</th>
                                    <th>身份</th>
                                    <th>军衔</th>
                                    <th>职务</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${item.responsible.map((person, idx) => `
                                    <tr>
                                        <td>${idx + 1}</td>
                                        <td>${person.identity || ''}</td>
                                        <td>${person.rank || ''}</td>
                                        <td>${person.position || ''}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            ` : ''}
            ${item.remarks ? `<div class="mt-3"><h6>备注</h6><p>${item.remarks}</p></div>` : ''}
        `;
    }
    
    modalBody.innerHTML = detailContent;
    modal.show();
}

// 编辑记录
function editRecord(index) {
    const item = currentQueryResults[index];
    if (!item) {
        showMessage('记录不存在', 'error');
        return;
    }
    
    const modalBody = document.getElementById('editModalBody');
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    
    // 生成编辑表单
    let editForm = '';
    
    if (item.type === 'hazard') {
        editForm = `
            <form id="editHazardForm">
                <input type="hidden" id="editIndex" value="${index}">
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="editHazardType" class="form-label">检查类型</label>
                            <select class="form-select" id="editHazardType" required>
                                <option value="chief" ${item.hazardType === 'chief' ? 'selected' : ''}>首长检查</option>
                                <option value="daily" ${item.hazardType === 'daily' ? 'selected' : ''}>日常检查</option>
                                <option value="comprehensive" ${item.hazardType === 'comprehensive' ? 'selected' : ''}>综合检查</option>
                                <option value="other" ${item.hazardType === 'other' ? 'selected' : ''}>其他</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="editHazardUnit" class="form-label">单位</label>
                            <input type="text" class="form-control" id="editHazardUnit" value="${item.unit}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editHazardCheckTime" class="form-label">检查时间</label>
                            <input type="date" class="form-control" id="editHazardCheckTime" value="${item.checkTime}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="editHazardProblemCategory" class="form-label">问题类别</label>
                            <input type="text" class="form-control" id="editHazardProblemCategory" value="${Array.isArray(item.problemCategory) ? item.problemCategory.join('、') : item.problemCategory}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editHazardProblem" class="form-label">具体问题</label>
                            <textarea class="form-control" id="editHazardProblem" rows="3" required>${item.problem}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="editHazardReasonAnalysis" class="form-label">原因分析</label>
                            <select class="form-select" id="editHazardReasonAnalysis" required>
                                <option value="人" ${item.reasonAnalysis === '人' ? 'selected' : ''}>人因</option>
                                <option value="物" ${item.reasonAnalysis === '物' ? 'selected' : ''}>物因</option>
                                <option value="环" ${item.reasonAnalysis === '环' ? 'selected' : ''}>环境原因</option>
                                <option value="管" ${item.reasonAnalysis === '管' ? 'selected' : ''}>管理原因</option>
                                <option value="任" ${item.reasonAnalysis === '任' ? 'selected' : ''}>责任原因</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="editHazardRemarks" class="form-label">备注</label>
                    <textarea class="form-control" id="editHazardRemarks" rows="2">${item.remarks || ''}</textarea>
                </div>
            </form>
        `;
    } else {
        editForm = `
            <form id="editOtherForm">
                <input type="hidden" id="editIndex" value="${index}">
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="editOtherTime" class="form-label">时间</label>
                            <input type="date" class="form-control" id="editOtherTime" value="${item.time}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editOtherUnit" class="form-label">单位</label>
                            <input type="text" class="form-control" id="editOtherUnit" value="${item.unit}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editOtherProblemCategory" class="form-label">问题类别</label>
                            <input type="text" class="form-control" id="editOtherProblemCategory" value="${Array.isArray(item.problemCategory) ? item.problemCategory.join('、') : item.problemCategory}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="editOtherProblemLevel" class="form-label">问题等级</label>
                            <select class="form-select" id="editOtherProblemLevel" required>
                                <option value="一般事故" ${item.problemLevel === '一般事故' ? 'selected' : ''}>一般事故</option>
                                <option value="较大事故" ${item.problemLevel === '较大事故' ? 'selected' : ''}>较大事故</option>
                                <option value="重大事故" ${item.problemLevel === '重大事故' ? 'selected' : ''}>重大事故</option>
                                <option value="特大事故" ${item.problemLevel === '特大事故' ? 'selected' : ''}>特大事故</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="editOtherProcess" class="form-label">经过</label>
                            <textarea class="form-control" id="editOtherProcess" rows="3" required>${item.process}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="editOtherReasonAnalysis" class="form-label">原因分析</label>
                            <select class="form-select" id="editOtherReasonAnalysis" required>
                                <option value="人" ${item.reasonAnalysis === '人' ? 'selected' : ''}>人因</option>
                                <option value="物" ${item.reasonAnalysis === '物' ? 'selected' : ''}>物因</option>
                                <option value="环" ${item.reasonAnalysis === '环' ? 'selected' : ''}>环境原因</option>
                                <option value="管" ${item.reasonAnalysis === '管' ? 'selected' : ''}>管理原因</option>
                                <option value="任" ${item.reasonAnalysis === '任' ? 'selected' : ''}>责任原因</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="editOtherRemarks" class="form-label">备注</label>
                    <textarea class="form-control" id="editOtherRemarks" rows="2">${item.remarks || ''}</textarea>
                </div>
            </form>
        `;
    }
    
    modalBody.innerHTML = editForm;
    modal.show();
}

// 保存编辑记录
function saveEditRecord() {
    const index = parseInt(document.getElementById('editIndex').value);
    const item = currentQueryResults[index];
    
    if (!item) {
        showMessage('记录不存在', 'error');
        return;
    }
    
    // 收集编辑后的数据
    let updatedItem = { ...item };
    
    if (item.type === 'hazard') {
        updatedItem.hazardType = document.getElementById('editHazardType').value;
        updatedItem.unit = document.getElementById('editHazardUnit').value;
        updatedItem.checkTime = document.getElementById('editHazardCheckTime').value;
        updatedItem.problemCategory = document.getElementById('editHazardProblemCategory').value.split('、');
        updatedItem.problem = document.getElementById('editHazardProblem').value;
        updatedItem.reasonAnalysis = document.getElementById('editHazardReasonAnalysis').value;
        updatedItem.remarks = document.getElementById('editHazardRemarks').value;
    } else {
        updatedItem.time = document.getElementById('editOtherTime').value;
        updatedItem.unit = document.getElementById('editOtherUnit').value;
        updatedItem.problemCategory = document.getElementById('editOtherProblemCategory').value.split('、');
        updatedItem.problemLevel = document.getElementById('editOtherProblemLevel').value;
        updatedItem.process = document.getElementById('editOtherProcess').value;
        updatedItem.reasonAnalysis = document.getElementById('editOtherReasonAnalysis').value;
        updatedItem.remarks = document.getElementById('editOtherRemarks').value;
    }
    
    // 更新数据
    currentQueryResults[index] = updatedItem;
    
    // 重新渲染查询结果
    renderQueryResults();
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    if (modal) {
        modal.hide();
    }
    
    showMessage('记录修改成功', 'success');
}

// 删除记录
function deleteRecord(index) {
    const item = currentQueryResults[index];
    if (!item) {
        showMessage('记录不存在', 'error');
        return;
    }
    
    // 确认删除
    if (!confirm(`确定要删除这条记录吗？\n类型：${getTypeText(item)}\n单位：${item.unit}`)) {
        return;
    }
    
    // 从查询结果中删除
    currentQueryResults.splice(index, 1);
    
    // 重新渲染查询结果
    renderQueryResults();
    
    showMessage('记录删除成功', 'success');
}
