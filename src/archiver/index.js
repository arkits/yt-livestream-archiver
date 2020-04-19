const fs = require('fs');
const log4js = require('log4js');
const sio = require('socket.io-client');

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

const logger = log4js.getLogger();
let config = JSON.parse(fs.readFileSync('config.json'));

let sioClient = sio(config['notification-server']['baseUrl'], {
    path: config['notification-server']['endpoint']
});

sioClient.on('connect', function () {
    logger.info('[sio] Connected to NS');
});

sioClient.on('disconnect', function () {
    logger.info('[sio] Disconnected from NS');
});

sioClient.on('yt-notification', function (data) {
    logger.info('[sio] yt-notification - ', data);
});
