// Copyright (C) 2007-2016, GoodData(R) Corporation. All rights reserved.
/* eslint no-underscore-dangle: 0 */
import find from 'lodash/find';
import map from 'lodash/map';

import * as Transformation from '../transformation';

describe('Transformation', () => {
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
            const metrics = Transformation._splitHeaders(headers).metrics;
            expect(metrics).toHaveLength(2);
            expect(metrics[0]).toEqual({ index: 0, header: headers[0] });
            expect(metrics[1]).toEqual({ index: 1, header: headers[1] });
        });

        it('should split headers to the rest', () => {
            const newHeaders = Transformation._splitHeaders(headers).headers;
            expect(newHeaders).toEqual(headers.slice(2));
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
                    format: Transformation.DEFAULT_FORMAT,
                    title: ''
                }];
                const actual = Transformation.getMetricNamesValuesHeaderItems([], []);
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
                const actual = Transformation.getMetricNamesValuesHeaderItems([], metrics);
                expect(actual).toEqual(mockHeaders);
            });
        });
    });

    describe('transposing data', () => {
        it('should return one row per metric on input', () => {
            const headers = [
                { title: 'Employees' },
                { title: 'Company', type: 'attrLabel' },
                { title: 'Since' },
                { title: 'Country', type: 'attrLabel' }
            ];
            const metrics = [{
                index: 0,
                header: headers[0]
            }, {
                index: 2,
                header: headers[2]
            }];

            const rawData = [
                [300, 'GoodData', 2007, 'Czech Republic']
            ];

            const transposed = Transformation._transposeData(headers, metrics, rawData);

            expect(transposed).toHaveLength(2);

            expect(transposed[0]).toEqual([
                { value: 'GoodData', id: 'GoodData' },
                { value: 'Czech Republic', id: 'Czech Republic' },
                { value: 'Employees', id: 'metric-0' },
                { y: 300, format: Transformation.DEFAULT_FORMAT, marker: { enabled: true } }
            ]);
            expect(transposed[1]).toEqual([
                { value: 'GoodData', id: 'GoodData' },
                { value: 'Czech Republic', id: 'Czech Republic' },
                { value: 'Since', id: 'metric-1' },
                { y: 2007, format: Transformation.DEFAULT_FORMAT, marker: { enabled: true } }
            ]);
        });
    });

    describe('data transformation to metricNames/Values', () => {
        it('should add two extra headers', () => {
            const M1Header = { type: 'metric', title: 'M1', format: '#.##' };
            const M2Header = { type: 'metric', title: 'M2', format: '#.##%' };

            const input = { headers: [M1Header, M2Header], rawData: [] };
            const transformed = Transformation.transformData(input);

            const metricNames = find(transformed.headers, { uri: '/metricGroup' });
            const expected = [{ header: M1Header, index: 0 }, { header: M2Header, index: 1 }];
            expect(metricNames.metrics).toEqual(expected);

            const metricValues = find(transformed.headers, { uri: '/metricValues' });
            expect(metricValues.title).toEqual('M1');
        });

        it('should not act on currently loading data', () => {
            expect(Transformation.transformData()).toEqual(undefined);

            const data = { isLoading: true };
            expect(Transformation.transformData(data)).toEqual(data);
        });

        it('should not do transformation if there are no metrics', () => {
            const data = { headers: [] }; // FIXME: have to inject headers now for _splitHeaders
            expect(Transformation.transformData(data)).toEqual(data);
        });
    });

    describe('Getting chart data', () => {
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
                    [{ id: 'a', value: 'a' }, { id: 'M3', value: 'M3' }, { y: 7, format: Transformation.DEFAULT_FORMAT }],
                    [{ id: 'b', value: 'b' }, { id: 'M3', value: 'M3' }, { y: 8, format: Transformation.DEFAULT_FORMAT }],
                    [{ id: 'c', value: 'c' }, { id: 'M3', value: 'M3' }, { y: 9, format: Transformation.DEFAULT_FORMAT }]
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
                            { y: 7, format: Transformation.DEFAULT_FORMAT },
                            { y: 8, format: Transformation.DEFAULT_FORMAT },
                            { y: 9, format: Transformation.DEFAULT_FORMAT }
                        ],
                        legendIndex: 2
                    }

                ]
            };

            expect(Transformation.getChartData(data, configuration)).toEqual(expectedData);
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

            expect(Transformation.getChartData(data, configuration)).toEqual(expectedData);
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
            const series = map(Transformation.getChartData(data, configuration).series, 'name');

            expect(series).toEqual(expectedSeries);
        });
    });

    describe('Generating palette', () => {
        it('should insert lightened color for pop metrics', () => {
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
                    { id: 'metricValues', type: 'metric' },
                    { id: 'abc.generated_pop', type: 'metric' }
                ]
            };
            const palette = [
                'rgb(00,131,255)',
                'rgb(00,128,255)',
                'rgb(241,35,61)',
                'rgb(239,134,00)',
                'rgb(188,90,178)'
            ];

            const expectedData = [
                'rgb(00,131,255)',
                'rgb(153,204,255)',
                'rgb(00,128,255)',
                'rgb(241,35,61)',
                'rgb(239,134,00)',
                'rgb(188,90,178)'
            ];

            expect(Transformation.getColorPalette(data, palette)).toEqual(expectedData);
        });
    });

    describe('Lighten color', () => {
        it('should lighten and darken color correctly', () => {
            const getLighterColor = Transformation._getLighterColor;

            expect(getLighterColor('rgb(00,128,255)', 0.5)).toEqual('rgb(128,192,255)');
            expect(getLighterColor('rgb(00,128,255)', -0.5)).toEqual('rgb(0,64,128)');
        });
    });
});
