/**
 * 联动下拉列表示例数据
 * 军种 > 战区 > 基地 > 机关 > 基层 的完整数据结构
 */

// 军种数据配置
const militaryCascadingData = {
    "military_branch": {
        label: "军种",
        allowCustom: false, // 军种不允许自定义
        placeholder: "请选择军种",
        options: [
            { value: "army", text: "陆军" },
            { value: "navy", text: "海军" },
            { value: "airforce", text: "空军" },
            { value: "rocket", text: "火箭军" },
            { value: "strategic", text: "战略支援部队" }
        ]
    },
    "theater": {
        label: "战区",
        allowCustom: true, // 战区允许自定义
        placeholder: "请选择战区",
        customPlaceholder: "输入自定义战区名称",
        customMaxLength: 30,
        options: {
            "army": [
                { value: "north", text: "北部战区" },
                { value: "south", text: "南部战区" },
                { value: "east", text: "东部战区" },
                { value: "west", text: "西部战区" },
                { value: "central", text: "中部战区" }
            ],
            "navy": [
                { value: "north_sea", text: "北海舰队" },
                { value: "east_sea", text: "东海舰队" },
                { value: "south_sea", text: "南海舰队" }
            ],
            "airforce": [
                { value: "north_air", text: "北部战区空军" },
                { value: "south_air", text: "南部战区空军" },
                { value: "east_air", text: "东部战区空军" },
                { value: "west_air", text: "西部战区空军" },
                { value: "central_air", text: "中部战区空军" }
            ],
            "rocket": [
                { value: "north_rocket", text: "北部战区火箭军" },
                { value: "south_rocket", text: "南部战区火箭军" },
                { value: "east_rocket", text: "东部战区火箭军" },
                { value: "west_rocket", text: "西部战区火箭军" },
                { value: "central_rocket", text: "中部战区火箭军" }
            ],
            "strategic": [
                { value: "north_strategic", text: "北部战区战略支援部队" },
                { value: "south_strategic", text: "南部战区战略支援部队" },
                { value: "east_strategic", text: "东部战区战略支援部队" },
                { value: "west_strategic", text: "西部战区战略支援部队" },
                { value: "central_strategic", text: "中部战区战略支援部队" }
            ]
        }
    },
    "base": {
        label: "基地",
        allowCustom: true,
        placeholder: "请选择基地",
        customPlaceholder: "输入自定义基地名称",
        customMaxLength: 40,
        options: {
            "north": [
                { value: "beijing_base", text: "北京基地" },
                { value: "shenyang_base", text: "沈阳基地" },
                { value: "jinan_base", text: "济南基地" }
            ],
            "south": [
                { value: "guangzhou_base", text: "广州基地" },
                { value: "kunming_base", text: "昆明基地" },
                { value: "nanning_base", text: "南宁基地" }
            ],
            "east": [
                { value: "nanjing_base", text: "南京基地" },
                { value: "fuzhou_base", text: "福州基地" },
                { value: "hangzhou_base", text: "杭州基地" }
            ],
            "west": [
                { value: "xian_base", text: "西安基地" },
                { value: "lanzhou_base", text: "兰州基地" },
                { value: "urumqi_base", text: "乌鲁木齐基地" }
            ],
            "central": [
                { value: "wuhan_base", text: "武汉基地" },
                { value: "changsha_base", text: "长沙基地" },
                { value: "nanchang_base", text: "南昌基地" }
            ],
            "north_sea": [
                { value: "qingdao_base", text: "青岛基地" },
                { value: "dalian_base", text: "大连基地" }
            ],
            "east_sea": [
                { value: "shanghai_base", text: "上海基地" },
                { value: "ningbo_base", text: "宁波基地" }
            ],
            "south_sea": [
                { value: "zhanjiang_base", text: "湛江基地" },
                { value: "sanya_base", text: "三亚基地" }
            ]
        }
    },
    "department": {
        label: "机关",
        allowCustom: true,
        placeholder: "请选择机关",
        customPlaceholder: "输入自定义机关名称",
        customMaxLength: 50,
        options: {
            "beijing_base": [
                { value: "command_dept", text: "司令部" },
                { value: "logistics_dept", text: "后勤部" }
            ],
            "shenyang_base": [
                { value: "command_dept", text: "司令部" },
                { value: "logistics_dept", text: "后勤部" }
            ],
            "guangzhou_base": [
                { value: "command_dept", text: "司令部" },
                { value: "logistics_dept", text: "后勤部" }
            ],
            "nanjing_base": [
                { value: "command_dept", text: "司令部" },
                { value: "logistics_dept", text: "后勤部" }
            ],
            "xian_base": [
                { value: "command_dept", text: "司令部" },
                { value: "logistics_dept", text: "后勤部" }
            ],
            "wuhan_base": [
                { value: "command_dept", text: "司令部" },
                { value: "logistics_dept", text: "后勤部" }
            ],
            "qingdao_base": [
                { value: "command_dept", text: "司令部" },
                { value: "logistics_dept", text: "后勤部" }
            ],
            "shanghai_base": [
                { value: "command_dept", text: "司令部" },
                { value: "logistics_dept", text: "后勤部" }
            ],
            "zhanjiang_base": [
                { value: "command_dept", text: "司令部" },
                { value: "logistics_dept", text: "后勤部" }
            ]
        }
    },
    "unit": {
        label: "基层",
        allowCustom: true,
        placeholder: "请选择基层单位",
        customPlaceholder: "输入自定义基层单位名称",
        customMaxLength: 60,
        options: {
            "command_dept": [
                { value: "operations_office", text: "作战科" },
                { value: "intelligence_office", text: "情报科" },
                { value: "communications_office", text: "通信科" },
                { value: "training_office", text: "训练科" },
                { value: "security_office", text: "保密科" }
            ],
            "logistics_dept": [
                { value: "supply_office", text: "供应科" },
                { value: "transport_office", text: "运输科" },
                { value: "medical_office", text: "卫生科" },
                { value: "finance_office", text: "财务科" },
                { value: "construction_office", text: "营房科" }
            ],
            "equipment_dept": [
                { value: "weapons_office", text: "武器科" },
                { value: "vehicles_office", text: "车辆科" },
                { value: "electronics_office", text: "电子科" },
                { value: "maintenance_office", text: "维修科" },
                { value: "inventory_office", text: "器材科" }
            ],
            "political_dept": [
                { value: "organization_office", text: "组织科" },
                { value: "propaganda_office", text: "宣传科" },
                { value: "cadre_office", text: "干部科" },
                { value: "discipline_office", text: "纪检科" },
                { value: "culture_office", text: "文化科" }
            ]
        }
    }
};

