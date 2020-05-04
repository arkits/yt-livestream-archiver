var log4js = require('log4js');

log4js.configure({
    appenders: {
        toFile: { type: 'file', filename: 'logs/archiver.log' },
        stdOut: { type: 'stdout' }
    },
    categories: {
        default: {
            appenders: ['toFile', 'stdOut'],
            level: 'debug',
            enableCallStack: true
        }
    }
});

module.exports = log4js;
