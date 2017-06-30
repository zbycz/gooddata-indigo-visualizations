import { get } from 'lodash';
import { DEFAULT_FORMAT } from '../constants/metrics';

export function getMetricNamesValuesHeaderItems(headers, metrics) {
    // Need to transform the headers to match the rawData transformation
    return [{
        id: 'metricNames',
        title: 'Metric',
        type: 'attrLabel',
        uri: '/metricGroup',
        metrics
    }, {
        id: 'metricValues',
        type: 'metric',
        uri: '/metricValues',

        // For axis formatting, use first metric's formatting.
        // For individual series tooltips and labels, formats are
        // handled separately in metricNames
        format: get(metrics, '0.header.format', DEFAULT_FORMAT),

        // use first metric title as default
        title: get(metrics, '0.header.title', '')
    }];
}

function addMetricNamesValues(headers, metrics) {
    return {
        headers: [...headers, ...getMetricNamesValuesHeaderItems(headers, metrics)],
        metrics
    };
}

function splitHeaders(headers) {
    const metrics = [];
    const otherHeaders = [];

    headers.forEach((header, i) => {
        if (header.type === 'metric') {
            metrics.push({
                index: i,
                header
            });
        } else {
            otherHeaders.push(header);
        }
    });

    return {
        headers: otherHeaders,
        metrics
    };
}

// TODO: Cover all the module with tests
export function enrichHeaders(_headers) {
    const { headers, metrics } = splitHeaders(_headers);

    return addMetricNamesValues(headers, metrics);
}
