/**
 * 全局可复用分页器组件
 * 支持：每页10条、URL同步、省略号、滚动回到列表顶、动态刷新
 */
class PaginationManager {
    constructor(options = {}) {
        this.options = {
            container: null,           // 分页容器元素
            itemsPerPage: 10,          // 每页显示条数
            totalItems: 0,             // 总条数
            currentPage: 1,            // 当前页
            maxVisiblePages: 5,        // 最大可见页码数
            onPageChange: null,        // 页面变化回调函数
            scrollToTop: true,         // 是否滚动到顶部
            urlSync: true,             // 是否同步URL参数
            ...options
        };
        
        this.init();
    }
    
    /**
     * 初始化分页器
     */
    init() {
        if (!this.options.container) {
            console.error('PaginationManager: container is required');
            return;
        }
        
        // 从URL获取当前页
        if (this.options.urlSync) {
            this.options.currentPage = this.getPageFromUrl();
        }
        
        this.render();
    }
    
    /**
     * 从URL获取页码
     */
    getPageFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const page = parseInt(urlParams.get('page')) || 1;
        return Math.max(1, page);
    }
    
    /**
     * 更新URL中的页码
     */
    updateUrl(page) {
        if (!this.options.urlSync) return;
        
        const url = new URL(window.location);
        if (page === 1) {
            url.searchParams.delete('page');
        } else {
            url.searchParams.set('page', page);
        }
        
        // 使用 history.replaceState 避免页面刷新
        window.history.replaceState({}, '', url);
    }
    
    /**
     * 计算总页数
     */
    getTotalPages() {
        return Math.ceil(this.options.totalItems / this.options.itemsPerPage);
    }
    
    /**
     * 获取当前页的数据范围
     */
    getCurrentPageRange() {
        const startIndex = (this.options.currentPage - 1) * this.options.itemsPerPage;
        const endIndex = startIndex + this.options.itemsPerPage;
        return { startIndex, endIndex };
    }
    
    /**
     * 渲染分页器
     */
    render() {
        const totalPages = this.getTotalPages();
        if (totalPages <= 1) {
            this.options.container.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // 上一页按钮
        if (this.options.currentPage === 1) {
            paginationHTML += `
                <li class="page-item disabled">
                    <span class="page-link" tabindex="-1" aria-disabled="true">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">上一页</span>
                    </span>
                </li>
            `;
        } else {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="getPaginationManager().changePage(${this.options.currentPage - 1}); return false;" aria-label="上一页">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">上一页</span>
                    </a>
                </li>
            `;
        }
        
        // 页码按钮
        const { startPage, endPage, showStartEllipsis, showEndEllipsis } = this.calculatePageRange(totalPages);
        
        // 第一页
        if (startPage > 1) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="getPaginationManager().changePage(1); return false;">1</a>
                </li>
            `;
        }
        
        // 开始省略号
        if (showStartEllipsis) {
            paginationHTML += `
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
            `;
        }
        
        // 页码按钮
        for (let i = startPage; i <= endPage; i++) {
            if (i === this.options.currentPage) {
                paginationHTML += `
                    <li class="page-item active">
                        <span class="page-link">
                            ${i}
                            <span class="sr-only">(当前页)</span>
                        </span>
                    </li>
                `;
            } else {
                paginationHTML += `
                    <li class="page-item">
                        <a class="page-link" href="#" onclick="getPaginationManager().changePage(${i}); return false;">${i}</a>
                    </li>
                `;
            }
        }
        
        // 结束省略号
        if (showEndEllipsis) {
            paginationHTML += `
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
            `;
        }
        
        // 最后一页
        if (endPage < totalPages) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="getPaginationManager().changePage(${totalPages}); return false;">${totalPages}</a>
                </li>
            `;
        }
        
        // 下一页按钮
        if (this.options.currentPage === totalPages) {
            paginationHTML += `
                <li class="page-item disabled">
                    <span class="page-link" tabindex="-1" aria-disabled="true">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">下一页</span>
                    </span>
                </li>
            `;
        } else {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="getPaginationManager().changePage(${this.options.currentPage + 1}); return false;" aria-label="下一页">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">下一页</span>
                    </a>
                </li>
            `;
        }
        
        this.options.container.innerHTML = paginationHTML;
    }
    
    /**
     * 计算页码范围
     */
    calculatePageRange(totalPages) {
        const maxVisible = this.options.maxVisiblePages;
        let startPage = Math.max(1, this.options.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        const showStartEllipsis = startPage > 2;
        const showEndEllipsis = endPage < totalPages - 1;
        
        return { startPage, endPage, showStartEllipsis, showEndEllipsis };
    }
    
    /**
     * 切换页面
     */
    changePage(page) {
        const totalPages = this.getTotalPages();
        if (page >= 1 && page <= totalPages && page !== this.options.currentPage) {
            this.options.currentPage = page;
            
            // 更新URL
            this.updateUrl(page);
            
            // 滚动到顶部
            if (this.options.scrollToTop) {
                this.scrollToTop();
            }
            
            // 调用回调函数
            if (typeof this.options.onPageChange === 'function') {
                this.options.onPageChange(page, this.getCurrentPageRange());
            }
            
            // 重新渲染
            this.render();
            
            console.log(`PaginationManager: Page changed to ${page}, Total pages: ${totalPages}`);
        }
    }
    
    /**
     * 滚动到顶部
     */
    scrollToTop() {
        // 查找列表容器或使用默认滚动
        const listContainer = this.options.container.closest('.card-body') || 
                             this.options.container.closest('.container') || 
                             document.body;
        
        if (listContainer) {
            listContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    
    /**
     * 更新数据
     */
    updateData(totalItems, currentPage = 1) {
        this.options.totalItems = totalItems;
        this.options.currentPage = currentPage;
        
        // 如果当前页超出范围，重置为第一页
        const totalPages = this.getTotalPages();
        if (this.options.currentPage > totalPages && totalPages > 0) {
            this.options.currentPage = 1;
            this.updateUrl(1);
        }
        
        this.render();
    }
    
    /**
     * 获取当前页的数据范围
     */
    getPageData(allData) {
        const { startIndex, endIndex } = this.getCurrentPageRange();
        return allData.slice(startIndex, endIndex);
    }
    
    /**
     * 销毁分页器
     */
    destroy() {
        if (this.options.container) {
            this.options.container.innerHTML = '';
        }
    }
}

// 全局分页器实例
let paginationManager = null;

/**
 * 创建分页器的便捷函数
 */
function createPagination(container, options = {}) {
    if (paginationManager) {
        paginationManager.destroy();
    }
    
    paginationManager = new PaginationManager({
        container: container,
        ...options
    });
    
    return paginationManager;
}

/**
 * 获取当前分页器实例
 */
function getPaginationManager() {
    return paginationManager;
}
