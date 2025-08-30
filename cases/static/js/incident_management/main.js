/**
 * 部队问题管理模块主JavaScript文件
 * 负责页面初始化、事件绑定和全局状态管理
 */

// 全局变量
let currentQueryResults = []; // 当前查询结果
let queryPagination = null; // 查询分页器实例
let analysisCharts = {}; // 存储图表实例
let analysisData = []; // 分析数据

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化时间显示
    updateTime();
    setInterval(updateTime, 1000);
    
    // 检查ECharts并生成初始图表
    setTimeout(() => {
        checkECharts();
        // 生成初始图表（使用模拟数据）
        const initialData = generateInitialData();
        generateCharts(initialData);
    }, 1000);
    
    // 监听窗口大小变化，重新调整图表大小
    window.addEventListener('resize', function() {
        setTimeout(resizeCharts, 100);
    });
    
    // 清理URL中的页码参数，确保页面刷新后不受影响
    if (window.location.search.includes('page=')) {
        const url = new URL(window.location);
        url.searchParams.delete('page');
        window.history.replaceState({}, '', url);
    }
    
    // 重置分页相关状态
    queryPagination = null;
    currentQueryResults = [];
    
    // 初始化查询单位下拉组件
    initQueryUnitDropdown();
    
    // 数据录入表单提交事件
    const form = document.getElementById('dataEntryForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 收集表单数据
            const formData = collectFormData();
            
            // 验证表单数据
            if (validateFormData(formData)) {
                // 提交数据
                submitFormData(formData);
            }
        });
    }
    
    // 查询表单提交事件
    const queryForm = document.getElementById('queryForm');
    if (queryForm) {
        queryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            executeQuery();
        });
        
        // 重置查询表单
        queryForm.addEventListener('reset', function(e) {
            setTimeout(() => {
                document.getElementById('queryResults').style.display = 'none';
                
                // 安全地清理下拉组件选择
                if (typeof tagsDropdownManager !== 'undefined') {
                    tagsDropdownManager.clearSelectedTags('queryOtherProblemCategory');
                    tagsDropdownManager.clearSelectedTags('queryProblemLevel');
                    tagsDropdownManager.clearSelectedTags('queryUnit');
                    tagsDropdownManager.clearSelectedTags('queryProblemCategory');
                }
                
                // 清理分页器和查询结果
                if (queryPagination) {
                    queryPagination.destroy();
                    queryPagination = null;
                }
                currentQueryResults = [];
            }, 100);
        });
    }
    
    // 分析表单提交事件
    const analysisForm = document.getElementById('analysisForm');
    if (analysisForm) {
        analysisForm.addEventListener('submit', function(e) {
            e.preventDefault();
            executeAnalysis();
        });
        
        // 重置分析表单
        analysisForm.addEventListener('reset', function(e) {
            setTimeout(() => {
                document.getElementById('analysisResults').style.display = 'none';
                
                // 安全地清理下拉组件选择
                if (typeof tagsDropdownManager !== 'undefined') {
                    tagsDropdownManager.clearSelectedTags('analysisOtherProblemCategory');
                    tagsDropdownManager.clearSelectedTags('analysisProblemLevel');
                    tagsDropdownManager.clearSelectedTags('analysisProblemCategory');
                }
                
                // 销毁图表
                destroyCharts();
                analysisData = [];
            }, 100);
        });
    }
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
    document.getElementById('currentTime').textContent = timeString;
}

// 检查ECharts是否可用
function checkECharts() {
    if (typeof echarts === 'undefined') {
        console.error('ECharts is not loaded!');
        return false;
    }
    return true;
}

// 生成初始数据
function generateInitialData() {
    const initialData = [];
    
    // 生成一些模拟数据用于初始图表显示
    const types = ['accident', 'case', 'suicide', 'hazard'];
    const units = ['某部队', '某基地', '某舰队', '某航空兵'];
    
    // 生成2024年跨季度的测试数据（用于测试季度/月双图表功能）
    const testData2024 = [
        // Q1 数据
        { type: 'accident', unit: '某部队', time: '2024-01-15', accidentSubType: 'social', problemCategory: '交通事故', reasonAnalysis: '人因' },
        { type: 'case', unit: '某基地', time: '2024-02-20', problemCategory: '违纪案件', reasonAnalysis: '人因' },
        { type: 'hazard', unit: '某舰队', checkTime: '2024-03-10', problemCategory: '安全隐患', problem: '设备老化', reasonAnalysis: '物因' },
        
        // Q2 数据
        { type: 'accident', unit: '某航空兵', time: '2024-04-05', accidentSubType: 'military', problemCategory: '训练事故', reasonAnalysis: '人因' },
        { type: 'suicide', unit: '某部队', time: '2024-05-12', problemCategory: '心理问题', reasonAnalysis: '人因' },
        { type: 'hazard', unit: '某基地', checkTime: '2024-06-25', problemCategory: '管理隐患', problem: '制度不完善', reasonAnalysis: '管因' },
        
        // Q3 数据
        { type: 'accident', unit: '某舰队', time: '2024-07-08', accidentSubType: 'social', problemCategory: '交通事故', reasonAnalysis: '人因' },
        { type: 'case', unit: '某航空兵', time: '2024-08-15', problemCategory: '违纪案件', reasonAnalysis: '人因' },
        { type: 'hazard', unit: '某部队', checkTime: '2024-09-30', problemCategory: '环境隐患', problem: '天气影响', reasonAnalysis: '环因' },
        
        // Q4 数据
        { type: 'accident', unit: '某基地', time: '2024-10-20', accidentSubType: 'military', problemCategory: '训练事故', reasonAnalysis: '人因' },
        { type: 'suicide', unit: '某舰队', time: '2024-11-05', problemCategory: '心理问题', reasonAnalysis: '人因' },
        { type: 'hazard', unit: '某航空兵', checkTime: '2024-12-18', problemCategory: '管理隐患', problem: '监督不到位', reasonAnalysis: '管因' }
    ];
    
    // 添加测试数据
    initialData.push(...testData2024);
    
    // 为每种类型生成一些额外的随机数据
    types.forEach(type => {
        for (let i = 0; i < 3 + Math.floor(Math.random() * 5); i++) {
            const year = ['2020', '2021', '2022', '2023'][Math.floor(Math.random() * 4)];
            const unit = units[Math.floor(Math.random() * units.length)];
            
            if (type === 'hazard') {
                initialData.push({
                    type: type,
                    unit: unit,
                    checkTime: year + '-01-01',
                    problemCategory: '安全检查',
                    problem: '模拟问题隐患',
                    reasonAnalysis: '管理原因'
                });
            } else {
                initialData.push({
                    type: type,
                    unit: unit,
                    time: year + '-01-01',
                    problemCategory: '模拟问题',
                    reasonAnalysis: '人因'
                });
            }
        }
    });
    
    return initialData;
}
