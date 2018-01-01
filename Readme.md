# go-js
[![NPM version](https://img.shields.io/npm/v/go-js.svg?style=flat-square)](https://www.npmjs.com/package/go-js)
[![NPM Downloads](https://img.shields.io/npm/dm/go-js.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/go-js)

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

## Customized Loader

可以在当前工作目录下书写自己的 `gojs.jsloader.js`

```javascript
module.exports = [
    {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      include: [
        // root
      ],
      query: {
        cacheDirectory: true,
        presets: [
          require.resolve('babel-preset-es2015'),
          require.resolve('babel-preset-react'),
          require.resolve('babel-preset-stage-0')
        ],
        plugins: [
          require.resolve('babel-plugin-transform-decorators-legacy'),
        ]
      }
    },
]
```
## Todo

- [ ] 添加上对 TypeScript 的支持（CoffeeScript先放放）

## ChangeLog

- v1.2.4
    - 添加custom loader支持(gojs.jsloader.js)
- v1.3.0
    - 支持全局依赖的使用 (对用户不可见)