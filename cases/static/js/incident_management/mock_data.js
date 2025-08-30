/**
 * 部队问题管理模块Mock数据
 * 用于开发和测试阶段的数据模拟
 */

// 模拟数据
const mockData = [
    // 问题隐患数据
    {
        type: 'hazard',
        hazardType: 'chief',
        unit: '某部队',
        checkTime: '2025-01-15',
        checkLocation: '训练场',
        problemCategory: ['安全检查', '训练安全'],
        problem: '训练器材老化，存在安全隐患',
        typical: true,
        reasonAnalysis: '管',
        remarks: '需要及时更换训练器材'
    },
    {
        type: 'hazard',
        hazardType: 'daily',
        unit: '某基地',
        checkTime: '2025-01-10',
        checkLocation: '食堂',
        problemCategory: ['食品安全'],
        problem: '食堂卫生条件不达标',
        typical: false,
        reasonAnalysis: '管',
        remarks: '加强食堂卫生管理'
    },
    {
        type: 'hazard',
        hazardType: 'comprehensive',
        unit: '某舰队',
        checkTime: '2025-01-08',
        checkLocation: '舰艇',
        problemCategory: ['装备安全', '消防安全'],
        problem: '消防设备配置不足',
        typical: true,
        reasonAnalysis: '物',
        remarks: '补充消防设备'
    },
    
    // 事故数据
    {
        type: 'accident',
        accidentSubType: 'military',
        unit: '某陆军',
        time: '2025-01-12',
        problemCategory: ['训练事故'],
        problemLevel: '一般事故',
        process: '训练过程中发生意外',
        deaths: 0,
        responsible: [
            { identity: '训练班长', rank: '上士', position: '班长' }
        ],
        reasonAnalysis: '人',
        remarks: '加强训练安全管理'
    },
    {
        type: 'accident',
        accidentSubType: 'social',
        unit: '某空军',
        time: '2025-01-05',
        problemCategory: ['车辆事故'],
        problemLevel: '较大事故',
        process: '外出执行任务时发生交通事故',
        deaths: 1,
        responsible: [
            { identity: '驾驶员', rank: '中士', position: '驾驶员' }
        ],
        reasonAnalysis: '人',
        remarks: '加强交通安全教育'
    },
    
    // 案件数据
    {
        type: 'case',
        unit: '某海军',
        time: '2025-01-03',
        problemCategory: ['盗窃'],
        problemLevel: '一般事故',
        process: '营区发生财物盗窃案件',
        deaths: 0,
        responsible: [
            { identity: '犯罪嫌疑人', rank: '', position: '' }
        ],
        reasonAnalysis: '管',
        remarks: '加强营区安全管理'
    },
    
    // 自杀数据
    {
        type: 'suicide',
        unit: '某航空兵',
        time: '2025-01-01',
        problemCategory: ['自缢'],
        problemLevel: '重大事故',
        process: '人员自杀身亡',
        deaths: 1,
        responsible: [],
        reasonAnalysis: '人',
        remarks: '加强心理健康教育'
    },
    
    // 更多模拟数据
    {
        type: 'hazard',
        hazardType: 'other',
        unit: '某训练基地',
        checkTime: '2024-12-28',
        checkLocation: '宿舍楼',
        problemCategory: ['消防安全'],
        problem: '消防通道被占用',
        typical: false,
        reasonAnalysis: '管',
        remarks: '清理消防通道'
    },
    {
        type: 'accident',
        accidentSubType: 'military',
        unit: '某军区',
        time: '2024-12-25',
        problemCategory: ['装备事故'],
        problemLevel: '特大事故',
        process: '装备故障导致重大事故',
        deaths: 3,
        responsible: [
            { identity: '装备管理员', rank: '少尉', position: '管理员' },
            { identity: '技术员', rank: '中士', position: '技术员' }
        ],
        reasonAnalysis: '物',
        remarks: '加强装备维护保养'
    },
    {
        type: 'case',
        unit: '某集团军',
        time: '2024-12-20',
        problemCategory: ['诈骗'],
        problemLevel: '一般事故',
        process: '人员被骗取财物',
        deaths: 0,
        responsible: [
            { identity: '诈骗犯', rank: '', position: '' }
        ],
        reasonAnalysis: '人',
        remarks: '加强防诈骗教育'
    },
    {
        type: 'suicide',
        unit: '某师',
        time: '2024-12-15',
        problemCategory: ['跳楼'],
        problemLevel: '重大事故',
        process: '人员跳楼自杀',
        deaths: 1,
        responsible: [],
        reasonAnalysis: '人',
        remarks: '加强心理疏导'
    },
    {
        type: 'hazard',
        hazardType: 'daily',
        unit: '某旅',
        checkTime: '2024-12-10',
        checkLocation: '弹药库',
        problemCategory: ['危险品安全'],
        problem: '危险品存储不规范',
        typical: true,
        reasonAnalysis: '管',
        remarks: '规范危险品存储'
    },
    {
        type: 'accident',
        accidentSubType: 'social',
        unit: '某团',
        time: '2024-12-05',
        problemCategory: ['火灾事故'],
        problemLevel: '较大事故',
        process: '营区发生火灾',
        deaths: 0,
        responsible: [
            { identity: '值班员', rank: '下士', position: '值班员' }
        ],
        reasonAnalysis: '环',
        remarks: '加强消防安全管理'
    },
    {
        type: 'case',
        unit: '某营',
        time: '2024-11-30',
        problemCategory: ['贪污'],
        problemLevel: '重大事故',
        process: '人员贪污公款',
        deaths: 0,
        responsible: [
            { identity: '财务人员', rank: '中尉', position: '财务员' }
        ],
        reasonAnalysis: '任',
        remarks: '加强财务监管'
    },
    {
        type: 'suicide',
        unit: '某连',
        time: '2024-11-25',
        problemCategory: ['服药自杀'],
        problemLevel: '重大事故',
        process: '人员服药自杀',
        deaths: 1,
        responsible: [],
        reasonAnalysis: '人',
        remarks: '加强心理健康教育'
    },
    {
        type: 'hazard',
        hazardType: 'comprehensive',
        unit: '某通信站',
        checkTime: '2024-11-20',
        checkLocation: '机房',
        problemCategory: ['信息安全'],
        problem: '网络安全防护不足',
        typical: true,
        reasonAnalysis: '管',
        remarks: '加强网络安全防护'
    },
    {
        type: 'accident',
        accidentSubType: 'military',
        unit: '某雷达站',
        time: '2024-11-15',
        problemCategory: ['飞行事故'],
        problemLevel: '特大事故',
        process: '飞行训练中发生事故',
        deaths: 2,
        responsible: [
            { identity: '飞行员', rank: '上尉', position: '飞行员' },
            { identity: '指挥员', rank: '少校', position: '指挥员' }
        ],
        reasonAnalysis: '人',
        remarks: '加强飞行安全管理'
    },
    {
        type: 'case',
        unit: '某医院',
        time: '2024-11-10',
        problemCategory: ['受贿'],
        problemLevel: '重大事故',
        process: '医疗人员受贿',
        deaths: 0,
        responsible: [
            { identity: '医生', rank: '少校', position: '主治医师' }
        ],
        reasonAnalysis: '任',
        remarks: '加强医疗行业监管'
    },
    {
        type: 'suicide',
        unit: '某学校',
        time: '2024-11-05',
        problemCategory: ['持枪自杀'],
        problemLevel: '特大事故',
        process: '人员持枪自杀',
        deaths: 1,
        responsible: [],
        reasonAnalysis: '管',
        remarks: '加强枪支管理'
    },
    {
        type: 'hazard',
        hazardType: 'chief',
        unit: '某研究所',
        checkTime: '2024-11-01',
        checkLocation: '实验室',
        problemCategory: ['环境安全'],
        problem: '实验室环境污染',
        typical: false,
        reasonAnalysis: '环',
        remarks: '加强实验室环境管理'
    },
    {
        type: 'accident',
        accidentSubType: 'social',
        unit: '某工厂',
        time: '2024-10-28',
        problemCategory: ['工业事故'],
        problemLevel: '重大事故',
        process: '工业生产中发生事故',
        deaths: 1,
        responsible: [
            { identity: '操作员', rank: '中士', position: '操作员' }
        ],
        reasonAnalysis: '人',
        remarks: '加强工业安全管理'
    }
];
