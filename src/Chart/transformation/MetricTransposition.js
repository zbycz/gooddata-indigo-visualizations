import { cloneDeep, assign } from 'lodash';
import { enrichHeaders } from './EnrichHeaders';
import { parseValue, getMeasureHeader, getAttributeHeader } from '../../utils/common';

import { DEFAULT_FORMAT } from '../constants/metrics';

function invalidInput(data) {
    return !data || data.isLoading;
}

function transposeData(headers, metrics, rawData, afm) {
    const data = [];

    for (let mi = 0; mi < metrics.length; mi++) {
        for (let ri = 0; ri < rawData.length; ri++) {
            const row = [];

            for (let ci = 0; ci < headers.length; ci++) {
                if (headers[ci].type === 'attrLabel') {
                    const element = rawData[ri][ci];

                    row.push(assign({
                        id: element.id,
                        value: element.name
                    }, getAttributeHeader(headers[ci])));
                }
            }

            const metric = metrics[mi];

            row.push(assign({
                id: metric.header.id, // each metric must have unique id
                value: metric.header.title
            }, getMeasureHeader(metric.header, afm)));

            const metricValue = rawData[ri][metric.index];
            const y = parseValue(metricValue);
            row.push({
                format: metric.header.format || DEFAULT_FORMAT,
                y,
                marker: { enabled: y !== null }
            });

            data.push(row);
        }
    }

    return data;
}

export function transposeMetrics(data, afm = {}) {
    if (invalidInput(data)) {
        return data;
    }

    const dataCopy = cloneDeep(data);

    const { headers, metrics } = enrichHeaders(dataCopy.headers);

    if (metrics.length < 1) return dataCopy;

    return {
        ...dataCopy,
        headers,
        rawData: transposeData(dataCopy.headers, metrics, dataCopy.rawData, afm)
    };
}