// 简化的数据结构（用于快速测试）
const simpleCascadingData = {
    "military_branch": {
        label: "军种",
        allowCustom: false,
        placeholder: "请选择军种",
        options: [
            { value: "army", text: "陆军" },
            { value: "navy", text: "海军" }
        ]
    },
    "theater": {
        label: "战区",
        allowCustom: true,
        placeholder: "请选择战区",
        customPlaceholder: "输入自定义战区",
        options: {
            "army": [
                { value: "north", text: "北部战区" },
                { value: "south", text: "南部战区" }
            ],
            "navy": [
                { value: "east_sea", text: "东海舰队" },
                { value: "south_sea", text: "南海舰队" }
            ]
        }
    },
    "base": {
        label: "基地",
        allowCustom: true,
        placeholder: "请选择基地",
        customPlaceholder: "输入自定义基地",
        options: {
            "north": [
                { value: "beijing_base", text: "北京基地" },
                { value: "shenyang_base", text: "沈阳基地" }
            ],
            "south": [
                { value: "guangzhou_base", text: "广州基地" },
                { value: "kunming_base", text: "昆明基地" }
            ],
            "east_sea": [
                { value: "shanghai_base", text: "上海基地" },
                { value: "ningbo_base", text: "宁波基地" }
            ],
            "south_sea": [
                { value: "zhanjiang_base", text: "湛江基地" },
                { value: "sanya_base", text: "三亚基地" }
            ]
        }
    }
};

// 从mock_data.js获取数据并转换为联动下拉组件格式
function getCascadingDataFromMockData() {
    // 检查是否可以从全局获取planManagementData
    if (typeof window !== 'undefined' && window.planManagementData) {
        return convertMockDataToCascadingFormat(window.planManagementData.units);
    }
    
    // 如果无法获取，返回默认数据
    console.warn('无法获取mock_data.js中的数据，使用默认数据');
    return militaryCascadingData;
}

