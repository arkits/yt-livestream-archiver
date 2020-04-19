# YouTube Livestream Archiver

## About

This is an experimental project to explore different ways of automatically archiving YouTube livestreams.

## Components

### `notification-server`

The notification-server is a Node.js web-server that subscribes the YouTube's official pubsubhubbub endpoint to receive the push-notifications about YouTube livestreams.

### `archiver`

The archiver is a client to the notifcation-server and does the actual archiving .

## Installation