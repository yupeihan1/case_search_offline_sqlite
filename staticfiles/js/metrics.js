/**
 * 执行率计算模块
 * 提供计划执行率的计算功能，支持离线使用
 * 
 * @author 安管之窗系统
 * @version 1.0.0
 */

// 执行率计算器类
class ExecutionRateCalculator {
    /**
     * 构造函数
     * @param {Object} options 配置选项
     * @param {number} options.decimalPlaces 小数位数，默认0（不保留小数点）
     * @param {boolean} options.showZeroWhenNoPlan 当计划为空时是否显示0%，默认true
     * @param {string} options.zeroDisplayText 当计划为空时的显示文本，默认'0%'
     */
    constructor(options = {}) {
        this.decimalPlaces = options.decimalPlaces || 0;
        this.showZeroWhenNoPlan = options.showZeroWhenNoPlan !== false; // 默认true
        this.zeroDisplayText = options.zeroDisplayText || '0%';
    }

    /**
     * 计算执行率
     * 执行率公式：|A ∩ P| / |P| × 100%
     * 
     * @param {Array} plannedUnits 计划受检单位集合
     * @param {Array} actualUnits 实际受检单位集合
     * @returns {Object} 计算结果对象
     * @returns {number} returns.rate 执行率数值（0-100）
     * @returns {string} returns.displayText 格式化后的显示文本
     * @returns {Object} returns.details 详细计算信息
     */
    calculate(plannedUnits, actualUnits) {
        // 参数验证和边界处理
        if (!Array.isArray(plannedUnits) || !Array.isArray(actualUnits)) {
            return this._handleError('输入参数必须是数组类型');
        }

        // 去重处理
        const uniquePlannedUnits = this._removeDuplicates(plannedUnits);
        const uniqueActualUnits = this._removeDuplicates(actualUnits);

        // 计算计划单位数量
        const plannedCount = uniquePlannedUnits.length;

        // 边界处理：如果计划为空
        if (plannedCount === 0) {
            return this._handleEmptyPlan();
        }

        // 计算交集
        const intersection = this._calculateIntersection(uniquePlannedUnits, uniqueActualUnits);
        const intersectionCount = intersection.length;

        // 计算执行率
        const rate = (intersectionCount / plannedCount) * 100;

        // 封顶100%
        const cappedRate = Math.min(rate, 100);

        // 四舍五入到指定小数位
        const roundedRate = this._roundToDecimalPlaces(cappedRate, this.decimalPlaces);

        // 生成显示文本
        const displayText = this._formatDisplayText(roundedRate);

        // 返回详细结果
        return {
            rate: roundedRate,
            displayText: displayText,
            details: {
                plannedUnits: uniquePlannedUnits,
                actualUnits: uniqueActualUnits,
                intersection: intersection,
                plannedCount: plannedCount,
                actualCount: uniqueActualUnits.length,
                intersectionCount: intersectionCount,
                rawRate: rate,
                cappedRate: cappedRate
            }
        };
    }

    /**
     * 批量计算多个计划的执行率
     * 
     * @param {Array} plans 计划数组，每个计划应包含units和actualUnits字段
     * @param {string} plannedUnitsField 计划单位字段名，默认'units'
     * @param {string} actualUnitsField 实际单位字段名，默认'actualUnits'
     * @returns {Array} 计算结果数组
     */
    calculateBatch(plans, plannedUnitsField = 'units', actualUnitsField = 'actualUnits') {
        if (!Array.isArray(plans)) {
            return [];
        }

        return plans.map(plan => {
            const plannedUnits = plan[plannedUnitsField] || [];
            const actualUnits = plan[actualUnitsField] || [];
            
            const result = this.calculate(plannedUnits, actualUnits);
            
            return {
                planId: plan.id,
                plan: plan,
                ...result
            };
        });
    }

    /**
     * 计算总体执行率（使用加权平均）
     * 加权平均公式：总体执行率 = Σ|A_i∩P_i| / Σ|P_i| × 100%
     * 
     * @param {Array} plans 计划数组
     * @param {string} plannedUnitsField 计划单位字段名，默认'units'
     * @param {string} actualUnitsField 实际单位字段名，默认'actualUnits'
     * @returns {Object} 总体执行率结果
     */
    calculateOverallRate(plans, plannedUnitsField = 'units', actualUnitsField = 'actualUnits') {
        if (!Array.isArray(plans) || plans.length === 0) {
            return this._handleError('计划数组不能为空');
        }

        // 计算加权平均
        let totalIntersectionCount = 0;  // 总交集数量：Σ|A_i∩P_i|
        let totalPlannedCount = 0;       // 总计划数量：Σ|P_i|

        plans.forEach(plan => {
            const plannedUnits = plan[plannedUnitsField] || [];
            const actualUnits = plan[actualUnitsField] || [];
            
            // 去重处理
            const uniquePlannedUnits = this._removeDuplicates(plannedUnits);
            const uniqueActualUnits = this._removeDuplicates(actualUnits);
            
            // 计算交集
            const intersection = this._calculateIntersection(uniquePlannedUnits, uniqueActualUnits);
            
            // 累加数据
            totalIntersectionCount += intersection.length;
            totalPlannedCount += uniquePlannedUnits.length;
        });

        // 边界处理：如果总计划数量为0
        if (totalPlannedCount === 0) {
            return this._handleEmptyPlan();
        }

        // 计算加权平均执行率
        const rate = (totalIntersectionCount / totalPlannedCount) * 100;

        // 封顶100%
        const cappedRate = Math.min(rate, 100);

        // 四舍五入到指定小数位
        const roundedRate = this._roundToDecimalPlaces(cappedRate, this.decimalPlaces);

        // 生成显示文本
        const displayText = this._formatDisplayText(roundedRate);

        // 返回详细结果
        return {
            rate: roundedRate,
            displayText: displayText,
            details: {
                totalIntersectionCount: totalIntersectionCount,
                totalPlannedCount: totalPlannedCount,
                totalActualCount: 0, // 加权平均中不直接使用总实际数量
                rawRate: rate,
                cappedRate: cappedRate,
                isWeightedAverage: true,
                planCount: plans.length,
                calculationMethod: 'weighted_average'
            }
        };
    }

