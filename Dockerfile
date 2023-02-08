# 安装完整依赖并构建产物
FROM node:18 AS build-nodejs
WORKDIR /app
COPY package.json tsconfig.json webpack.config.js /app/
COPY src /app/src
# 编译打包项目
RUN npm install && npm run build:pack

# 精简内容
FROM gcr.io/distroless/nodejs18
COPY --from=build-nodejs /app/dist /dist
COPY resource /resource
EXPOSE 6667

CMD [ "/dist/bundle.js" ]
