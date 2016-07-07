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

[ "$SCM_BRANCH_GDC_CI" ] || export SCM_BRANCH_GDC_CI=master
[ "$SCM_URL_GDC_CI" ] || SCM_URL_GDC_CI=git@github.com:gooddata/gdc-ci

rm -rf ./gdc-ci || :

git --work-tree gdc-ci clone -b $SCM_BRANCH_GDC_CI $SCM_URL_GDC_CI
cp -rf gdc-ci/quality/util/hudsonjobs ./quality/
cp -rf gdc-ci/components/common/gitflow ./gitflow/

VERSION_BRANCH=$(python gitflow/git2rpm_name.py)
VERSION="3.${VERSION_BRANCH}"
RELEASE="${BUILD_NUMBER:="0"}.${REVISION:=$(git log --format='%h' -1)}"

export PATH="$PATH:$PWD/node_modules/.bin/"
rpmbuild -bb --define "_rpmdir $RPMDIR" --define "_version $VERSION" --define "_release $RELEASE" gdc-indigo-visualizations-web.spec

. quality/lib

echo
if [ "0" -eq "$BUILD_NUMBER" ]; then
echo "not uploading local build to repo"
    export DO_NOT_UPLOAD="1"
    echo "# local build " > hiera.fragment.txt
else
    echo "# $BUILD_URL" > hiera.fragment.txt
fi

echo "gdc_indigo_visualizations_web_revision: $VERSION-$RELEASE" >> hiera.fragment.txt
echo -e "INDIGO_VISUALIZATIONS_WEB_RPM_VERSION=$VERSION-$RELEASE" > rpm_build.properties
git log -150 --pretty=format:"%h;%s;%an"  > git-gdc-indigo-visualizations-web.log
