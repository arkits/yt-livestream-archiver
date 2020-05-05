# YouTube Livestream Archiver

## About

This is an experimental project to explore different ways of automatically archiving YouTube livestreams.

## Architecture

### `notification-server`

The notification-server is a Node.js web-server that subscribes to YouTube's official [pubsubhubbub endpoint](https://pubsubhubbub.appspot.com/) to receive the push-notifications about target livestreams.

### `archiver`

The archiver is a client to the notification-server and facilitates the actual archiving.

## Installation

### Setup the `notification-server`

The notification-server is designed to be run a node that can be reachable by [pubsubhubbub](https://github.com/pubsubhubbub/PubSubHubbub). This requires your node to be mapped to a real domain name. The rest of this document assumes you've figured out that part. 

Following are the steps to to setup the notification-server:

- Install Node.js
- Install [pm2](https://www.npmjs.com/package/pm2) - used for managing the process
```bash
npm install -g pm2
```
- Clone this repo
```bash
git clone https://github.com/arkits/yt-livestream-archiver.git
```
- Install the dependencies
```bash
cd src/notification-server
npm install                     # or  yarn install
```
- Start the notification-server with pm2
```bash
pm2 start --name "ytla-ns" npm -- start
```
Alternatively, you can start the notification-server without pm2 - 
```bash
node index.js
```
#### Handle traffic through Nginx

Here is how a *pseudo* Nginx server-block would look like - 

```
location /ytla {
    proxy_pass http://127.0.0.1:3000;
}

location /ytla/socket.io {
    proxy_pass http://127.0.0.1:3000/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### Setup the `archiver`

The archiver is designed to be on any node that can access the notification-server and YouTube (duh!). This can be same node that runs the notification-server, or completely independent. Please factor in storage and network quotas in your deployment. 

Following are the steps to to setup the archiver:

- Install Node.js
- Install [pm2](https://www.npmjs.com/package/pm2) - used for managing the process
```bash
npm install -g pm2
```
- Clone this repo
```bash
git clone https://github.com/arkits/yt-livestream-archiver.git
```
- Install the dependencies
```bash
cd src/archiver
npm install                     # or  yarn install
```
- Start the archiver with pm2
```bash
pm2 start --name "ytla-arch" npm -- start
```
Alternatively, you can start the notification-server without pm2 - 
```bash
node index.js
```