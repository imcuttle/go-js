#!/usr/bin/env node

let argv = require('minimist')(process.argv.slice(2));
const log = require('../dist/lib/log')
const nps = require('path')

const opts = {
    verbose: !!argv.v || !!argv.verbose,
    help: !!argv.h || !!argv.help,
    version: !!argv.version,
    openSync: !argv.noopen,
    silent: !!argv.silent || !!argv.s,
    port: argv.port || argv.p,
    path: argv._.length > 0 ? argv._[0] : process.cwd(),
    type: argv.type || argv.t || 'js',
    build: argv.build || argv.b,
    buildCopyPath: argv.buildcopy,
    initPath: argv.i || argv.init
}

opts.path = nps.resolve(opts.path)


if (opts.help) {
    console.log(`Usage: gojs [path] --options`);
    console.log('');
    console.log('Options:');
    console.log('');
    console.log('  --version                   get current version');
    console.log('  -h --help                   how to use it');
    console.log('  -v --verbose                verbose talk');
    console.log('  -s --silent                 silent');
    console.log('  --noopen                    disable open browser synchronously');
    console.log('  -p --port                   set server port');
    console.log('  -t --type                   set type (only support `js` now, and will add `ts/coffee` in the future)');
    console.log('  -b --build                  set entry for build.');
    console.log('  --buildcopy                 set copy file or directory for build.');
    console.log('  -i --init [path]            open path automatically when server start. (not work when `--noopen`)');
    console.log('');
    process.exit(0)
}

if (opts.version) {
    console.log(require('../package.json').version)
    process.exit(0)
}


if (opts.build) {
    const template = require('lodash').template
    const readFileSync = require('fs').readFileSync
    const fsExtra = require('fs-extra')
    const getPlugins = require('../dist/lib/get-webpack-plugins')
    const defaultTemplatePath = nps.join(__dirname, '../dist/template/build.html')
    const build = require('../dist/build')
    const ed = require('../dist/lib/encode-decode')
    const ConfigAdaptor = require('../dist/lib/ConfigAdaptor')
    const dest = nps.join(opts.path, '.dist')
    const adaptor = new ConfigAdaptor(opts.path, opts.type, false)
    adaptor.addEntry(opts.build)
    const config = adaptor.getConfig()
    const callback = function (err, stats) {
        if (err) {
            throw err
        } else {
            log.info(`Build Done in ${dest}`)
        }
    }

    config.plugins = getPlugins({dev: false, config})
    config.output.path = dest
    // config.context = dest
    config.module.loaders = config.module.loaders.map(loader => {
        // delete loader.include// = opts.path
        return loader
    })

    fsExtra.emptyDirSync(dest)
    // console.log(JSON.stringify(config, null, 2))

    if (!opts.buildCopyPath) {
        build({
            compile: true,
            isBuf: true,
            config: config,
            src: template(readFileSync(defaultTemplatePath).toString())({
                encodeName: ed.encode(opts.build),
                name: opts.build
            }),
            dest: nps.join(dest, 'index.html')
        }, callback)
    } else {
        build({
            compile: true,
            isBuf: false,
            config: config,
            src: opts.buildCopyPath,
            dest: dest,
        }, callback)
    }

} else {
    const GoJS = require('../dist')
    const listen = require('../dist/default-listen')
    const gojs = new GoJS(opts)
    listen(gojs)

    gojs.start((err, port) => {
        log.info(`current work directory ${gojs.opts.path}`)
    })

    process.on('SIGINT', () => {
        // console.log('Received SIGINT.  Press Control-D to exit.');
        gojs.stop()
        process.exit()
    })

}