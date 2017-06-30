import { find } from 'lodash';
import { transposeMetrics } from '../MetricTransposition';
import { noMeasure, singleMeasure, singleMeasureAndAttribute } from './fixtures/executionResponses';

describe('MetricTransposition', () => {
    describe('input handling', () => {
        it('should not do anything if data are loading', () => {
            const data = {
                isLoading: true
            };

            expect(transposeMetrics(data)).toEqual(data);
        });

        it('should not do anything if the result is empty', () => {
            const data = null;

            expect(transposeMetrics(data)).toEqual(data);
        });

        it('should not do anything for attributes only', () => {
            const data = noMeasure;

            expect(transposeMetrics(data)).toEqual(data);
        });
    });

    describe('transposition', () => {
        it('should transpose single metric', () => {
            expect(transposeMetrics(singleMeasure)).toMatchSnapshot();
        });

        it('should transpose single metric sliced by attribute', () => {
            expect(transposeMetrics(singleMeasureAndAttribute)).toMatchSnapshot();
        });
    });

    describe('data transformation to metricNames/Values', () => {
        it('should add two extra headers', () => {
            const M1Header = { type: 'metric', title: 'M1', format: '#.##' };
            const M2Header = { type: 'metric', title: 'M2', format: '#.##%' };

            const input = { headers: [M1Header, M2Header], rawData: [] };
            const transformed = transposeMetrics(input);

            const metricNames = find(transformed.headers, { uri: '/metricGroup' });
            const expected = [{ header: M1Header, index: 0 }, { header: M2Header, index: 1 }];
            expect(metricNames.metrics).toEqual(expected);

            const metricValues = find(transformed.headers, { uri: '/metricValues' });
            expect(metricValues.title).toEqual('M1');
        });

        it('should not act on currently loading data', () => {
            expect(transposeMetrics()).toEqual(undefined);

            const data = { isLoading: true };
            expect(transposeMetrics(data)).toEqual(data);
        });

        it('should not do transformation if there are no metrics', () => {
            const data = { headers: [] }; // FIXME: have to inject headers now for _splitHeaders
            expect(transposeMetrics(data)).toEqual(data);
        });
    });
});