// 将mock_data.js中的部队数据转换为联动下拉组件格式
function convertMockDataToCascadingFormat(units) {
    if (!units || !Array.isArray(units)) {
        console.error('无效的部队数据');
        return militaryCascadingData;
    }

    // 按层级分组数据
    const militaryBranches = units.filter(unit => unit.level === '军种');
    const theaters = units.filter(unit => unit.level === '战区');
    const bases = units.filter(unit => unit.level === '基地');
    const departments = units.filter(unit => unit.level === '机关');
    const basicUnits = units.filter(unit => unit.level === '基层');

    // 构建军种选项
    const militaryBranchOptions = militaryBranches.map(branch => ({
        value: branch.name.toLowerCase(),
        text: branch.name
    }));

    // 构建战区选项（按军种分组）
    const theaterOptions = {};
    theaters.forEach(theater => {
        const parentBranch = militaryBranches.find(branch => branch.id === theater.parentId);
        if (parentBranch) {
            const branchKey = parentBranch.name.toLowerCase();
            if (!theaterOptions[branchKey]) {
                theaterOptions[branchKey] = [];
            }
            theaterOptions[branchKey].push({
                value: theater.name.toLowerCase().replace(/\s+/g, '_'),
                text: theater.name
            });
        }
    });

    // 构建基地选项（按战区分组）
    const baseOptions = {};
    bases.forEach(base => {
        const parentTheater = theaters.find(theater => theater.id === base.parentId);
        if (parentTheater) {
            const theaterKey = parentTheater.name.toLowerCase().replace(/\s+/g, '_');
            if (!baseOptions[theaterKey]) {
                baseOptions[theaterKey] = [];
            }
            baseOptions[theaterKey].push({
                value: base.name.toLowerCase().replace(/\s+/g, '_') + '_base',
                text: base.name
            });
        }
    });

    // 构建机关选项（按基地分组）
    const departmentOptions = {};
    departments.forEach(dept => {
        const parentBase = bases.find(base => base.id === dept.parentId);
        if (parentBase) {
            const baseKey = parentBase.name.toLowerCase().replace(/\s+/g, '_') + '_base';
            if (!departmentOptions[baseKey]) {
                departmentOptions[baseKey] = [];
            }
            departmentOptions[baseKey].push({
                value: dept.name.toLowerCase().replace(/\s+/g, '_') + '_dept',
                text: dept.name
            });
        }
    });

    // 构建基层选项（按机关分组）
    const unitOptions = {};
    basicUnits.forEach(unit => {
        const parentDept = departments.find(dept => dept.id === unit.parentId);
        if (parentDept) {
            const deptKey = parentDept.name.toLowerCase().replace(/\s+/g, '_') + '_dept';
            if (!unitOptions[deptKey]) {
                unitOptions[deptKey] = [];
            }
            unitOptions[deptKey].push({
                value: unit.name.toLowerCase().replace(/\s+/g, '_') + '_unit',
                text: unit.name
            });
        }
    });

    // 返回转换后的数据结构
    return {
        "military_branch": {
            label: "军种",
            allowCustom: false,
            placeholder: "请选择军种",
            options: militaryBranchOptions
        },
        "theater": {
            label: "战区",
            allowCustom: true,
            placeholder: "请选择战区",
            customPlaceholder: "输入自定义战区名称",
            customMaxLength: 30,
            options: theaterOptions
        },
        "base": {
            label: "基地",
            allowCustom: true,
            placeholder: "请选择基地",
            customPlaceholder: "输入自定义基地名称",
            customMaxLength: 40,
            options: baseOptions
        },
        "department": {
            label: "机关",
            allowCustom: true,
            placeholder: "请选择机关",
            customPlaceholder: "输入自定义机关名称",
            customMaxLength: 50,
            options: departmentOptions
        },
        "unit": {
            label: "基层",
            allowCustom: true,
            placeholder: "请选择基层单位",
            customPlaceholder: "输入自定义基层单位名称",
            customMaxLength: 60,
            options: unitOptions
        }
    };
}

// 获取完整的部队层级数据（包含所有层级）
function getCompleteMilitaryHierarchy() {
    if (typeof window !== 'undefined' && window.planManagementData) {
        const units = window.planManagementData.units;
        const completeUnits = generateCompleteUnitData ? generateCompleteUnitData() : units;
        return convertMockDataToCascadingFormat(completeUnits);
    }
    return militaryCascadingData;
}

// 根据选择获取下级选项
function getChildOptions(parentLevel, parentValue, cascadingData) {
    if (!cascadingData || !cascadingData[parentLevel]) {
        return [];
    }

    const levelData = cascadingData[parentLevel];
    if (!levelData.options || !levelData.options[parentValue]) {
        return [];
    }

    return levelData.options[parentValue];
}

// 根据选择路径获取完整的选择信息
function getSelectionInfo(selections, cascadingData) {
    const result = {
        path: [],
        details: {}
    };

    if (!selections || !cascadingData) {
        return result;
    }

    Object.keys(selections).forEach(level => {
        const selection = selections[level];
        const levelData = cascadingData[level];
        
        if (levelData && levelData.options) {
            let text = '';
            
            if (selection.startsWith('custom_')) {
                text = selection.replace('custom_', '');
            } else {
                if (level === 'military_branch') {
                    const option = levelData.options.find(opt => opt.value === selection);
                    text = option ? option.text : selection;
                } else {
                    // 查找父级选择
                    const levels = Object.keys(cascadingData);
                    const currentIndex = levels.indexOf(level);
                    if (currentIndex > 0) {
                        const parentLevel = levels[currentIndex - 1];
                        const parentSelection = selections[parentLevel];
                        if (parentSelection && levelData.options[parentSelection]) {
                            const option = levelData.options[parentSelection].find(opt => opt.value === selection);
                            text = option ? option.text : selection;
                        }
                    }
                }
            }
            
            if (text) {
                result.path.push(text);
                result.details[level] = {
                    value: selection,
                    text: text
                };
            }
        }
    });

    return result;
}

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        militaryCascadingData,
        simpleCascadingData,
        getCascadingDataFromMockData,
        convertMockDataToCascadingFormat,
        getCompleteMilitaryHierarchy,
        getChildOptions,
        getSelectionInfo
    };
} else {
    // 浏览器环境
    window.militaryCascadingData = militaryCascadingData;
    window.simpleCascadingData = simpleCascadingData;
    window.getCascadingDataFromMockData = getCascadingDataFromMockData;
    window.convertMockDataToCascadingFormat = convertMockDataToCascadingFormat;
    window.getCompleteMilitaryHierarchy = getCompleteMilitaryHierarchy;
    window.getChildOptions = getChildOptions;
    window.getSelectionInfo = getSelectionInfo;
}
