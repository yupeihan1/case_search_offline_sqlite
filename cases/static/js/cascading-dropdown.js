/**
 * 联动下拉列表组件系统
 * 专门用于创建和管理级联选择的下拉组件
 * 支持军种 > 战区 > 基地 > 机关 > 基层的联动选择
 */

// 联动下拉组件管理器
class CascadingDropdownManager {
    constructor() {
        this.components = new Map(); // 存储所有联动组件实例
        this.sharedData = new Map(); // 存储组件间共享的数据
        this.customData = new Map(); // 存储用户自定义数据
        this.storageKey = 'cascading_dropdown_custom_data';
        this.init();
    }

    init() {
        this.loadCustomData(); // 加载保存的自定义数据
        this.bindGlobalEvents(); // 绑定全局事件
    }

    // 加载保存的自定义数据
    loadCustomData() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                this.customData = new Map(Object.entries(JSON.parse(savedData)));
            }
        } catch (error) {
            console.warn('加载自定义数据失败:', error);
        }
    }

    // 保存自定义数据到本地存储
    saveCustomData() {
        try {
            const dataToSave = Object.fromEntries(this.customData);
            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
        } catch (error) {
            console.warn('保存自定义数据失败:', error);
        }
    }

    // 绑定全局事件监听器
    bindGlobalEvents() {
        // 点击组件外部时自动关闭所有打开的下拉框
        document.addEventListener('click', (e) => {
            const dropdowns = document.querySelectorAll('.cascading-dropdown');
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(e.target)) {
                    const menu = dropdown.querySelector('.cascading-dropdown-menu');
                    const toggle = dropdown.querySelector('.cascading-dropdown-toggle');
                    if (menu) menu.classList.remove('show');
                    if (toggle) toggle.classList.remove('active');
                }
            });
        });
    }

    // 创建联动下拉组件
    createCascadingComponent(config) {
        const {
            id,
            container,
            data = {},
            showPath = true,
            showSearch = true,
            maxHeight = 300,
            customPlaceholder = "输入自定义名称",
            customMaxLength = 50,
            enablePersistence = true,
            storageKey = null,
            onSelectionChange = null,
            onCustomAdd = null,
            onLevelChange = null
        } = config;

        // 验证必要参数
        if (!id || !container || !data) {
            console.error('创建联动组件失败：缺少必要参数');
            return null;
        }

        // 生成联动组件的HTML结构
        const html = this.generateCascadingComponentHTML(id, data, showPath, showSearch);
        
        // 创建组件实例对象
        const component = {
            id,
            type: 'cascading',
            data: { ...data },
            showPath,
            showSearch,
            maxHeight,
            customPlaceholder,
            customMaxLength,
            enablePersistence,
            storageKey: storageKey || `${id}_custom_data`,
            onSelectionChange,
            onCustomAdd,
            onLevelChange,
            element: null,
            currentSelections: {}, // 当前各层级的选择
            selectionPath: [], // 选择路径
            isInitialized: false
        };

        // 存储组件实例到管理器
        this.components.set(id, component);

        // 将生成的HTML插入到指定容器
        if (container) {
            container.innerHTML = html;
            component.element = container;
        }

        // 初始化组件事件监听
        this.initCascadingComponentEvents(id);

        // 标记为已初始化
        component.isInitialized = true;

        return component;
    }

    // 生成联动组件的HTML结构
    generateCascadingComponentHTML(id, data, showPath, showSearch) {
        const levels = Object.keys(data);
        
        // 生成选择路径显示区域
        const pathHtml = showPath ? `
            <div class="cascading-selection-path" id="${id}_path">
                <span class="path-placeholder">请选择军种</span>
            </div>
        ` : '';

        // 生成各层级下拉组件
        const dropdownsHtml = levels.map(level => {
            const levelData = data[level];
            const allowCustom = levelData.allowCustom !== false;
            const isDisabled = level !== levels[0]; // 除第一级外都初始禁用
            
            return `
                <div class="cascading-dropdown-item" data-level="${level}">
                    <label class="cascading-label">${levelData.label}</label>
                    <div class="cascading-dropdown" id="${id}_${level}_dropdown">
                        <button type="button" class="cascading-dropdown-toggle ${isDisabled ? 'disabled' : ''}" 
                                id="${id}_${level}_toggle" 
                                onclick="cascadingDropdownManager.toggleCascadingDropdown('${id}', '${level}')"
                                ${isDisabled ? 'disabled' : ''}>
                            ${levelData.placeholder || `请选择${levelData.label}`}
                        </button>
                        <div class="cascading-dropdown-menu" id="${id}_${level}_menu">
                            ${showSearch ? `
                                <div class="p-2 border-bottom">
                                    <div class="input-group input-group-sm">
                                        <span class="input-group-text">
                                            <i class="bi bi-search"></i>
                                        </span>
                                        <input type="text" class="form-control form-control-sm cascading-search-input" 
                                               id="${id}_${level}_searchInput" placeholder="搜索..." 
                                               onkeyup="cascadingDropdownManager.filterCascadingOptions('${id}', '${level}', this.value)">
                                    </div>
                                </div>
                            ` : ''}
                            <div class="cascading-options-container" id="${id}_${level}_optionsContainer">
                                <!-- 选项将通过JavaScript动态生成 -->
                            </div>
                            ${allowCustom ? `
                                <div class="cascading-dropdown-divider"></div>
                                <div class="p-2">
                                    <div class="input-group input-group-sm">
                                        <input type="text" class="form-control form-control-sm custom-cascading-input" 
                                               id="${id}_${level}_customInput" placeholder="${levelData.customPlaceholder || '输入自定义名称'}"
                                               maxlength="${levelData.customMaxLength || 50}">
                                        <button class="btn btn-outline-primary btn-sm" type="button" 
                                                onclick="cascadingDropdownManager.addCustomCascadingOption('${id}', '${level}')">
                                            <i class="bi bi-plus"></i> 添加
                                        </button>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // 生成当前选择结果显示区域
        const selectionHtml = `
            <div class="cascading-current-selection" id="${id}_currentSelection">
                <strong>当前选择：</strong>
                <span id="${id}_currentSelectionText">请选择军种</span>
            </div>
        `;

        // 返回完整的联动组件HTML结构
        return `
            <div class="cascading-dropdown-container" id="${id}_container">
                ${pathHtml}
                <div class="cascading-dropdowns" id="${id}_dropdowns">
                    ${dropdownsHtml}
                </div>
                ${selectionHtml}
            </div>
        `;
    }

    // 初始化联动组件的事件监听
    initCascadingComponentEvents(id) {
        const component = this.components.get(id);
        if (!component) return;

        // 延迟绑定事件，确保DOM已经完全渲染
        setTimeout(() => {
            // 初始化第一级选项
            this.initializeLevelOptions(id, Object.keys(component.data)[0]);
            
            // 为自定义输入框添加回车键事件支持
            Object.keys(component.data).forEach(level => {
                const customInput = document.getElementById(`${id}_${level}_customInput`);
                if (customInput) {
                    customInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            this.addCustomCascadingOption(id, level);
                        }
                    });
                }
            });
        }, 100);
    }

    // 初始化指定层级的选项
    initializeLevelOptions(id, level) {
        const component = this.components.get(id);
        if (!component) return;

        const levelData = component.data[level];
        const optionsContainer = document.getElementById(`${id}_${level}_optionsContainer`);
        if (!optionsContainer) return;

        let options = [];

        if (level === Object.keys(component.data)[0]) {
            // 第一级：直接使用预定义选项
            options = levelData.options || [];
        } else {
            // 其他级别：根据上级选择获取选项
            const parentLevel = this.getParentLevel(id, level);
            const parentSelection = component.currentSelections[parentLevel];
            
            if (parentSelection) {
                options = this.getLevelOptions(id, level, parentSelection);
            }
        }

        // 添加自定义选项
        const customOptions = this.getCustomOptions(id, level);
        options = [...options, ...customOptions];

        // 生成选项HTML
        this.renderLevelOptions(id, level, options);
    }

    // 获取父级层级
    getParentLevel(id, level) {
        const component = this.components.get(id);
        if (!component) return null;

        const levels = Object.keys(component.data);
        const currentIndex = levels.indexOf(level);
        return currentIndex > 0 ? levels[currentIndex - 1] : null;
    }

    // 获取指定层级的选项
    getLevelOptions(id, level, parentSelection) {
        const component = this.components.get(id);
        if (!component) return [];

        const levelData = component.data[level];
        if (!levelData.options || !levelData.options[parentSelection]) {
            return [];
        }

        return levelData.options[parentSelection];
    }

    // 获取自定义选项
    getCustomOptions(id, level) {
        const customKey = `${id}_${level}`;
        const customOptions = this.customData.get(customKey) || [];
        
        return customOptions.map(option => ({
            value: `custom_${option}`,
            text: option,
            isCustom: true
        }));
    }

    // 渲染层级选项
    renderLevelOptions(id, level, options) {
        const optionsContainer = document.getElementById(`${id}_${level}_optionsContainer`);
        if (!optionsContainer) return;

        if (options.length === 0) {
            optionsContainer.innerHTML = '<div class="no-options-message p-2 text-muted text-center"><small>暂无选项</small></div>';
            return;
        }

        const optionsHtml = options.map(option => {
            const isCustom = option.isCustom ? ' custom-option' : '';
            return `
                <button type="button" class="cascading-dropdown-item${isCustom}" 
                        data-value="${option.value}" data-text="${option.text}">
                    ${option.text}
                    ${option.isCustom ? '<i class="bi bi-pencil-square ms-1 text-muted"></i>' : ''}
                </button>
            `;
        }).join('');

        optionsContainer.innerHTML = optionsHtml;

        // 绑定选项点击事件
        this.bindLevelOptionEvents(id, level);
    }

    // 绑定层级选项事件
    bindLevelOptionEvents(id, level) {
        const optionsContainer = document.getElementById(`${id}_${level}_optionsContainer`);
        if (!optionsContainer) return;

        optionsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('cascading-dropdown-item')) {
                const value = e.target.getAttribute('data-value');
                const text = e.target.getAttribute('data-text');
                this.selectCascadingOption(id, level, value, text);
            }
        });
    }

    // 切换联动下拉框的显示/隐藏状态
    toggleCascadingDropdown(id, level) {
        const dropdown = document.getElementById(`${id}_${level}_dropdown`);
        if (!dropdown) return;

        const menu = dropdown.querySelector('.cascading-dropdown-menu');
        const toggle = dropdown.querySelector('.cascading-dropdown-toggle');
        
        // 切换下拉菜单的显示状态
        if (menu.classList.contains('show')) {
            menu.classList.remove('show');
            toggle.classList.remove('active');
        } else {
            // 关闭其他打开的下拉框
            this.closeAllCascadingDropdowns(id);
            
            menu.classList.add('show');
            toggle.classList.add('active');
            
            // 清空搜索框并重置过滤
            this.clearCascadingSearch(id, level);
        }
    }

    // 关闭所有联动下拉框
    closeAllCascadingDropdowns(id) {
        const dropdowns = document.querySelectorAll(`#${id}_container .cascading-dropdown`);
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.cascading-dropdown-menu');
            const toggle = dropdown.querySelector('.cascading-dropdown-toggle');
            if (menu) menu.classList.remove('show');
            if (toggle) toggle.classList.remove('active');
        });
    }

    // 选择联动选项
    selectCascadingOption(id, level, value, text) {
        const component = this.components.get(id);
        if (!component) return;

        // 更新当前选择
        component.currentSelections[level] = value;
        
        // 更新选择路径
        this.updateSelectionPath(id);
        
        // 更新UI显示
        this.updateCascadingUI(id, level, text);
        
        // 级联更新下级选项
        this.cascadeUpdateChildLevels(id, level);
        
        // 触发回调函数
        this.triggerCallbacks(id, level, value, text);
        
        // 关闭下拉框
        this.closeAllCascadingDropdowns(id);
    }

    // 更新选择路径
    updateSelectionPath(id) {
        const component = this.components.get(id);
        if (!component) return;

        const levels = Object.keys(component.data);
        const pathElements = [];
        
        levels.forEach(level => {
            const selection = component.currentSelections[level];
            if (selection) {
                const levelData = component.data[level];
                let text = '';
                
                // 查找对应的显示文本
                if (selection.startsWith('custom_')) {
                    text = selection.replace('custom_', '');
                } else {
                    if (level === levels[0]) {
                        // 第一级：从预定义选项中查找
                        const option = levelData.options.find(opt => opt.value === selection);
                        text = option ? option.text : selection;
                    } else {
                        // 其他级别：从依赖选项中查找
                        const parentLevel = this.getParentLevel(id, level);
                        const parentSelection = component.currentSelections[parentLevel];
                        if (parentSelection && levelData.options[parentSelection]) {
                            const option = levelData.options[parentSelection].find(opt => opt.value === selection);
                            text = option ? option.text : selection;
                        }
                    }
                }
                
                pathElements.push(text);
            }
        });

        component.selectionPath = pathElements;
        this.updatePathDisplay(id);
        this.updateCurrentSelectionDisplay(id);
    }

    // 更新路径显示
    updatePathDisplay(id) {
        const pathElement = document.getElementById(`${id}_path`);
        if (!pathElement) return;

        const component = this.components.get(id);
        if (!component) return;

        if (component.selectionPath.length > 0) {
            const pathHtml = component.selectionPath.map((text, index) => 
                `<span class="path-item">${text}</span>${index < component.selectionPath.length - 1 ? '<i class="bi bi-chevron-right"></i>' : ''}`
            ).join('');
            pathElement.innerHTML = pathHtml;
        } else {
            pathElement.innerHTML = '<span class="path-placeholder">请选择军种</span>';
        }
    }

    // 更新当前选择显示
    updateCurrentSelectionDisplay(id) {
        const textElement = document.getElementById(`${id}_currentSelectionText`);
        if (!textElement) return;

        const component = this.components.get(id);
        if (!component) return;

        if (component.selectionPath.length > 0) {
            textElement.textContent = component.selectionPath.join(' > ');
        } else {
            textElement.textContent = '请选择军种';
        }
    }

    // 更新联动UI显示
    updateCascadingUI(id, level, text) {
        const toggle = document.getElementById(`${id}_${level}_toggle`);
        if (toggle) {
            toggle.textContent = text;
            toggle.classList.remove('disabled');
            toggle.disabled = false;
        }
    }

    // 级联更新子级选项
    cascadeUpdateChildLevels(id, level) {
        const component = this.components.get(id);
        if (!component) return;

        const levels = Object.keys(component.data);
        const currentIndex = levels.indexOf(level);
        
        // 清空当前级别之后的所有选择
        for (let i = currentIndex + 1; i < levels.length; i++) {
            const childLevel = levels[i];
            delete component.currentSelections[childLevel];
            
            // 重置子级UI
            this.resetChildLevelUI(id, childLevel);
        }

        // 更新下一级选项
        if (currentIndex + 1 < levels.length) {
            const nextLevel = levels[currentIndex + 1];
            this.updateChildLevelOptions(id, nextLevel);
        }
    }

    // 重置子级UI
    resetChildLevelUI(id, level) {
        const toggle = document.getElementById(`${id}_${level}_toggle`);
        if (toggle) {
            const levelData = this.components.get(id).data[level];
            toggle.textContent = levelData.placeholder || `请选择${levelData.label}`;
            toggle.classList.add('disabled');
            toggle.disabled = true;
        }
    }

    // 更新子级选项
    updateChildLevelOptions(id, level) {
        const component = this.components.get(id);
        if (!component) return;

        const parentLevel = this.getParentLevel(id, level);
        const parentSelection = component.currentSelections[parentLevel];
        
        if (parentSelection) {
            // 启用子级下拉框
            const toggle = document.getElementById(`${id}_${level}_toggle`);
            if (toggle) {
                toggle.classList.remove('disabled');
                toggle.disabled = false;
            }

            // 获取并渲染选项
            const options = this.getLevelOptions(id, level, parentSelection);
            const customOptions = this.getCustomOptions(id, level);
            const allOptions = [...options, ...customOptions];
            
            this.renderLevelOptions(id, level, allOptions);
        }
    }

    // 触发回调函数
    triggerCallbacks(id, level, value, text) {
        const component = this.components.get(id);
        if (!component) return;

        // 触发选择变化回调
        if (component.onSelectionChange) {
            component.onSelectionChange({
                level,
                value,
                text,
                path: component.selectionPath,
                selections: { ...component.currentSelections }
            });
        }

        // 触发层级变化回调
        if (component.onLevelChange) {
            component.onLevelChange({
                level,
                value,
                text,
                path: component.selectionPath
            });
        }
    }

    // 过滤联动选项
    filterCascadingOptions(id, level, searchText) {
        const optionsContainer = document.getElementById(`${id}_${level}_optionsContainer`);
        if (!optionsContainer) return;

        const searchLower = searchText.toLowerCase().trim();
        const optionItems = optionsContainer.querySelectorAll('.cascading-dropdown-item');

        optionItems.forEach(item => {
            const optionText = item.getAttribute('data-text').toLowerCase();
            if (searchLower === '' || optionText.includes(searchLower)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        // 显示无结果提示
        const visibleItems = optionsContainer.querySelectorAll('.cascading-dropdown-item[style*="display: block"]');
        const noResultsElement = optionsContainer.querySelector('.no-results-message');
        
        if (visibleItems.length === 0 && searchLower !== '') {
            if (!noResultsElement) {
                const noResults = document.createElement('div');
                noResults.className = 'no-results-message p-2 text-muted text-center';
                noResults.innerHTML = '<small>没有找到匹配的选项</small>';
                optionsContainer.appendChild(noResults);
            }
        } else if (noResultsElement) {
            noResultsElement.remove();
        }
    }

    // 清空搜索框
    clearCascadingSearch(id, level) {
        const searchInput = document.getElementById(`${id}_${level}_searchInput`);
        if (searchInput) {
            searchInput.value = '';
            this.filterCascadingOptions(id, level, '');
        }
    }

    // 添加自定义联动选项
    addCustomCascadingOption(id, level) {
        const component = this.components.get(id);
        if (!component) return;

        const customInput = document.getElementById(`${id}_${level}_customInput`);
        if (!customInput) return;

        const customText = customInput.value.trim();
        
        // 验证自定义输入
        if (!customText) {
            this.showCascadingMessage('请输入自定义名称', 'warning');
            return;
        }
        
        if (customText.length > component.customMaxLength) {
            this.showCascadingMessage(`自定义名称不能超过${component.customMaxLength}个字符`, 'warning');
            return;
        }

        // 检查是否已存在
        const customKey = `${id}_${level}`;
        const existingCustoms = this.customData.get(customKey) || [];
        if (existingCustoms.includes(customText)) {
            this.showCascadingMessage('该自定义选项已存在', 'warning');
            return;
        }

        // 添加到自定义数据
        existingCustoms.push(customText);
        this.customData.set(customKey, existingCustoms);
        
        // 保存到本地存储
        if (component.enablePersistence) {
            this.saveCustomData();
        }

        // 重新渲染选项
        this.initializeLevelOptions(id, level);
        
        // 自动选中新添加的选项
        this.selectCascadingOption(id, level, `custom_${customText}`, customText);
        
        // 清空输入框
        customInput.value = '';
        
        // 触发自定义添加回调
        if (component.onCustomAdd) {
            component.onCustomAdd(level, customText);
        }

        // 显示成功提示
        this.showCascadingMessage(`自定义选项"${customText}"已添加`, 'success');
    }

    // 显示联动组件消息
    showCascadingMessage(message, type = 'success') {
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

    // 获取指定组件的当前选择
    getCascadingSelections(id) {
        const component = this.components.get(id);
        return component ? { ...component.currentSelections } : {};
    }

    // 设置指定组件的选择
    setCascadingSelections(id, selections) {
        const component = this.components.get(id);
        if (!component) return;

        // 清空当前选择
        component.currentSelections = {};
        
        // 按层级顺序设置选择
        const levels = Object.keys(component.data);
        levels.forEach(level => {
            if (selections[level]) {
                this.selectCascadingOption(id, level, selections[level], selections[level]);
            }
        });
    }

    // 清空指定组件的所有选择
    clearCascadingSelections(id) {
        const component = this.components.get(id);
        if (!component) return;

        component.currentSelections = {};
        component.selectionPath = [];
        
        // 重置所有UI
        const levels = Object.keys(component.data);
        levels.forEach(level => {
            this.resetChildLevelUI(id, level);
        });
        
        // 更新显示
        this.updatePathDisplay(id);
        this.updateCurrentSelectionDisplay(id);
    }

    // 销毁指定组件
    destroyCascadingComponent(id) {
        const component = this.components.get(id);
        if (!component) return;

        // 移除DOM元素
        if (component.element) {
            component.element.innerHTML = '';
        }

        // 从管理器中移除
        this.components.delete(id);
    }
}

// 创建全局联动下拉组件管理器实例
const cascadingDropdownManager = new CascadingDropdownManager();
