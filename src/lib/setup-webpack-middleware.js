/**
 * Created by moyu on 2017/7/30.
 */

const webpack = require('webpack')
const _ = require('lodash')
const webpackHotM = require('webpack-hot-middleware')
const webpackDevM = require('webpack-dev-middleware')

const ed = require('./encode-decode')
const log = require('./log')
const getPlugins = require('./get-webpack-plugins')

function setupWebpackMiddleware(app, entry, config) {
    // if (app.locals.num == null) {
    //     app.locals.num = -1
    // }
    // app.locals.num++

    const verbose = !!app.locals.opts.verbose

    config = _.cloneDeep(config)

    config.plugins = getPlugins({dev: true, config})

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
        noInfo: !verbose,
        stats: {
            chunks: false,
            hash: false,
            colors: {level: 2, hasBasic: true, has256: true, has16m: false}
        },
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
    // entry = _.cloneDeep(entry)

    // entry is unique，don't need to filter request by self
    return fn
    /*return (req, res, next) => {
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
    }*/
}

module.exports = setupWebpackMiddleware