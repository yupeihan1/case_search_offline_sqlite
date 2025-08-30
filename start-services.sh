#!/bin/bash

# 同时启动Django应用和SQLite Web

echo "初始化数据库..."
python manage.py migrate --run-syncdb

echo "Starting Django application..."
python manage.py runserver 0.0.0.0:8000 &

echo "Starting SQLite Web..."
sqlite_web --host 0.0.0.0 --port 8080 db.sqlite3 &

echo "Services started:"
echo "- Django: http://localhost:8000"
echo "- SQLite Web: http://localhost:8080"

# 等待所有后台进程
wait
