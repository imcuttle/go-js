/**
 * Created by moyu on 2017/7/30.
 */
const nps = require('path')
const fs = require('fs')
const _ = require('lodash')

const errorStr = fs.readFileSync(nps.join(__dirname, '../template/error.html')).toString()
const renderError = _.template(errorStr)

module.exports = (err, req, res, next) => {
    const path = req.path.replace(/^\/+/, '')

    const locals = req.app.locals
    locals.gojs.emit('error', err)

    let status = 500
    let message = err.message

    if (err.code === 'ENOENT') {
        let pathType = (nps.extname(err.path) !== '' ? 'file' : 'folder')
        status = 404
        message = `The ${pathType} ${path} was not found. Maybe you didn't create it yet?`
    }

    if (err.code === 'ENOINDEX') {
        status = 404
        message = `The folder ${path} doesn't have an index file. Try creating an index.js file in this folder.`
    }

    let template = renderError({
        status: status,
        message: message
    })

    res.contentType('html')
    return res.status(status).send(template)
}