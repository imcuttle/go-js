/**
 * Created by moyu on 2017/7/31.
 */

const bole = require('bole')
const log = bole('go-js')
const garnish = require('garnish')
let logger = garnish({
  level: 'info',
  name: 'go-js'
})
logger.pipe(process.stdout)
bole.output({
  level: 'info',
  stream: logger
})

module.exports = log