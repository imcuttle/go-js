/**
 * Created by moyu on 2017/7/30.
 */

const webpack = require('webpack')
const _ = require('lodash')
const webpackHotM = require('webpack-hot-middleware')
const webpackDevM = require('webpack-dev-middleware')
const npmInstall = require('./npm-install-webpack-plugin')
const install = require('./install')
const pkg = require('../../package.json')
const ed = require('./encode-decode')
const HappyPack = require('happypack')
const happyThreadPool = new HappyPack.ThreadPool({size: 4})
const log = require('./log')

function setupWebpackMiddleware(app, entry, config) {
    // if (app.locals.num == null) {
    //     app.locals.num = -1
    // }
    // app.locals.num++

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
            dev: function(module, path) {
                log.info(`module: ${module}`)
                // log.info(`path: ${path}`)
                install(module, {dev: true})
                return 'skip';
            }
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

    const hmrPath = '/__webpack_hmr_' + (id++)
    config.entry = _.cloneDeep(entry)
    for (let name in config.entry) {
        if (config.entry.hasOwnProperty(name)) {
            config.entry[name] = config.entry[name].map(x => {
                if (x.trim().startsWith('webpack-hot-middleware')) {
                    if (x.indexOf('?') >=0) {
                        x += `&path=${hmrPath}`
                    } else {
                        x += `?path=${hmrPath}`
                    }
                }
                return x
            })
        }
    }

    const compiler = webpack(config)
    app.use(maybeNotBundle(entry, webpackDevM(compiler, {
        publicPath: config.output.publicPath,
        hot: true,
        quiet: !verbose,
        log: verbose && log.info
    })))

    app.use(webpackHotM(compiler, {
        log: verbose && log.info,
        path: hmrPath
    }))
}

let id = 0

function nextBetter(iid, fn) {
    return (req, res, next) => {
        if (iid === id) {
            fn(req, res, next)
        } else {
            next()
        }
    }
}

function maybeNotBundle(entry, fn) {
    entry = _.cloneDeep(entry)
    return (req, res, next) => {
        const path = req.path
        if (path.startsWith('/__gojs/bundle/') && path.endsWith('.bundle.js')) {
            const allEntry = req.app.locals.configAdaptor.getConfig().entry
            let name = path.replace(/^\/?__gojs\/bundle\//, '').replace(/\.bundle\.js$/, '')
            let encodeName = ed.encode(name)
            if (entry[encodeName] && allEntry[encodeName]) {
                fn(req, res, next)
            } else {
                next()
            }
        } else {
            fn(req, res, next)
        }
    }
}

module.exports = setupWebpackMiddleware