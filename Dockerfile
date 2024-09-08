# 阶段一：构建和安装依赖
FROM node:18-alpine AS build-nodejs
WORKDIR /app
COPY package.json tsconfig.json webpack.config.js /app/
COPY src /app/src
RUN npm install && npm run build:pack && npm cache clean --force

# # 精简内容
FROM node:18-alpine AS run-nodejs
COPY --from=build-nodejs /app/dist /dist
COPY resource /resource
EXPOSE 6667
CMD [ "node", "/app/bundle.js" ]

# docker build -t ps-live-comment-1 .