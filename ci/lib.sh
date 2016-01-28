#!/bin/bash

setupGrunt () {
    # this should really be a dependency of the client
    npm install grunt-cli

    # install dependencies
    npm install
}

export PATH=$PATH:$WORKSPACE/node_modules/.bin

# initiate
setupGrunt
