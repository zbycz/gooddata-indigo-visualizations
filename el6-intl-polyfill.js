// see https://formatjs.io/guides/runtime-environments/#polyfill-node
if (!global.Intl) {
    global.Intl = require('intl');
}
