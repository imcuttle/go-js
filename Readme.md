# go-js

**Setup frontend webpack server quickly**

## Video
https://www.youtube.com/embed/VDfcNhSxbQY

## What is it?

以 commonjs 为标准的，快捷地前端代码执行环境（基于webpack）

## Concept

1. one javascript file is one entry. (一个 JavaScript 文件即是一个入口)


## Feature

1. Download Dependencies Automatically. (自动下载依赖)
2. HMR works (HMR 自动生效，无需自行配置)
3. Dynamic Entry. (动态入口)
4. 为了有效地 cache bundle file，为 Dynamic Entry 提供更好的体验。颗粒化对 WebpackDevMiddleware/WebpackHotMiddleware 的过滤处理


## How to use

```bash
npm install -g go-js
gojs -h
```


## Todo

-[ ] 添加上对 TypeScript 的支持（CoffeeScript先放放）

