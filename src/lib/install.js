/**
 * @file   pre-install
 * @author yucong02
 */
const installer = require('./npm-install-webpack-plugin/src/installer')
const pkg = require('../../package.json')

module.exports = function (module, opts) {
    module = module.replace(/\/.*$/, '')
    let version = ''
    if (pkg.baseDependencies && pkg.baseDependencies[module]) {
        version = pkg.baseDependencies[module]
    } else if (pkg.dependencies && pkg.dependencies[module]) {
        version = pkg.dependencies[module]
    } else if (pkg.devDependencies && pkg.devDependencies[module]) {
        version = pkg.devDependencies[module]
    }

    if (installer.check(module) === undefined) {
        return false
    }

    if (version) {
        version = version.replace(/^\^/, '>=')
        if (version !== '*') {
            module = `${module}@${version}`
        }
    }

    installer.install(module, Object.assign({dev: true, extract: true}, opts))
}