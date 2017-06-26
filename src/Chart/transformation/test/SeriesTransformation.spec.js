import { map } from 'lodash';
import { DEFAULT_FORMAT } from '../../constants/metrics';
import { getChartData } from '../SeriesTransformation';
import { transposeMetrics } from '../MetricTransposition';
import { singleMeasure, singleMeasureAndAttribute } from './fixtures/executionResponses';

describe('Getting chart data', () => {
    it('should create series from single measure', () => {
        const data = transposeMetrics(singleMeasure);

        const indices = {
            category: -1,
            series: 0,
            metric: 1
        };

        const configuration = {
            indices
        };

        expect(getChartData(data, configuration)).toMatchSnapshot();
    });

    it('should create series from single measure and attribute', () => {
        const data = transposeMetrics(singleMeasureAndAttribute);

        const indices = {
            category: 0,
            series: 1,
            metric: 2
        };

        const configuration = {
            indices
        };

        expect(getChartData(data, configuration)).toMatchSnapshot();
    });

    it('should correctly transform with metrics with/without formats', () => {
        const data = {
            headers: [
                { id: 'a1', type: 'attrLabel' },
                {
                    id: 'metricNames',
                    type: 'attrLabel',
                    metrics: {
                        M1: { header: { format: '#.## M1' } },
                        M2: { header: { format: '#.## M2' } },
                        M3: { header: { } }
                    }
                },
                { id: 'metricValues', type: 'metric' }
            ],
            /* eslint-disable max-len */
            rawData: [
                [{ id: 'a', value: 'a' }, { id: 'M1', value: 'M1' }, { y: 1, format: '#.## M1' }],
                [{ id: 'b', value: 'b' }, { id: 'M1', value: 'M1' }, { y: 2, format: '#.## M1' }],
                [{ id: 'c', value: 'c' }, { id: 'M1', value: 'M1' }, { y: 3, format: '#.## M1' }],
                [{ id: 'a', value: 'a' }, { id: 'M2', value: 'M2' }, { y: 4, format: '#.## M2' }],
                [{ id: 'b', value: 'b' }, { id: 'M2', value: 'M2' }, { y: 5, format: '#.## M2' }],
                [{ id: 'c', value: 'c' }, { id: 'M2', value: 'M2' }, { y: 6, format: '#.## M2' }],
                [{ id: 'a', value: 'a' }, { id: 'M3', value: 'M3' }, { y: 7, format: DEFAULT_FORMAT }],
                [{ id: 'b', value: 'b' }, { id: 'M3', value: 'M3' }, { y: 8, format: DEFAULT_FORMAT }],
                [{ id: 'c', value: 'c' }, { id: 'M3', value: 'M3' }, { y: 9, format: DEFAULT_FORMAT }]
            ]
            /* eslint-enable max-len */
        };

        const configuration = {
            indices: {
                category: 0,
                series: 1,
                metric: 2
            },
            sortSeries: true
        };

        const expectedData = {
            categories: ['a', 'b', 'c'],
            series: [
                {
                    name: 'M1',
                    data: [
                        { y: 1, format: '#.## M1' },
                        { y: 2, format: '#.## M1' },
                        { y: 3, format: '#.## M1' }
                    ],
                    legendIndex: 0
                },
                {
                    name: 'M2',
                    data: [
                        { y: 4, format: '#.## M2' },
                        { y: 5, format: '#.## M2' },
                        { y: 6, format: '#.## M2' }
                    ],
                    legendIndex: 1
                },
                {
                    name: 'M3',
                    data: [
                        { y: 7, format: DEFAULT_FORMAT },
                        { y: 8, format: DEFAULT_FORMAT },
                        { y: 9, format: DEFAULT_FORMAT }
                    ],
                    legendIndex: 2
                }

            ]
        };

        expect(getChartData(data, configuration)).toEqual(expectedData);
    });

    it('should correctly transform when multiple attributes present', () => {
        const data = {
            headers: [
                { id: 'a1', type: 'attrLabel' },
                { id: 'a2', type: 'attrLabel' },
                {
                    id: 'metricNames',
                    type: 'attrLabel',
                    metrics: {
                        M1: { header: { format: '#.## M1' } }
                    }
                },
                { id: 'metricValues', type: 'metric' }
            ],
            /* eslint-disable max-len */
            rawData: [
                [{ id: 'a', value: 'a' }, { id: 'x', value: 'x' }, { id: 'M1', value: 'M1' }, { y: 1, format: '#.## M1' }],
                [{ id: 'a', value: 'a' }, { id: 'y', value: 'y' }, { id: 'M1', value: 'M1' }, { y: 2, format: '#.## M1' }],
                [{ id: 'b', value: 'b' }, { id: 'x', value: 'x' }, { id: 'M1', value: 'M1' }, { y: 3, format: '#.## M1' }],
                [{ id: 'b', value: 'b' }, { id: 'y', value: 'y' }, { id: 'M1', value: 'M1' }, { y: 4, format: '#.## M1' }],
                [{ id: 'c', value: 'c' }, { id: 'x', value: 'x' }, { id: 'M1', value: 'M1' }, { y: 5, format: '#.## M1' }],
                [{ id: 'c', value: 'c' }, { id: 'y', value: 'y' }, { id: 'M1', value: 'M1' }, { y: 6, format: '#.## M1' }]
            ]
            /* eslint-enable max-len */
        };

        const configuration = {
            indices: {
                category: 0,
                series: 1,
                metric: 3
            },
            sortSeries: true
        };

        const expectedData = {
            categories: ['a', 'b', 'c'],
            series: [
                {
                    name: 'x',
                    data: [
                        { y: 1, format: '#.## M1' },
                        { y: 3, format: '#.## M1' },
                        { y: 5, format: '#.## M1' }
                    ],
                    legendIndex: 0
                },
                {
                    name: 'y',
                    data: [
                        { y: 2, format: '#.## M1' },
                        { y: 4, format: '#.## M1' },
                        { y: 6, format: '#.## M1' }
                    ],
                    legendIndex: 1
                }
            ]
        };

        expect(getChartData(data, configuration)).toEqual(expectedData);
    });

    it('should produce sorted legend even if some values are missing', () => {
        const data = {
            headers: [
                { id: 'a1', type: 'attrLabel' },
                { id: 'a2', type: 'attrLabel' },
                {
                    id: 'metricNames',
                    type: 'attrLabel',
                    metrics: {
                        M1: { header: { format: '#.## M1' } }
                    }
                },
                { id: 'metricValues', type: 'metric' }
            ],
            /* eslint-disable max-len */
            rawData: [
                [{ id: 'a', value: 'a' }, { id: 'x', value: 'x' }, { id: 'M1', value: 'M1' }, { y: 1, format: '#.## M1' }],
                [{ id: 'a', value: 'a' }, { id: 'z', value: 'z' }, { id: 'M1', value: 'M1' }, { y: 2, format: '#.## M1' }],
                [{ id: 'b', value: 'b' }, { id: 'x', value: 'x' }, { id: 'M1', value: 'M1' }, { y: 3, format: '#.## M1' }],
                [{ id: 'b', value: 'b' }, { id: 'y', value: 'y' }, { id: 'M1', value: 'M1' }, { y: 4, format: '#.## M1' }],
                [{ id: 'b', value: 'b' }, { id: 'z', value: 'z' }, { id: 'M1', value: 'M1' }, { y: 5, format: '#.## M1' }]
            ]
            /* eslint-enable max-len */
        };

        const configuration = {
            indices: {
                category: 0,
                series: 1,
                metric: 3
            },
            sortSeries: true
        };

        const expectedSeries = ['x', 'y', 'z'];
        const series = map(getChartData(data, configuration).series, 'name');

        expect(series).toEqual(expectedSeries);
    });
});
