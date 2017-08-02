/**
 * @file   pre-install
 * @author yucong02
 */
const install = require('./install')
const installer = require('./npm-install-webpack-plugin/src/installer')

const dep = {
    'js': [
        // 'babel-core', 'babel-plugin-transform-decorators-legacy',
        // 'babel-preset-es2015', 'babel-preset-react', 'babel-preset-stage-0',
        // 'less', 'autoprefixer'
    ]
}

module.exports = function (type, use) {
    installer.checkPackage()
    dep[type].forEach(module => install(module))
}