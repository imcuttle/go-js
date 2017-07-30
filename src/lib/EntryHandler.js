/**
 * Created by moyu on 2017/7/30.
 */
const nps = require('path')
const fsExtra = require('fs-extra')
const fs = require('fs')
const _ = require('lodash')

const tpl = _.template(fs.readFileSync(nps.join(__dirname, '../template/entry.js')).toString())

function EntryHandler(root) {
    this._dir = nps.join(root, '.entry')
    this._tpl = tpl
}
EntryHandler.prototype.push = function (name, path) {
    const file = nps.join(this._dir, name)
    if (fs.existsSync(file)) {
        return file
    }
    fs.writeFileSync(file, this._tpl({path}))
    return file
}

EntryHandler.prototype.init = function () {
    if (!fs.existsSync(this._dir)) {
        fsExtra.mkdirSync(this._dir)
    }
    return this
}

EntryHandler.prototype.exit = function () {
    fsExtra.removeSync(this._dir)
    return this;
}

module.exports = EntryHandler