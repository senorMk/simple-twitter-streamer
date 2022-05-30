<h1 align="center">
Simple Twitter Streamer
</h1>
<p align="center">
Simple Twitter Streamer. Stack: MongoDB, Expressjs, React, SocketIO, NodeJS
</p>

<p align="center">
   <a href="https://github.com/senorMk/Simple-Twitter-Streamer/blob/master/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-green.svg" />
   </a>
   <a href="https://circleci.com/gh/senorMk/Simple-Twitter-Streamer">
      <img src="https://circleci.com/gh/senorMk/Simple-Twitter-Streamer.svg?style=svg" />
   </a>
</p>

A simple real-time twitter streaming app built with React, SocketIO and the Twitter API.

## clone or download

```terminal
$ git clone https://github.com/senorMk/Simple-Twitter-Streamer.git
```

## project structure

```terminal
LICENSE
package.json
server/
client/
   package.json
```

# Usage

## Prerequisites

- [Node](https://nodejs.org/en/download/) ^16.15.0
- [npm](https://nodejs.org/en/download/package-manager/)

Notice, the client and server run concurrently thanks to the [concurrently](https://www.npmjs.com/package/concurrently) npm package.

## Development

To run in development mode, execute the following commands at the root level folder:

```terminal
$ npm install
$ npm run install-client // install the client
$ npm run dev       // run the react development server and nodemon concurrently
```

## Production

Suggestions: to run in production mode, firstly create a .env file at the root level and specify the following:

- Server listening port: PORT
- Twitter API credentials: TWITTER_CONSUMER_API_KEY, TWITTER_CONSUMER_API_KEY_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET, TWITTER_BEARER_TOKEN

Execute the following commands at the root level folder(ideally you could also use something like pm2 or forver for the last command):

```terminal
$ npm install
$ npm run install-client && npm run build // install the client and build it for production
$ npm run start // start the production node instance
```

## Standard

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## BUGs or comments

[Create new Issues](https://github.com/senorMk/Simple-Twitter-Streamer/issues) (preferred)

[Email Me](mailto:mkandawire15@gmail.com)

## Author

[Penjani Mkandawire](mailto:mkandawire15@gmail.com)

### License

[MIT](https://github.com/senorMk/Simple-Twitter-Streamer/blob/master/LICENSE)
