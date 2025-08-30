/**
 * 工具函数模块
 * 包含各种辅助函数
 */

// 显示消息提示
function showMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 3000);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

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

// 获取类型显示名称
function getTypeDisplayName(type) {
    const typeMap = {
        'accident': '事故',
        'case': '案件',
        'suicide': '自杀',
        'hazard': '问题隐患',
        '社会事故': '社会事故',
        '部队事故': '部队事故',
        '其他事故': '其他事故'
    };
    return typeMap[type] || type;
}

// 获取原因显示名称
function getReasonDisplayName(reason) {
    const reasonMap = {
        '人': '人因',
        '物': '物因',
        '环': '环境原因',
        '管': '管理原因',
        '任': '责任原因'
    };
    return reasonMap[reason] || reason;
}

// 通用tooltip配置
function getCommonTooltipConfig() {
    return {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e6e6e6',
        borderWidth: 1,
        textStyle: {
            color: '#333333',
            fontSize: 13,
            fontWeight: 'normal'
        },
        padding: [10, 15],
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 6px;'
    };
}

// 饼图通用tooltip配置
function getPieTooltipConfig() {
    return {
        ...getCommonTooltipConfig(),
        formatter: function(params) {
            return `<div style="font-weight: bold; margin-bottom: 5px;">${params.seriesName}</div>
                   <div style="color: #666;">${params.name}: ${params.value}起 (${params.percent}%)</div>`;
        }
    };
}

// 柱状图通用tooltip配置
function getBarTooltipConfig() {
    return {
        ...getCommonTooltipConfig(),
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        formatter: function(params) {
            let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
            params.forEach(param => {
                result += `<div style="margin: 3px 0;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 8px; border-radius: 2px;"></span>
                            <span style="color: #666;">${param.seriesName}: ${param.value}起</span>
                          </div>`;
            });
            return result;
        }
    };
}

// 折线图通用tooltip配置
function getLineTooltipConfig() {
    return {
        ...getCommonTooltipConfig(),
        trigger: 'axis',
        formatter: function(params) {
            let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
            params.forEach(param => {
                result += `<div style="margin: 3px 0;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; margin-right: 8px; border-radius: 2px;"></span>
                            <span style="color: #666;">${param.seriesName}: ${param.value}起</span>
                          </div>`;
            });
            return result;
        }
    };
}
