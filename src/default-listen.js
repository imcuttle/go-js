/**
 * Created by moyu on 2017/7/30.
 */
const log = require('./lib/log')

module.exports = function (gojs) {
    gojs.on('error', error => {
        error.type = 'go-js'
        log.error(error.message)
    })

    gojs.on('server', port => {
        // console.log(`Server run on http://localhost:${port}`)
        log.info({
            url: `http://localhost:${port}`,
            message: `go-js is listening on`
        })
    })

    gojs.on('request', (req, res, start) => {
        if (req.url.startsWith('/__gojs')) return
        if (req.path === '/favicon.ico' /*&& res.statusCode === 404*/) return // don't log favicon.ico 404s

        log.info({
            elapsed: Date.now() - start,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            type: 'request',
        })
    })

    gojs.on('addEntry', entry => {
        log.info({
            type: 'entry',
            message: `addEntry: \n${JSON.stringify(entry, null, 2)}`
        })
    })

    gojs.on('rmEntry', entry => {
        log.info({
            type: 'entry',
            message: `rmEntry: ${entry}`
        })
    })

    gojs.on('watch', (type, filePath) => {
        log.info({
            type: 'watch',
            message: `${filePath} has been changed (${type})`
        })
    })
}