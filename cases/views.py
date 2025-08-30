
from django.shortcuts import render
from django.http import JsonResponse
from .services.document_search import DocumentSearchService


class ApiResponse:
    """统一的API响应封装类"""
    
    def __init__(self, recode=200, message=None, data=None):
        """
        初始化响应对象
        
        Args:
            recode: 响应码，默认200
            message: 响应消息，默认None
            data: 响应数据，默认None
        """
        self.recode = recode
        self.message = message
        self.data = data
    
    def to_json_response(self):
        """转换为Django JsonResponse"""
        return JsonResponse({
            'recode': self.recode,
            'message': self.message,
            'data': self.data
        }, status=self.recode if self.recode != 200 else 200)


class NavigationView:
    """导航页面视图类"""

    @staticmethod
    def index(request):
        """导航主页"""
        return render(request, "cases/navigation.html")


class IncidentManagementView:
    """部队问题管理模块视图类"""

    def __init__(self):
        """初始化服务依赖"""
        # 未来可以添加：self.incident_service = IncidentManagementService()
        pass

    def index(self, request):
        """问题管理主页"""
        return render(request, "cases/incident_management/index.html")


class PlansManagementView:
    """计划管理模块视图类"""

    def __init__(self):
        """初始化服务依赖"""
        # 未来可以添加：self.plans_service = PlansManagementService()
        pass

    def index(self, request):
        """计划管理主页"""
        return render(request, "cases/plans_management/index.html")


class DocumentSearchView:
    """全文检索模块视图类"""

    def __init__(self):
        """初始化服务依赖"""
        self.document_service = DocumentSearchService()

    def index(self, request):
        """全文检索主页"""
        return render(request, "cases/document_search/index.html")

    def get_all_tags(self, request):
        """获取所有标签的API接口"""
        try:
            # 使用实例的服务
            tags_data = self.document_service.get_all_tags()

            # 使用统一的响应封装
            response = ApiResponse(
                recode=200,
                message="获取标签成功",
                data=tags_data
            )
            return response.to_json_response()
            
        except Exception as e:
            # 错误响应
            response = ApiResponse(
                recode=500,
                message=f"获取标签失败: {str(e)}",
                data=None
            )
            return response.to_json_response()
