/**
 * @file   build
 * @author yucong02
 */
const webpack = require('webpack')
const fs = require('fs-extra')
const oFs = require('fs')
const nps = require('path')


function build({config, src, dest, isBuf = true, compile = true}, cb) {
    if (!cb) cb = function () {}

    if (isBuf) {
        oFs.writeFileSync(dest, src)
    } else {
        fs.ensureDirSync(dest)
        if (oFs.statSync(src).isDirectory()) {
            fs.copySync(src, dest)
        } else {
            fs.copySync(src, nps.join(dest, nps.basename(src)))
        }
    }

    if (compile) {
        const compiler = webpack(config)
        compiler.run(cb)
    } else {
        cb()
    }
}

module.exports = build