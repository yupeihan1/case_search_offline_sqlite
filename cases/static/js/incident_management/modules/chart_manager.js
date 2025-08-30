/**
 * 图表管理模块
 * 负责图表生成、管理和销毁
 */

// 生成图表
function generateCharts(data, startDate = null, endDate = null) {
    // 检查ECharts是否可用
    if (!checkECharts()) {
        console.error('Cannot generate charts: ECharts not available');
        return;
    }
    
    // 销毁旧图表
    destroyCharts();
    
    try {
        // 生成事故总量柱状图 - 传入时间范围参数
        generateAccidentTotalChart(data, startDate, endDate);
        
        // 生成饼图系列
        generateAccidentTypePieChart(data);
        generateSafetyCausePieChart(data);
        generateSafetyTypePieChart(data);
        generateHumanBehaviorPieChart(data);
        generateUnsafeConditionPieChart(data);
        generateEnvironmentalImpactPieChart(data);
        generateManagementIssuePieChart(data);
        generateTaskArrangementPieChart(data);
        
        // 生成年分布折线图 - 传入时间范围参数
        generateYearDistributionChart(data, startDate, endDate);
        
    } catch (error) {
        console.error('Error generating charts:', error);
    }
}

// 销毁图表
function destroyCharts() {
    Object.values(analysisCharts).forEach(chart => {
        if (chart) {
            chart.dispose();
        }
    });
    analysisCharts = {};
}

// 重新调整图表大小
function resizeCharts() {
    Object.values(analysisCharts).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
}

