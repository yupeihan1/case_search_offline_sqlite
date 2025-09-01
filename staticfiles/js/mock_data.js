// Mock数据文件 - 部队问题管理模块测试数据
// 时间分布: 2000-2025年
// 包含: 问题隐患、事故、案件、自杀四种类型

const mockData = [
    // 问题隐患数据 (2000-2025年)
    {
        id: 1,
        type: 'hazard',
        hazardType: 'daily',
        unit: '第一营',
        checkTime: '2000-03-15',
        checkLocation: '',
        problemCategory: '装备维护',
        problem: '部分装备维护不及时，存在安全隐患',
        typical: true,
        remarks: '需要加强日常维护管理',
        attachments: ['维护记录.pdf', '现场照片.jpg'],
        reasonAnalysis: '管'
    },
    {
        id: 2,
        type: 'hazard',
        hazardType: 'comprehensive',
        unit: '第二营',
        checkTime: '2002-06-20',
        checkLocation: '训练场',
        problemCategory: '训练安全',
        problem: '训练场地设施老化，存在安全隐患',
        typical: true,
        remarks: '建议更换训练设施',
        attachments: ['设施检查报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 3,
        type: 'hazard',
        hazardType: 'chief',
        unit: '第三营',
        checkTime: '2005-09-25',
        checkLocation: '营区',
        problemCategory: '人员管理',
        problem: '人员配置不合理，存在安全隐患',
        typical: false,
        remarks: '需要调整人员配置',
        attachments: ['人员配置表.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 4,
        type: 'hazard',
        hazardType: 'daily',
        unit: '第四营',
        checkTime: '2008-12-30',
        checkLocation: '',
        problemCategory: '设施安全',
        problem: '营区设施存在安全隐患',
        typical: true,
        remarks: '需要维修设施',
        attachments: ['设施检查报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 5,
        type: 'hazard',
        hazardType: 'comprehensive',
        unit: '第五营',
        checkTime: '2010-04-05',
        checkLocation: '食堂',
        problemCategory: '食品安全',
        problem: '食堂卫生条件不达标，存在食品安全隐患',
        typical: true,
        remarks: '需要改善食堂卫生条件',
        attachments: ['卫生检查报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 6,
        type: 'hazard',
        hazardType: 'daily',
        unit: '第六营',
        checkTime: '2012-07-10',
        checkLocation: '',
        problemCategory: '消防安全',
        problem: '消防设备配置不足，存在消防安全隐患',
        typical: true,
        remarks: '需要增加消防设备',
        attachments: ['消防检查报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 7,
        type: 'hazard',
        hazardType: 'chief',
        unit: '第七营',
        checkTime: '2015-10-15',
        checkLocation: '宿舍区',
        problemCategory: '住宿安全',
        problem: '宿舍楼存在结构安全隐患',
        typical: false,
        remarks: '需要维修宿舍楼',
        attachments: ['建筑检查报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 8,
        type: 'hazard',
        hazardType: 'daily',
        unit: '第八营',
        checkTime: '2018-01-20',
        checkLocation: '',
        problemCategory: '训练安全',
        problem: '训练场地地面不平整，存在安全隐患',
        typical: true,
        remarks: '需要平整训练场地',
        attachments: ['场地检查报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 9,
        type: 'hazard',
        hazardType: 'comprehensive',
        unit: '第九营',
        checkTime: '2020-05-25',
        checkLocation: '装备库',
        problemCategory: '装备管理',
        problem: '装备库管理不规范，存在安全隐患',
        typical: true,
        remarks: '需要规范装备库管理',
        attachments: ['装备检查报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 10,
        type: 'hazard',
        hazardType: 'daily',
        unit: '第十营',
        checkTime: '2023-08-01',
        checkLocation: '',
        problemCategory: '车辆安全',
        problem: '车辆维护不及时，存在安全隐患',
        typical: true,
        remarks: '需要加强车辆维护',
        attachments: ['车辆检查报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 11,
        type: 'hazard',
        hazardType: 'chief',
        unit: '第十一营',
        checkTime: '2025-03-05',
        checkLocation: '医疗室',
        problemCategory: '医疗保障',
        problem: '医疗设备配置不足，存在医疗保障隐患',
        typical: false,
        remarks: '需要增加医疗设备',
        attachments: ['医疗检查报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 12,
        type: 'hazard',
        hazardType: 'comprehensive',
        unit: '第十二营',
        checkTime: '2001-11-12',
        checkLocation: '弹药库',
        problemCategory: '弹药管理',
        problem: '弹药库温湿度控制不当，存在安全隐患',
        typical: true,
        remarks: '需要改善弹药库环境控制',
        attachments: ['弹药库检查报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 13,
        type: 'hazard',
        hazardType: 'daily',
        unit: '第十三营',
        checkTime: '2003-02-18',
        checkLocation: '',
        problemCategory: '通信安全',
        problem: '通信设备老化，存在通信安全隐患',
        typical: true,
        remarks: '需要更新通信设备',
        attachments: ['通信设备检查报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 14,
        type: 'hazard',
        hazardType: 'chief',
        unit: '第十四营',
        checkTime: '2006-08-22',
        checkLocation: '指挥中心',
        problemCategory: '指挥系统',
        problem: '指挥系统软件版本过旧，存在安全漏洞',
        typical: false,
        remarks: '需要升级指挥系统',
        attachments: ['系统检查报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 15,
        type: 'hazard',
        hazardType: 'comprehensive',
        unit: '第十五营',
        checkTime: '2009-12-08',
        checkLocation: '油料库',
        problemCategory: '油料管理',
        problem: '油料库防火设施不完善，存在火灾隐患',
        typical: true,
        remarks: '需要完善防火设施',
        attachments: ['防火检查报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 16,
        type: 'hazard',
        hazardType: 'daily',
        unit: '第十六营',
        checkTime: '2011-04-14',
        checkLocation: '',
        problemCategory: '电力安全',
        problem: '配电室设备老化，存在电力安全隐患',
        typical: true,
        remarks: '需要更换配电设备',
        attachments: ['电力检查报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 17,
        type: 'hazard',
        hazardType: 'chief',
        unit: '第十七营',
        checkTime: '2014-07-30',
        checkLocation: '机场',
        problemCategory: '飞行安全',
        problem: '跑道标识不清，存在飞行安全隐患',
        typical: false,
        remarks: '需要重新标识跑道',
        attachments: ['跑道检查报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 18,
        type: 'hazard',
        hazardType: 'comprehensive',
        unit: '第十八营',
        checkTime: '2017-01-16',
        checkLocation: '港口',
        problemCategory: '海上安全',
        problem: '码头设施损坏，存在海上作业隐患',
        typical: true,
        remarks: '需要维修码头设施',
        attachments: ['码头检查报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 19,
        type: 'hazard',
        hazardType: 'daily',
        unit: '第十九营',
        checkTime: '2019-06-28',
        checkLocation: '',
        problemCategory: '网络安全',
        problem: '网络设备防护不足，存在网络安全隐患',
        typical: true,
        remarks: '需要加强网络防护',
        attachments: ['网络安全检查报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 20,
        type: 'hazard',
        hazardType: 'chief',
        unit: '第二十营',
        checkTime: '2022-09-03',
        checkLocation: '雷达站',
        problemCategory: '雷达安全',
        problem: '雷达设备维护不及时，存在监测隐患',
        typical: false,
        remarks: '需要加强雷达维护',
        attachments: ['雷达检查报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 21,
        type: 'hazard',
        hazardType: 'comprehensive',
        unit: '第二十一营',
        checkTime: '2024-12-20',
        checkLocation: '导弹基地',
        problemCategory: '导弹安全',
        problem: '导弹发射装置检查不彻底，存在安全隐患',
        typical: true,
        remarks: '需要全面检查发射装置',
        attachments: ['导弹检查报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 22,
        type: 'hazard',
        hazardType: 'daily',
        unit: '第二十二营',
        checkTime: '2004-05-11',
        checkLocation: '',
        problemCategory: '后勤保障',
        problem: '后勤物资管理混乱，存在保障隐患',
        typical: true,
        remarks: '需要规范物资管理',
        attachments: ['后勤检查报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 23,
        type: 'hazard',
        hazardType: 'chief',
        unit: '第二十三营',
        checkTime: '2007-10-25',
        checkLocation: '训练基地',
        problemCategory: '训练设施',
        problem: '训练设施损坏严重，存在训练隐患',
        typical: false,
        remarks: '需要维修训练设施',
        attachments: ['训练设施检查报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 24,
        type: 'hazard',
        hazardType: 'comprehensive',
        unit: '第二十四营',
        checkTime: '2013-03-09',
        checkLocation: '维修厂',
        problemCategory: '维修安全',
        problem: '维修设备操作规程不完善，存在维修隐患',
        typical: true,
        remarks: '需要完善操作规程',
        attachments: ['维修检查报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 25,
        type: 'hazard',
        hazardType: 'daily',
        unit: '第二十五营',
        checkTime: '2016-11-17',
        checkLocation: '',
        problemCategory: '环境安全',
        problem: '环境污染处理不当，存在环境隐患',
        typical: true,
        remarks: '需要改善环境处理',
        attachments: ['环境检查报告.pdf'],
        reasonAnalysis: '环'
    },
    {
        id: 26,
        type: 'hazard',
        hazardType: 'chief',
        unit: '第二十六营',
        checkTime: '2021-02-28',
        checkLocation: '实验室',
        problemCategory: '实验安全',
        problem: '实验室安全防护不足，存在实验隐患',
        typical: false,
        remarks: '需要加强安全防护',
        attachments: ['实验室检查报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 27,
        type: 'hazard',
        hazardType: 'comprehensive',
        unit: '第二十七营',
        checkTime: '2025-01-10',
        checkLocation: '数据中心',
        problemCategory: '数据安全',
        problem: '数据备份机制不完善，存在数据丢失隐患',
        typical: true,
        remarks: '需要完善备份机制',
        attachments: ['数据安全检查报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 28,
        type: 'hazard',
        hazardType: 'daily',
        unit: '第二十八营',
        checkTime: '2000-08-05',
        checkLocation: '',
        problemCategory: '人员安全',
        problem: '人员安全意识不足，存在人为隐患',
        typical: true,
        remarks: '需要加强安全教育',
        attachments: ['安全教育报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 29,
        type: 'hazard',
        hazardType: 'chief',
        unit: '第二十九营',
        checkTime: '2002-12-19',
        checkLocation: '武器库',
        problemCategory: '武器管理',
        problem: '武器管理制度执行不严，存在武器隐患',
        typical: false,
        remarks: '需要严格执行制度',
        attachments: ['武器检查报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 30,
        type: 'hazard',
        hazardType: 'comprehensive',
        unit: '第三十营',
        checkTime: '2005-06-30',
        checkLocation: '通信中心',
        problemCategory: '通信管理',
        problem: '通信保密措施不到位，存在泄密隐患',
        typical: true,
        remarks: '需要加强保密措施',
        attachments: ['保密检查报告.pdf'],
        reasonAnalysis: '管'
    },
    
    // 事故数据 (2000-2025年)
    {
        id: 31,
        type: 'accident',
        accidentSubType: 'military',
        time: '2000-05-15',
        problemCategory: '装备事故',
        problemLevel: '一般事故',
        unit: '第一师',
        process: '训练过程中装备故障导致事故',
        deaths: 0,
        responsible: [
            { identity: '张连长', rank: '上尉', position: '连长' }
        ],
        remarks: '装备维护不及时',
        attachments: ['事故调查报告.pdf', '现场照片.jpg'],
        reasonAnalysis: '物'
    },
    {
        id: 32,
        type: 'accident',
        accidentSubType: 'military',
        time: '2002-08-22',
        problemCategory: '火灾事故',
        problemLevel: '较大事故',
        unit: '第二师',
        process: '弹药库发生火灾事故',
        deaths: 2,
        responsible: [
            { identity: '李营长', rank: '少校', position: '营长' },
            { identity: '王班长', rank: '中士', position: '班长' }
        ],
        remarks: '防火措施不到位',
        attachments: ['火灾事故报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 33,
        type: 'accident',
        accidentSubType: 'military',
        time: '2005-03-10',
        problemCategory: '舰艇事故',
        problemLevel: '重大事故',
        unit: '第三师',
        process: '舰艇在训练中发生碰撞事故',
        deaths: 5,
        responsible: [
            { identity: '陈舰长', rank: '中校', position: '舰长' },
            { identity: '刘副舰长', rank: '少校', position: '副舰长' }
        ],
        remarks: '操作失误导致事故',
        attachments: ['舰艇事故报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 34,
        type: 'accident',
        accidentSubType: 'military',
        time: '2008-11-05',
        problemCategory: '飞行事故',
        problemLevel: '特大事故',
        unit: '第四师',
        process: '战斗机在训练中坠毁',
        deaths: 1,
        responsible: [
            { identity: '赵飞行员', rank: '上尉', position: '飞行员' },
            { identity: '孙机长', rank: '少校', position: '机长' }
        ],
        remarks: '机械故障导致坠机',
        attachments: ['飞行事故报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 35,
        type: 'accident',
        accidentSubType: 'military',
        time: '2011-07-18',
        problemCategory: '车辆事故',
        problemLevel: '一般事故',
        unit: '第五师',
        process: '军车在运输过程中发生交通事故',
        deaths: 0,
        responsible: [
            { identity: '周司机', rank: '下士', position: '司机' }
        ],
        remarks: '疲劳驾驶导致事故',
        attachments: ['车辆事故报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 36,
        type: 'accident',
        accidentSubType: 'military',
        time: '2014-12-03',
        problemCategory: '训练事故',
        problemLevel: '较大事故',
        unit: '第六师',
        process: '实弹训练中发生意外',
        deaths: 3,
        responsible: [
            { identity: '吴教官', rank: '上尉', position: '教官' },
            { identity: '郑班长', rank: '中士', position: '班长' }
        ],
        remarks: '训练组织不当',
        attachments: ['训练事故报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 37,
        type: 'accident',
        accidentSubType: 'social',
        time: '2001-06-12',
        problemCategory: '车辆交通事故',
        problemLevel: '重大事故',
        unit: '第七师',
        process: '军车与社会车辆发生严重碰撞',
        deaths: 4,
        responsible: [
            { identity: '冯司机', rank: '中士', position: '司机' }
        ],
        remarks: '超速行驶导致事故',
        attachments: ['交通事故报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 38,
        type: 'accident',
        accidentSubType: 'social',
        time: '2004-09-28',
        problemCategory: '火灾事故',
        problemLevel: '较大事故',
        unit: '第八师',
        process: '营区附近发生火灾',
        deaths: 1,
        responsible: [
            { identity: '朱班长', rank: '中士', position: '班长' }
        ],
        remarks: '用火不慎导致火灾',
        attachments: ['火灾事故报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 39,
        type: 'accident',
        accidentSubType: 'social',
        time: '2007-02-14',
        problemCategory: '建筑事故',
        problemLevel: '一般事故',
        unit: '第九师',
        process: '营房建设过程中发生事故',
        deaths: 0,
        responsible: [
            { identity: '秦工长', rank: '上士', position: '工长' }
        ],
        remarks: '施工安全措施不到位',
        attachments: ['建筑事故报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 40,
        type: 'accident',
        accidentSubType: 'social',
        time: '2010-10-20',
        problemCategory: '工业事故',
        problemLevel: '重大事故',
        unit: '第十师',
        process: '军工厂发生爆炸事故',
        deaths: 6,
        responsible: [
            { identity: '许厂长', rank: '中校', position: '厂长' },
            { identity: '韩技术员', rank: '上尉', position: '技术员' }
        ],
        remarks: '操作不当导致爆炸',
        attachments: ['工业事故报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 41,
        type: 'accident',
        accidentSubType: 'military',
        time: '2013-04-08',
        problemCategory: '装备事故',
        problemLevel: '一般事故',
        unit: '第十一师',
        process: '武器装备故障导致事故',
        deaths: 0,
        responsible: [
            { identity: '何技师', rank: '上士', position: '技师' }
        ],
        remarks: '装备维护不当',
        attachments: ['装备事故报告.pdf'],
        reasonAnalysis: '物'
    },
    {
        id: 42,
        type: 'accident',
        accidentSubType: 'military',
        time: '2016-08-15',
        problemCategory: '飞行事故',
        problemLevel: '较大事故',
        unit: '第十二师',
        process: '直升机训练中发生事故',
        deaths: 2,
        responsible: [
            { identity: '吕飞行员', rank: '上尉', position: '飞行员' }
        ],
        remarks: '天气条件恶劣导致事故',
        attachments: ['飞行事故报告.pdf'],
        reasonAnalysis: '环'
    },
    {
        id: 43,
        type: 'accident',
        accidentSubType: 'social',
        time: '2019-01-25',
        problemCategory: '车辆交通事故',
        problemLevel: '一般事故',
        unit: '第十三师',
        process: '军车在市区发生轻微碰撞',
        deaths: 0,
        responsible: [
            { identity: '马司机', rank: '下士', position: '司机' }
        ],
        remarks: '注意力不集中导致事故',
        attachments: ['交通事故报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 44,
        type: 'accident',
        accidentSubType: 'military',
        time: '2022-06-30',
        problemCategory: '训练事故',
        problemLevel: '重大事故',
        unit: '第十四师',
        process: '实弹演习中发生意外',
        deaths: 4,
        responsible: [
            { identity: '董指挥', rank: '中校', position: '指挥员' },
            { identity: '袁班长', rank: '中士', position: '班长' }
        ],
        remarks: '指挥失误导致事故',
        attachments: ['训练事故报告.pdf'],
        reasonAnalysis: '管'
    },
    {
        id: 45,
        type: 'accident',
        accidentSubType: 'social',
        time: '2025-03-12',
        problemCategory: '火灾事故',
        problemLevel: '较大事故',
        unit: '第十五师',
        process: '营区发生火灾事故',
        deaths: 1,
        responsible: [
            { identity: '蒋班长', rank: '中士', position: '班长' }
        ],
        remarks: '用电不当导致火灾',
        attachments: ['火灾事故报告.pdf'],
        reasonAnalysis: '人'
    },
    
    // 案件数据 (2000-2025年)
    {
        id: 46,
        type: 'case',
        time: '2000-12-05',
        problemCategory: '强奸',
        problemLevel: '重大事故',
        unit: '第十六师',
        process: '发生强奸案件',
        deaths: 0,
        responsible: [
            { identity: '刘某', rank: '上士', position: '班长' }
        ],
        remarks: '严重违反军纪',
        attachments: ['案件调查报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 47,
        type: 'case',
        time: '2003-07-18',
        problemCategory: '盗窃',
        problemLevel: '一般事故',
        unit: '第十七师',
        process: '营区发生盗窃案件',
        deaths: 0,
        responsible: [
            { identity: '王某', rank: '下士', position: '士兵' }
        ],
        remarks: '盗窃军用物资',
        attachments: ['盗窃案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 48,
        type: 'case',
        time: '2006-03-22',
        problemCategory: '诈骗',
        problemLevel: '较大事故',
        unit: '第十八师',
        process: '发生诈骗案件',
        deaths: 0,
        responsible: [
            { identity: '李某', rank: '中士', position: '班长' }
        ],
        remarks: '利用职务之便进行诈骗',
        attachments: ['诈骗案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 49,
        type: 'case',
        time: '2009-11-08',
        problemCategory: '贪污',
        problemLevel: '重大事故',
        unit: '第十九师',
        process: '发生贪污案件',
        deaths: 0,
        responsible: [
            { identity: '张某', rank: '少校', position: '科长' }
        ],
        remarks: '贪污公款',
        attachments: ['贪污案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 50,
        type: 'case',
        time: '2012-05-14',
        problemCategory: '受贿',
        problemLevel: '重大事故',
        unit: '第二十师',
        process: '发生受贿案件',
        deaths: 0,
        responsible: [
            { identity: '陈某', rank: '中校', position: '处长' }
        ],
        remarks: '利用职权收受贿赂',
        attachments: ['受贿案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 51,
        type: 'case',
        time: '2015-09-30',
        problemCategory: '强奸',
        problemLevel: '重大事故',
        unit: '第二十一师',
        process: '再次发生强奸案件',
        deaths: 0,
        responsible: [
            { identity: '赵某', rank: '上尉', position: '连长' }
        ],
        remarks: '严重违反军纪',
        attachments: ['案件调查报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 52,
        type: 'case',
        time: '2018-02-16',
        problemCategory: '盗窃',
        problemLevel: '一般事故',
        unit: '第二十二师',
        process: '发生盗窃案件',
        deaths: 0,
        responsible: [
            { identity: '孙某', rank: '下士', position: '士兵' }
        ],
        remarks: '盗窃个人财物',
        attachments: ['盗窃案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 53,
        type: 'case',
        time: '2021-08-25',
        problemCategory: '诈骗',
        problemLevel: '较大事故',
        unit: '第二十三师',
        process: '发生诈骗案件',
        deaths: 0,
        responsible: [
            { identity: '周某', rank: '中士', position: '班长' }
        ],
        remarks: '冒充军官进行诈骗',
        attachments: ['诈骗案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 54,
        type: 'case',
        time: '2024-12-03',
        problemCategory: '贪污',
        problemLevel: '重大事故',
        unit: '第二十四师',
        process: '发生贪污案件',
        deaths: 0,
        responsible: [
            { identity: '吴某', rank: '少校', position: '科长' }
        ],
        remarks: '贪污军费',
        attachments: ['贪污案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 55,
        type: 'case',
        time: '2025-01-20',
        problemCategory: '受贿',
        problemLevel: '重大事故',
        unit: '第二十五师',
        process: '发生受贿案件',
        deaths: 0,
        responsible: [
            { identity: '郑某', rank: '中校', position: '处长' }
        ],
        remarks: '利用职务之便收受贿赂',
        attachments: ['受贿案件报告.pdf'],
        reasonAnalysis: '人'
    },
    
    // 自杀数据 (2000-2025年)
    {
        id: 56,
        type: 'suicide',
        time: '2000-10-12',
        problemCategory: '自缢',
        problemLevel: '重大事故',
        unit: '第二十六师',
        process: '士兵在宿舍自缢身亡',
        deaths: 1,
        responsible: [
            { identity: '冯某', rank: '下士', position: '士兵' }
        ],
        remarks: '心理问题导致自杀',
        attachments: ['自杀案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 57,
        type: 'suicide',
        time: '2003-04-28',
        problemCategory: '跳楼',
        problemLevel: '重大事故',
        unit: '第二十七师',
        process: '军官从办公楼跳楼身亡',
        deaths: 1,
        responsible: [
            { identity: '朱某', rank: '上尉', position: '连长' }
        ],
        remarks: '工作压力过大',
        attachments: ['自杀案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 58,
        type: 'suicide',
        time: '2006-08-15',
        problemCategory: '持枪自杀',
        problemLevel: '特大事故',
        unit: '第二十八师',
        process: '士兵持枪自杀身亡',
        deaths: 1,
        responsible: [
            { identity: '秦某', rank: '中士', position: '班长' }
        ],
        remarks: '感情问题导致自杀',
        attachments: ['自杀案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 59,
        type: 'suicide',
        time: '2009-12-03',
        problemCategory: '服药自杀',
        problemLevel: '重大事故',
        unit: '第二十九师',
        process: '军官服药自杀身亡',
        deaths: 1,
        responsible: [
            { identity: '许某', rank: '少校', position: '科长' }
        ],
        remarks: '家庭问题导致自杀',
        attachments: ['自杀案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 60,
        type: 'suicide',
        time: '2012-06-20',
        problemCategory: '室内点火窒息',
        problemLevel: '重大事故',
        unit: '第三十师',
        process: '士兵在室内点火窒息身亡',
        deaths: 1,
        responsible: [
            { identity: '何某', rank: '下士', position: '士兵' }
        ],
        remarks: '心理疾病导致自杀',
        attachments: ['自杀案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 61,
        type: 'suicide',
        time: '2015-03-08',
        problemCategory: '自缢',
        problemLevel: '重大事故',
        unit: '第三十一师',
        process: '士兵在训练场自缢身亡',
        deaths: 1,
        responsible: [
            { identity: '吕某', rank: '中士', position: '班长' }
        ],
        remarks: '训练压力过大',
        attachments: ['自杀案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 62,
        type: 'suicide',
        time: '2018-09-14',
        problemCategory: '跳楼',
        problemLevel: '重大事故',
        unit: '第三十二师',
        process: '军官从宿舍楼跳楼身亡',
        deaths: 1,
        responsible: [
            { identity: '马某', rank: '上尉', position: '连长' }
        ],
        remarks: '人际关系问题',
        attachments: ['自杀案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 63,
        type: 'suicide',
        time: '2021-01-25',
        problemCategory: '持枪自杀',
        problemLevel: '特大事故',
        unit: '第三十三师',
        process: '士兵持枪自杀身亡',
        deaths: 1,
        responsible: [
            { identity: '董某', rank: '下士', position: '士兵' }
        ],
        remarks: '经济问题导致自杀',
        attachments: ['自杀案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 64,
        type: 'suicide',
        time: '2023-07-10',
        problemCategory: '服药自杀',
        problemLevel: '重大事故',
        unit: '第三十四师',
        process: '军官服药自杀身亡',
        deaths: 1,
        responsible: [
            { identity: '袁某', rank: '少校', position: '科长' }
        ],
        remarks: '健康问题导致自杀',
        attachments: ['自杀案件报告.pdf'],
        reasonAnalysis: '人'
    },
    {
        id: 65,
        type: 'suicide',
        time: '2025-02-18',
        problemCategory: '室内点火窒息',
        problemLevel: '重大事故',
        unit: '第三十五师',
        process: '士兵在室内点火窒息身亡',
        deaths: 1,
        responsible: [
            { identity: '蒋某', rank: '中士', position: '班长' }
        ],
        remarks: '心理问题导致自杀',
        attachments: ['自杀案件报告.pdf'],
        reasonAnalysis: '人'
    }
];

// 计划管理模块mock数据
const planManagementData = {
    // 计划数据
    plans: [
        {
            id: 1,
            type: 'leader',
            planStartDate: '2025-01-13',
            planEndDate: '2025-01-19',
            leader: '张司令',
            leadDept: '作战处',
            accompanyDept: ['政治处', '后勤处'],
            units: ['一营', '二营', '三营', '四营', '五营', '六营'],
            actualDate: null,
            actualLeader: null,
            actualLeadDept: null,
            actualAccompanyDept: null,
            actualUnits: null,
            checkResult: null,
            status: 'urgent' // urgent, completed
        },
        {
            id: 2,
            type: 'leader',
            planStartDate: '2025-01-06',
            planEndDate: '2025-01-12',
            leader: '李政委',
            leadDept: '训练处',
            accompanyDept: ['装备处'],
            units: ['一营', '二营', '三营'],
            actualDate: '2025-01-08',
            actualLeader: '李政委',
            actualLeadDept: '训练处',
            actualAccompanyDept: ['装备处'],
            actualUnits: ['一营', '二营', '七营'],
            checkResult: '优秀',
            status: 'completed'
        },
        {
            id: 3,
            type: 'daily',
            planStartDate: '2025-01-20',
            planEndDate: '2025-01-26',
            inspector: '王参谋',
            units: ['一营', '二营', '三营', '四营', '五营', '六营'],
            actualDate: null,
            actualInspector: null,
            actualUnits: null,
            checkResult: null,
            status: 'normal'
        },
        {
            id: 4,
            type: 'daily',
            planStartDate: '2025-01-27',
            planEndDate: '2025-02-02',
            inspector: '赵参谋',
            units: ['一营', '二营', '三营'],
            actualDate: '2025-01-29',
            actualInspector: '赵参谋',
            actualUnits: ['一营', '二营', '三营', '四营'],
            checkResult: '良好',
            status: 'completed'
        },
        {
            id: 5,
            type: 'leader',
            planStartDate: '2024-12-30',
            planEndDate: '2025-01-05',
            leader: '王司令',
            leadDept: '后勤处',
            accompanyDept: ['装备处', '训练处'],
            units: ['一营', '二营', '三营', '四营', '五营'],
            actualDate: '2025-01-02',
            actualLeader: '王司令',
            actualLeadDept: '后勤处',
            actualAccompanyDept: ['装备处', '训练处'],
            actualUnits: ['一营', '二营', '三营', '四营'],
            checkResult: '需改进',
            status: 'completed'
        },
        {
            id: 6,
            type: 'daily',
            planStartDate: '2024-12-23',
            planEndDate: '2024-12-29',
            inspector: '李参谋',
            units: ['一营', '二营', '三营'],
            actualDate: '2024-12-25',
            actualInspector: '李参谋',
            actualUnits: ['一营', '二营'],
            checkResult: '优秀',
            status: 'completed'
        }
    ],

    // 部队信息数据
    units: [
        // 军种级别
        {
            id: 1,
            name: '陆军',
            level: '军种',
            parentId: null,
            hierarchy: ['陆军'],
            location: '全国',
            distance: 0,
            personnel: 1000000,
            tags: ['重点单位'],
            children: []
        },
        {
            id: 2,
            name: '海军',
            level: '军种',
            parentId: null,
            hierarchy: ['海军'],
            location: '全国',
            distance: 0,
            personnel: 800000,
            tags: ['重点单位'],
            children: []
        },
        {
            id: 3,
            name: '空军',
            level: '军种',
            parentId: null,
            hierarchy: ['空军'],
            location: '全国',
            distance: 0,
            personnel: 600000,
            tags: ['重点单位'],
            children: []
        },
        
        // 战区级别
        {
            id: 4,
            name: '北部战区',
            level: '战区',
            parentId: 1,
            hierarchy: ['陆军', '北部战区'],
            location: '北京市',
            distance: 0,
            personnel: 200000,
            tags: ['重点单位'],
            children: []
        },
        {
            id: 5,
            name: '南部战区',
            level: '战区',
            parentId: 1,
            hierarchy: ['陆军', '南部战区'],
            location: '广州市',
            distance: 0,
            personnel: 180000,
            tags: ['重点单位'],
            children: []
        },
        {
            id: 6,
            name: '东部战区',
            level: '战区',
            parentId: 1,
            hierarchy: ['陆军', '东部战区'],
            location: '南京市',
            distance: 0,
            personnel: 190000,
            tags: ['重点单位'],
            children: []
        },
        {
            id: 7,
            name: '西部战区',
            level: '战区',
            parentId: 1,
            hierarchy: ['陆军', '西部战区'],
            location: '成都市',
            distance: 0,
            personnel: 170000,
            tags: ['重点单位'],
            children: []
        },
        {
            id: 8,
            name: '中部战区',
            level: '战区',
            parentId: 1,
            hierarchy: ['陆军', '中部战区'],
            location: '郑州市',
            distance: 0,
            personnel: 160000,
            tags: ['重点单位'],
            children: []
        },
        
        // 基地级别
        {
            id: 9,
            name: '大连基地',
            level: '基地',
            parentId: 4,
            hierarchy: ['陆军', '北部战区', '大连基地'],
            location: '大连市',
            distance: 0,
            personnel: 50000,
            tags: ['重点单位'],
            children: []
        },
        {
            id: 10,
            name: '沈阳基地',
            level: '基地',
            parentId: 4,
            hierarchy: ['陆军', '北部战区', '沈阳基地'],
            location: '沈阳市',
            distance: 0,
            personnel: 45000,
            tags: ['重点单位'],
            children: []
        },
        {
            id: 11,
            name: '广州基地',
            level: '基地',
            parentId: 5,
            hierarchy: ['陆军', '南部战区', '广州基地'],
            location: '广州市',
            distance: 0,
            personnel: 48000,
            tags: ['重点单位'],
            children: []
        },
        {
            id: 12,
            name: '南京基地',
            level: '基地',
            parentId: 6,
            hierarchy: ['陆军', '东部战区', '南京基地'],
            location: '南京市',
            distance: 0,
            personnel: 52000,
            tags: ['重点单位'],
            children: []
        },
        
        // 机关级别
        {
            id: 13,
            name: '作战处',
            level: '机关',
            parentId: 9,
            hierarchy: ['陆军', '北部战区', '大连基地', '作战处'],
            location: '大连市',
            distance: 0,
            personnel: 200,
            tags: ['重点单位'],
            children: []
        },
        {
            id: 14,
            name: '政治处',
            level: '机关',
            parentId: 9,
            hierarchy: ['陆军', '北部战区', '大连基地', '政治处'],
            location: '大连市',
            distance: 0,
            personnel: 150,
            tags: ['重点单位'],
            children: []
        },
        {
            id: 15,
            name: '后勤处',
            level: '机关',
            parentId: 9,
            hierarchy: ['陆军', '北部战区', '大连基地', '后勤处'],
            location: '大连市',
            distance: 0,
            personnel: 180,
            tags: ['后勤保障'],
            children: []
        },
        {
            id: 16,
            name: '装备处',
            level: '机关',
            parentId: 9,
            hierarchy: ['陆军', '北部战区', '大连基地', '装备处'],
            location: '大连市',
            distance: 0,
            personnel: 160,
            tags: ['装备维护'],
            children: []
        },
        {
            id: 17,
            name: '训练处',
            level: '机关',
            parentId: 9,
            hierarchy: ['陆军', '北部战区', '大连基地', '训练处'],
            location: '大连市',
            distance: 0,
            personnel: 120,
            tags: ['训练基地'],
            children: []
        },
        {
            id: 18,
            name: '情报处',
            level: '机关',
            parentId: 9,
            hierarchy: ['陆军', '北部战区', '大连基地', '情报处'],
            location: '大连市',
            distance: 0,
            personnel: 100,
            tags: ['重点单位'],
            children: []
        },
        {
            id: 19,
            name: '通信处',
            level: '机关',
            parentId: 9,
            hierarchy: ['陆军', '北部战区', '大连基地', '通信处'],
            location: '大连市',
            distance: 0,
            personnel: 90,
            tags: ['装备维护'],
            children: []
        },
        {
            id: 9,
            name: '工化处',
            level: '机关',
            parentId: 1,
            hierarchy: ['某基地', '工化处'],
            location: '北京市',
            distance: 0,
            personnel: 80,
            tags: ['装备维护'],
            children: []
        },
        {
            id: 10,
            name: '军需处',
            level: '机关',
            parentId: 1,
            hierarchy: ['某基地', '军需处'],
            location: '北京市',
            distance: 0,
            personnel: 110,
            tags: ['后勤保障'],
            children: []
        },
        {
            id: 11,
            name: '卫生处',
            level: '机关',
            parentId: 1,
            hierarchy: ['某基地', '卫生处'],
            location: '北京市',
            distance: 0,
            personnel: 95,
            tags: ['后勤保障'],
            children: []
        },
        {
            id: 12,
            name: '运输处',
            level: '机关',
            parentId: 1,
            hierarchy: ['某基地', '运输处'],
            location: '北京市',
            distance: 0,
            personnel: 85,
            tags: ['后勤保障'],
            children: []
        },
        {
            id: 13,
            name: '财务处',
            level: '机关',
            parentId: 1,
            hierarchy: ['某基地', '财务处'],
            location: '北京市',
            distance: 0,
            personnel: 70,
            tags: ['后勤保障'],
            children: []
        },
        {
            id: 14,
            name: '审计处',
            level: '机关',
            parentId: 1,
            hierarchy: ['某基地', '审计处'],
            location: '北京市',
            distance: 0,
            personnel: 60,
            tags: ['重点单位'],
            children: []
        },
        {
            id: 15,
            name: '纪检处',
            level: '机关',
            parentId: 1,
            hierarchy: ['某基地', '纪检处'],
            location: '北京市',
            distance: 0,
            personnel: 55,
            tags: ['重点单位'],
            children: []
        }
    ],

    // 基层单位数据（为简化，只添加部分示例）
    basicUnits: [
        {
            id: 16,
            name: '作战处一营',
            level: '基层',
            parentId: 2,
            hierarchy: ['某基地', '作战处', '作战处一营'],
            location: '北京市',
            distance: 15,
            personnel: 120,
            tags: ['重点单位', '训练基地']
        },
        {
            id: 17,
            name: '作战处二营',
            level: '基层',
            parentId: 2,
            hierarchy: ['某基地', '作战处', '作战处二营'],
            location: '天津市',
            distance: 120,
            personnel: 110,
            tags: ['重点单位']
        },
        {
            id: 18,
            name: '政治处一营',
            level: '基层',
            parentId: 3,
            hierarchy: ['某基地', '政治处', '政治处一营'],
            location: '河北省',
            distance: 200,
            personnel: 95,
            tags: ['重点单位']
        },
        {
            id: 19,
            name: '后勤处一营',
            level: '基层',
            parentId: 4,
            hierarchy: ['某基地', '后勤处', '后勤处一营'],
            location: '山西省',
            distance: 350,
            personnel: 85,
            tags: ['后勤保障']
        },
        {
            id: 20,
            name: '装备处一营',
            level: '基层',
            parentId: 5,
            hierarchy: ['某基地', '装备处', '装备处一营'],
            location: '内蒙古自治区',
            distance: 500,
            personnel: 75,
            tags: ['装备维护', '偏远单位']
        }
    ],

    // 标签选项数据
    tags: {
        // 机关单位标签
        orgUnits: ['作战处', '政治处', '后勤处', '装备处', '训练处', '情报处', '通信处', '工化处', '军需处', '卫生处', '运输处', '财务处', '审计处', '纪检处'],
        
        // 基层单位标签
        basicUnits: ['一营', '二营', '三营', '四营', '五营', '六营', '七营', '八营', '九营', '十营'],
        
        // 牵头处和陪同处标签
        departments: ['作战处', '政治处', '后勤处', '装备处', '训练处'],
        
        // 部队信息维护标签
        unitTags: ['重点单位', '偏远单位', '新建单位', '训练基地', '后勤保障', '装备维护'],
        
        // 受检单位标签
        checkUnits: ['一营', '二营', '三营', '四营', '五营', '六营', '七营', '八营', '九营', '十营']
    },

    // 首长和检查人数据
    personnel: {
        // 首长列表
        leaders: ['张司令', '李政委', '王司令', '赵政委', '刘司令', '陈政委', '孙司令', '周政委'],
        
        // 检查人列表
        inspectors: ['王参谋', '李参谋', '张参谋', '赵参谋', '刘参谋', '陈参谋', '孙参谋', '周参谋']
    },

    // 检查重点数据
    focusPoints: [
        '战备训练情况',
        '装备管理情况',
        '人员管理情况',
        '安全管理情况',
        '后勤保障情况',
        '政治教育情况',
        '纪律作风情况',
        '信息化建设情况'
    ],

    // 部门数据
    departments: [
        {
            id: 1,
            name: '参谋部',
            level: '部',
            parentId: null,
            code: 'CB001',
            leader: '张参谋',
            phone: '010-12345678',
            description: '负责军事参谋工作'
        },
        {
            id: 2,
            name: '作战处',
            level: '处',
            parentId: 1,
            code: 'CB002',
            leader: '李作战',
            phone: '010-12345679',
            description: '负责作战计划制定'
        },
        {
            id: 3,
            name: '训练处',
            level: '处',
            parentId: 1,
            code: 'CB003',
            leader: '王训练',
            phone: '010-12345680',
            description: '负责军事训练工作'
        },
        {
            id: 4,
            name: '后勤处',
            level: '处',
            parentId: null,
            code: 'HL001',
            leader: '赵后勤',
            phone: '010-12345681',
            description: '负责后勤保障工作'
        },
        {
            id: 5,
            name: '装备处',
            level: '处',
            parentId: null,
            code: 'ZB001',
            leader: '钱装备',
            phone: '010-12345682',
            description: '负责装备管理工作'
        },
        {
            id: 6,
            name: '政治处',
            level: '处',
            parentId: null,
            code: 'ZZ001',
            leader: '孙政治',
            phone: '010-12345683',
            description: '负责政治思想工作'
        },
        {
            id: 7,
            name: '情报处',
            level: '处',
            parentId: 1,
            code: 'CB004',
            leader: '周情报',
            phone: '010-12345684',
            description: '负责情报收集分析'
        },
        {
            id: 8,
            name: '通信处',
            level: '处',
            parentId: null,
            code: 'TX001',
            leader: '吴通信',
            phone: '010-12345685',
            description: '负责通信保障工作'
        },
        {
            id: 9,
            name: '工化处',
            level: '处',
            parentId: null,
            code: 'GH001',
            leader: '郑工化',
            phone: '010-12345686',
            description: '负责工程化学工作'
        },
        {
            id: 10,
            name: '军需处',
            level: '处',
            parentId: 4,
            code: 'HL002',
            leader: '冯军需',
            phone: '010-12345687',
            description: '负责军需物资保障'
        },
        {
            id: 11,
            name: '卫生处',
            level: '处',
            parentId: 4,
            code: 'HL003',
            leader: '陈卫生',
            phone: '010-12345688',
            description: '负责医疗卫生保障'
        },
        {
            id: 12,
            name: '运输处',
            level: '处',
            parentId: 4,
            code: 'HL004',
            leader: '褚运输',
            phone: '010-12345689',
            description: '负责运输保障工作'
        },
        {
            id: 13,
            name: '财务处',
            level: '处',
            parentId: null,
            code: 'CW001',
            leader: '卫财务',
            phone: '010-12345690',
            description: '负责财务管理'
        },
        {
            id: 14,
            name: '审计处',
            level: '处',
            parentId: 13,
            code: 'CW002',
            leader: '蒋审计',
            phone: '010-12345691',
            description: '负责审计监督工作'
        },
        {
            id: 15,
            name: '纪检处',
            level: '处',
            parentId: 6,
            code: 'ZZ002',
            leader: '沈纪检',
            phone: '010-12345692',
            description: '负责纪律检查工作'
        }
    ]
};

// 生成完整的部队信息数据（包含所有基层单位）
function generateCompleteUnitData() {
    const completeUnits = [...planManagementData.units];
    
    // 为每个机关生成基层单位
    planManagementData.units.forEach(orgUnit => {
        if (orgUnit.level === '机关') {
            // 每个机关生成3-6个基层单位
            const basicUnitCount = Math.floor(Math.random() * 4) + 3;
            for (let i = 1; i <= basicUnitCount; i++) {
                const basicUnit = {
                    id: completeUnits.length + 1,
                    name: `${orgUnit.name}${i}营`,
                    level: '基层',
                    parentId: orgUnit.id,
                    hierarchy: [...orgUnit.hierarchy, `${orgUnit.name}${i}营`],
                    location: getRandomLocation(),
                    distance: Math.floor(Math.random() * 100) + 10,
                    personnel: Math.floor(Math.random() * 200) + 50,
                    tags: getRandomTags()
                };
                completeUnits.push(basicUnit);
            }
        }
    });
    
    return completeUnits;
}

// 生成随机驻地
function getRandomLocation() {
    const locations = ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省'];
    return locations[Math.floor(Math.random() * locations.length)];
}

// 生成随机标签
function getRandomTags() {
    const allTags = ['重点单位', '偏远单位', '新建单位', '训练基地', '后勤保障', '装备维护'];
    const numTags = Math.floor(Math.random() * 3) + 1;
    const selectedTags = [];
    
    for (let i = 0; i < numTags; i++) {
        const tag = allTags[Math.floor(Math.random() * allTags.length)];
        if (!selectedTags.includes(tag)) {
            selectedTags.push(tag);
        }
    }
    
    return selectedTags;
}

// 生成检查历史记录
function generateCheckHistory(units) {
    units.forEach(unit => {
        unit.checkHistory = [];
        const checkCount = Math.floor(Math.random() * 10) + 1;
        
        for (let i = 0; i < checkCount; i++) {
            const checkDate = new Date();
            checkDate.setDate(checkDate.getDate() - Math.floor(Math.random() * 365));
            
            unit.checkHistory.push({
                date: checkDate.toISOString().split('T')[0],
                type: Math.random() > 0.5 ? '首长检查' : '日常检查',
                inspector: Math.random() > 0.5 ? '张司令' : '王参谋',
                result: Math.random() > 0.7 ? '优秀' : '良好'
            });
        }
        
        // 按日期排序
        unit.checkHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    });
}

// 法律法规文档模块mock数据
const documentDatabase = {
    1: {
        id: 1,
        fileName: '关于进一步加强财政管理的通知.docx',
        content: `关于进一步加强财政管理的通知

各有关单位：

为进一步加强财政管理，规范财政收支行为，提高财政资金使用效益，现就有关事项通知如下：

一、总体要求
（一）坚持以习近平新时代中国特色社会主义思想为指导，全面贯彻党的二十大精神，认真落实党中央、国务院决策部署。
（二）坚持稳中求进工作总基调，完整、准确、全面贯彻新发展理念，加快构建新发展格局。
（三）坚持系统观念，统筹发展和安全，推动高质量发展。

二、主要任务
（一）加强预算管理
1. 严格执行预算制度，确保预算编制的科学性、准确性和完整性。
2. 加强预算执行监督，建立健全预算执行监控机制。
3. 强化预算绩效管理，提高财政资金使用效益。

（二）规范收支管理
1. 严格执行收支两条线管理，确保财政收入及时足额入库。
2. 加强支出管理，严格控制一般性支出，保障重点支出。
3. 建立健全内部控制制度，防范财政风险。

（三）强化监督管理
1. 加强财政监督检查，建立健全监督检查制度。
2. 强化责任追究，对违反财经纪律的行为严肃处理。
3. 加强信息化建设，提高财政管理效率。

三、保障措施
（一）加强组织领导，明确责任分工。
（二）加强培训教育，提高人员素质。
（三）加强协调配合，形成工作合力。

四、实施时间
本通知自发布之日起施行。

特此通知。

财政部
2025年1月15日`,
        securityLevel: '内部',
        securityPeriod: 10,
        publishUnit: '财政部',
        publishDate: '2025-01-15',
        effectStatus: '有效',
        tags: '财政,管理',
        issueUnit: '财政部办公厅',
        effectiveStartDate: '2025-01-15',
        effectiveEndDate: '2028-01-15',
        fileNumber: '财办发[2025]15号',
        revisionHistory: '关于规范财政资金使用的指导意见.docx',
        remarks: '重要文件，请各单位认真学习并贯彻执行'
    },
    2: {
        id: 2,
        fileName: '教育事业发展专项资金管理办法.pdf',
        content: `教育事业发展专项资金管理办法

第一章 总则

第一条 为规范教育事业发展专项资金管理，提高资金使用效益，促进教育事业健康发展，根据《中华人民共和国预算法》等法律法规，制定本办法。

第二条 本办法所称教育事业发展专项资金（以下简称专项资金），是指中央财政安排用于支持教育事业发展的专项资金。

第三条 专项资金管理遵循以下原则：
（一）统筹规划，突出重点；
（二）规范管理，提高效益；
（三）公开透明，接受监督。

第二章 资金分配

第四条 专项资金分配应当遵循以下原则：
（一）公平公正，科学合理；
（二）突出重点，统筹兼顾；
（三）注重绩效，激励约束。

第五条 专项资金分配主要考虑以下因素：
（一）各地教育发展水平；
（二）人口规模和结构；
（三）经济发展水平；
（四）财政困难程度；
（五）绩效评价结果。

第三章 资金使用

第六条 专项资金主要用于以下方面：
（一）改善办学条件；
（二）提高教育质量；
（三）促进教育公平；
（四）支持教育改革创新。

第七条 专项资金不得用于以下支出：
（一）人员经费；
（二）日常办公经费；
（三）与教育无关的支出。

第四章 监督管理

第八条 各级财政部门应当加强对专项资金的监督管理，建立健全监督检查制度。

第九条 各级教育部门应当加强对专项资金使用的指导和管理，确保资金使用效益。

第十条 对违反本办法规定的行为，依法依规追究相关责任人的责任。

第五章 附则

第十一条 本办法由财政部、教育部负责解释。

第十二条 本办法自发布之日起施行。`,
        securityLevel: '公开',
        publishUnit: '教育部',
        publishDate: '2025-01-10',
        effectStatus: '有效',
        tags: '教育,资金',
        issueUnit: '教育部财务司',
        effectiveStartDate: '2025-01-10',
        effectiveEndDate: '2030-01-10',
        fileNumber: '教财发[2025]8号',
        revisionHistory: '教育信息化建设实施方案.pdf',
        remarks: '本办法适用于全国教育系统'
    },
    3: {
        id: 3,
        fileName: '医疗卫生机构建设标准.pdf',
        content: `医疗卫生机构建设标准

前言

本标准规定了医疗卫生机构建设的基本要求、建设规模、功能布局、设备配置等内容，适用于新建、改建、扩建医疗卫生机构的设计、建设和管理。

第一章 基本要求

第一条 医疗卫生机构建设应当符合国家相关法律法规和标准规范。

第二条 医疗卫生机构建设应当遵循以下原则：
（一）以人为本，保障安全；
（二）科学合理，经济适用；
（三）统筹规划，协调发展；
（四）保护环境，节约资源。

第三条 医疗卫生机构建设应当满足以下基本要求：
（一）满足医疗服务需求；
（二）保障医疗安全；
（三）提高医疗质量；
（四）改善就医环境。

第二章 建设规模

第四条 医疗卫生机构建设规模应当根据服务人口、服务半径、医疗需求等因素确定。

第五条 不同级别医疗卫生机构的建设规模标准：
（一）三级医院：床位数不少于500张；
（二）二级医院：床位数200-499张；
（三）一级医院：床位数100-199张；
（四）社区卫生服务中心：建筑面积不少于1000平方米。

第三章 功能布局

第六条 医疗卫生机构功能布局应当科学合理，满足医疗服务流程要求。

第七条 主要功能区域包括：
（一）门诊区域；
（二）住院区域；
（三）医技区域；
（四）后勤保障区域。

第四章 设备配置

第八条 医疗卫生机构设备配置应当满足医疗服务需要，符合相关标准规范。

第九条 基本设备配置要求：
（一）医疗设备：满足基本医疗服务需要；
（二）信息设备：支持信息化管理；
（三）安全设备：保障医疗安全。

第五章 附则

第十条 本标准由卫生部负责解释。

第十一条 本标准自发布之日起施行。`,
        securityLevel: '内部',
        publishUnit: '卫生部',
        publishDate: '2025-01-08',
        effectStatus: '有效',
        tags: '卫生,建设',
        issueUnit: '卫生部规划司',
        effectiveStartDate: '2025-01-08',
        effectiveEndDate: '2027-01-08',
        fileNumber: '卫规发[2025]3号',
        revisionHistory: '关于规范财政资金使用的指导意见.docx;教育信息化建设实施方案.pdf',
        remarks: '本标准为强制性标准，必须严格执行'
    },
    4: {
        id: 4,
        fileName: '交通运输安全管理办法.pdf',
        content: `交通运输安全管理办法

第一章 总则

第一条 为加强交通运输安全管理，保障人民群众生命财产安全，根据《中华人民共和国道路交通安全法》等法律法规，制定本办法。

第二条 本办法适用于公路、水路、铁路、民航等交通运输领域的安全管理。

第三条 交通运输安全管理应当遵循以下原则：
（一）安全第一，预防为主；
（二）综合治理，标本兼治；
（三）依法管理，严格执法。

第二章 安全管理职责

第四条 交通运输主管部门负责本行政区域内交通运输安全管理工作。

第五条 运输企业应当建立健全安全生产责任制，落实安全生产主体责任。

第六条 驾驶员、船员等从业人员应当严格遵守安全操作规程。

第三章 安全监督检查

第七条 交通运输主管部门应当定期开展安全监督检查。

第八条 对发现的安全隐患，应当及时督促整改。

第四章 附则

第九条 本办法由交通运输部负责解释。

第十条 本办法自发布之日起施行。`,
        securityLevel: '公开',
        publishUnit: '交通运输部',
        publishDate: '2025-01-05',
        effectStatus: '有效',
        tags: '交通,安全',
        issueUnit: '交通运输部安全司',
        effectiveStartDate: '2025-01-05',
        effectiveEndDate: '2028-01-05',
        fileNumber: '交安发[2025]2号',
        revisionHistory: '根据最新安全要求修订',
        remarks: '本办法适用于全国交通运输系统'
    },
    5: {
        id: 5,
        fileName: '环境保护监测标准.pdf',
        content: `环境保护监测标准

前言

本标准规定了环境保护监测的基本要求、监测项目、监测方法等内容，适用于环境质量监测、污染源监测等环境保护监测工作。

第一章 基本要求

第一条 环境保护监测应当遵循以下原则：
（一）科学规范，准确可靠；
（二）及时有效，连续监测；
（三）公开透明，接受监督。

第二条 监测机构应当具备相应的资质和能力。

第二章 监测项目

第三条 环境质量监测项目包括：
（一）大气环境质量监测；
（二）水环境质量监测；
（三）土壤环境质量监测；
（四）噪声环境质量监测。

第四条 污染源监测项目包括：
（一）工业污染源监测；
（二）生活污染源监测；
（三）农业污染源监测。

第三章 监测方法

第五条 监测方法应当符合国家相关标准规范。

第六条 监测数据应当真实、准确、完整。

第四章 附则

第七条 本标准由环境保护部负责解释。

第八条 本标准自发布之日起施行。`,
        securityLevel: '内部',
        publishUnit: '环境保护部',
        publishDate: '2025-01-03',
        effectStatus: '有效',
        tags: '环保,监测',
        issueUnit: '环境保护部监测司',
        effectiveStartDate: '2025-01-03',
        effectiveEndDate: '2027-01-03',
        fileNumber: '环监发[2025]1号',
        revisionHistory: '根据最新监测技术修订',
        remarks: '本标准为强制性标准，必须严格执行'
    },
    6: {
        id: 6,
        fileName: '农业技术推广条例.pdf',
        content: `农业技术推广条例

第一章 总则

第一条 为促进农业技术推广，提高农业科技水平，根据《中华人民共和国农业法》等法律法规，制定本条例。

第二条 本条例适用于农业技术推广活动。

第三条 农业技术推广应当遵循以下原则：
（一）因地制宜，分类指导；
（二）示范引导，逐步推广；
（三）农民自愿，政府引导。

第二章 推广体系

第四条 建立以农业技术推广机构为主体，农业科研单位、农业院校、农民专业合作社等为补充的推广体系。

第五条 农业技术推广机构应当配备专业技术人员。

第三章 推广内容

第六条 农业技术推广内容包括：
（一）新品种、新技术、新设备；
（二）农业标准化生产技术；
（三）农业生态环境保护技术；
（四）农业信息化技术。

第四章 保障措施

第七条 各级人民政府应当保障农业技术推广经费。

第八条 建立农业技术推广激励机制。

第五章 附则

第九条 本条例由农业部负责解释。

第十条 本条例自发布之日起施行。`,
        securityLevel: '公开',
        publishUnit: '农业部',
        publishDate: '2024-12-28',
        effectStatus: '有效',
        tags: '农业,技术',
        issueUnit: '农业部科技司',
        effectiveStartDate: '2024-12-28',
        effectiveEndDate: '2029-12-28',
        fileNumber: '农技发[2024]25号',
        revisionHistory: '根据农业发展需要修订',
        remarks: '本条例适用于全国农业系统'
    },
    7: {
        id: 7,
        fileName: '工业产品质量监督管理办法.pdf',
        content: `工业产品质量监督管理办法

第一章 总则

第一条 为加强工业产品质量监督管理，保障产品质量安全，根据《中华人民共和国产品质量法》等法律法规，制定本办法。

第二条 本办法适用于工业产品质量监督管理活动。

第三条 工业产品质量监督管理应当遵循以下原则：
（一）预防为主，防治结合；
（二）分级管理，属地负责；
（三）公开透明，接受监督。

第二章 监督管理职责

第四条 质量监督部门负责工业产品质量监督管理工作。

第五条 生产企业应当建立健全质量管理体系。

第六条 销售企业应当建立进货检查验收制度。

第三章 监督检查

第七条 质量监督部门应当定期开展产品质量监督检查。

第八条 对不合格产品，应当依法处理。

第四章 附则

第九条 本办法由质量监督总局负责解释。

第十条 本办法自发布之日起施行。`,
        securityLevel: '内部',
        publishUnit: '质量监督总局',
        publishDate: '2024-12-25',
        effectStatus: '有效',
        tags: '工业,质量',
        issueUnit: '质量监督总局监督司',
        effectiveStartDate: '2024-12-25',
        effectiveEndDate: '2027-12-25',
        fileNumber: '质检发[2024]20号',
        revisionHistory: '根据质量监管要求修订',
        remarks: '本办法适用于全国质量监督系统'
    },
    8: {
        id: 8,
        fileName: '科技创新项目管理规定.pdf',
        content: `科技创新项目管理规定

第一章 总则

第一条 为规范科技创新项目管理，提高科技资源配置效率，根据《中华人民共和国科学技术进步法》等法律法规，制定本规定。

第二条 本规定适用于政府资助的科技创新项目。

第三条 科技创新项目管理应当遵循以下原则：
（一）公开透明，公平竞争；
（二）突出重点，分类管理；
（三）注重绩效，动态调整。

第二章 项目申报

第四条 项目申报应当符合国家科技发展规划。

第五条 申报单位应当具备相应的研究能力和条件。

第六条 申报材料应当真实、准确、完整。

第三章 项目评审

第七条 建立专家评审制度。

第八条 评审过程应当公开、公平、公正。

第四章 项目实施

第九条 项目承担单位应当按照项目计划组织实施。

第十条 建立项目监督检查制度。

第五章 附则

第十一条 本规定由科技部负责解释。

第十二条 本规定自发布之日起施行。`,
        securityLevel: '内部',
        publishUnit: '科技部',
        publishDate: '2024-12-20',
        effectStatus: '有效',
        tags: '科技,创新',
        issueUnit: '科技部计划司',
        effectiveStartDate: '2024-12-20',
        effectiveEndDate: '2027-12-20',
        fileNumber: '科计发[2024]18号',
        revisionHistory: '根据科技创新需要修订',
        remarks: '本规定适用于全国科技系统'
    },
    9: {
        id: 9,
        fileName: '文化产业发展指导意见.pdf',
        content: `文化产业发展指导意见

一、总体要求

（一）指导思想
以习近平新时代中国特色社会主义思想为指导，全面贯彻党的二十大精神，坚持社会主义先进文化前进方向，推动文化产业高质量发展。

（二）基本原则
1. 坚持正确导向，弘扬主旋律；
2. 坚持市场导向，激发活力；
3. 坚持创新驱动，提升质量；
4. 坚持融合发展，扩大影响。

二、重点任务

（一）提升文化产品质量
1. 加强内容创作；
2. 提高制作水平；
3. 完善评价体系。

（二）培育新兴业态
1. 发展数字文化产业；
2. 推进文化科技融合；
3. 拓展文化消费市场。

（三）完善产业体系
1. 优化产业结构；
2. 加强人才培养；
3. 完善政策支持。

三、保障措施

（一）加强组织领导；
（二）加大政策支持；
（三）强化监督管理。

四、实施时间
本意见自发布之日起实施。`,
        securityLevel: '公开',
        publishUnit: '文化部',
        publishDate: '2024-12-15',
        effectStatus: '有效',
        tags: '文化,产业',
        issueUnit: '文化部产业司',
        effectiveStartDate: '2024-12-15',
        effectiveEndDate: '2029-12-15',
        fileNumber: '文产发[2024]15号',
        revisionHistory: '根据文化发展需要修订',
        remarks: '本意见适用于全国文化系统'
    },
    10: {
        id: 10,
        fileName: '体育事业发展规划.pdf',
        content: `体育事业发展规划

一、发展目标

（一）总体目标
到2030年，基本建成体育强国，体育综合实力和国际影响力显著提升。

（二）具体目标
1. 全民健身水平显著提高；
2. 竞技体育实力明显增强；
3. 体育产业规模不断扩大；
4. 体育文化影响力持续提升。

二、重点任务

（一）推进全民健身
1. 完善全民健身设施；
2. 丰富全民健身活动；
3. 提高科学健身水平。

（二）提升竞技体育
1. 优化项目布局；
2. 加强人才培养；
3. 提高训练水平。

（三）发展体育产业
1. 扩大产业规模；
2. 优化产业结构；
3. 促进融合发展。

三、保障措施

（一）加强组织领导；
（二）加大投入力度；
（三）完善政策体系。

四、实施时间
本规划自发布之日起实施。`,
        securityLevel: '公开',
        publishUnit: '体育总局',
        publishDate: '2024-12-10',
        effectStatus: '有效',
        tags: '体育,发展',
        issueUnit: '体育总局规划司',
        effectiveStartDate: '2024-12-10',
        effectiveEndDate: '2030-12-10',
        fileNumber: '体规发[2024]12号',
        revisionHistory: '根据体育发展需要修订',
        remarks: '本规划适用于全国体育系统'
    },
    11: {
        id: 11,
        fileName: '体育事业发展规划2.pdf',
        content: `体育事业发展规划

一、发展目标

（一）总体目标
到2030年，基本建成体育强国，体育综合实力和国际影响力显著提升。

（二）具体目标
1. 全民健身水平显著提高；
2. 竞技体育实力明显增强；
3. 体育产业规模不断扩大；
4. 体育文化影响力持续提升。

二、重点任务

（一）推进全民健身
1. 完善全民健身设施；
2. 丰富全民健身活动；
3. 提高科学健身水平。

（二）提升竞技体育
1. 优化项目布局；
2. 加强人才培养；
3. 提高训练水平。

（三）发展体育产业
1. 扩大产业规模；
2. 优化产业结构；
3. 促进融合发展。

三、保障措施

（一）加强组织领导；
（二）加大投入力度；
（三）完善政策体系。

四、实施时间
本规划自发布之日起实施。`,
        securityLevel: '公开',
        publishUnit: '体育总局',
        publishDate: '2024-12-10',
        effectStatus: '有效',
        tags: '体育,发展',
        issueUnit: '体育总局规划司',
        effectiveStartDate: '2024-12-10',
        effectiveEndDate: '2030-12-10',
        fileNumber: '体规发[2024]12号',
        revisionHistory: '根据体育发展需要修订',
        remarks: '本规划适用于全国体育系统'
    }
};

// 历史修订文件数据库
const revisionFileDatabase = [
    {
        id: 1,
        fileName: '关于进一步加强财政管理的通知.docx',
        publishUnit: '财政部',
        publishDate: '2025-01-15',
        effectiveStartDate: '2025-01-15',
        effectiveEndDate: '2028-01-15',
        securityLevel: '内部'
    },
    {
        id: 2,
        fileName: '教育事业发展专项资金管理办法.pdf',
        publishUnit: '教育部',
        publishDate: '2025-01-10',
        effectiveStartDate: '2025-01-10',
        effectiveEndDate: '2027-01-10',
        securityLevel: '公开'
    },
    {
        id: 3,
        fileName: '医疗卫生机构建设标准.pdf',
        publishUnit: '卫生部',
        publishDate: '2025-01-08',
        effectiveStartDate: '2025-01-08',
        effectiveEndDate: '2026-01-08',
        securityLevel: '内部'
    },
    {
        id: 4,
        fileName: '关于规范财政资金使用的指导意见.docx',
        publishUnit: '财政部',
        publishDate: '2024-12-20',
        effectiveStartDate: '2024-12-20',
        effectiveEndDate: '2027-12-20',
        securityLevel: '内部'
    },
    {
        id: 5,
        fileName: '教育信息化建设实施方案.pdf',
        publishUnit: '教育部',
        publishDate: '2024-12-15',
        effectiveStartDate: '2024-12-15',
        effectiveEndDate: '2026-12-15',
        securityLevel: '公开'
    }
];

// 法律法规模块配置数据
const documentConfig = {
    // 默认标签选项
    defaultTagOptions: [
        '财政', '教育', '卫生', '交通', '环保', '农业', '工业', '科技', '文化', '体育',
        '民政', '公安', '司法', '人事', '劳动', '建设', '规划', '管理', '监督', '检查',
        '安全', '质量', '标准', '制度', '政策', '法规', '条例', '办法', '通知', '决定',
        '意见', '批复', '公告', '通告', '报告', '请示', '函', '会议纪要'
    ],
    
    // 密级选项
    securityLevels: ['公开', '内部', '秘密', '机密', '绝密'],
    
    // 效力状态选项
    effectStatuses: ['有效', '失效', '待生效'],
    
    // 文件类型选项
    fileTypes: ['.doc', '.docx', '.pdf'],
    
    // 最大文件大小（MB）
    maxFileSize: 50
};

// 导出数据供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        mockData,
        planManagementData,
        generateCompleteUnitData,
        generateCheckHistory,
        documentDatabase,
        revisionFileDatabase,
        documentConfig
    };
}

// 导出到全局作用域（兼容浏览器环境）
if (typeof window !== 'undefined') {
    window.planManagementData = planManagementData;
    window.generateCompleteUnitData = generateCompleteUnitData;
    window.generateCheckHistory = generateCheckHistory;
    window.documentDatabase = documentDatabase;
    window.revisionFileDatabase = revisionFileDatabase;
    window.documentConfig = documentConfig;
}
