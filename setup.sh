#!/usr/bin/env bash
#image_version=`date +%Y%m%d%H%M`;

# 关闭容器
 docker-compose stop pos-server || true;
# # 删除容器
 docker-compose down pos-server || true;
# 构建镜像
docker-compose build;
# 启动并后台运行
docker-compose up -d;
# # 对空间进行自动清理
# docker system prune -a -f
