import {
    getSortInfo,
    getMetricsFromHeaders,
    parseMetricValues,
    getHeaderSortClassName
} from '../utils';
import { ASC, DESC } from '../Sort';

describe('Utils', () => {
    describe('getSortInfo', () => {
        let config;

        beforeEach(() => {
            config = {
                buckets: {
                    categories: [
                        { category: { } },
                        { category: { sort: 'asc' } }
                    ],
                    measures: [
                        { measure: {} },
                        { measure: { sort: 'desc' } }
                    ]
                }
            };
        });

        it('should get sort for category', () => {
            const sortInfo = getSortInfo(config);

            expect(sortInfo.sortBy).toEqual(1);
            expect(sortInfo.sortDir).toEqual('asc');
        });

        it('should get sort for measure', () => {
            config.buckets.categories[1].category = {};
            const sortInfo = getSortInfo(config);

            expect(sortInfo.sortBy).toEqual(3);
            expect(sortInfo.sortDir).toEqual('desc');
        });

        it('should handle missing config', () => {
            const sortInfo = getSortInfo();

            expect(sortInfo).toEqual({});
        });

        it('should handle missing categories', () => {
            delete config.buckets.categories;
            const sortInfo = getSortInfo(config);

            expect(sortInfo.sortBy).toEqual(1);
            expect(sortInfo.sortDir).toEqual('desc');
        });

        it('should handle sort object in measure', () => {
            const sortInfo = getSortInfo({
                buckets: {
                    categories: [],
                    measures: [
                        { measure: {} },
                        { measure: { sort: { direction: 'asc' } } }
                    ]
                }
            });

            expect(sortInfo.sortBy).toEqual(1);
            expect(sortInfo.sortDir).toEqual('asc');
        });

        it('should handle sort for measure with pop', () => {
            const sortInfo = getSortInfo({
                buckets: {
                    categories: [],
                    measures: [
                        { measure: {} },
                        { measure: { showPoP: true, sort: { direction: 'asc' } } }
                    ]
                }
            });

            expect(sortInfo.sortBy).toEqual(2);
            expect(sortInfo.sortDir).toEqual('asc');
        });

        it('should handle sort for pop measure', () => {
            const sortInfo = getSortInfo({
                buckets: {
                    categories: [],
                    measures: [
                        { measure: {} },
                        { measure: { showPoP: true, sort: { direction: 'asc', sortByPoP: true } } }
                    ]
                }
            });

            expect(sortInfo.sortBy).toEqual(1);
            expect(sortInfo.sortDir).toEqual('asc');
        });
    });

    describe('getHeaderSortClassName', () => {
        it('should create classes with hinted ASC and current sort DESC', () => {
            const classes = getHeaderSortClassName(ASC, DESC);
            expect(classes).toContain('gd-table-arrow-up');
            expect(classes).toContain('s-sorted-desc');
        });

        it('should create classes with hinted sort and without current sort', () => {
            const classes = getHeaderSortClassName(DESC, null);
            expect(classes).toContain('gd-table-arrow-down');
            expect(classes).not.toContain('s-sorted-desc');
            expect(classes).not.toContain('s-sorted-asc');
        });
    });

    describe('getMetricsFromHeaders', () => {
        it('should create array of metrics from headers with only one metric', () => {
            const headers = [
                {
                    type: 'metric',
                    data: {}
                },
                {
                    type: 'other',
                    data: {}
                }
            ];

            const metrics = getMetricsFromHeaders(headers);

            expect(metrics.length).toEqual(1);
        });

        it('should create array of 2 metrics from headers with correct metric index', () => {
            const headers = [
                {
                    type: 'metric',
                    data: {}
                },
                {
                    type: 'other',
                    data: {}
                },
                {
                    type: 'metric',
                    data: {}
                }
            ];

            const metrics = getMetricsFromHeaders(headers);

            expect(metrics).toEqual([
                {
                    index: 0,
                    header: {
                        type: 'metric',
                        data: {}
                    }
                },
                {
                    index: 2,
                    header: {
                        type: 'metric',
                        data: {}
                    }
                }
            ]);
        });
    });

    describe('parseMetricValues', () => {
        it('should parse metric values in given data', () => {
            const headers = [
                {
                    type: 'metric',
                    data: {}
                },
                {
                    type: 'other',
                    data: {}
                },
                {
                    type: 'metric',
                    data: {}
                }
            ];

            const rawData = [
                ['12345', 'test', '98765'],
                ['1.2345', 'test', '9.8765'],
                ['1.2345678901e-05', 'test', '9.8765432109e-3']
            ];

            const data = parseMetricValues(headers, rawData);

            expect(data).toEqual([
                [12345, 'test', 98765],
                [1.2345, 'test', 9.8765],
                [0.000012345678901, 'test', 0.0098765432109]
            ]);
        });
    });
});
