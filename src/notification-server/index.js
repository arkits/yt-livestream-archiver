const pubSubHubbub = require('pubsubhubbub');
const fs = require('fs');
const log4js = require('log4js');

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Configure logging to stdout and file
log4js.configure({
    appenders: {
        toFile: { type: 'file', filename: 'logs/ns.log' },
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

// Get a logger
const logger = log4js.getLogger();

// Read config file
let config = JSON.parse(fs.readFileSync('config.json'));

// Setup PSHB variables
let callbackUrl = config['callbackUrl'] + config['pshbPath'];
let topic = config['targetChannel'];
let hub = config['pshbUrl'];

// Create PSHB subscriber
let pubsub = pubSubHubbub.createServer({
    callbackUrl: callbackUrl
});

// Use PSHB subscriber as middleware
app.use(config['pshbPath'], pubsub.listener());

// Setup express routing
app.get('/', (req, res) => {
    res.json({
        name: 'arkits/notification-server'
    });
});

// Setup SIO client handling
io.on('connection', (socket) => {
    logger.info('[sio] New Client - ', socket.id);

    socket.on('disconnect', () => {
        logger.info('[sio] Client Disconnected - ', socket.id);
    });
});

// Start the HTTP server
http.listen(config.runOnPort, () => {
    logger.info('Started notification-server on %s 🙏', config.runOnPort);
    logger.debug('Using config -', JSON.stringify(config, null, 4));
    logger.info('callbackUrl - ', callbackUrl);
    pubsub.subscribe(topic, hub);
});

pubsub.on('denied', (data) => {
    logger.warn('[pshb] Denied - ', data);
});

pubsub.on('subscribe', (data) => {
    logger.info('[pshb] Subscribed! - ', JSON.stringify(data, null, 4));
});

pubsub.on('unsubscribe', (data) => {
    logger.warn('[pshb] Unsubscribe - ', data);
});

pubsub.on('error', (error) => {
    logger.error('[pshb] Error - ', error);
});

pubsub.on('feed', (data) => {
    logger.debug('[pshb] New Feed Item - ', data);
    try {
        let feed = data.feed;
        if (feed !== undefined) {
            // Get the feed from the update
            let feedXml = feed.toString();
            logger.info('[pshb-subscribe] New Feed Item - ', feedXml);

            let toEmit = {
                feedXml: feedXml,
                timeBrodcasted: Date.now(),
                rawFeed: data
            };

            io.sockets.emit('yt-notification', toEmit);
        }
    } catch (error) {
        logger.error('Caught Error - ', error);
    }
});
