const fs = require('fs');
const log4js = require('log4js');
const sio = require('socket.io-client');
const xml2js = require('xml2js');

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

let xmlParser = new xml2js.Parser();

let sioClient = sio(config['notification-server']['baseUrl'], {
    path: config['notification-server']['endpoint']
});

sioClient.on('connect', function () {
    logger.info('[sio] Connected to NS');
});

sioClient.on('disconnect', function () {
    logger.info('[sio] Disconnected from NS');
});

sioClient.on('yt-notification', async function (data) {
    logger.debug('[sio] yt-notification - ', data);
    try {
        let feedXml = data.feedXml;

        let parsedFeed = await xmlParser.parseStringPromise(feedXml);
        logger.debug('[ytn] parsedFeed - ', JSON.stringify(parsedFeed, null, 4));

        let feedEntry = parsedFeed.feed.entry;

        if (feedEntry) {
            let entry = feedEntry[0];

            let videoTitle = entry.title[0];
            let videoTimePublished = entry.published[0];
            let videoUrl = entry.link[0]['$']['href'];

            logger.info(
                "[ytn] videoTitle='%s' videoTimePublished='%s' videoUrl='%s'",
                videoTitle,
                videoTimePublished,
                videoUrl
            );
        }
    } catch (error) {
        logger.error('Caught Error in yt-notification! - ', error);
    }
});
