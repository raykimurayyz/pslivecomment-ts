# 安装完整依赖并构建产物
FROM node:14 AS build
WORKDIR /app
COPY package.json tsconfig.json webpack.config.js /app/
COPY src /app/src
RUN npm install

# 编译打包项目
RUN npm run build:pack

# 精简内容
FROM gcr.io/distroless/nodejs
COPY --from=build /app /
EXPOSE 6667

CMD [ "start.js" ]
