/**
 * Created by moyu on 2017/7/30.
 */
const nps = require('path')
const _ = require('lodash')
const fs = require('fs')
const cheerio = require('cheerio')

const setupWebpackMiddleware = require('../setup-webpack-middleware')
const encodeSep = require('../encode-decode').encode

const tplStr = fs.readFileSync(nps.join(__dirname, '../../template/tpl.html')).toString()
const renderTpl = _.template(tplStr)

module.exports = function (req, res, next) {
    const path = nps.join(req.app.locals.opts.path, req.path)
    if (/^\/(__gojs\/)|(.entry)/.test(req.path)) {
        next()
        return
    }
    if (fs.existsSync(path)) {
        let entryHandler = req.app.locals.entryHandler
        let configAdaptor = req.app.locals.configAdaptor
        res.contentType('html')
        let name = req.path.replace(/^\//g, '')
        let encodeName = encodeSep(name)

        function addEntry(entryPath) {
            let singleEntry = null
            if (singleEntry = configAdaptor.addEntry(encodeName, entryPath)) {
                setupWebpackMiddleware(req.app, {[encodeName]: singleEntry}, configAdaptor.getConfig())
            }
        }

        const patternHtmlPath = path.replace(/\.[^\.]*$/, '.html')
        if (fs.existsSync(patternHtmlPath)) {
            addEntry(entryHandler.push(encodeName, '../' + name, ['../' + name.replace(/\.[^\.]*$/, '.html')]))
            fs.readFile(patternHtmlPath, 'utf-8', (err, data) => {
                if (err) next(err)
                else {
                    let $ = cheerio.load(data, {decodeEntities: false})
                    $('body').append(`<script src="/__gojs/bundle/${encodeName}.bundle.js"></script>`)
                    res.send($.html())
                }
            })
        } else {
            addEntry(entryHandler.push(encodeName, '../' + name))
            res.send(renderTpl({
                name,
                encodeName
            }))
        }
    } else {
        const err = new Error(`File not found: ${path}`)
        err.code = 'ENOENT'
        next(err)
    }
}