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
    let config = 'config' in obj ? obj.config : null

    let plugins = []
    if (dev) {
        plugins = [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': dev ? '"development"' : '"production"',
                '__PRODUCTION__': !dev,
                '__DEVELOPMENT__': dev,
                '__DEVTOOLS__': dev
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new npmInstall({
                dev: function(module, path) {
                    log.info(`module: ${module}`)
                    // log.info(`path: ${path}`)
                    install(module, {dev: true})
                    return 'skip';
                }
            }),

        ]
    } else {
        plugins = [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': dev ? '"development"' : '"production"',
                '__PRODUCTION__': !dev,
                '__DEVELOPMENT__': dev,
                '__DEVTOOLS__': dev
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                output: {comments: false},
                compress: {
                    warnings: false
                }
            }),
            new npmInstall({
                dev: function(module, path) {
                    log.info(`module: ${module}`)
                    // log.info(`path: ${path}`)
                    install(module, {dev: false})
                    return 'skip';
                }
            }),

        ]
    }

    if (config && config.module && config.module.loaders) {
        let loaders = config.module.loaders
        let happyIds = loaders.filter(x => !!x.happy && !!x.happy.id).map(x => x.happy.id)
        // console.log('happyIds', happyIds)
        happyIds.forEach(function (id) {
            plugins = plugins.concat(
                new HappyPack({
                    id: id,
                    threadPool: happyThreadPool,
                    verbose: false
                })
            )
        })
    }

    return plugins
}