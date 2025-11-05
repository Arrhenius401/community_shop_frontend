# 第一步：编译前端静态文件（使用Node镜像）
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json和依赖锁文件，安装依赖（优先用缓存）
COPY package.json package-lock.json ./
RUN npm install --registry=https://registry.npm.taobao.org  # 国内源加速

# 复制所有源代码，编译生成静态文件
COPY . .
RUN npm run build  # 执行打包命令（生成dist目录）

# 第二步：使用Nginx托管静态文件（轻量Nginx镜像）
FROM nginx:alpine

# 从builder阶段复制编译好的dist目录到Nginx容器
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义的nginx.conf到Nginx配置目录（覆盖默认配置）
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露80端口（与nginx.conf中listen端口一致）
EXPOSE 80

# 启动Nginx（前台运行，确保容器不退出）
CMD ["nginx", "-g", "daemon off;"]