/**
 * @file   get-webpack-plugins
 * @author yucong02
 */
const webpack = require('webpack')
const HappyPack = require('happypack')
const happyThreadPool = new HappyPack.ThreadPool({size: 4})
const npmInstall = require('./npm-install-webpack-plugin')
const install = require('./install')
const pkg = require('../../package.json')
const log = require('./log')

module.exports = function (obj = {}) {
    let dev = obj.dev == null ? true : obj.dev

    let plugins = [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': dev ? '"development"' : '"production"',
            '__PRODUCTION__': !dev,
            '__DEVELOPMENT__': dev,
            '__DEVTOOLS__': dev
        }),
        new HappyPack({
            id: 'js',
            threadPool: happyThreadPool,
            verbose: false
        }),
        new HappyPack({
            id: 'less',
            threadPool: happyThreadPool,
            verbose: false
        }),
        new HappyPack({
            id: 'css',
            threadPool: happyThreadPool,
            verbose: false
        }),
    ]

    if (dev) {
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new npmInstall({
                dev: function(module, path) {
                    log.info(`module: ${module}`)
                    // log.info(`path: ${path}`)
                    install(module, {dev: false})
                    return 'skip';
                }
            })
        )
    } else {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                output: {comments: false},
                compress: {
                    warnings: false
                }
            })
        )
    }

    return plugins
}