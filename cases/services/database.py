import sqlite3
import os
import logging
from typing import Optional, Dict, List, Any
from contextlib import contextmanager
from datetime import datetime

# 配置logger
logger = logging.getLogger(__name__)


class DatabaseManager:
    """
    数据库管理类
    提供统一的数据库连接和基础操作
    """
    
    _instance = None
    _db_path = None
    
    def __new__(cls, db_path: str = None):
        """单例模式，确保只有一个数据库管理器实例"""
        if cls._instance is None:
            cls._instance = super(DatabaseManager, cls).__new__(cls)
            cls._instance._initialize(db_path)
        return cls._instance
    
    def _initialize(self, db_path: str = None):
        """初始化数据库管理器"""
        if db_path is None:
            # 使用 Django 的数据库配置
            try:
                from django.conf import settings
                db_path = str(settings.DATABASES['default']['NAME'])
            except:
                # 如果 Django 配置不可用，使用默认路径
                db_path = '/app/db.sqlite3'
        
        self._db_path = db_path
        self._ensure_database_exists()
    
    def _ensure_database_exists(self):
        """确保数据库文件存在"""
        if not os.path.exists(self._db_path):
            # 创建数据库文件
            with sqlite3.connect(self._db_path) as conn:
                conn.execute("SELECT 1")  # 创建数据库文件
            logger.info(f"数据库文件已创建: {self._db_path}")
    
    @contextmanager
    def get_connection(self):
        """
        获取数据库连接的上下文管理器
        
        Usage:
            with db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM table")
        """
        conn = None
        try:
            conn = sqlite3.connect(self._db_path)
            conn.row_factory = sqlite3.Row  # 使结果可以通过列名访问
            yield conn
        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                conn.close()
    
    def execute_query(self, query: str, params: tuple = None) -> List[Dict[str, Any]]:
        """
        执行查询语句
        
        Args:
            query: SQL查询语句
            params: 查询参数
            
        Returns:
            List[Dict]: 查询结果列表
        """
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)
                
                rows = cursor.fetchall()
                return [dict(row) for row in rows]
                
        except Exception as e:
            logger.error(f"查询执行失败: {e}")
            return []
    
    def execute_update(self, query: str, params: tuple = None) -> bool:
        """
        执行更新语句（INSERT, UPDATE, DELETE）
        
        Args:
            query: SQL更新语句
            params: 更新参数
            
        Returns:
            bool: 执行成功返回True，失败返回False
        """
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)
                
                conn.commit()
                return True
                
        except Exception as e:
            logger.error(f"更新执行失败: {e}")
            return False
    
    def execute_many(self, query: str, params_list: List[tuple]) -> bool:
        """
        批量执行SQL语句
        
        Args:
            query: SQL语句
            params_list: 参数列表
            
        Returns:
            bool: 执行成功返回True，失败返回False
        """
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.executemany(query, params_list)
                conn.commit()
                return True
                
        except Exception as e:
            logger.error(f"批量执行失败: {e}")
            return False
    
    def get_single_value(self, query: str, params: tuple = None) -> Any:
        """
        获取单个值
        
        Args:
            query: SQL查询语句
            params: 查询参数
            
        Returns:
            Any: 查询结果，如果没有结果返回None
        """
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)
                
                result = cursor.fetchone()
                return result[0] if result else None
                
        except Exception as e:
            logger.error(f"获取单个值失败: {e}")
            return None
    
    def table_exists(self, table_name: str) -> bool:
        """
        检查表是否存在
        
        Args:
            table_name: 表名
            
        Returns:
            bool: 表存在返回True，不存在返回False
        """
        query = """
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name=?
        """
        result = self.get_single_value(query, (table_name,))
        return result is not None
    
    def get_table_info(self, table_name: str) -> List[Dict[str, Any]]:
        """
        获取表结构信息
        
        Args:
            table_name: 表名
            
        Returns:
            List[Dict]: 表结构信息列表
        """
        query = f"PRAGMA table_info({table_name})"
        return self.execute_query(query)
    
    def get_all_tables(self) -> List[str]:
        """
        获取所有表名
        
        Returns:
            List[str]: 表名列表
        """
        query = "SELECT name FROM sqlite_master WHERE type='table'"
        results = self.execute_query(query)
        return [row['name'] for row in results]
    
    def backup_database(self, backup_path: str) -> bool:
        """
        备份数据库
        
        Args:
            backup_path: 备份文件路径
            
        Returns:
            bool: 备份成功返回True，失败返回False
        """
        try:
            import shutil
            shutil.copy2(self._db_path, backup_path)
            logger.info(f"数据库已备份到: {backup_path}")
            return True
        except Exception as e:
            logger.error(f"数据库备份失败: {e}")
            return False
    
    def get_database_info(self) -> Dict[str, Any]:
        """
        获取数据库信息
        
        Returns:
            Dict: 数据库信息字典
        """
        info = {
            'path': self._db_path,
            'size': os.path.getsize(self._db_path) if os.path.exists(self._db_path) else 0,
            'tables': self.get_all_tables(),
            'created_time': datetime.fromtimestamp(
                os.path.getctime(self._db_path)
            ).strftime('%Y-%m-%d %H:%M:%S') if os.path.exists(self._db_path) else None
        }
        return info


# 全局数据库管理器实例
db_manager = DatabaseManager()


# 便捷函数
def get_db_connection():
    """获取数据库连接"""
    return db_manager.get_connection()


def execute_query(query: str, params: tuple = None) -> List[Dict[str, Any]]:
    """执行查询语句"""
    return db_manager.execute_query(query, params)


def execute_update(query: str, params: tuple = None) -> bool:
    """执行更新语句"""
    return db_manager.execute_update(query, params)


def get_single_value(query: str, params: tuple = None) -> Any:
    """获取单个值"""
    return db_manager.get_single_value(query, params)


def table_exists(table_name: str) -> bool:
    """检查表是否存在"""
    return db_manager.table_exists(table_name)


# 使用示例
if __name__ == "__main__":
    # 配置日志
    logging.basicConfig(level=logging.INFO)
    
    # 获取数据库信息
    info = db_manager.get_database_info()
    logger.info(f"数据库信息: {info}")
    
    # 检查tags表是否存在
    if table_exists('tags'):
        logger.info("tags表存在")
        # 获取表结构
        table_info = db_manager.get_table_info('tags')
        logger.info(f"tags表结构: {table_info}")
    else:
        logger.info("tags表不存在")
    
    # 执行查询示例
    if table_exists('tags'):
        tags = execute_query("SELECT * FROM tags LIMIT 5")
        logger.info(f"标签数据: {tags}")
