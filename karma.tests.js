var testsContext = require.context('./test', true, /\_test\.jsx?$/);
testsContext.keys().forEach(testsContext);
