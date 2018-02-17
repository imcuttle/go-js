/**
 * @file: setUpFallback
 * @author: Cuttle Cong
 * @date: 2018/2/17
 * @description: 
 */
const forwardRequest = require('./forward')
const nUrl = require('url')

module.exports = function (app, fallbackConfig = {}, host = '/') {
  Object.keys(fallbackConfig)
    .forEach(from => {
      const to = fallbackConfig[from]
      app.all(from, (req, res, next) => {
        forwardRequest(req, res, nUrl.resolve(host, to), { redirect: false })
          .catch(next)
      })
    })
}