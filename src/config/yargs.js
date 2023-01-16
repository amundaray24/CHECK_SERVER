const argv = require('yargs')
  .option('a', {
    alias: 'action',
    type: 'string',
    demandOption: true,
    describe: 'OPEN/CLOSE'
  })
  .option('f', {
    alias: 'flexy',
    type: 'boolean',
    demandOption: true,
    describe: 'true flexy working'
  })
  .check((argv,options) => {
    if (argv.a !== 'OPEN' && argv.a !== 'CLOSE' ) throw 'The action argument must be OPEN or CLOSE';
    return true;
  })
  .argv;

module.exports = argv;