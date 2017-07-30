/**
 * Created by moyu on 2017/7/30.
 */
const nps = require('path')
const _ = require('lodash')
const fs = require('fs')

const setupWebpackMiddleware = require('../setup-webpack-middleware')
const encodeSep = require('../encode-decode').encode

const tplStr = fs.readFileSync(nps.join(__dirname, '../../template/tpl.html')).toString()
const renderTpl = _.template(tplStr)

module.exports = function (req, res, next) {
    const path = nps.join(req.app.locals.opts.path, req.path)
    if (/^\/(__flyjs\/)|(.entry)/.test(req.path)) {
        next()
        return
    }
    if (fs.existsSync(path)) {
        let entryHandler = req.app.locals.entryHandler
        let configAdaptor = req.app.locals.configAdaptor
        res.contentType('html')
        let name = req.path.replace(/^\//g, '')
        let encodeName = encodeSep(name)

        const entryPath = entryHandler.push(encodeName, path)
        if (configAdaptor.addEntry(encodeName, entryPath)) {
            setupWebpackMiddleware(req.app, configAdaptor.getConfig())
        }

        res.send(renderTpl({
            name,
            encodeName
        }))
    } else {
        next(new Error(`File not found: ${path}`))
    }
}