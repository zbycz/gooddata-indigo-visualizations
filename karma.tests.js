var testsContext = require.context('./app', true, /\_test\.jsx?$/);
testsContext.keys().forEach(testsContext);
