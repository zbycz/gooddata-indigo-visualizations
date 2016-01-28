// Copyright (C) 2007-2016, GoodData(R) Corporation. All rights reserved.
import find from 'lodash/find';
import map from 'lodash/map';

import * as Transformation from '../src/transformation';

describe('Transformation', function() {
    describe('splitting headers', function() {
        var headers = [{
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

        it('should split headers to metrics', function() {
            var metrics = Transformation._splitHeaders(headers).metrics;
            expect(metrics).to.have.length(2);
            expect(metrics[0]).to.eql({ index: 0, header: headers[0] });
            expect(metrics[1]).to.eql({ index: 1, header: headers[1] });
        });

        it('should split headers to the rest', function() {
            var newHeaders = Transformation._splitHeaders(headers).headers;
            expect(newHeaders).to.eql(headers.slice(2));
        });
    });

    describe('transposing data', function() {
        it('should return one row per metric on input', function() {
            var headers = [
                { title: 'Employees' },
                { title: 'Company', type: 'attrLabel' },
                { title: 'Since' },
                { title: 'Country', type: 'attrLabel' }
            ];
            var metrics = [{
                index: 0,
                header: headers[0]
            }, {
                index: 2,
                header: headers[2]
            }];

            var rawData = [
                [300, 'GoodData', 2007, 'Czech Republic']
            ];

            var transposed = Transformation._transposeData(headers, metrics, rawData);

            expect(transposed).to.have.length(2);

            expect(transposed[0]).to.eql([
                { value: 'GoodData', id: 'GoodData' },
                { value: 'Czech Republic', id: 'Czech Republic' },
                { value: 'Employees', id: 'metric-0' },
                { y: 300, format: Transformation.DEFAULT_FORMAT }
            ]);
            expect(transposed[1]).to.eql([
                { value: 'GoodData', id: 'GoodData' },
                { value: 'Czech Republic', id: 'Czech Republic' },
                { value: 'Since', id: 'metric-1' },
                { y: 2007, format: Transformation.DEFAULT_FORMAT }
            ]);
        });
    });

    describe('data transformation to metricNames/Values', function() {
        it('should add two extra headers', function() {
            var M1Header = { type: 'metric', title: 'M1', format: '#.##' },
                M2Header = { type: 'metric', title: 'M2', format: '#.##%' };


            var input = { headers: [M1Header, M2Header], rawData: [] };
            var transformed = Transformation.transformData(input);

            var metricNames = find(transformed.headers, { uri: '/metricGroup' });
            var expected = [{ header: M1Header, index: 0 }, { header: M2Header, index: 1 }];
            expect(metricNames.metrics).to.eql(expected);

            var metricValues = find(transformed.headers, { uri: '/metricValues' });
            expect(metricValues.title).to.eql('M1');
        });

        it('should not act on currently loading data', function() {
            expect(Transformation.transformData()).to.be(undefined);

            var data = { isLoading: true };
            expect(Transformation.transformData(data)).to.be(data);
        });

        it('should not do transformation if there are no metrics', function() {
            var data = { headers: [] }; // FIXME: have to inject headers now for _splitHeaders
            expect(Transformation.transformData(data)).to.eql(data);
        });
    });

    describe('Getting chart data', function() {
        it('should correctly transform with metrics with/without formats', function() {
            var data = {
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

            var configuration = {
                indices: {
                    category: 0,
                    series: 1,
                    metric: 2
                },
                sortSeries: true
            };

            var expectedData = {
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

            expect(Transformation.getChartData(data, configuration)).to.eql(expectedData);
        });

        it('should correctly transform when multiple attributes present', function() {
            var data = {
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

            var configuration = {
                indices: {
                    category: 0,
                    series: 1,
                    metric: 3
                },
                sortSeries: true
            };

            var expectedData = {
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

            expect(Transformation.getChartData(data, configuration)).to.eql(expectedData);
        });

        it('should produce sorted legend even if some values are missing', function() {
            var data = {
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

            var configuration = {
                indices: {
                    category: 0,
                    series: 1,
                    metric: 3
                },
                sortSeries: true
            };

            var expectedSeries = ['x', 'y', 'z'];
            var series = map(Transformation.getChartData(data, configuration).series, 'name');

            expect(series).to.eql(expectedSeries);
        });
    });
});
