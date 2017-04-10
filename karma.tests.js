const testsContext = require.context('./src', true, /_test\.jsx?$/);
testsContext.keys().forEach(testsContext);

// Convert console.error to errors
/* eslint-disable no-console */
const consoleError = console.error;
console.error = (error) => {
    consoleError.apply(console, [error]);

    throw new Error(error);
};
