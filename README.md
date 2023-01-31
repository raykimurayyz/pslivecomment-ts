
# 目录

- [概要](#概要)
- [快速入门](#快速入门)
  - [下载依赖](#下载依赖)
  - [启动服务](#启动服务)
- [License](#license)

## 概要

本项目为PlayStation4/5主机直播时的BiliBili弹幕转发服务

## 快速入门

### 下载依赖

```shell
> npm install        
```

### 启动服务

```shell
> npm run start              
```

目录说明:

```text
├─ resource       // 资源文件
│  └─ application.properties // 配置信息
├─ src
│  ├─ room        // 房间实现类（目前只支持BiliBili）
│  ├─ tool        // 工具类集合
│  └─ main.ts     // 启动入口
```

## 关于Docker

### 创建容器

```bash
> docker build 
```

### 运行容器

```bash
> docker run
```

## 感谢

本项目是基于[Tilerphy/ps4broadcast](https://github.com/Tilerphy/ps4broadcast)项目，剥离其弹幕功能的ts重构

## License

- [MIT](LICENSE)
