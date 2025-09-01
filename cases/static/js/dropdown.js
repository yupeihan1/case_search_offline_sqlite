/**
 * 标签下拉组件系统
 * 专门用于创建和管理多选标签下拉组件
 */

// 标签下拉组件管理器
class TagsDropdownManager {
    constructor() {
        this.components = new Map(); // 存储所有标签组件实例
        this.sharedData = new Map();  // 存储组件间共享的数据
        this.init();
    }

    init() {
        this.bindGlobalEvents(); // 绑定全局事件（如点击外部关闭下拉框）
    }

    // 注册共享数据（用于组件间数据同步）
    registerSharedData(key, data) {
        this.sharedData.set(key, data);
    }

    // 获取共享数据
    getSharedData(key) {
        return this.sharedData.get(key);
    }

    // 更新共享数据（触发组件间同步）
    updateSharedData(key, data) {
        this.sharedData.set(key, data);
        this.notifyDataChange(key, data);
    }

    // 通知数据变化（发送自定义事件）
    notifyDataChange(key, data) {
        const event = new CustomEvent('sharedDataChanged', {
            detail: { key, data }
        });
        document.dispatchEvent(event);
    }

    // 创建标签下拉组件
    createTagsComponent(config) {
        const {
            id,
            container,
            options = [],
            selectedTags = [],
            placeholder = '请选择标签',
            allowCustom = true,
            maxCustomLength = 20,
            helpText = null,
            onTagsChange = null,
            onCustomTagAdd = null,
            // 新增自定义文字配置
            selectedText = '已选择 {count} 个标签',  // 已选择时的显示文字，{count}会被替换为实际数量
            previewLabel = '已选标签:',              // 预览区域的标签文字
            customInputPlaceholder = '输入自定义标签', // 自定义输入框的占位符
            addButtonText = '添加',                   // 添加按钮的文字
            unitText = '个'                          // 数量单位文字
        } = config;

        // 生成标签下拉组件的HTML结构
        const html = this.generateTagsComponentHTML(id, options, placeholder, allowCustom, helpText, customInputPlaceholder, addButtonText);
        
        // 创建标签组件实例对象
        const component = {
            id,                              // 组件唯一标识
            type: 'tags',                    // 组件类型（标签下拉）
            options: [...options],           // 可选标签列表
            selectedTags: [...selectedTags], // 已选中的标签
            allowCustom,                     // 是否允许自定义标签
            maxCustomLength,                 // 自定义标签最大长度
            onTagsChange,                    // 标签变化回调函数
            onCustomTagAdd,                  // 自定义标签添加回调函数
            element: null,                   // DOM元素引用
            // 新增自定义文字配置
            selectedText,                    // 已选择时的显示文字
            previewLabel,                    // 预览区域的标签文字
            unitText                         // 数量单位文字
        };

        // 存储组件实例到管理器
        this.components.set(id, component);

        // 将生成的HTML插入到指定容器
        if (container) {
            container.innerHTML = html;
            component.element = container;
        }

        // 初始化组件事件监听
        this.initTagsComponentEvents(id);

        return component;
    }

    // 生成标签下拉组件的HTML结构
    generateTagsComponentHTML(id, options, placeholder, allowCustom, helpText, customInputPlaceholder, addButtonText) {
        // 生成可选标签的HTML
        const optionsHtml = options.map(tag => 
            `<button type="button" class="tags-dropdown-item" data-value="${tag}">${tag}</button>`
        ).join('');

        // 生成搜索框HTML
        const searchBoxHtml = `
            <div class="p-2 border-bottom">
                <div class="input-group input-group-sm">
                    <span class="input-group-text">
                        <i class="bi bi-search"></i>
                    </span>
                    <input type="text" class="form-control form-control-sm tags-search-input" 
                           id="${id}_searchInput" placeholder="搜索标签..." 
                           onkeyup="tagsDropdownManager.filterTags('${id}', this.value)">
                </div>
            </div>
        `;

        // 生成自定义标签输入区域的HTML（如果允许自定义）
        const customInputHtml = allowCustom ? `
            <div class="tags-dropdown-divider"></div>
            <div class="p-2">
                <div class="input-group input-group-sm">
                    <input type="text" class="form-control form-control-sm custom-tag-input" 
                           id="${id}_customInput" placeholder="${customInputPlaceholder}">
                    <button class="btn btn-outline-primary btn-sm" type="button" 
                            onclick="tagsDropdownManager.addCustomTag('${id}')">
                        <i class="bi bi-plus"></i> ${addButtonText}
                    </button>
                </div>
            </div>
        ` : '';

        // 返回完整的标签下拉组件HTML结构
        return `
            <div class="tags-dropdown" id="${id}_dropdown">
                <button type="button" class="tags-dropdown-toggle" id="${id}_toggle" 
                        onclick="tagsDropdownManager.toggleTagsDropdown('${id}')">
                    ${placeholder}
                </button>
                <div class="tags-dropdown-menu" id="${id}_menu">
                    ${searchBoxHtml}
                    <div class="tags-options-container" id="${id}_optionsContainer">
                        ${optionsHtml}
                    </div>
                    ${customInputHtml}
                </div>
            </div>
            <div class="mt-2" id="${id}_preview">
                <!-- 已选标签预览区域 -->
            </div>
            <div class="form-text">${helpText || '点击选择标签，支持自定义标签'}</div>
            <input type="hidden" id="${id}_hidden" name="${id}">
        `;
    }