    /**
     * 数组去重
     * 
     * @param {Array} array 输入数组
     * @returns {Array} 去重后的数组
     * @private
     */
    _removeDuplicates(array) {
        if (!Array.isArray(array)) {
            return [];
        }
        
        // 使用Set进行去重，保持原有顺序
        const seen = new Set();
        return array.filter(item => {
            const normalizedItem = String(item).trim();
            if (seen.has(normalizedItem)) {
                return false;
            }
            seen.add(normalizedItem);
            return true;
        });
    }

    /**
     * 计算两个数组的交集
     * 
     * @param {Array} array1 第一个数组
     * @param {Array} array2 第二个数组
     * @returns {Array} 交集数组
     * @private
     */
    _calculateIntersection(array1, array2) {
        if (!Array.isArray(array1) || !Array.isArray(array2)) {
            return [];
        }

        const set1 = new Set(array1.map(item => String(item).trim()));
        return array2.filter(item => set1.has(String(item).trim()));
    }

    /**
     * 四舍五入到指定小数位
     * 
     * @param {number} value 数值
     * @param {number} decimalPlaces 小数位数
     * @returns {number} 四舍五入后的数值
     * @private
     */
    _roundToDecimalPlaces(value, decimalPlaces) {
        if (typeof value !== 'number' || isNaN(value)) {
            return 0;
        }

        const multiplier = Math.pow(10, decimalPlaces);
        return Math.round(value * multiplier) / multiplier;
    }

    /**
     * 格式化显示文本
     * 
     * @param {number} rate 执行率数值
     * @returns {string} 格式化后的显示文本
     * @private
     */
    _formatDisplayText(rate) {
        if (this.decimalPlaces === 0) {
            return `${Math.round(rate)}%`;
        } else {
            return `${rate.toFixed(this.decimalPlaces)}%`;
        }
    }

    /**
     * 处理计划为空的情况
     * 
     * @returns {Object} 错误结果对象
     * @private
     */
    _handleEmptyPlan() {
        return {
            rate: 0,
            displayText: this.showZeroWhenNoPlan ? this.zeroDisplayText : '--',
            details: {
                plannedUnits: [],
                actualUnits: [],
                intersection: [],
                plannedCount: 0,
                actualCount: 0,
                intersectionCount: 0,
                rawRate: 0,
                cappedRate: 0,
                isEmptyPlan: true
            }
        };
    }

    /**
     * 处理错误情况
     * 
     * @param {string} errorMessage 错误信息
     * @returns {Object} 错误结果对象
     * @private
     */
    _handleError(errorMessage) {
        console.error('执行率计算错误:', errorMessage);
        return {
            rate: 0,
            displayText: '计算错误',
            details: {
                error: errorMessage,
                plannedUnits: [],
                actualUnits: [],
                intersection: [],
                plannedCount: 0,
                actualCount: 0,
                intersectionCount: 0,
                rawRate: 0,
                cappedRate: 0
            }
        };
    }

    /**
     * 更新配置选项
     * 
     * @param {Object} options 新的配置选项
     */
    updateOptions(options) {
        if (options.decimalPlaces !== undefined) {
            this.decimalPlaces = options.decimalPlaces;
        }
        if (options.showZeroWhenNoPlan !== undefined) {
            this.showZeroWhenNoPlan = options.showZeroWhenNoPlan;
        }
        if (options.zeroDisplayText !== undefined) {
            this.zeroDisplayText = options.zeroDisplayText;
        }
    }
}

// 创建全局实例
const executionRateCalculator = new ExecutionRateCalculator();

// 导出到全局作用域（兼容非模块环境）
if (typeof window !== 'undefined') {
    window.executionRateCalculator = executionRateCalculator;
    window.ExecutionRateCalculator = ExecutionRateCalculator;
}

// 兼容CommonJS环境
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ExecutionRateCalculator,
        executionRateCalculator
    };
}
