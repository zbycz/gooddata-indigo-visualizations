import { enrichHeaders, getMetricNamesValuesHeaderItems } from '../EnrichHeaders';
import { DEFAULT_FORMAT } from '../../constants/metrics';

describe('splitting headers', () => {
    const headers = [{
        id: 'id1',
        title: 'Probability',
        type: 'metric'
    }, {
        id: 'id2',
        title: 'Revenue',
        type: 'metric'
    }, {
        id: 'id2',
        title: 'Opp Name',
        type: 'attrLabel'
    }, {
        id: 'id3',
        title: 'Stage',
        type: 'attrLabel'
    }];

    it('should split headers to metrics', () => {
        const metrics = enrichHeaders(headers).metrics;
        expect(metrics).toHaveLength(2);
        expect(metrics[0]).toEqual({ index: 0, header: headers[0] });
        expect(metrics[1]).toEqual({ index: 1, header: headers[1] });
    });

    it('should split headers to the rest', () => {
        const newHeaders = enrichHeaders(headers).headers;

        expect(newHeaders).toMatchSnapshot();
    });

    describe('getMetricNamesValuesHeaderItems', () => {
        it('adds metricNames and metricValues headers', () => {
            const headersWithoutMetrics = [{
                id: 'metricNames',
                title: 'Metric',
                type: 'attrLabel',
                uri: '/metricGroup',
                metrics: []
            }, {
                id: 'metricValues',
                type: 'metric',
                uri: '/metricValues',
                format: DEFAULT_FORMAT,
                title: ''
            }];
            const actual = getMetricNamesValuesHeaderItems([], []);
            expect(actual).toEqual(headersWithoutMetrics);
        });

        it('uses first metric format when metric present', () => {
            const metrics = [{
                header: {
                    title: 'Metric 1',
                    format: '00##00'
                }
            }];
            const mockHeaders = [{
                id: 'metricNames',
                title: 'Metric',
                type: 'attrLabel',
                uri: '/metricGroup',
                metrics
            }, {
                id: 'metricValues',
                type: 'metric',
                uri: '/metricValues',
                format: '00##00',
                title: 'Metric 1'
            }];
            const actual = getMetricNamesValuesHeaderItems([], metrics);
            expect(actual).toEqual(mockHeaders);
        });
    });
});
