# 基础镜像
FROM python:3.12-slim

# 1) 安装系统依赖
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    gcc \
 && rm -rf /var/lib/apt/lists/*

# 2) 工作目录
WORKDIR /app

# 3) 复制依赖清单并安装
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4) 拷贝项目源码
COPY . .

# 创建数据目录
RUN mkdir -p /app/data && chmod 755 /app/data

# 暴露端口
EXPOSE 8000 8080

# 创建启动脚本
COPY start-services.sh /app/start-services.sh
RUN chmod +x /app/start-services.sh

# 启动命令
CMD ["/app/start-services.sh"]
