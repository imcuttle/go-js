/**
 * Created by moyu on 2017/7/30.
 */

const webpack = require('webpack')
const _ = require('lodash')
const webpackHotM = require('webpack-hot-middleware')
const webpackDevM = require('webpack-dev-middleware')
const npmInstall = require('npm-install-webpack-plugin')
const HappyPack = require('happypack')
const happyThreadPool = new HappyPack.ThreadPool({size: 4})
const log = require('./log')

function setupWebpackMiddleware(app, config) {
    if (app.locals.num == null) {
        app.locals.num = -1
    }
    app.locals.num++
    const verbose = !!app.locals.opts.verbose

    config = _.cloneDeep(config)

    config.plugins = ([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"',
            '__PRODUCTION__': false,
            '__DEVELOPMENT__': true,
            '__DEVTOOLS__': true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new npmInstall({
        }),
        new HappyPack({
            id: 'js',
            threadPool: happyThreadPool,
            verbose
        }),
        new HappyPack({
            id: 'less',
            threadPool: happyThreadPool,
            verbose
        }),
        new HappyPack({
            id: 'css',
            threadPool: happyThreadPool,
            verbose
        }),
    ])

    const compiler = webpack(config)
    app.use(maybeNot(app.locals.num, webpackDevM(compiler, {
        publicPath: config.output.publicPath,
        hot: true,
        quiet: !verbose,
        log: verbose && console.log
    })))
    app.use(maybeNot(app.locals.num, webpackHotM(compiler, {
        reload: true,
        log: verbose && console.log
        // path: '/'
    })))
}

function maybeNot(num, fn) {
    return (req, res, next) => {
        if (req.app.locals.num === num) {
            fn(req, res, next)
        } else {
            next()
        }
    }
}

module.exports = setupWebpackMiddleware