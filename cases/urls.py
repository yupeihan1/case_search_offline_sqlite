
from django.urls import path
from . import views

urlpatterns = [
    # 导航页面
    path('', views.NavigationView.index, name='navigation'),
    # 部队问题管理模块
    path('incident_management/', views.IncidentManagementView().index, name='incident_management'),
    # 计划管理模块
    path('plans_management/', views.PlansManagementView().index, name='plans_management'),
    # 全文检索模块
    path('document_search/', views.DocumentSearchView().index, name='document_search'),
    path('document_search/get_all_tags/', views.DocumentSearchView().get_all_tags, name='document_search_get_all_tags'),
]
