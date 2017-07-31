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
        log.info({
            url: `http://localhost:${port}`,
            message: `run-js is listening on`
        })
    })

    gojs.on('request', (req, res, start) => {
        if (req.url.startsWith('/__gojs')) return
        if (req.url === 'favicon.ico' /*&& res.statusCode === 404*/) return // don't log favicon.ico 404s

        log.info({
            elapsed: Date.now() - start,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode
        })
    })

    gojs.on('addEntry', entry => {
        log.info({
            type: 'addEntry',
            message: `addEntry: \n${JSON.stringify(entry, null, 2)}`
        })
    })
}