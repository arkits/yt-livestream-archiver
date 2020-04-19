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

// Setup pubsubhub options
let pshbOptions = {
    callbackUrl: config.callbackUrl + '/pubsubhubbub'
};

// Create a subscriber based on options
let pshbSubscriber = pubSubHubbub.createServer(pshbOptions),
    topic = config.targetChannel,
    hub = config.pshbUrl;

pshbSubscriber.on('subscribe', function (data) {
    logger.info(data.topic + ' subscribed');
});

pshbSubscriber.on('listen', function () {
    pubSubSubscriber.subscribe(topic, hub, function (err) {
        if (err) {
            logger.error('Failed subscribing - ', err);
        }
    });
});

pshbSubscriber.on('feed', function (data) {
    logger.info('We got em!');
    logger.info(data.feed.toString());
    logger.info('~~~~~~~~~~~~~~~~~~');
});

// Add pubsubhubbub as Express middleware..
app.use('/pubsubhubbub', pshbSubscriber.listener());

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
    logger.debug('Using config - %s', config);
});
