const testsContext = require.context('./src', true, /_test\.jsx?$/);
testsContext.keys().forEach(testsContext);
