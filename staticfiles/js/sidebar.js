// 侧边栏当前页面高亮处理
(function() {
    'use strict';
    
    // 等待DOM加载完成
    function initSidebar() {
        try {
            console.log('Sidebar initialization started');
            
            // 获取当前页面路径
            const currentPath = window.location.pathname;
            console.log('Current path:', currentPath);
            
            // 移除所有active类
            const sidebarLinks = document.querySelectorAll('.sidebar-link');
            console.log('Found sidebar links:', sidebarLinks.length);
            
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            });
            
            // 根据当前路径设置active类
            let activeLink = null;
            
            if (currentPath === '/' || currentPath === '') {
                // 主页
                activeLink = document.querySelector('.sidebar-link[href="/"]');
                console.log('Setting active for home page');
            } else if (currentPath.includes('/incident_management/')) {
                // 部队问题管理模块
                activeLink = document.querySelector('.sidebar-link[href="/incident_management/"]');
                console.log('Setting active for incident_management');
            } else if (currentPath.includes('/plans_management/')) {
                // 计划管理模块
                activeLink = document.querySelector('.sidebar-link[href="/plans_management/"]');
                console.log('Setting active for plans_management');
            } else if (currentPath.includes('/document_search/')) {
                // 全文检索模块
                activeLink = document.querySelector('.sidebar-link[href="/document_search/"]');
                console.log('Setting active for document_search');
            }
            
            if (activeLink) {
                activeLink.classList.add('active');
                activeLink.setAttribute('aria-current', 'page');
                console.log('Active link set successfully:', activeLink.href);
            } else {
                console.warn('No matching link found for current path:', currentPath);
            }
            
        } catch (error) {
            console.error('Error in sidebar initialization:', error);
        }
    }
    
    // 如果DOM已经加载完成，立即执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
        // DOM已经加载完成，立即执行
        initSidebar();
    }
    
    // 为了确保在动态加载的情况下也能工作，添加一个备用初始化
    window.addEventListener('load', function() {
        // 再次检查是否有侧边栏链接，如果没有active状态，重新初始化
        const activeLinks = document.querySelectorAll('.sidebar-link.active');
        if (activeLinks.length === 0) {
            console.log('No active links found, reinitializing sidebar');
            setTimeout(initSidebar, 100);
        }
    });
    
})();
