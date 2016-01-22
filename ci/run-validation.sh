#!/bin/bash

echo "Validating source code..."

. $(dirname $0)/lib.sh

grep -irl '\(describe\|it\)\.only' "$WORKSPACE/test" > /dev/null && {
    echo "Please remove it.only and describe.only from tests!"
    exit 1
}

grunt validate
