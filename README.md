# Indigo Analytical Designer in React

## Setup

Install [Node.js](http://nodejs.org). MacOS users should install [Homebrew](http://brew.sh/) first and then run:
```
$ brew install git
$ brew install node
$ npm install -g grunt-cli
```

Get the dependecies with:
```
$ npm install
```

## Develop
Run the app with ```grunt dev```

Open **https://localhost:8443/analyze-new/** in your favorite browser.

It starts proxy that allows app to communicate with [secure.gooddata.com](https://secure.gooddata.com).

####Options:

- `--host` or `--backend` defaults to `secure.gooddata.com` and specifies which backend to proxy HTTP requests to.
- `--port` defaults to `8443` and specifies which local port number will be used.

Grunt will watch for changes in packages, pre-compile CSS, pre-compile handlebars templates.

Optionaly you can to install terminal-notifier to get notified about build status.
The easy way is to use Homebrew:

```shell
brew install terminal-notifier
```

## Test
For unit tests run ```grunt test```

## Deploy
Build the application with ```grunt dist```.

This will build production version into **dist/**.

## License
Copyright (C) 2007-2016, GoodData(R) Corporation. All rights reserved.