// 生成事故总量柱状图
function generateAccidentTotalChart(data, startDate = null, endDate = null) {
    const ctx = document.getElementById('accidentTotalChart');
    if (!ctx) return;
    
    // 根据时间范围确定显示粒度
    const timeGranularity = analyzeTimeGranularityByRange(startDate, endDate);
    console.log('柱状图时间粒度:', timeGranularity);
    
    // 如果是季度/月双图模式，特殊处理
    if (timeGranularity === 'quarter-month') {
        generateQuarterMonthBarChart(data, startDate, endDate);
        return;
    }
    
    // 根据时间粒度生成统计数据
    const timeStats = {};
    const typeStats = {};
    
    data.forEach(item => {
        const timeKey = getTimeKey(item, timeGranularity);
        let type = item.type;
        
        // 事故类型需要根据accidentSubType细分
        if (item.type === 'accident') {
            if (item.accidentSubType === 'social') {
                type = '社会事故';
            } else if (item.accidentSubType === 'military') {
                type = '部队事故';
            } else {
                type = '其他事故';
            }
        }
        
        if (timeKey) {
            if (!timeStats[timeKey]) timeStats[timeKey] = {};
            if (!timeStats[timeKey][type]) timeStats[timeKey][type] = 0;
            timeStats[timeKey][type]++;
        }
        
        if (!typeStats[type]) typeStats[type] = 0;
        typeStats[type]++;
    });
    
    let timeKeys = Object.keys(timeStats).sort();
    const types = Object.keys(typeStats);
    
    console.log('柱状图初始时间轴:', timeKeys);
    
    if (timeKeys.length === 0) {
        console.log('柱状图时间轴为空，生成默认时间轴');
        // 如果没有数据，根据时间范围生成默认时间轴
        if (timeGranularity === 'year') {
            timeKeys.push('2023', '2024', '2025');
        } else if (timeGranularity === 'month') {
            // 如果没有传入时间范围，使用当前年份
            const currentYear = new Date().getFullYear();
            let effectiveStartDate = startDate;
            let effectiveEndDate = endDate;
            
            if (!effectiveStartDate) {
                effectiveStartDate = `${currentYear}-01-01`;
            }
            if (!effectiveEndDate) {
                effectiveEndDate = `${currentYear}-12-31`;
            }
            
            timeKeys = generateMonthKeysByRange(effectiveStartDate, effectiveEndDate);
        } else if (timeGranularity === 'day') {
            // 如果没有传入时间范围，使用当前月份
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
            const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
            let effectiveStartDate = startDate;
            let effectiveEndDate = endDate;
            
            if (!effectiveStartDate) {
                effectiveStartDate = `${currentYear}-${currentMonth}-01`;
            }
            if (!effectiveEndDate) {
                effectiveEndDate = `${currentYear}-${currentMonth}-${daysInMonth}`;
            }
            
            timeKeys = generateDayKeysByRange(effectiveStartDate, effectiveEndDate);
        }
    } else {
        console.log('柱状图时间轴不为空，根据数据生成完整时间轴');
        // 当有数据时，根据数据的时间范围生成完整的时间轴（包括数据为0的节点）
        if (timeGranularity === 'month') {
            // 根据数据的时间范围生成月份时间轴
            const dataTimeRange = getDataTimeRange(data);
            let effectiveStartDate = startDate;
            let effectiveEndDate = endDate;
            
            if (!effectiveStartDate && dataTimeRange.start) {
                effectiveStartDate = dataTimeRange.start;
            }
            if (!effectiveEndDate && dataTimeRange.end) {
                effectiveEndDate = dataTimeRange.end;
            }
            
            // 如果没有有效的时间范围，使用传入的时间范围或默认时间范围
            if (!effectiveStartDate || !effectiveEndDate) {
                if (startDate && endDate) {
                    // 使用传入的时间范围
                    effectiveStartDate = effectiveStartDate || startDate;
                    effectiveEndDate = effectiveEndDate || endDate;
                } else {
                    // 使用默认时间范围
                    const currentYear = new Date().getFullYear();
                    effectiveStartDate = effectiveStartDate || `${currentYear}-01-01`;
                    effectiveEndDate = effectiveEndDate || `${currentYear}-12-31`;
                }
            }
            
            timeKeys = generateMonthKeysByRange(effectiveStartDate, effectiveEndDate);
        } else if (timeGranularity === 'day') {
            // 根据数据的时间范围生成日期时间轴
            const dataTimeRange = getDataTimeRange(data);
            let effectiveStartDate = startDate;
            let effectiveEndDate = endDate;
            
            if (!effectiveStartDate && dataTimeRange.start) {
                effectiveStartDate = dataTimeRange.start;
            }
            if (!effectiveEndDate && dataTimeRange.end) {
                effectiveEndDate = dataTimeRange.end;
            }
            
            // 如果没有有效的时间范围，使用传入的时间范围或默认时间范围
            if (!effectiveStartDate || !effectiveEndDate) {
                if (startDate && endDate) {
                    // 使用传入的时间范围
                    effectiveStartDate = effectiveStartDate || startDate;
                    effectiveEndDate = effectiveEndDate || endDate;
                } else {
                    // 使用默认时间范围
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear();
                    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
                    const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
                    effectiveStartDate = effectiveStartDate || `${currentYear}-${currentMonth}-01`;
                    effectiveEndDate = effectiveEndDate || `${currentYear}-${currentMonth}-${daysInMonth}`;
                }
            }
            
            timeKeys = generateDayKeysByRange(effectiveStartDate, effectiveEndDate);
        }
        
        // 确保时间轴不为空
        if (timeKeys.length === 0) {
            if (timeGranularity === 'month') {
                for (let i = 1; i <= 12; i++) {
                    timeKeys.push(`${i}月`);
                }
            } else if (timeGranularity === 'day') {
                for (let i = 1; i <= 31; i++) {
                    timeKeys.push(`1月${i}日`);
                }
            }
        }
    }
    
    console.log('柱状图最终时间轴:', timeKeys);
    console.log('柱状图时间轴长度:', timeKeys.length);
    
    const option = {
        tooltip: getBarTooltipConfig(),
        legend: {
            data: types.map(type => getTypeDisplayName(type)),
            top: 15,
            itemGap: 15,
            textStyle: {
                fontSize: 12
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '8%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: timeKeys,
            axisLabel: {
                fontSize: 11,
                interval: 0,
                rotate: 0
            },
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 11
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: types.map((type, index) => ({
            name: getTypeDisplayName(type),
            type: 'bar',
            data: timeKeys.map(timeKey => timeStats[timeKey]?.[type] || 0),
            itemStyle: {
                color: `hsl(${index * 60}, 70%, 60%)`
            },
            label: {
                show: true,
                position: 'top',
                fontSize: 10
            }
        }))
    };
    
    analysisCharts.accidentTotal = echarts.init(ctx, 'shine');
    analysisCharts.accidentTotal.setOption(option);
    
    // 动态更新图表标题
    updateBarChartTitle(timeGranularity);
}

// 生成事故类型饼图
function generateAccidentTypePieChart(data) {
    const domElement = document.getElementById('accidentTypePieChart');
    if (!domElement) return;
    
    // 根据筛选数据统计不同类型，将事故细分为社会事故和部队事故
    const typeStats = {};
    data.forEach(item => {
        if (item.type === 'accident') {
            // 事故类型需要根据accidentSubType细分
            if (item.accidentSubType === 'social') {
                if (!typeStats['社会事故']) typeStats['社会事故'] = 0;
                typeStats['社会事故']++;
            } else if (item.accidentSubType === 'military') {
                if (!typeStats['部队事故']) typeStats['部队事故'] = 0;
                typeStats['部队事故']++;
            } else {
                // 如果没有子类型，归类为其他事故
                if (!typeStats['其他事故']) typeStats['其他事故'] = 0;
                typeStats['其他事故']++;
            }
        } else {
            // 非事故类型直接统计
            const type = item.type;
            if (!typeStats[type]) typeStats[type] = 0;
            typeStats[type]++;
        }
    });
    
    const pieData = Object.keys(typeStats).map(type => ({
        name: getTypeDisplayName(type),
        value: typeStats[type]
    }));
    
    if (pieData.length === 0) {
        pieData.push({ name: '无数据', value: 1 });
    }
    
    const option = {
        tooltip: getPieTooltipConfig(),
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            itemGap: 6,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                fontSize: 10
            },
            formatter: function(name) {
                const item = pieData.find(d => d.name === name);
                return item ? `${name} (${item.value}起)` : name;
            }
        },
        series: [{
            name: '事故类型',
            type: 'pie',
            radius: ['25%', '55%'],
            center: ['30%', '50%'],
            data: pieData,
            label: {
                show: true, // 显示饼图标签
                position: 'outside', // 统一使用外部标签
                formatter: function(params) {
                    return `${params.percent}%`;
                },
                fontSize: 10,
                color: '#333', // 统一使用黑色
                fontWeight: 'bold'
            },
            labelLine: {
                show: true, // 始终显示引导线
                length: 15,
                length2: 10,
                smooth: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    analysisCharts.accidentTypePie = echarts.init(domElement, 'shine');
    analysisCharts.accidentTypePie.setOption(option);
}

// 生成安全问题致因饼图
function generateSafetyCausePieChart(data) {
    const ctx = document.getElementById('safetyCausePieChart');
    if (!ctx) return;
    
    // 根据筛选数据统计原因分析
    const reasonStats = {};
    data.forEach(item => {
        const reason = item.reasonAnalysis;
        if (!reasonStats[reason]) reasonStats[reason] = 0;
        reasonStats[reason]++;
    });
    
    const labels = Object.keys(reasonStats).map(reason => getReasonDisplayName(reason));
    const values = Object.values(reasonStats);
    
    if (labels.length === 0) {
        labels.push('无数据');
        values.push(1);
    }
    
    const pieData = labels.map((label, index) => ({
        name: label,
        value: values[index]
    }));
    
    const option = {
        tooltip: getPieTooltipConfig(),
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            itemGap: 6,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                fontSize: 10
            },
            formatter: function(name) {
                const item = pieData.find(d => d.name === name);
                return item ? `${name} (${item.value}起)` : name;
            }
        },
        series: [{
            name: '安全问题致因',
            type: 'pie',
            radius: ['25%', '55%'],
            center: ['30%', '50%'],
            data: pieData,
            label: {
                show: true, // 显示饼图标签
                position: 'outside', // 统一使用外部标签
                formatter: function(params) {
                    return `${params.percent}%`;
                },
                fontSize: 10,
                color: '#333', // 统一使用黑色
                fontWeight: 'bold'
            },
            labelLine: {
                show: true, // 始终显示引导线
                length: 15,
                length2: 10,
                smooth: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    analysisCharts.safetyCausePie = echarts.init(ctx, 'shine');
    analysisCharts.safetyCausePie.setOption(option);
}

// 生成年分布折线图
function generateYearDistributionChart(data, startDate = null, endDate = null) {
    const domElement = document.getElementById('yearDistributionChart');
    if (!domElement) {
        console.error('yearDistributionChart element not found');
        return;
    }
    
    // 根据时间范围确定显示粒度
    const timeGranularity = analyzeTimeGranularityByRange(startDate, endDate);
    console.log('时间粒度分析结果:', timeGranularity);
    console.log('开始时间:', startDate);
    console.log('结束时间:', endDate);
    
    // 如果是季度/月双图模式，特殊处理
    if (timeGranularity === 'quarter-month') {
        generateQuarterMonthChart(data, startDate, endDate);
        return;
    }
    
    // 根据时间粒度生成统计数据
    const timeStats = {};
    const typeStats = {};
    
    data.forEach(item => {
        const timeKey = getTimeKey(item, timeGranularity);
        let type = item.type;
        
        // 事故类型需要根据accidentSubType细分
        if (item.type === 'accident') {
            if (item.accidentSubType === 'social') {
                type = '社会事故';
            } else if (item.accidentSubType === 'military') {
                type = '部队事故';
            } else {
                type = '其他事故';
            }
        }
        
        if (timeKey) {
            if (!timeStats[timeKey]) timeStats[timeKey] = {};
            if (!timeStats[timeKey][type]) timeStats[timeKey][type] = 0;
            timeStats[timeKey][type]++;
        }
        
        if (!typeStats[type]) typeStats[type] = 0;
        typeStats[type]++;
    });
    
    let timeKeys = Object.keys(timeStats).sort();
    const types = Object.keys(typeStats);
    console.log('初始时间轴:', timeKeys);
    console.log('数据类型:', types);
    
    if (timeKeys.length === 0) {
        console.log('时间轴为空，生成默认时间轴');
        // 如果没有数据，根据时间范围生成默认时间轴
        if (timeGranularity === 'year') {
            timeKeys.push('2023', '2024', '2025');
        } else if (timeGranularity === 'month') {
            // 如果没有传入时间范围，使用当前年份
            const currentYear = new Date().getFullYear();
            let effectiveStartDate = startDate;
            let effectiveEndDate = endDate;
            
            if (!effectiveStartDate) {
                effectiveStartDate = `${currentYear}-01-01`;
            }
            if (!effectiveEndDate) {
                effectiveEndDate = `${currentYear}-12-31`;
            }
            
            timeKeys = generateMonthKeysByRange(effectiveStartDate, effectiveEndDate);
        } else if (timeGranularity === 'day') {
            // 如果没有传入时间范围，使用当前月份
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
            const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
            let effectiveStartDate = startDate;
            let effectiveEndDate = endDate;
            
            if (!effectiveStartDate) {
                effectiveStartDate = `${currentYear}-${currentMonth}-01`;
            }
            if (!effectiveEndDate) {
                effectiveEndDate = `${currentYear}-${currentMonth}-${daysInMonth}`;
            }
            
            timeKeys = generateDayKeysByRange(effectiveStartDate, effectiveEndDate);
        }
    } else {
        console.log('时间轴不为空，根据数据生成完整时间轴');
        // 当有数据时，根据数据的时间范围生成完整的时间轴（包括数据为0的节点）
        if (timeGranularity === 'month') {
            // 根据数据的时间范围生成月份时间轴
            const dataTimeRange = getDataTimeRange(data);
            let effectiveStartDate = startDate;
            let effectiveEndDate = endDate;
            
            if (!effectiveStartDate && dataTimeRange.start) {
                effectiveStartDate = dataTimeRange.start;
            }
            if (!effectiveEndDate && dataTimeRange.end) {
                effectiveEndDate = dataTimeRange.end;
            }
            
            // 如果没有有效的时间范围，使用传入的时间范围或默认时间范围
            if (!effectiveStartDate || !effectiveEndDate) {
                if (startDate && endDate) {
                    // 使用传入的时间范围
                    effectiveStartDate = effectiveStartDate || startDate;
                    effectiveEndDate = effectiveEndDate || endDate;
                } else {
                    // 使用默认时间范围
                    const currentYear = new Date().getFullYear();
                    effectiveStartDate = effectiveStartDate || `${currentYear}-01-01`;
                    effectiveEndDate = effectiveEndDate || `${currentYear}-12-31`;
                }
            }
            
            timeKeys = generateMonthKeysByRange(effectiveStartDate, effectiveEndDate);
        } else if (timeGranularity === 'day') {
            // 根据数据的时间范围生成日期时间轴
            const dataTimeRange = getDataTimeRange(data);
            let effectiveStartDate = startDate;
            let effectiveEndDate = endDate;
            
            if (!effectiveStartDate && dataTimeRange.start) {
                effectiveStartDate = dataTimeRange.start;
            }
            if (!effectiveEndDate && dataTimeRange.end) {
                effectiveEndDate = dataTimeRange.end;
            }
            
            // 如果没有有效的时间范围，使用传入的时间范围或默认时间范围
            if (!effectiveStartDate || !effectiveEndDate) {
                if (startDate && endDate) {
                    // 使用传入的时间范围
                    effectiveStartDate = effectiveStartDate || startDate;
                    effectiveEndDate = effectiveEndDate || endDate;
                } else {
                    // 使用默认时间范围
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear();
                    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
                    const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
                    effectiveStartDate = effectiveStartDate || `${currentYear}-${currentMonth}-01`;
                    effectiveEndDate = effectiveEndDate || `${currentYear}-${currentMonth}-${daysInMonth}`;
                }
            }
            
            timeKeys = generateDayKeysByRange(effectiveStartDate, effectiveEndDate);
        }
        
        // 确保时间轴不为空
        if (timeKeys.length === 0) {
            if (timeGranularity === 'month') {
                for (let i = 1; i <= 12; i++) {
                    timeKeys.push(`${i}月`);
                }
            } else if (timeGranularity === 'day') {
                for (let i = 1; i <= 31; i++) {
                    timeKeys.push(`1月${i}日`);
                }
            }
        }
    }
    
    console.log('最终时间轴:', timeKeys);
    console.log('时间轴长度:', timeKeys.length);
    
    // 构建ECharts系列数据
    const series = types.map((type, index) => {
        const colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF'];
        return {
            name: getTypeDisplayName(type),
            type: 'line',
            data: timeKeys.map(timeKey => timeStats[timeKey]?.[type] || 0),
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
                color: colors[index % colors.length]
            },
            itemStyle: {
                color: colors[index % colors.length]
            },
            label: {
                show: true,
                position: 'top',
                formatter: '{c}'
            }
        };
    });
    
    // 添加总数线
    const totalData = timeKeys.map(timeKey => {
        return Object.keys(timeStats[timeKey] || {}).reduce((sum, type) => sum + (timeStats[timeKey][type] || 0), 0);
    });
    
    series.unshift({
        name: '总数',
        type: 'line',
        data: totalData,
        smooth: true,
        symbol: 'diamond',
        symbolSize: 8,
        lineStyle: {
            color: '#FF6384',
            width: 3
        },
        itemStyle: {
            color: '#FF6384'
        },
        label: {
            show: true,
            position: 'top',
            formatter: '{c}'
        }
    });
    
    const option = {
        tooltip: getLineTooltipConfig(),
        legend: {
            data: series.map(s => s.name),
            top: 15,
            itemGap: 15,
            textStyle: {
                fontSize: 12
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '8%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: timeKeys,
            axisLabel: {
                fontSize: 11
            },
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value',
            minInterval: 1,
            axisLabel: {
                fontSize: 11
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: series
    };
    
    analysisCharts.yearDistribution = echarts.init(domElement, 'shine');
    analysisCharts.yearDistribution.setOption(option);
    
    // 动态更新图表标题
    updateChartTitle(timeGranularity);
}

// 生成季度/月双图表
function generateQuarterMonthChart(data, startDate = null, endDate = null) {
    const domElement = document.getElementById('yearDistributionChart');
    if (!domElement) return;
    
    // 生成季度统计数据
    const quarterStats = {};
    const monthStats = {};
    const typeStats = {};
    
    data.forEach(item => {
        const quarterKey = getTimeKey(item, 'quarter');
        const monthKey = getTimeKey(item, 'month');
        let type = item.type;
        
        // 事故类型需要根据accidentSubType细分
        if (item.type === 'accident') {
            if (item.accidentSubType === 'social') {
                type = '社会事故';
            } else if (item.accidentSubType === 'military') {
                type = '部队事故';
            } else {
                type = '其他事故';
            }
        }
        
        if (quarterKey) {
            if (!quarterStats[quarterKey]) quarterStats[quarterKey] = {};
            if (!quarterStats[quarterKey][type]) quarterStats[quarterKey][type] = 0;
            quarterStats[quarterKey][type]++;
        }
        
        if (monthKey) {
            if (!monthStats[monthKey]) monthStats[monthKey] = {};
            if (!monthStats[monthKey][type]) monthStats[monthKey][type] = 0;
            monthStats[monthKey][type]++;
        }
        
        if (!typeStats[type]) typeStats[type] = 0;
        typeStats[type]++;
    });
    
    // 根据时间范围生成时间轴
    const { quarterKeys, monthKeys } = generateTimeAxisByRange(startDate, endDate);
    const types = Object.keys(typeStats);
    
    // 构建季度系列数据
    const quarterSeries = types.map((type, index) => {
        const colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF'];
        return {
            name: getTypeDisplayName(type),
            type: 'line',
            data: quarterKeys.map(quarterKey => quarterStats[quarterKey]?.[type] || 0),
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
                color: colors[index % colors.length]
            },
            itemStyle: {
                color: colors[index % colors.length]
            },
            label: {
                show: true,
                position: 'top',
                formatter: '{c}'
            }
        };
    });
    
    // 添加季度总数线
    const quarterTotalData = quarterKeys.map(quarterKey => {
        return Object.keys(quarterStats[quarterKey] || {}).reduce((sum, type) => sum + (quarterStats[quarterKey][type] || 0), 0);
    });
    
    quarterSeries.unshift({
        name: '总数',
        type: 'line',
        data: quarterTotalData,
        smooth: true,
        symbol: 'diamond',
        symbolSize: 8,
        lineStyle: {
            color: '#FF6384',
            width: 3
        },
        itemStyle: {
            color: '#FF6384'
        },
        label: {
            show: true,
            position: 'top',
            formatter: '{c}'
        }
    });
    
    // 构建月系列数据
    const monthSeries = types.map((type, index) => {
        const colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF'];
        return {
            name: getTypeDisplayName(type),
            type: 'line',
            data: monthKeys.map(monthKey => monthStats[monthKey]?.[type] || 0),
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
                color: colors[index % colors.length]
            },
            itemStyle: {
                color: colors[index % colors.length]
            },
            label: {
                show: true,
                position: 'top',
                formatter: '{c}'
            }
        };
    });
    
    // 添加月总数线
    const monthTotalData = monthKeys.map(monthKey => {
        return Object.keys(monthStats[monthKey] || {}).reduce((sum, type) => sum + (monthStats[monthKey][type] || 0), 0);
    });
    
    monthSeries.unshift({
        name: '总数',
        type: 'line',
        data: monthTotalData,
        smooth: true,
        symbol: 'diamond',
        symbolSize: 8,
        lineStyle: {
            color: '#FF6384',
            width: 3
        },
        itemStyle: {
            color: '#FF6384'
        },
        label: {
            show: true,
            position: 'top',
            formatter: '{c}'
        }
    });
    
    // 配置双图表选项
    const option = {
        tooltip: getLineTooltipConfig(),
        title: [
            {
                text: '季度分布',
                left: 'center',
                top: '12%',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#333'
                }
            },
            {
                text: '月度分布',
                left: 'center',
                top: '57%',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#333'
                }
            }
        ],
        legend: {
            data: quarterSeries.map(s => s.name),
            top: 15,
            itemGap: 15,
            textStyle: {
                fontSize: 12
            },
            pageButtonItemGap: 5,
            pageButtonGap: 5,
            pageButtonPosition: 'end',
            pageIconColor: '#666',
            pageIconInactiveColor: '#ccc',
            pageIconSize: 12,
            pageTextStyle: {
                color: '#666',
                fontSize: 12
            }
        },
        grid: [
            {
                left: '5%',
                right: '5%',
                top: '24%',
                height: '25%'
            },
            {
                left: '5%',
                right: '5%',
                top: '69%',
                height: '25%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: quarterKeys,
                axisLabel: {
                    fontSize: 11
                },
                axisTick: {
                    alignWithLabel: true
                },
                gridIndex: 0
            },
            {
                type: 'category',
                boundaryGap: false,
                data: monthKeys,
                axisLabel: {
                    fontSize: 11
                },
                axisTick: {
                    alignWithLabel: true
                },
                gridIndex: 1
            }
        ],
        yAxis: [
            {
                type: 'value',
                minInterval: 1,
                axisLabel: {
                    fontSize: 11
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                gridIndex: 0
            },
            {
                type: 'value',
                minInterval: 1,
                axisLabel: {
                    fontSize: 11
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                gridIndex: 1
            }
        ],
        series: [
            // 季度图表系列
            ...quarterSeries.map(series => ({
                ...series,
                xAxisIndex: 0,
                yAxisIndex: 0
            })),
            // 月图表系列
            ...monthSeries.map(series => ({
                ...series,
                xAxisIndex: 1,
                yAxisIndex: 1
            }))
        ]
    };
    
    analysisCharts.yearDistribution = echarts.init(domElement, 'shine');
    analysisCharts.yearDistribution.setOption(option);
    
    // 动态更新图表标题
    updateChartTitle('quarter-month');
}

// 根据时间范围确定显示粒度
function analyzeTimeGranularityByRange(startDate, endDate) {
    // 如果没有设置时间范围，默认显示年图
    if (!startDate && !endDate) return 'year';
    
    // 如果只设置了开始时间或结束时间，使用该时间
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    // 如果时间无效，默认显示年图
    if ((start && isNaN(start.getTime())) || (end && isNaN(end.getTime()))) {
        return 'year';
    }
    
    // 如果只设置了开始时间，使用开始时间
    if (start && !end) {
        timeGranularity = analyzeSingleDate(start);
        console.log('timeGranularity=====>', timeGranularity);
        return timeGranularity;
    }
    
    // 如果只设置了结束时间，使用结束时间
    if (!start && end) {
        timeGranularity = analyzeSingleDate(end);
        console.log('timeGranularity=====>', timeGranularity);
        return timeGranularity;
    }
    
    // 如果设置了时间范围，分析时间跨度
    if (start && end) {
        timeGranularity = analyzeDateRange(start, end);
        console.log('timeGranularity=====>', timeGranularity);
        return timeGranularity;
    }
    
    return 'year';
}

// 分析单个日期的时间粒度
function analyzeSingleDate(date) {
    // 单个日期显示日图，这样可以显示该日期的详细数据
    return 'day';
}

// 分析时间范围的时间粒度
function analyzeDateRange(start, end) {
    console.log('analyzeDateRange - 开始时间:', start);
    console.log('analyzeDateRange - 结束时间:', end);
    
    // 计算时间差（毫秒）
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    console.log('analyzeDateRange - 天数差:', daysDiff);
    
    // 如果时间差小于等于1天，显示日图
    if (daysDiff <= 1) {
        console.log('analyzeDateRange - 返回: day (天数差 <= 1)');
        return 'day';
    }
    
    // 检查是否跨年
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    
    console.log('analyzeDateRange - 开始年份:', startYear, '结束年份:', endYear);
    
    if (startYear !== endYear) {
        // 跨年显示年图
        console.log('analyzeDateRange - 返回: year (跨年)');
        return 'year';
    }
    
    // 同一年，检查是否跨季度
    const startQuarter = Math.ceil((start.getMonth() + 1) / 3);
    const endQuarter = Math.ceil((end.getMonth() + 1) / 3);
    
    console.log('analyzeDateRange - 开始季度:', startQuarter, '结束季度:', endQuarter);
    
    if (startQuarter !== endQuarter) {
        // 跨季度显示季度/月双图
        console.log('analyzeDateRange - 返回: quarter-month (跨季度)');
        return 'quarter-month';
    }
    
    // 同季度，检查是否跨月
    const startMonth = start.getMonth() + 1;
    const endMonth = end.getMonth() + 1;
    
    console.log('analyzeDateRange - 开始月份:', startMonth, '结束月份:', endMonth);
    
    if (startMonth !== endMonth) {
        // 跨月显示月图
        console.log('analyzeDateRange - 返回: month (跨月)');
        return 'month';
    }
    
    // 同月显示日图
    console.log('analyzeDateRange - 返回: day (同月)');
    return 'day';
}

// 分析数据的时间分布，确定显示粒度（保留原函数用于其他用途）
function analyzeTimeGranularity(data) {
    if (!data || data.length === 0) return 'year';
    
    const years = new Set();
    const quarters = new Set();
    const months = new Set();
    const days = new Set();
    
    data.forEach(item => {
        const dateStr = item.type === 'hazard' ? item.checkTime : item.time;
        if (!dateStr) return;
        
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return;
        
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const quarter = Math.ceil(month / 3);
        
        years.add(year);
        quarters.add(`${year}-Q${quarter}`);
        months.add(`${year}-${month.toString().padStart(2, '0')}`);
        days.add(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
    });
    
    // 如果只有一天的数据，显示每日
    if (days.size === 1) return 'day';
    // 如果只有一个月的数据，显示每日
    if (months.size === 1) return 'day';
    // 如果只有一年的数据，判断季度分布
    if (years.size === 1) {
        // 如果跨季度，显示季度/月双图
        if (quarters.size > 1) return 'quarter-month';
        // 如果同季度，显示月图
        return 'month';
    }
    // 否则显示每年
    return 'year';
}

// 根据时间范围生成时间轴
function generateTimeAxisByRange(startDate, endDate) {
    let quarterKeys = ['Q1', 'Q2', 'Q3', 'Q4'];
    let monthKeys = [];
    
    // 如果没有传入时间范围，使用默认时间范围
    if (!startDate || !endDate) {
        // 默认显示所有季度和月份
        for (let i = 1; i <= 12; i++) {
            monthKeys.push(`${i}月`);
        }
        return { quarterKeys, monthKeys };
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const startYear = start.getFullYear();
        const endYear = end.getFullYear();
        
        // 如果跨年，显示简化处理，显示所有季度和月份
        if (startYear !== endYear) {
            quarterKeys = ['Q1', 'Q2', 'Q3', 'Q4'];
            for (let i = 1; i <= 12; i++) {
                monthKeys.push(`${i}月`);
            }
        } else {
            // 同一年，根据季度范围生成
            const startQuarter = Math.ceil((start.getMonth() + 1) / 3);
            const endQuarter = Math.ceil((end.getMonth() + 1) / 3);
            
            quarterKeys = [];
            if (startQuarter === endQuarter) {
                // 同一个季度，只显示这个季度
                quarterKeys.push(`Q${startQuarter}`);
            } else {
                // 跨季度，生成季度范围
                for (let q = startQuarter; q <= endQuarter; q++) {
                    quarterKeys.push(`Q${q}`);
                }
            }
            
            // 生成月份范围
            const startMonth = start.getMonth() + 1;
            const endMonth = end.getMonth() + 1;
            
            if (startMonth === endMonth) {
                // 同一个月，只显示这个月
                monthKeys.push(`${startMonth}月`);
            } else {
                // 跨月，生成月份范围
                for (let m = startMonth; m <= endMonth; m++) {
                    monthKeys.push(`${m}月`);
                }
            }
        }
    } else {
        // 时间无效，默认显示所有季度和月份
        for (let i = 1; i <= 12; i++) {
            monthKeys.push(`${i}月`);
        }
    }
    
    return { quarterKeys, monthKeys };
}

// 根据时间范围生成月份时间轴
function generateMonthKeysByRange(startDate, endDate) {
    let monthKeys = [];
    
    // 如果没有传入时间范围，使用默认时间范围
    if (!startDate || !endDate) {
        // 默认显示所有月份
        for (let i = 1; i <= 12; i++) {
            monthKeys.push(`${i}月`);
        }
        return monthKeys;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const startYear = start.getFullYear();
        const endYear = end.getFullYear();
        
        if (startYear !== endYear) {
            // 跨年显示简化处理，显示所有月份
            for (let i = 1; i <= 12; i++) {
                monthKeys.push(`${i}月`);
            }
        } else {
            // 同一年，根据月份范围生成
            const startMonth = start.getMonth() + 1;
            const endMonth = end.getMonth() + 1;
            
            if (startMonth === endMonth) {
                // 同一个月，只显示这个月
                monthKeys.push(`${startMonth}月`);
            } else {
                // 跨月，生成月份范围
                for (let m = startMonth; m <= endMonth; m++) {
                    monthKeys.push(`${m}月`);
                }
            }
        }
    } else {
        // 时间无效，默认显示所有月份
        for (let i = 1; i <= 12; i++) {
            monthKeys.push(`${i}月`);
        }
    }
    
    return monthKeys;
}

// 根据时间范围生成日期时间轴
function generateDayKeysByRange(startDate, endDate) {
    let dayKeys = [];
    
    // 如果没有传入时间范围，使用默认时间范围
    if (!startDate || !endDate) {
        // 默认显示1月的1-31日
        for (let i = 1; i <= 31; i++) {
            dayKeys.push(`1月${i}日`);
        }
        return dayKeys;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const startYear = start.getFullYear();
        const endYear = end.getFullYear();
        
        if (startYear !== endYear) {
            // 跨年显示简化处理，显示1-31日
            for (let i = 1; i <= 31; i++) {
                dayKeys.push(`1月${i}日`);
            }
        } else {
            // 同一年，根据日期范围生成
            const startMonth = start.getMonth() + 1;
            const endMonth = end.getMonth() + 1;
            const startDay = start.getDate();
            const endDay = end.getDate();
            
            if (startMonth === endMonth) {
                // 同一个月，生成该月的日期范围
                if (startDay === endDay) {
                    // 同一天，只显示这一天
                    dayKeys.push(`${startMonth}月${startDay}日`);
                } else {
                    // 同月不同天，生成日期范围
                    for (let d = startDay; d <= endDay; d++) {
                        dayKeys.push(`${startMonth}月${d}日`);
                    }
                }
            } else {
                // 跨月，简化处理，显示1-31日
                for (let i = 1; i <= 31; i++) {
                    dayKeys.push(`1月${i}日`);
                }
            }
        }
    } else {
        // 时间无效，默认显示1月的1-31日
        for (let i = 1; i <= 31; i++) {
            dayKeys.push(`1月${i}日`);
        }
    }
    
    return dayKeys;
}

// 获取数据的时间范围
function getDataTimeRange(data) {
    let minDate = null;
    let maxDate = null;
    
    data.forEach(item => {
        const dateStr = item.type === 'hazard' ? item.checkTime : item.time;
        if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                if (!minDate || date < minDate) {
                    minDate = date;
                }
                if (!maxDate || date > maxDate) {
                    maxDate = date;
                }
            }
        }
    });
    
    return {
        start: minDate ? minDate.toISOString().split('T')[0] : null,
        end: maxDate ? maxDate.toISOString().split('T')[0] : null
    };
}

// 根据时间粒度获取时间键
function getTimeKey(item, granularity) {
    const dateStr = item.type === 'hazard' ? item.checkTime : item.time;
    if (!dateStr) return null;
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const quarter = Math.ceil(month / 3);
    
    switch (granularity) {
        case 'year':
            return year.toString();
        case 'quarter':
            return `Q${quarter}`;
        case 'month':
            return `${month}月`;
        case 'day':
            return `${month}月${day}日`;
        default:
            return year.toString();
    }
}

// 动态更新柱状图标题
function updateBarChartTitle(timeGranularity) {
    const titleElement = document.querySelector('#accidentTotalChart').closest('.card').querySelector('.card-title');
    if (titleElement) {
        let title = '';
        switch (timeGranularity) {
            case 'year':
                title = '军队事故、案件、自杀问题数量年统计图';
                break;
            case 'quarter-month':
                title = '军队事故、案件、自杀问题数量季度/月统计图';
                break;
            case 'month':
                title = '军队事故、案件、自杀问题数量月统计图';
                break;
            case 'day':
                title = '军队事故、案件、自杀问题数量日统计图';
                break;
            default:
                title = '军队事故、案件、自杀问题数量统计图';
        }
        titleElement.textContent = title;
    }
}

// 生成季度/月双柱状图
function generateQuarterMonthBarChart(data, startDate = null, endDate = null) {
    const domElement = document.getElementById('accidentTotalChart');
    if (!domElement) return;
    
    // 生成季度统计数据
    const quarterStats = {};
    const monthStats = {};
    const typeStats = {};
    
    data.forEach(item => {
        const quarterKey = getTimeKey(item, 'quarter');
        const monthKey = getTimeKey(item, 'month');
        let type = item.type;
        
        // 事故类型需要根据accidentSubType细分
        if (item.type === 'accident') {
            if (item.accidentSubType === 'social') {
                type = '社会事故';
            } else if (item.accidentSubType === 'military') {
                type = '部队事故';
            } else {
                type = '其他事故';
            }
        }
        
        if (quarterKey) {
            if (!quarterStats[quarterKey]) quarterStats[quarterKey] = {};
            if (!quarterStats[quarterKey][type]) quarterStats[quarterKey][type] = 0;
            quarterStats[quarterKey][type]++;
        }
        
        if (monthKey) {
            if (!monthStats[monthKey]) monthStats[monthKey] = {};
            if (!monthStats[monthKey][type]) monthStats[monthKey][type] = 0;
            monthStats[monthKey][type]++;
        }
        
        if (!typeStats[type]) typeStats[type] = 0;
        typeStats[type]++;
    });
    
    // 根据时间范围生成时间轴
    const { quarterKeys, monthKeys } = generateTimeAxisByRange(startDate, endDate);
    const types = Object.keys(typeStats);
    
    // 构建季度系列数据
    const quarterSeries = types.map((type, index) => {
        const colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF'];
        return {
            name: getTypeDisplayName(type),
            type: 'bar',
            data: quarterKeys.map(quarterKey => quarterStats[quarterKey]?.[type] || 0),
            itemStyle: {
                color: colors[index % colors.length]
            },
            label: {
                show: true,
                position: 'top',
                fontSize: 10
            }
        };
    });
    
    // 构建月系列数据
    const monthSeries = types.map((type, index) => {
        const colors = ['#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF'];
        return {
            name: getTypeDisplayName(type),
            type: 'bar',
            data: monthKeys.map(monthKey => monthStats[monthKey]?.[type] || 0),
            itemStyle: {
                color: colors[index % colors.length]
            },
            label: {
                show: true,
                position: 'top',
                fontSize: 10
            }
        };
    });
    
    // 配置双图表选项
    const option = {
        tooltip: getBarTooltipConfig(),
        title: [
            {
                text: '季度统计',
                left: 'center',
                top: '12%',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#333'
                }
            },
            {
                text: '月度统计',
                left: 'center',
                top: '57%',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#333'
                }
            }
        ],
        legend: {
            data: quarterSeries.map(s => s.name),
            top: 15,
            itemGap: 15,
            textStyle: {
                fontSize: 12
            },
            pageButtonItemGap: 5,
            pageButtonGap: 5,
            pageButtonPosition: 'end',
            pageIconColor: '#666',
            pageIconInactiveColor: '#ccc',
            pageIconSize: 12,
            pageTextStyle: {
                color: '#666',
                fontSize: 12
            }
        },
        grid: [
            {
                left: '5%',
                right: '5%',
                top: '24%',
                height: '25%'
            },
            {
                left: '5%',
                right: '5%',
                top: '69%',
                height: '25%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: quarterKeys,
                axisLabel: {
                    fontSize: 11
                },
                axisTick: {
                    alignWithLabel: true
                },
                gridIndex: 0
            },
            {
                type: 'category',
                data: monthKeys,
                axisLabel: {
                    fontSize: 11
                },
                axisTick: {
                    alignWithLabel: true
                },
                gridIndex: 1
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    fontSize: 11
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                gridIndex: 0
            },
            {
                type: 'value',
                axisLabel: {
                    fontSize: 11
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                gridIndex: 1
            }
        ],
        series: [
            // 季度图表系列
            ...quarterSeries.map(series => ({
                ...series,
                xAxisIndex: 0,
                yAxisIndex: 0
            })),
            // 月图表系列
            ...monthSeries.map(series => ({
                ...series,
                xAxisIndex: 1,
                yAxisIndex: 1
            }))
        ]
    };
    
    analysisCharts.accidentTotal = echarts.init(domElement, 'shine');
    analysisCharts.accidentTotal.setOption(option);
    
    // 动态更新图表标题
    updateBarChartTitle('quarter-month');
}

// 动态更新折线图标题
function updateChartTitle(timeGranularity) {
    const titleElement = document.querySelector('#yearDistributionChart').closest('.card').querySelector('.card-title');
    if (titleElement) {
        let title = '';
        switch (timeGranularity) {
            case 'year':
                title = '军队事故、案件、自杀问题数量年分布图';
                break;
            case 'quarter-month':
                title = '军队事故、案件、自杀问题数量季度/月分布图';
                break;
            case 'month':
                title = '军队事故、案件、自杀问题数量月分布图';
                break;
            case 'day':
                title = '军队事故、案件、自杀问题数量日分布图';
                break;
            default:
                title = '军队事故、案件、自杀问题数量分布图';
        }
        titleElement.textContent = title;
    }
}

// 其他饼图生成函数
function generateSafetyTypePieChart(data) {
    const ctx = document.getElementById('safetyTypePieChart');
    if (!ctx) return;
    
    // 统计安全问题类型
    const safetyTypeStats = {};
    data.forEach(item => {
        if (item.type === 'hazard') {
            const categories = Array.isArray(item.problemCategory) ? item.problemCategory : [item.problemCategory];
            categories.forEach(category => {
                if (!safetyTypeStats[category]) safetyTypeStats[category] = 0;
                safetyTypeStats[category]++;
            });
        }
    });
    
    const pieData = Object.keys(safetyTypeStats).map(category => ({
        name: category,
        value: safetyTypeStats[category]
    }));
    
    if (pieData.length === 0) {
        pieData.push({ name: '无数据', value: 1 });
    }
    
    const option = {
        tooltip: getPieTooltipConfig(),
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            itemGap: 6,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                fontSize: 10
            },
            formatter: function(name) {
                const item = pieData.find(d => d.name === name);
                return item ? `${name} (${item.value}起)` : name;
            }
        },
        series: [{
            name: '安全问题类型',
            type: 'pie',
            radius: ['25%', '55%'],
            center: ['30%', '50%'],
            data: pieData,
            label: {
                show: true, // 显示饼图标签
                position: 'outside', // 统一使用外部标签
                formatter: function(params) {
                    return `${params.percent}%`;
                },
                fontSize: 10,
                color: '#333', // 统一使用黑色
                fontWeight: 'bold'
            },
            labelLine: {
                show: true, // 始终显示引导线
                length: 15,
                length2: 10,
                smooth: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    analysisCharts.safetyTypePie = echarts.init(ctx, 'shine');
    analysisCharts.safetyTypePie.setOption(option);
}

function generateHumanBehaviorPieChart(data) {
    const ctx = document.getElementById('humanBehaviorPieChart');
    if (!ctx) return;
    
    // 统计人的不安全行为类型（基于问题描述分析）
    const behaviorStats = {
        '违规操作': 0,
        '安全意识不足': 0,
        '疲劳作业': 0,
        '注意力不集中': 0,
        '其他': 0
    };
    
    data.forEach(item => {
        if (item.reasonAnalysis === '人') {
            const problem = item.problem || '';
            if (problem.includes('违规') || problem.includes('违章')) {
                behaviorStats['违规操作']++;
            } else if (problem.includes('安全') || problem.includes('意识')) {
                behaviorStats['安全意识不足']++;
            } else if (problem.includes('疲劳') || problem.includes('劳累')) {
                behaviorStats['疲劳作业']++;
            } else if (problem.includes('注意') || problem.includes('分心')) {
                behaviorStats['注意力不集中']++;
            } else {
                behaviorStats['其他']++;
            }
        }
    });
    
    const pieData = Object.keys(behaviorStats).map(behavior => ({
        name: behavior,
        value: behaviorStats[behavior]
    })).filter(item => item.value > 0);
    
    if (pieData.length === 0) {
        pieData.push({ name: '无数据', value: 1 });
    }
    
    const option = {
        tooltip: getPieTooltipConfig(),
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            itemGap: 6,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                fontSize: 10
            },
            formatter: function(name) {
                const item = pieData.find(d => d.name === name);
                return item ? `${name} (${item.value}起)` : name;
            }
        },
        series: [{
            name: '人的不安全行为类型',
            type: 'pie',
            radius: ['25%', '55%'],
            center: ['30%', '50%'],
            data: pieData,
            label: {
                show: true, // 显示饼图标签
                position: 'outside', // 统一使用外部标签
                formatter: function(params) {
                    return `${params.percent}%`;
                },
                fontSize: 10,
                color: '#333', // 统一使用黑色
                fontWeight: 'bold'
            },
            labelLine: {
                show: true, // 始终显示引导线
                length: 15,
                length2: 10,
                smooth: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    analysisCharts.humanBehaviorPie = echarts.init(ctx, 'shine');
    analysisCharts.humanBehaviorPie.setOption(option);
}

function generateUnsafeConditionPieChart(data) {
    const ctx = document.getElementById('unsafeConditionPieChart');
    if (!ctx) return;
    
    // 统计物的不安全状态类型
    const conditionStats = {
        '设备老化': 0,
        '防护不足': 0,
        '设计缺陷': 0,
        '维护不当': 0,
        '其他': 0
    };
    
    data.forEach(item => {
        if (item.reasonAnalysis === '物') {
            const problem = item.problem || '';
            if (problem.includes('老化') || problem.includes('损坏')) {
                conditionStats['设备老化']++;
            } else if (problem.includes('防护') || problem.includes('保护')) {
                conditionStats['防护不足']++;
            } else if (problem.includes('设计') || problem.includes('缺陷')) {
                conditionStats['设计缺陷']++;
            } else if (problem.includes('维护') || problem.includes('保养')) {
                conditionStats['维护不当']++;
            } else {
                conditionStats['其他']++;
            }
        }
    });
    
    const pieData = Object.keys(conditionStats).map(condition => ({
        name: condition,
        value: conditionStats[condition]
    })).filter(item => item.value > 0);
    
    if (pieData.length === 0) {
        pieData.push({ name: '无数据', value: 1 });
    }
    
    const option = {
        tooltip: getPieTooltipConfig(),
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            itemGap: 6,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                fontSize: 10
            },
            formatter: function(name) {
                const item = pieData.find(d => d.name === name);
                return item ? `${name} (${item.value}起)` : name;
            }
        },
        series: [{
            name: '物的不安全状态类型',
            type: 'pie',
            radius: ['25%', '55%'],
            center: ['30%', '50%'],
            data: pieData,
            label: {
                show: true, // 显示饼图标签
                position: 'outside', // 统一使用外部标签
                formatter: function(params) {
                    return `${params.percent}%`;
                },
                fontSize: 10,
                color: '#333', // 统一使用黑色
                fontWeight: 'bold'
            },
            labelLine: {
                show: true, // 始终显示引导线
                length: 15,
                length2: 10,
                smooth: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    analysisCharts.unsafeConditionPie = echarts.init(ctx, 'shine');
    analysisCharts.unsafeConditionPie.setOption(option);
}

function generateEnvironmentalImpactPieChart(data) {
    const ctx = document.getElementById('environmentalImpactPieChart');
    if (!ctx) return;
    
    // 统计环境的不良影响类型
    const impactStats = {
        '天气影响': 0,
        '场地条件': 0,
        '照明不足': 0,
        '噪音干扰': 0,
        '其他': 0
    };
    
    data.forEach(item => {
        if (item.reasonAnalysis === '环') {
            const problem = item.problem || '';
            if (problem.includes('天气') || problem.includes('雨') || problem.includes('风')) {
                impactStats['天气影响']++;
            } else if (problem.includes('场地') || problem.includes('地面')) {
                impactStats['场地条件']++;
            } else if (problem.includes('照明') || problem.includes('光线')) {
                impactStats['照明不足']++;
            } else if (problem.includes('噪音') || problem.includes('声音')) {
                impactStats['噪音干扰']++;
            } else {
                impactStats['其他']++;
            }
        }
    });
    
    const pieData = Object.keys(impactStats).map(impact => ({
        name: impact,
        value: impactStats[impact]
    })).filter(item => item.value > 0);
    
    if (pieData.length === 0) {
        pieData.push({ name: '无数据', value: 1 });
    }
    
    const option = {
        tooltip: getPieTooltipConfig(),
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            itemGap: 6,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                fontSize: 10
            },
            formatter: function(name) {
                const item = pieData.find(d => d.name === name);
                return item ? `${name} (${item.value}起)` : name;
            }
        },
        series: [{
            name: '环境的不良影响类型',
            type: 'pie',
            radius: ['25%', '55%'],
            center: ['30%', '50%'],
            data: pieData,
            label: {
                show: true, // 显示饼图标签
                position: 'outside', // 统一使用外部标签
                formatter: function(params) {
                    return `${params.percent}%`;
                },
                fontSize: 10,
                color: '#333', // 统一使用黑色
                fontWeight: 'bold'
            },
            labelLine: {
                show: true, // 始终显示引导线
                length: 15,
                length2: 10,
                smooth: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    analysisCharts.environmentalImpactPie = echarts.init(ctx, 'shine');
    analysisCharts.environmentalImpactPie.setOption(option);
}

function generateManagementIssuePieChart(data) {
    const ctx = document.getElementById('managementIssuePieChart');
    if (!ctx) return;
    
    // 统计管理上的不科学类型
    const managementStats = {
        '制度不完善': 0,
        '监督不到位': 0,
        '培训不足': 0,
        '资源配置不当': 0,
        '其他': 0
    };
    
    data.forEach(item => {
        if (item.reasonAnalysis === '管') {
            const problem = item.problem || '';
            if (problem.includes('制度') || problem.includes('规范')) {
                managementStats['制度不完善']++;
            } else if (problem.includes('监督') || problem.includes('检查')) {
                managementStats['监督不到位']++;
            } else if (problem.includes('培训') || problem.includes('教育')) {
                managementStats['培训不足']++;
            } else if (problem.includes('配置') || problem.includes('资源')) {
                managementStats['资源配置不当']++;
            } else {
                managementStats['其他']++;
            }
        }
    });
    
    const pieData = Object.keys(managementStats).map(management => ({
        name: management,
        value: managementStats[management]
    })).filter(item => item.value > 0);
    
    if (pieData.length === 0) {
        pieData.push({ name: '无数据', value: 1 });
    }
    
    const option = {
        tooltip: getPieTooltipConfig(),
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            itemGap: 6,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                fontSize: 10
            },
            formatter: function(name) {
                const item = pieData.find(d => d.name === name);
                return item ? `${name} (${item.value}起)` : name;
            }
        },
        series: [{
            name: '管理上的不科学类型',
            type: 'pie',
            radius: ['25%', '55%'],
            center: ['30%', '50%'],
            data: pieData,
            label: {
                show: true, // 显示饼图标签
                position: 'outside', // 统一使用外部标签
                formatter: function(params) {
                    return `${params.percent}%`;
                },
                fontSize: 10,
                color: '#333', // 统一使用黑色
                fontWeight: 'bold'
            },
            labelLine: {
                show: true, // 始终显示引导线
                length: 15,
                length2: 10,
                smooth: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    analysisCharts.managementIssuePie = echarts.init(ctx, 'shine');
    analysisCharts.managementIssuePie.setOption(option);
}

function generateTaskArrangementPieChart(data) {
    const ctx = document.getElementById('taskArrangementPieChart');
    if (!ctx) return;
    
    // 统计任务安排不合理类型
    const taskStats = {
        '时间安排不当': 0,
        '人员配置不合理': 0,
        '任务分配不均': 0,
        '协调配合不足': 0,
        '其他': 0
    };
    
    data.forEach(item => {
        if (item.reasonAnalysis === '任') {
            const problem = item.problem || '';
            if (problem.includes('时间') || problem.includes('安排')) {
                taskStats['时间安排不当']++;
            } else if (problem.includes('人员') || problem.includes('配置')) {
                taskStats['人员配置不合理']++;
            } else if (problem.includes('分配') || problem.includes('不均')) {
                taskStats['任务分配不均']++;
            } else if (problem.includes('协调') || problem.includes('配合')) {
                taskStats['协调配合不足']++;
            } else {
                taskStats['其他']++;
            }
        }
    });
    
    const pieData = Object.keys(taskStats).map(task => ({
        name: task,
        value: taskStats[task]
    })).filter(item => item.value > 0);
    
    if (pieData.length === 0) {
        pieData.push({ name: '无数据', value: 1 });
    }
    
    const option = {
        tooltip: getPieTooltipConfig(),
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            itemGap: 6,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                fontSize: 10
            },
            formatter: function(name) {
                const item = pieData.find(d => d.name === name);
                return item ? `${name} (${item.value}起)` : name;
            }
        },
        series: [{
            name: '任务安排不合理类型',
            type: 'pie',
            radius: ['25%', '55%'],
            center: ['30%', '50%'],
            data: pieData,
            label: {
                show: true, // 显示饼图标签
                position: 'outside', // 统一使用外部标签
                formatter: function(params) {
                    return `${params.percent}%`;
                },
                fontSize: 10,
                color: '#333', // 统一使用黑色
                fontWeight: 'bold'
            },
            labelLine: {
                show: true, // 始终显示引导线
                length: 15,
                length2: 10,
                smooth: true
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    analysisCharts.taskArrangementPie = echarts.init(ctx, 'shine');
    analysisCharts.taskArrangementPie.setOption(option);
}
