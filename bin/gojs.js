#!/usr/bin/env node

let argv = require('minimist')(process.argv.slice(2));

const opts = {
    verbose: !!argv.v || !!argv.verbose,
    help: !!argv.h || !!argv.help,
    version: !!argv.version,
    openSync: !argv.noopen,
    port: argv.port || argv.p,
    path: argv._.length > 0 ? argv._[0] : process.cwd(),
    type: argv.type || argv.t || 'js'
}



if (opts.help) {
    console.log(`Usage: gojs [path] --options`);
    console.log('');
    console.log('Options:');
    console.log('');
    console.log('  --version                   get current version');
    console.log('  -h --help                   how to use it');
    console.log('  -v --verbose                verbose talk');
    console.log('  --noopen                    disable open browser synchronously');
    console.log('  -p --port                   set server port');
    console.log('  -t --type                   set type (only support `js` now, and will add `ts/coffee` in the future)');
    console.log('');
    process.exit(0)
}

if (opts.version) {
    console.log(require('../package.json').version)
    process.exit(0)
}

const GoJS = require('../src')
const listen = require('../src/default-listen')
const log = require('../src/lib/log')
const gojs = new GoJS(opts)
listen(gojs)

gojs.start((err, port) => {
    log.info(`current work directory ${gojs.opts.path}`)
})

process.on('SIGINT', () => {
    // console.log('Received SIGINT.  Press Control-D to exit.');
    gojs.stop()
    process.exit()
});

