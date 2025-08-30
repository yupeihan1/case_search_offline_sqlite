-- 标签表 DDL
-- 描述: 用于存储系统标签信息
CREATE TABLE
IF NOT EXISTS tags (
		-- 模块ID
		module_id VARCHAR (50) NOT NULL,
		-- 标签ID（在同一个module_id下自增）
		tag_id INTEGER NOT NULL,
		-- 标签名
		tag_name VARCHAR (100) NOT NULL,
		-- 显示顺序
		display_order INTEGER DEFAULT 0,
		-- 更新时间
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		-- 作成时间
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		-- 备注
		remarks TEXT,
		-- 主键约束（module_id + tag_id）
		PRIMARY KEY (module_id, tag_id)
	);