    // 初始化标签下拉组件的事件监听
    initTagsComponentEvents(id) {
        const component = this.components.get(id);
        if (!component) return;

        // 延迟绑定事件，确保DOM已经完全渲染
        setTimeout(() => {
            // 为下拉菜单中的标签项添加点击事件
            const menu = document.getElementById(`${id}_menu`);
            if (menu) {
                menu.addEventListener('click', (e) => {
                    if (e.target.classList.contains('tags-dropdown-item')) {
                        const tagValue = e.target.getAttribute('data-value');
                        const tagText = e.target.textContent;
                        this.selectTag(id, tagValue, tagText);
                    }
                });
            }

            // 为自定义标签输入框添加回车键事件支持
            const customInput = document.getElementById(`${id}_customInput`);
            if (customInput) {
                customInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.addCustomTag(id);
                    }
                });
            }
        }, 100);
    }

    // 过滤标签选项
    filterTags(id, searchText) {
        const component = this.components.get(id);
        if (!component) return;

        const optionsContainer = document.getElementById(`${id}_optionsContainer`);
        if (!optionsContainer) return;

        const searchLower = searchText.toLowerCase().trim();
        const tagItems = optionsContainer.querySelectorAll('.tags-dropdown-item');

        tagItems.forEach(item => {
            const tagText = item.textContent.toLowerCase();
            if (searchLower === '' || tagText.includes(searchLower)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        // 如果没有匹配的标签，显示提示信息
        const visibleItems = optionsContainer.querySelectorAll('.tags-dropdown-item[style*="display: block"], .tags-dropdown-item:not([style*="display: none"])');
        const noResultsElement = optionsContainer.querySelector('.no-results-message');
        
        if (visibleItems.length === 0 && searchLower !== '') {
            if (!noResultsElement) {
                const noResults = document.createElement('div');
                noResults.className = 'no-results-message p-2 text-muted text-center';
                noResults.innerHTML = '<small>没有找到匹配的标签</small>';
                optionsContainer.appendChild(noResults);
            }
        } else if (noResultsElement) {
            noResultsElement.remove();
        }
    }

    // 清空搜索框
    clearSearch(id) {
        const searchInput = document.getElementById(`${id}_searchInput`);
        if (searchInput) {
            searchInput.value = '';
            this.filterTags(id, '');
        }
    }

    // 切换标签下拉框的显示/隐藏状态
    toggleTagsDropdown(id) {
        const dropdown = document.getElementById(`${id}_dropdown`);
        if (!dropdown) return;

        const menu = dropdown.querySelector('.tags-dropdown-menu');
        const toggle = dropdown.querySelector('.tags-dropdown-toggle');
        
        // 切换下拉菜单的显示状态
        if (menu.classList.contains('show')) {
            menu.classList.remove('show');
            toggle.classList.remove('active');
        } else {
            menu.classList.add('show');
            toggle.classList.add('active');
            // 清空搜索框并重置过滤
            this.clearSearch(id);
        }
    }

    // 选择标签（添加到已选列表）
    selectTag(id, tagValue, tagText) {
        const component = this.components.get(id);
        if (!component) return;

        // 检查标签是否已选中，避免重复添加
        if (!component.selectedTags.includes(tagValue)) {
            component.selectedTags.push(tagValue);
            this.updateTagsComponent(id);
            
            // 触发标签变化回调函数
            if (component.onTagsChange) {
                component.onTagsChange(component.selectedTags);
            }
        }
    }

    // 移除标签（从已选列表中删除）
    removeTag(id, tagValue) {
        const component = this.components.get(id);
        if (!component) return;

        // 从已选标签列表中过滤掉指定标签
        component.selectedTags = component.selectedTags.filter(tag => tag !== tagValue);
        this.updateTagsComponent(id);
        
        // 触发标签变化回调函数
        if (component.onTagsChange) {
            component.onTagsChange(component.selectedTags);
        }
    }

    // 添加自定义标签
    addCustomTag(id) {
        const component = this.components.get(id);
        if (!component) return;

        const customInput = document.getElementById(`${id}_customInput`);
        if (!customInput) return;

        const customTag = customInput.value.trim();
        
        // 验证自定义标签输入
        if (!customTag) {
            alert('请输入标签名称');
            return;
        }
        
        if (customTag.length > component.maxCustomLength) {
            alert(`标签名称不能超过${component.maxCustomLength}个字符`);
            return;
        }
        
        if (component.selectedTags.includes(customTag)) {
            alert('该标签已选中');
            return;
        }

        // 将自定义标签添加到组件选项列表
        if (!component.options.includes(customTag)) {
            component.options.push(customTag);
            this.updateTagsComponentOptions(id);
        }

        // 自动选中新添加的标签
        this.selectTag(id, customTag, customTag);
        
        // 清空输入框
        customInput.value = '';
        
        // 触发自定义标签添加回调函数
        if (component.onCustomTagAdd) {
            component.onCustomTagAdd(customTag);
        }

        // 显示成功提示消息
        this.showMessage(`标签"${customTag}"已添加`);
    }

    // 更新标签下拉组件的显示状态
    updateTagsComponent(id) {
        const component = this.components.get(id);
        if (!component) return;

        // 更新下拉框切换按钮的显示文本
        const toggle = document.getElementById(`${id}_toggle`);
        if (toggle) {
            if (component.selectedTags.length > 0) {
                toggle.textContent = component.selectedText.replace('{count}', component.selectedTags.length);
            } else {
                toggle.textContent = component.placeholder || '请选择标签';
            }
        }

        // 更新隐藏表单字段的值（用于表单提交）
        const hiddenInput = document.getElementById(`${id}_hidden`);
        if (hiddenInput) {
            hiddenInput.value = component.selectedTags.join(',');
        }

        // 更新已选标签的预览区域
        this.updateTagsPreview(id);
    }

    // 更新标签下拉组件的选项列表
    updateTagsComponentOptions(id) {
        const component = this.components.get(id);
        if (!component) return;

        const optionsContainer = document.getElementById(`${id}_optionsContainer`);
        if (!optionsContainer) return;

        // 清除现有的所有标签项
        const tagItems = optionsContainer.querySelectorAll('.tags-dropdown-item');
        tagItems.forEach(item => item.remove());

        // 重新生成所有标签选项
        component.options.forEach(tag => {
            const newItem = document.createElement('button');
            newItem.type = 'button';
            newItem.className = 'tags-dropdown-item';
            newItem.setAttribute('data-value', tag);
            newItem.textContent = tag;
            
            optionsContainer.appendChild(newItem);
        });

        // 重新绑定事件监听器
        this.initTagsComponentEvents(id);
    }

    // 更新已选标签的预览区域
    updateTagsPreview(id) {
        const component = this.components.get(id);
        if (!component) return;

        const previewArea = document.getElementById(`${id}_preview`);
        if (!previewArea) return;

        // 如果有已选标签，显示标签徽章
        if (component.selectedTags.length > 0) {
            const tagsHtml = component.selectedTags.map(tag => 
                `<span class="badge bg-primary me-1 mb-1">${tag} <i class="bi bi-x-circle ms-1" onclick="tagsDropdownManager.removeTag('${id}', '${tag}')" style="cursor: pointer;"></i></span>`
            ).join('');
            previewArea.innerHTML = `<small class="text-muted">${component.previewLabel}</small><br>${tagsHtml}`;
        } else {
            // 如果没有已选标签，清空预览区域
            previewArea.innerHTML = '';
        }
    }

    // 获取指定组件已选中的标签列表
    getSelectedTags(id) {
        const component = this.components.get(id);
        return component ? component.selectedTags : [];
    }

    // 设置指定组件的已选标签列表
    setSelectedTags(id, tags) {
        const component = this.components.get(id);
        if (component) {
            component.selectedTags = [...tags];
            this.updateTagsComponent(id);
        }
    }

    // 清空指定组件的已选标签
    clearSelectedTags(id) {
        this.setSelectedTags(id, []);
    }

    // 向指定组件添加新的标签选项
    addComponentOption(id, option) {
        const component = this.components.get(id);
        if (component && !component.options.includes(option)) {
            component.options.push(option);
            this.updateTagsComponentOptions(id);
        }
    }

    // 显示提示消息（Toast通知）
    showMessage(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // 添加到页面
        document.body.appendChild(alertDiv);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 3000);
    }

    // 绑定全局事件监听器
    bindGlobalEvents() {
        // 点击组件外部时自动关闭所有打开的下拉框
        document.addEventListener('click', (e) => {
            const dropdowns = document.querySelectorAll('.tags-dropdown');
            dropdowns.forEach(dropdown => {
                // 如果点击位置不在当前下拉框内，则关闭该下拉框
                if (!dropdown.contains(e.target)) {
                    const menu = dropdown.querySelector('.tags-dropdown-menu');
                    const toggle = dropdown.querySelector('.tags-dropdown-toggle');
                    if (menu) menu.classList.remove('show');
                    if (toggle) toggle.classList.remove('active');
                    
                    // 清空搜索框
                    const dropdownId = dropdown.id.replace('_dropdown', '');
                    this.clearSearch(dropdownId);
                }
            });
        });
    }
}

// 创建全局标签下拉组件管理器实例
const tagsDropdownManager = new TagsDropdownManager();

// 为了向后兼容，保留原来的变量名
const componentManager = tagsDropdownManager;
