/**
 * @file: setUpFallback
 * @author: Cuttle Cong
 * @date: 2018/2/17
 * @description: 
 */
const express = require('express')
const nUrl = require('url')
const nps = require('path')
const fs = require('fs')
const forwardRequest = require('./forward')

module.exports = function (app, fallbackConfig = {}, { host = '/', path }) {
  Object.keys(fallbackConfig)
    .forEach(from => {
      const to = fallbackConfig[from]
      let handler = to
      if (typeof to === 'string') {
        const resolvedPath = nps.resolve(path, to)
        if (fs.existsSync(resolvedPath)) {
          handler = express.static(resolvedPath)
        }
        else {
          handler = (req, res, next) => {
            forwardRequest(req, res, nUrl.resolve(host, to), { redirect: false })
              .catch(next)
          }
        }
      }
      app.use(from, handler)
    })
}