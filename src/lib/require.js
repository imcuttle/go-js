/**
 * @file: require
 * @author: Cuttle Cong
 * @date: 2017/12/29
 * @description: 
 */

const Module = require('module')
const resolve = require('resolve')
const nps = require('path')
const _resolveFilename = Module._resolveFilename

module.exports = {
  over(paths) {
    if (_resolveFilename !== Module._resolveFilename) {
      return
    }

    paths = paths || [process.cwd()]
    paths.push(nps.join(__dirname, '../..'))
    Module._resolveFilename = function (request, parent, isMain, options) {
      if (resolve.isCore(request)) {
        return _resolveFilename.apply(this, arguments)
      }
      const dirname = nps.dirname(parent.filename)
      try {
        return resolve.sync(request, { basedir: dirname })
      } catch (ex) {
        let path;
        let isFound = paths.some(function (dirname) {
          try {
            path = resolve.sync(request, { basedir: dirname })
            return true
          } catch (ex) {

          }
        })
        if (isFound) {
          return path
        }
        return _resolveFilename.apply(this, arguments)
      }
    }
  },
  unover() {
    Module._resolveFilename = _resolveFilename
  }
}