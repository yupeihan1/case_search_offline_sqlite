# 安管之窗 - 案件搜索系统

这是一个基于Django的案件搜索系统，支持离线部署和SQLite数据库。

## 功能特性

- **案件搜索**: 基于文本嵌入的智能文档搜索
- **部队问题管理**: 事件管理和跟踪
- **计划管理**: 计划制定和管理
- **全文检索**: 使用BGE中文嵌入模型进行语义搜索

## 技术栈

- **后端**: Django 4.2.7
- **数据库**: SQLite3
- **机器学习**: sentence-transformers, PyTorch
- **前端**: Bootstrap, ECharts
- **部署**: Docker, Gunicorn

## 快速开始

### 1. 环境要求

- Python 3.12+
- 虚拟环境

### 2. 安装依赖

```bash
# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt
```

### 3. 数据库初始化

```bash
# 创建数据库迁移
python manage.py makemigrations

# 应用迁移
python manage.py migrate
```

### 4. 启动服务器

```bash
# 开发环境
python manage.py runserver

# 生产环境
gunicorn case_search.wsgi:application --bind 0.0.0.0:8000
```

### 5. 访问应用

打开浏览器访问: http://localhost:8000

## 项目结构

```
case_search_offline_sqlite/
├── case_search/          # Django项目配置
├── cases/               # 主应用
│   ├── models.py        # 数据模型
│   ├── views.py         # 视图函数
│   ├── urls.py          # URL配置
│   ├── static/          # 静态文件
│   └── templates/       # 模板文件
├── requirements.txt     # Python依赖
├── Dockerfile          # Docker配置
└── manage.py           # Django管理脚本
```

## 主要功能模块

### 1. 导航页面 (`/`)
- 系统主入口
- 功能模块导航

### 2. 部队问题管理 (`/incident_management/`)
- 事件记录和管理
- 问题跟踪和解决

### 3. 计划管理 (`/plans_management/`)
- 计划制定
- 计划执行跟踪

### 4. 文档搜索 (`/document_search/`)
- 基于语义的文档搜索
- 支持多种文件格式
- 使用BGE中文嵌入模型

## 数据库配置

项目已配置为使用SQLite数据库，无需额外配置：

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

## Docker部署

### 构建镜像
```bash
docker build -t case-search .
```

### 运行容器
```bash
# 同时启动Django应用和SQLite Web管理界面
# Linux/macOS:
docker run -d \
  --name case-search-app \
  -p 8000:8000 \
  -p 8080:8080 \
  -v $(pwd)/db.sqlite3:/app/db.sqlite3 \
  -v $(pwd)/temp:/app/temp \
  -v $(pwd)/logs:/app/logs \
  case-search

# Windows PowerShell:
docker run -d `
  --name case-search-app `
  -p 8000:8000 `
  -p 8080:8080 `
  -v ${PWD}/db.sqlite3:/app/db.sqlite3 `
  -v ${PWD}/temp:/app/temp `
  -v ${PWD}/logs:/app/logs `
  case-search

# 或者使用相对路径（推荐）:
docker run -d \
  --name case-search-app \
  -p 8000:8000 \
  -p 8080:8080 \
  -v ./db.sqlite3:/app/db.sqlite3 \
  -v ./temp:/app/temp \
  -v ./logs:/app/logs \
  case-search
```

### 访问地址
- **Django应用**: http://localhost:8000
- **SQLite Web**: http://localhost:8080

### 数据挂载说明
- `./db.sqlite3` - SQLite数据库文件（持久化存储）
- `./temp/` - 临时文件目录（上传缓存、处理中间文件）
- `./logs/` - 日志文件目录（系统运行日志）

**注意**：用户上传的文档文件存储在MinIO对象存储中，不通过Docker卷挂载。

## 注意事项

1. 本系统为离线部署，所有模型文件需预先准备
2. 请确保模型文件已放置在正确位置（models/bge-small-zh-v1.5/）
3. 建议在生产环境中使用更强大的数据库（如PostgreSQL）

## 许可证

本项目仅供内部使用。
