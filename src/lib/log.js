/**
 * Created by moyu on 2017/7/31.
 */

const bole = require('bole')
const log = bole('fly-js')
const garnish = require('garnish')
let logger = garnish({
    level: 'info',
    name: 'fly-js'
})
logger.pipe(process.stdout)
bole.output({
    level: 'info',
    stream: logger
})

module.exports = log