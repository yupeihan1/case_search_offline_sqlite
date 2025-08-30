import logging
from typing import List, Dict, Optional, Any
from datetime import datetime
from .database import db_manager, execute_query, execute_update, get_single_value
from ..serializers.tag_serializer import TagCreateSerializer, TagUpdateSerializer

# 配置logger
logger = logging.getLogger(__name__)


class DocumentSearchService:
    """
    文档搜索服务类
    提供标签管理和全文检索功能
    """
    
    def __init__(self):
        """
        初始化服务
        """
        self.module_id = 'document_search'
    
    def get_all_tags(self) -> List[Dict[str, Any]]:
        """
        检索当前module下的所有tags
        
        Returns:
            List[Dict[str, Any]]: 标签列表
        """
        query = """
        SELECT module_id, tag_id, tag_name, display_order, 
               updated_at, created_at, remarks
        FROM tags 
        WHERE module_id = ? 
        ORDER BY display_order ASC, tag_id ASC
        """
        
        return execute_query(query, (self.module_id,))
    
    def get_next_tag_id(self) -> int:
        """
        获取当前module_id下的下一个可用tag_id
        
        Returns:
            int: 下一个可用的tag_id
        """
        query = """
        SELECT COALESCE(MAX(tag_id), 0) + 1
        FROM tags 
        WHERE module_id = ?
        """
        
        result = get_single_value(query, (self.module_id,))
        return result if result else 1
    
    def create_tag(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        创建新的标签
        
        Args:
            data: 标签数据字典
            
        Returns:
            Dict[str, Any]: 操作结果 {'success': bool, 'message': str, 'data': Dict, 'errors': List}
        """
        # 使用TagCreateSerializer进行数据验证
        serializer = TagCreateSerializer(data=data)
        if not serializer.is_valid():
            return {
                'success': False,
                'message': '数据验证失败',
                'errors': list(serializer.errors.values()),
                'data': None
            }
        
        validated_data = serializer.validated_data
        
        # 检查标签名是否已存在
        check_query = """
        SELECT COUNT(*) FROM tags 
        WHERE module_id = ? AND tag_name = ?
        """
        count = get_single_value(check_query, (self.module_id, validated_data['tag_name']))
        if count and count > 0:
            return {
                'success': False,
                'message': f"标签名 '{validated_data['tag_name']}' 已存在",
                'errors': [f"标签名 '{validated_data['tag_name']}' 已存在"],
                'data': None
            }
        
        # 获取下一个可用的tag_id
        next_tag_id = self.get_next_tag_id()
        
        # 插入新标签
        insert_query = """
        INSERT INTO tags (module_id, tag_id, tag_name, display_order, 
                        updated_at, created_at, remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        success = execute_update(insert_query, (
            self.module_id,
            next_tag_id,
            validated_data['tag_name'],
            validated_data.get('display_order', 0),
            current_time,
            current_time,
            validated_data.get('remarks')
        ))
        
        if success:
            logger.info(f"成功创建标签: {validated_data['tag_name']} (ID: {next_tag_id})")
            # 返回创建的标签信息
            created_tag = {
                'module_id': self.module_id,
                'tag_id': next_tag_id,
                'tag_name': validated_data['tag_name'],
                'display_order': validated_data.get('display_order', 0),
                'updated_at': current_time,
                'created_at': current_time,
                'remarks': validated_data.get('remarks')
            }
            return {
                'success': True,
                'message': '标签创建成功',
                'data': created_tag,
                'errors': None
            }
        else:
            return {
                'success': False,
                'message': '标签创建失败',
                'errors': ['数据库操作失败'],
                'data': None
            }
    
    def update_tag(self, tag_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        更新标签信息
        
        Args:
            tag_id: 要更新的标签ID
            data: 更新数据字典
            
        Returns:
            Dict[str, Any]: 操作结果 {'success': bool, 'message': str, 'data': Dict, 'errors': List}
        """
        # 使用TagUpdateSerializer进行数据验证
        serializer = TagUpdateSerializer(data=data)
        if not serializer.is_valid():
            return {
                'success': False,
                'message': '数据验证失败',
                'errors': list(serializer.errors.values()),
                'data': None
            }
        
        validated_data = serializer.validated_data
        
        # 检查标签是否存在
        check_query = """
        SELECT COUNT(*) FROM tags 
        WHERE module_id = ? AND tag_id = ?
        """
        count = get_single_value(check_query, (self.module_id, tag_id))
        if not count or count == 0:
            return {
                'success': False,
                'message': f"标签ID {tag_id} 不存在",
                'errors': [f"标签ID {tag_id} 不存在"],
                'data': None
            }
        
        # 构建更新查询
        update_parts = []
        params = []
        
        if 'tag_name' in validated_data:
            # 检查新标签名是否与其他标签冲突
            name_check_query = """
            SELECT COUNT(*) FROM tags 
            WHERE module_id = ? AND tag_name = ? AND tag_id != ?
            """
            name_count = get_single_value(name_check_query, (self.module_id, validated_data['tag_name'], tag_id))
            if name_count and name_count > 0:
                return {
                    'success': False,
                    'message': f"标签名 '{validated_data['tag_name']}' 已存在",
                    'errors': [f"标签名 '{validated_data['tag_name']}' 已存在"],
                    'data': None
                }
            
            update_parts.append("tag_name = ?")
            params.append(validated_data['tag_name'])
        
        if 'display_order' in validated_data:
            update_parts.append("display_order = ?")
            params.append(validated_data['display_order'])
        
        if 'remarks' in validated_data:
            update_parts.append("remarks = ?")
            params.append(validated_data['remarks'])
        
        # 添加更新时间
        update_parts.append("updated_at = ?")
        params.append(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        
        # 添加WHERE条件参数
        params.extend([self.module_id, tag_id])
        
        # 执行更新
        update_query = f"""
        UPDATE tags 
        SET {', '.join(update_parts)}
        WHERE module_id = ? AND tag_id = ?
        """
        
        success = execute_update(update_query, tuple(params))
        
        if success:
            logger.info(f"成功更新标签ID {tag_id}")
            # 返回更新后的标签信息
            updated_tag = self.get_tag_by_id(tag_id)
            return {
                'success': True,
                'message': '标签更新成功',
                'data': updated_tag,
                'errors': None
            }
        else:
            return {
                'success': False,
                'message': '标签更新失败',
                'errors': ['数据库操作失败'],
                'data': None
            }
    
    def delete_tag(self, tag_id: int) -> Dict[str, Any]:
        """
        删除标签
        
        Args:
            tag_id: 要删除的标签ID
            
        Returns:
            Dict[str, Any]: 操作结果 {'success': bool, 'message': str, 'data': Dict, 'errors': List}
        """
        if tag_id <= 0:
            return {
                'success': False,
                'message': '标签ID必须大于0',
                'errors': ['标签ID必须大于0'],
                'data': None
            }
        
        # 检查标签是否存在并获取标签名
        check_query = """
        SELECT tag_name FROM tags 
        WHERE module_id = ? AND tag_id = ?
        """
        tag_name = get_single_value(check_query, (self.module_id, tag_id))
        
        if not tag_name:
            return {
                'success': False,
                'message': f"标签ID {tag_id} 不存在",
                'errors': [f"标签ID {tag_id} 不存在"],
                'data': None
            }
        
        # 删除标签
        delete_query = """
        DELETE FROM tags 
        WHERE module_id = ? AND tag_id = ?
        """
        
        success = execute_update(delete_query, (self.module_id, tag_id))
        
        if success:
            logger.info(f"成功删除标签: {tag_name} (ID: {tag_id})")
            return {
                'success': True,
                'message': f"成功删除标签: {tag_name}",
                'data': {'tag_id': tag_id, 'tag_name': tag_name},
                'errors': None
            }
        else:
            return {
                'success': False,
                'message': '标签删除失败',
                'errors': ['数据库操作失败'],
                'data': None
            }
    
    def get_tag_by_id(self, tag_id: int) -> Optional[Dict[str, Any]]:
        """
        根据ID获取标签信息
        
        Args:
            tag_id: 标签ID
            
        Returns:
            Optional[Dict[str, Any]]: 格式化的标签数据，如果不存在返回None
        """
        query = """
        SELECT module_id, tag_id, tag_name, display_order, 
               updated_at, created_at, remarks
        FROM tags 
        WHERE module_id = ? AND tag_id = ?
        """
        
        results = execute_query(query, (self.module_id, tag_id))
        if results:
            return results[0]
        return None


# 使用示例
if __name__ == "__main__":
    # 配置日志
    logging.basicConfig(level=logging.INFO)
    
    # 创建服务实例
    service = DocumentSearchService()
    
    # 1. 获取所有标签
    logger.info("=== 获取所有标签 ===")
    tags = service.get_all_tags()
    logger.info(f"总共有 {len(tags)} 个标签")
    for tag in tags:
        logger.info(f"ID: {tag['tag_id']}, 名称: {tag['tag_name']}, 顺序: {tag['display_order']}")
    
    # 2. 创建新标签
    logger.info("=== 创建新标签 ===")
    create_data = {
        'tag_name': '重要文档',
        'display_order': 1,
        'remarks': '标记重要的文档'
    }
    response = service.create_tag(create_data)
    logger.info(f"创建结果: {response}")
    
    # 3. 更新标签
    logger.info("=== 更新标签 ===")
    if tags:
        first_tag = tags[0]
        update_data = {
            'display_order': 10
        }
        response = service.update_tag(first_tag['tag_id'], update_data)
        logger.info(f"更新结果: {response}")
    
    # 4. 删除标签
    logger.info("=== 删除标签 ===")
    if tags:
        first_tag = tags[0]
        response = service.delete_tag(first_tag['tag_id'])
        logger.info(f"删除结果: {response}")
    
    # 5. 再次获取所有标签
    logger.info("=== 更新后的标签列表 ===")
    tags = service.get_all_tags()
    logger.info(f"总共有 {len(tags)} 个标签")
    for tag in tags:
        logger.info(f"ID: {tag['tag_id']}, 名称: {tag['tag_name']}, 顺序: {tag['display_order']}")
    
    # 6. 测试DRF序列化器
    logger.info("=== 测试DRF序列化器 ===")
    
    # 测试创建序列化器
    create_data = {
        'tag_name': '测试标签',
        'display_order': 5,
        'remarks': '这是一个测试标签'
    }
    
    create_serializer = TagCreateSerializer(data=create_data)
    if create_serializer.is_valid():
        logger.info(f"创建数据验证通过: {create_serializer.validated_data}")
    else:
        logger.info(f"创建数据验证失败: {create_serializer.errors}")
    
    # 测试更新序列化器
    update_data = {'display_order': 10}
    update_serializer = TagUpdateSerializer(data=update_data)
    if update_serializer.is_valid():
        logger.info(f"更新数据验证通过: {update_serializer.validated_data}")
    else:
        logger.info(f"更新数据验证失败: {update_serializer.errors}")
