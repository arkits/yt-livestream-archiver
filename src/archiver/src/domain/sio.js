var config = require('config');
var sio = require('socket.io-client');
var logger = require('log4js').getLogger('main');
var youtubeNotificationHandler = require('./youtubeNotificationHandler');

let sioClient = null;

function createSioClient() {
    let baseUrl = config.get('notification-server.baseUrl');
    let path = config.get('notification-server.endpoint');

    logger.debug('[sio] starting sioClient - baseUrl=%s path=%s', baseUrl, path);

    sioClient = sio(baseUrl, {
        path: path
    });

    registerSioEventHandlers();
}

function registerSioEventHandlers() {
    logger.debug('[sio] registering event handlers...');
    sioClient.on('connect', function () {
        logger.info('[sio] Connected to NS');
    });

    sioClient.on('disconnect', function () {
        logger.info('[sio] Disconnected from NS');
    });

    sioClient.on('yt-notification', function (data) {
        youtubeNotificationHandler.handle(data);
    });
}

module.exports = {
    createSioClient
};
