const xml2js = require('xml2js');

(async () => {
    let input = {
        feedXml:
            "<?xml version='1.0' encoding='UTF-8'?>\n" +
            '<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom"><link rel="hub" href="https://pubsubhubbub.appspot.com"/><link rel="self" href="https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCDq3SgqtNhxxgvxivywx_Pg"/><title>YouTube video feed</title><updated>2020-04-19T01:44:39.321120785+00:00</updated><entry>\n' +
            '  <id>yt:video:MDhc7TAIx8k</id>\n' +
            '  <yt:videoId>MDhc7TAIx8k</yt:videoId>\n' +
            '  <yt:channelId>UCDq3SgqtNhxxgvxivywx_Pg</yt:channelId>\n' +
            '  <title>Test</title>\n' +
            '  <link rel="alternate" href="https://www.youtube.com/watch?v=MDhc7TAIx8k"/>\n' +
            '  <author>\n' +
            '   <name>Maut</name>\n' +
            '   <uri>https://www.youtube.com/channel/UCDq3SgqtNhxxgvxivywx_Pg</uri>\n' +
            '  </author>\n' +
            '  <published>2020-04-19T01:44:26+00:00</published>\n' +
            '  <updated>2020-04-19T01:44:39.321120785+00:00</updated>\n' +
            ' </entry></feed>\n',
        timeBrodcasted: 1587260681110,
        rawFeed: {
            topic: 'https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCDq3SgqtNhxxgvxivywx_Pg',
            hub: 'http://pubsubhubbub.appspot.com',
            callback:
                'http://127.0.0.1:3000/?topic=https%3A%2F%2Fwww.youtube.com%2Fxml%2Ffeeds%2Fvideos.xml%3Fchannel_id%3DUCDq3SgqtNhxxgvxivywx_Pg&hub=http%3A%2F%2Fpubsubhubbub.appspot.com',
            headers: {
                host: '127.0.0.1:3000',
                connection: 'close',
                'content-length': '856',
                link:
                    '<https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCDq3SgqtNhxxgvxivywx_Pg>; rel=self, <http://pubsubhubbub.appspot.com/>; rel=hub',
                'content-type': 'application/atom+xml',
                'cache-control': 'no-cache,max-age=0',
                pragma: 'no-cache',
                accept: '*/*',
                from: 'googlebot(at)googlebot.com',
                'user-agent': 'FeedFetcher-Google; (+http://www.google.com/feedfetcher.html)',
                'accept-encoding': 'gzip,deflate,br'
            }
        }
    };

    let feedXml = input.feedXml;

    let xmlParser = new xml2js.Parser();

    let parsed = await xmlParser.parseStringPromise(feedXml);

    let entry = parsed.feed.entry[0];

    let videoTitle = entry.title[0];
    let videoTimePublished = entry.published[0];
    let videoUrl = entry.link[0]['$']['href'];

    console.log(entry.link[0]['$']['href']);
})();
