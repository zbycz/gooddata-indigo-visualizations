#!/bin/bash -x

rm -rf ./gemini/reports/

nohup ./node_modules/grunt-grizzly/bin/grizzly.js -d dist-storybook -a &> grizzly.log &
GRIZZLY_PID=$!

# we need to wait a bit for grizzly to give us some output
sleep 3
PORT=$(sed -e 's#.*Running server on https://localhost:\(.*\).*#\1#' <<< `grep https://localhost: grizzly.log`)

nohup ./node_modules/.bin/chromedriver --port=4444 --url-base=wd/hub &
CHROME_DRIVER_PID=$!

SCRIPT_RESULT=0

if [ $? -eq 0 ]; then
    ./node_modules/.bin/gemini test --reporter vflat --root-url https://localhost:${PORT}
    SCRIPT_RESULT=$?
fi

kill ${GRIZZLY_PID}
kill ${CHROME_DRIVER_PID}

exit ${SCRIPT_RESULT}
