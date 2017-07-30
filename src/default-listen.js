/**
 * Created by moyu on 2017/7/30.
 */
const log = require('./lib/log')

module.exports = function (flyjs) {
    flyjs.on('error', error => {
        error.type = 'fly-js'
        log.error(error)
    })

    flyjs.on('server', port => {
        // console.log(`Server run on http://localhost:${port}`)
        log.info({
            url: `http://localhost:${port}`,
            message: `run-js is listening on`
        })
    })

    flyjs.on('request', (req, res, start) => {
        if (req.url.startsWith('/__flyjs')) return
        if (req.url === 'favicon.ico' /*&& res.statusCode === 404*/) return // don't log favicon.ico 404s

        log.info({
            elapsed: Date.now() - start,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode
        })
    })

    flyjs.on('addEntry', entry => {
        log.info({
            type: 'addEntry',
            message: `addEntry: \n${JSON.stringify(entry, null, 2)}`
        })
    })
}