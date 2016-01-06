#!/bin/bash

set -e
set -x

RPMDIR="$PWD/packages/artifacts"

if [ ! -z "$BUILD_NUMBER" ]; then
        git clean -fd
fi

rm -rf "$RPMDIR"
[ -f hiera.fragment.txt ] && rm -f hiera.fragment.txt
mkdir -p "$RPMDIR"

# In case of RPM build on different env than Component pipeline
if [ "x" = "x$VCS_BRANCH" ]; then
    [ "$CI_BRANCH" ] || export CI_BRANCH=master
    [ "$CI_REPO" ] || CI_REPO=git@github.com:gooddata/gdc-ci

    rm -rf ./gdc-ci || :

    git --work-tree gdc-ci clone -b $CI_BRANCH $CI_REPO

    VCS_BRANCH=$(python gdc-ci/components/common/gitflow/git2rpm_name.py)
fi

VERSION="3.${VCS_BRANCH}"
RELEASE="${BUILD_NUMBER:="0"}.${REVISION:=$(git log --format='%h' -1)}"

export PATH="$PATH:$PWD/node_modules/.bin/"
rpmbuild -bb --define "_rpmdir $RPMDIR" --define "_version $VERSION" --define "_release $RELEASE" gdc-analyze.spec

. gdc-ci/quality/util/hudsonjobs/lib

echo
if [ "0" -eq "$BUILD_NUMBER" ]; then
echo "not uploading local build to repo"
    export DO_NOT_UPLOAD="1"
    echo "# local build " > hiera.fragment.txt
else
    echo "# $BUILD_URL" > hiera.fragment.txt
fi

echo "analyze_revision: $VERSION-$RELEASE" >> hiera.fragment.txt
echo -e "ANALYZE_RPM_VERSION=$VERSION-$RELEASE" > rpm_build.properties
git log -150 --pretty=format:"%h;%s;%an"  > git-gdc-analyze.log
