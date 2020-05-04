var xml2js = require('xml2js');
var fs = require('fs');
var sh = require('shelljs');
var puppeteer = require('puppeteer');
var logger = require('log4js').getLogger('main');
let xmlParser = new xml2js.Parser();

function handle(data) {
    logger.debug('[sio] yt-notification - ', data);
    processAndRecord(data);
}

async function processAndRecord(data) {
    try {
        let parsedVideo = await parseFeedVideo(data);
        await waitForLive(parsedVideo);
        startRecording(parsedVideo);
    } catch (error) {}
}

async function parseFeedVideo(data) {
    let parsedVideo = null;

    try {
        let feedXml = data.feedXml;

        let feedXmlToJson = await xmlParser.parseStringPromise(feedXml);
        logger.debug('[ytn] feedXmlToJson - ', JSON.stringify(feedXmlToJson, null, 4));

        let feedEntry = feedXmlToJson.feed.entry;

        if (feedEntry) {
            let entry = feedEntry[0];

            parsedVideo = {
                videoTitle: entry.title[0],
                videoTimePublished: entry.published[0],
                videoUrl: entry.link[0]['$']['href'],
                videoId: entry.id[0].substring(9)
            };

            logger.info('[ytn] parsedVideo - ', parsedVideo);
        }
    } catch (error) {
        logger.error('Caught Error in parseNotification - ', error);
    }

    return parsedVideo;
}

async function waitForLive(parsedVideo) {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });

    page.on('load', async () => {
        logger.debug('Page loaded!');

        const offlineSlateStyle = await page.evaluate(() => {
            const elements = document.getElementsByClassName('ytp-offline-slate');
            return [...elements].map((element) => {
                element.focus();
                return window.getComputedStyle(element).getPropertyValue('display');
            });
        });

        if (offlineSlateStyle[0] === 'none') {
            logger.info('Stream is Live! Starting the recording...');
        } else {
            await sleep(1000);
            logger.info('Looks like the stream is offline... reloading page!');
            page.reload();
        }
    });

    await page.goto(parsedVideo.videoUrl);
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function startRecording(parsedVideo) {
    logger.info('Invoking recording script...');
}

module.exports = {
    handle
};
