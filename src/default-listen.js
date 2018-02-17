/**
 * Created by moyu on 2017/7/30.
 */
const log = require('./lib/log')

module.exports = function (gojs) {
    gojs.on('error', error => {
        error.type = 'go-js'
        log.error(error)
    })

    gojs.on('server', port => {
        // console.log(`Server run on http://localhost:${port}`)
        !gojs.opts.silent && log.info({
            url: `http://localhost:${port}`,
            message: `go-js is listening on`
        })
    })

    gojs.on('request', (req, res, start) => {
        if (req.url.startsWith('/__gojs')) return
        if (req.path === '/favicon.ico' /*&& res.statusCode === 404*/) return // don't log favicon.ico 404s

        !gojs.opts.silent && log.info({
            elapsed: Date.now() - start,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            type: 'request',
        })
    })

    gojs.on('addEntry', entry => {
        !gojs.opts.silent && log.info({
            type: 'entry',
            message: `addEntry: \n${JSON.stringify(entry, null, 2)}`
        })
    })

    gojs.on('rmEntry', entry => {
        !gojs.opts.silent && log.info({
            type: 'entry',
            message: `rmEntry: ${entry}`
        })
    })

    gojs.on('watch', (type, filePath) => {
        !gojs.opts.silent && log.info({
            type: 'watch',
            message: `${filePath} has been changed (${type})`
        })
    })
}