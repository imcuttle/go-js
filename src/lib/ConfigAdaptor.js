/**
 * Created by moyu on 2017/7/30.
 */
const nps = require('path')
const _ = require('lodash')
const EventEmitter = require('events').EventEmitter
const inherits = require('util').inherits
const encodeSep = require('./encode-decode').encode



function getConfig(root, type) {
    let loaders = null
    if (!type || type ===  'js') {
        loaders = require('./loaders/js-loader')
    }

    loaders = loaders.map(loader => {
        loader.include = loader.include || []
        loader.include.push(root)
        return loader
    })
    console.log(nps.join(__dirname, '../../'))
    return {
        devtool: 'source-map',
        context: nps.join(__dirname, '../../'),//root,
        entry: {},
        output: {
            publicPath: '/__flyjs/bundle/',
            path: nps.join(root, '/.dist/'),

            filename: '[name].bundle.js',
            chunkFilename: '[name].[chunkhash].bundle.js',
        },
        module: {
            loaders: loaders
        },

        plugins: [],
    }
}

function addEntry(key, abPath) {
    let encodeName = encodeSep(key)
    if (!this.config.entry[encodeName]) {
        abPath = abPath || nps.join(this.root, key)
        const entry = fillEntry(abPath)
        this.config.entry[encodeName] = entry
        this.emit('addEntry', {
            [encodeName]: entry
        })
        return encodeName
    }
    return false
}

function fillEntry(absolute) {
    return [
        'babel-polyfill',
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?reload=true',
        absolute
    ]
}

function ConfigAdaptor(root, type) {
    this.config = getConfig(root, type)
    this.root = root
}

ConfigAdaptor.prototype.addEntry = addEntry
ConfigAdaptor.prototype.getConfig = function () {
    return this.config
}
ConfigAdaptor.fillEntry = fillEntry

inherits(ConfigAdaptor, EventEmitter)

module.exports = ConfigAdaptor