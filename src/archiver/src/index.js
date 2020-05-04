var log4js = require('./domain/logger');
var logger = log4js.getLogger('main');
var { createSioClient } = require('./domain/sio');

(() => {
    logger.info('Starting archiver...');
    createSioClient();
})();
