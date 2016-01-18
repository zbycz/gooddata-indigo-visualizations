// Copyright (C) 2007-2015, GoodData(R) Corporation. All rights reserved.

'use strict';

import _ from 'lodash';
import { xhr } from 'gooddata';

import loadMetricMaql from './metric_details_loader';

const ELEMENT_COUNT = 5;

function loadAttrElements(attribute) {
    var elementsUri = attribute.elementsUri;

    elementsUri += `?offset=0&count=${ELEMENT_COUNT}`;

    return xhr.ajax(elementsUri).then((res) => res.attributeElements);
}

function loadDataset(item, pid) {
    var objectId = _.last(item.uri.split('/')),
        uri = `/gdc/md/${pid}/usedby2/${objectId}?types=dataSet`;

    return xhr.ajax(uri).then((data) => _.first(data.entries));
}

var detailLoaders = {
    metric(item) {
        var promise = loadMetricMaql(item);
        return promise.then((segments) => ({ metricMaql: segments }));
    },

    attribute(item) {
        var promise = loadAttrElements(item);
        return promise.then((attributeElements) => {
            var attrElementsTotalCount = parseInt(attributeElements.elementsMeta.records, 10);

            return {
                attrElements: attributeElements.elements,
                attrElementsTotalCount
            };
        });
    },

    fact(item, pid) {
        var promise = loadDataset(item, pid);
        return promise.then((dataset) => ({ dataset }));
    }
};

function defaultLoader() {
    return Promise.resolve();
}

export function loadDetails(item, pid) {
    var detailLoader = detailLoaders[item.type] || defaultLoader;

    return detailLoader(item, pid);
}
