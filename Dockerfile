# 安装完整依赖并构建产物
FROM node:14 AS build
WORKDIR /app
COPY package.json start.js  /app/
WORKDIR /app/modules
COPY modules/_realroll.js modules/room_bilibili.js /app/modules
RUN npm install

FROM gcr.io/distroless/nodejs
COPY --from=build /app /
EXPOSE 6667

CMD [ "start.js" ]
