/**
 * Created by moyu on 2017/7/30.
 */
const nps = require('path')
const _ = require('lodash')
const EventEmitter = require('events').EventEmitter
const inherits = require('util').inherits
const encodeSep = require('./encode-decode').encode
const getPlugins = require('./get-webpack-plugins')



function getConfig(root, type, dev) {
    if (typeof dev === 'undefined') dev = true
    let loaders = null
    if (!type || type ===  'js') {
        loaders = require('./loaders/js-loader')
    }

    loaders = loaders.map(loader => {
        loader.include = loader.include || []
        loader.include.push(root)
        return loader
    })
    return {
        devtool: dev ? 'source-map' : null,
        context: root,
        entry: {},
        output: {
            publicPath: '/__gojs/bundle/',
            path: nps.join(root, '/.dist/'),

            filename: '[name].bundle.js',
            chunkFilename: '[name].[chunkhash].bundle.js',
        },
        module: {
            loaders: loaders
        },

        resolve: {
            // root: nps.join(__dirname, '../../'),
            // fallback: nps.join(__dirname, '../../node_modules'),
        },

        resolveLoader: {
            // modulesDirectories: [
            //     nps.join(__dirname, '../../node_modules')
            // ],
            // root: nps.join(__dirname, '../../node_modules'),
            // fallback: nps.join(__dirname, '../../node_modules'),
        },

        plugins: getPlugins({dev: dev}),
    }
}

function clearEntry() {
    this.config.entry = {}
    return this
}

function addEntry(key, abPath) {
    let encodeName = encodeSep(key)
    if (!this.config.entry[encodeName]) {
        abPath = abPath || nps.join(this.root, key)
        const entry = fillEntry(abPath, !this.dev)
        this.config.entry[encodeName] = entry
        this.emit('addEntry', {
            [encodeName]: entry
        })
        return entry.slice()
    }
    return false
}

function rmEntry(key) {
    let encodeName = encodeSep(key)
    if (this.config.entry[encodeName]) {
        delete this.config.entry[encodeName]
        return true
    }
    return false
}

function fillEntry(absolute, prod) {
    if (prod) {
        return [
            'babel-polyfill',
            // 'react-hot-loader/patch',
            absolute
        ]
    }

    return [
        'babel-polyfill',
        // 'react-hot-loader/patch',
        'webpack-hot-middleware/client?reload=true',
        absolute
    ]
}

function ConfigAdaptor(root, type, isDev) {
    if (typeof isDev === 'undefined') isDev = true
    this.dev = isDev
    this.config = getConfig(root, type, isDev)
    this.root = root
}

ConfigAdaptor.prototype.clearEntry = clearEntry
ConfigAdaptor.prototype.addEntry = addEntry
ConfigAdaptor.prototype.rmEntry = rmEntry
ConfigAdaptor.prototype.getConfig = function () {
    return this.config
}
ConfigAdaptor.fillEntry = fillEntry

inherits(ConfigAdaptor, EventEmitter)

module.exports = ConfigAdaptor