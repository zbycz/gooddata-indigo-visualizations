import {
    propertiesToHeaders,
    getIndices,
    isMetricNamesInSeries,
    getLegendLayout,
    getCategoryAxisLabel,
    getMetricAxisLabel,
    showInPercent,
    generateTooltipFn,
    generatePieTooltipFn,
    getLineFamilyChartData,
    getPieFamilyChartData,
    getPieChartOptions
} from '../chartCreators';

import {
    DEFAULT_COLOR_PALETTE
} from '../transformation';

import { transposeMetrics } from '../transformation/MetricTransposition';

describe('chartCreators', () => {
    let config;
    let mockData;
    let mockHeaders;

    beforeEach(() => {
        config = {
            type: 'column',
            x: '/gdc/md/zro9kxjp2hejksfug8qemqwx6d92c940/obj/2577',
            y: '/metricValues',
            color: '/metricGroup',
            colorPalette: [
                'rgb(00,131,255)'
            ],
            selection: null,
            visible: true,
            orderBy: [],
            where: {}
        };
        mockData = transposeMetrics({
            headers: [
                {
                    type: 'attrLabel',
                    id: 'healthdata_finish.aci81lMifn6q',
                    uri: '/gdc/md/zro9kxjp2hejksfug8qemqwx6d92c940/obj/2577',
                    title: 'Quarter/Year (Health Data_finish)'
                },
                {
                    type: 'metric',
                    id: 'c54rxxM5coY6',
                    uri: '/gdc/md/zro9kxjp2hejksfug8qemqwx6d92c940/obj/2647',
                    title: 'Average kilometers',
                    format: '#,##0.00'
                }
            ],
            rawData: []
        });
        mockHeaders = mockData.headers;
    });

    describe('propertiesToHeaders', () => {
        it('converts vis ctrl properties to header format', () => {
            const res = propertiesToHeaders(config, mockHeaders);
            expect(res.x).toEqual({
                type: 'attrLabel',
                id: 'healthdata_finish.aci81lMifn6q',
                uri: '/gdc/md/zro9kxjp2hejksfug8qemqwx6d92c940/obj/2577',
                title: 'Quarter/Year (Health Data_finish)'
            });
            expect(res.y).toEqual({
                id: 'metricValues',
                type: 'metric',
                uri: '/metricValues',
                format: '#,##0.00',
                title: 'Average kilometers'
            });
        });
    });

    describe('getIndices', () => {
        it('return indices from config', () => {
            expect(getIndices(config, mockData.headers))
                .toEqual({ category: 0, series: 1, metric: 2 });
        });
    });

    describe('isMetricNamesInSeries', () => {
        it('works', () => {
            expect(isMetricNamesInSeries(config, mockHeaders)).toEqual(true);
            config.y = 'metricNames';
            config.color = 'metricValues';
            expect(isMetricNamesInSeries(config, mockHeaders)).toEqual(false);
        });
    });

    describe('getLegendLayout', () => {
        it('works', () => {
            expect(getLegendLayout(config, mockHeaders)).toEqual('horizontal');
            config.y = 'metricNames';
            config.color = 'metricValues';
            expect(getLegendLayout(config, mockHeaders)).toEqual('vertical');
        });
    });

    describe('getCategoryAxisLabel', () => {
        it('works', () => {
            expect(getCategoryAxisLabel(config, mockHeaders))
                .toEqual('Quarter/Year (Health Data_finish)');
            mockHeaders[0].title = undefined;
            expect(getCategoryAxisLabel(config, mockHeaders)).toEqual('');
        });
    });

    describe('getMetricAxisLabel', () => {
        it('works', () => {
            expect(getMetricAxisLabel(config, mockHeaders)).toEqual('Average kilometers');
            mockHeaders[1].metrics = [];
            expect(getMetricAxisLabel(config, mockHeaders)).toEqual('Average kilometers');
        });
    });

    describe('showInPercent', () => {
        it('works', () => {
            expect(showInPercent(config, mockHeaders)).toEqual(false);
            mockHeaders[2].format = '#,##0.00 %';
            expect(showInPercent(config, mockHeaders)).toEqual(true);
        });
    });

    describe('generateTooltipFn', () => {
        const tooltipFnOptions = { categoryAxisLabel: 'category-label' };

        describe('unescaping angle brackets and htmlescaping the whole value', () => {
            const generatedTooltip = generateTooltipFn(tooltipFnOptions);

            it('should keep &lt; and &gt; untouched (unescape -> escape)', () => {
                const tooltip = generatedTooltip({
                    y: 1,
                    series: {
                        name: '&lt;series&gt;'
                    }
                });

                expect(tooltip.includes('&lt;series&gt;')).toEqual(true);
            });

            it('should escape other html chars and have output properly escaped', () => {
                const tooltip = generatedTooltip({
                    y: 1,
                    series: {
                        name: '"&\'&lt;'
                    }
                });

                expect(tooltip.includes('&quot;&amp;&#39;&lt;')).toEqual(true);
            });

            it('should unescape brackets and htmlescape category', () => {
                const tooltip = generatedTooltip({
                    y: 1,
                    category: '&gt;"&\'&lt;',
                    series: {
                        name: 'series'
                    }
                });

                expect(tooltip.includes('&gt;&quot;&amp;&#39;&lt;')).toEqual(true);
            });
        });
    });

    describe('generatePieTooltipFn', () => {
        describe('unescaping angle brackets and htmlescaping the whole value', () => {
            const tooltipFnOptions = { categoryLabel: 'category-label', metricLabel: 'opportunities lost', metricsOnly: false };
            const generatedTooltip = generatePieTooltipFn(tooltipFnOptions);

            it('should keep &lt; and &gt; untouched (unescape -> escape)', () => {
                const tooltip = generatedTooltip({
                    y: 1,
                    name: '&lt;series&gt;'
                });
                expect(tooltip.includes('&lt;series&gt;')).toEqual(true);
            });

            it('should escape other html chars and have output properly escaped', () => {
                const tooltip = generatedTooltip({
                    y: 1,
                    name: '"&\'&lt;'
                });
                expect(tooltip.includes('&quot;&amp;&#39;&lt;')).toEqual(true);
            });

            it('should unescape brackets and htmlescape category', () => {
                const tooltip = generatedTooltip({
                    y: 1,
                    name: '&gt;"&\'&lt;'
                });

                expect(tooltip.includes('&gt;&quot;&amp;&#39;&lt;')).toEqual(true);
            });
        });

        describe('tooltip renders correctly according to attr/metric or multiple metrics', () => {
            it('renders correctly with attribute and metric', () => {
                const tooltipFnOptions = { categoryLabel: 'category-label', metricLabel: 'opportunities lost', metricsOnly: false };
                const generatedTooltip = generatePieTooltipFn(tooltipFnOptions);

                const tooltip = generatedTooltip({
                    y: 1,
                    name: '"&\'&lt;'
                });

                expect(tooltip.includes('category-label')).toEqual(true);
            });

            it('renders correctly with metrics only', () => {
                const tooltipFnOptions = { categoryLabel: 'category-label', metricLabel: 'opportunities lost', metricsOnly: true };
                const generatedTooltip = generatePieTooltipFn(tooltipFnOptions);

                const tooltip = generatedTooltip({
                    y: 1,
                    name: 'opportunities'
                });

                expect(tooltip.includes('opportunities')).toEqual(true);
                expect(tooltip.includes('category-label')).toEqual(false);
            });
        });
    });

    describe('getPieFamilyChartData', () => {
        const oneMetricOneAttributeData = {
            isLoaded: true,
            headers: [
                {
                    type: 'attrLabel',
                    id: 'date.aag81lMifn6q',
                    uri: '/gdc/md/yowwuctu6c5lkxql3itj3nz4ec54ax89/obj/15331',
                    title: 'Year (Date)'
                }, {
                    type: 'metric',
                    id: 'metric_yowwuctu6c5lkxql3itj3nz4ec54ax89_16206.generated.pop.5b24b8',
                    uri: '/gdc/md/yowwuctu6c5lkxql3itj3nz4ec54ax89/obj/808882',
                    title: 'Email Click Rate - previous year',
                    format: '#,##0.0%'
                }
            ],
            rawData: [
                [{ id: '2013', name: '2013' }, '124'],
                [{ id: '2014', name: '2014' }, '284'],
                [{ id: '2015', name: '2015' }, '123'],
                [{ id: '2016', name: '2016' }, '155'],
                [{ id: '2017', name: '2017' }, null]
            ],
            isEmpty: false,
            isLoading: false
        };

        it('should be able to rotate color palette', () => {
            const pieConfig = {
                metricsOnly: false,
                colorPalette: DEFAULT_COLOR_PALETTE.slice(0, 2)
            };

            const data = getPieFamilyChartData(pieConfig, oneMetricOneAttributeData);

            expect(data).toEqual({
                series: [{
                    data: [
                        { name: '2014', y: 284, color: DEFAULT_COLOR_PALETTE[0], legendIndex: 0, format: '#,##0.0%' },
                        { name: '2016', y: 155, color: DEFAULT_COLOR_PALETTE[1], legendIndex: 1, format: '#,##0.0%' },
                        { name: '2013', y: 124, color: DEFAULT_COLOR_PALETTE[0], legendIndex: 2, format: '#,##0.0%' },
                        { name: '2015', y: 123, color: DEFAULT_COLOR_PALETTE[1], legendIndex: 3, format: '#,##0.0%' },
                        { name: '2017', y: null, color: DEFAULT_COLOR_PALETTE[0], legendIndex: 4, format: '#,##0.0%' }
                    ]
                }]
            });
        });

        it('should prepare data correctly when provided with one metric and one attribute', () => {
            const pieConfig = {
                metricsOnly: false,
                colorPalette: DEFAULT_COLOR_PALETTE.slice(0, 2)
            };

            const data = getPieFamilyChartData(pieConfig, oneMetricOneAttributeData);

            expect(data).toEqual({
                series: [{
                    data: [
                        { name: '2014', y: 284, color: DEFAULT_COLOR_PALETTE[0], legendIndex: 0, format: '#,##0.0%' },
                        { name: '2016', y: 155, color: DEFAULT_COLOR_PALETTE[1], legendIndex: 1, format: '#,##0.0%' },
                        { name: '2013', y: 124, color: DEFAULT_COLOR_PALETTE[0], legendIndex: 2, format: '#,##0.0%' },
                        { name: '2015', y: 123, color: DEFAULT_COLOR_PALETTE[1], legendIndex: 3, format: '#,##0.0%' },
                        { name: '2017', y: null, color: DEFAULT_COLOR_PALETTE[0], legendIndex: 4, format: '#,##0.0%' }
                    ]
                }]
            });
        });

        it('should prepare data correctly when provided with multiple metrics', () => {
            const pieConfig = {
                metricsOnly: true,
                colorPalette: DEFAULT_COLOR_PALETTE
            };

            const pieData = {
                isLoaded: true,
                headers: [
                    {
                        type: 'metric',
                        id: 'metric_yowwuctu6c5lkxql3itj3nz4ec54ax89_16206.generated.pop.5b24b8',
                        uri: '/gdc/md/yowwuctu6c5lkxql3itj3nz4ec54ax89/obj/808882',
                        title: 'First',
                        format: '#,##0.0%'
                    },
                    {
                        type: 'metric',
                        id: 'metric_yowwuctu6c5lkxql3itj3nz4ec54ax89_16206.generated.pop.5b24b8',
                        uri: '/gdc/md/yowwuctu6c5lkxql3itj3nz4ec54ax89/obj/808882',
                        title: 'Next one',
                        format: '#,##0.0%'
                    },
                    {
                        type: 'metric',
                        id: 'metric_yowwuctu6c5lkxql3itj3nz4ec54ax89_16206.generated.pop.5b24b8',
                        uri: '/gdc/md/yowwuctu6c5lkxql3itj3nz4ec54ax89/obj/808882',
                        title: 'Next two',
                        format: '#,##0.0%'
                    }
                ],
                rawData: [
                    ['123', '456', '789']
                ],
                isEmpty: false,
                isLoading: false
            };

            const data = getPieFamilyChartData(pieConfig, pieData);

            expect(data).toEqual({
                series: [{
                    data: [
                        { name: 'Next two', y: 789, color: DEFAULT_COLOR_PALETTE[0], legendIndex: 0, format: '#,##0.0%' },
                        { name: 'Next one', y: 456, color: DEFAULT_COLOR_PALETTE[1], legendIndex: 1, format: '#,##0.0%' },
                        { name: 'First', y: 123, color: DEFAULT_COLOR_PALETTE[2], legendIndex: 2, format: '#,##0.0%' }
                    ]
                }]
            });
        });
    });

    describe('getLineFamilyChartData', () => {
        beforeEach(() => {
            config = {
                color: '/metricGroup',
                orderBy: [],
                stacking: false,
                type: 'column',
                where: {},
                x: '/gdc/md/yowwuctu6c5lkxql3itj3nz4ec54ax89/obj/15331',
                y: '/metricValues'
            };

            mockData = {
                isLoaded: true,
                headers: [
                    {
                        type: 'attrLabel',
                        id: 'date.aag81lMifn6q',
                        uri: '/gdc/md/yowwuctu6c5lkxql3itj3nz4ec54ax89/obj/15331',
                        title: 'Year (Date)'
                    }, {
                        type: 'metric',
                        id: 'metric_yowwuctu6c5lkxql3itj3nz4ec54ax89_16206.generated.pop.5b24b8',
                        uri: '/gdc/md/yowwuctu6c5lkxql3itj3nz4ec54ax89/obj/808882',
                        title: 'Email Click Rate - previous year',
                        format: '#,##0.0%'
                    }, {
                        type: 'metric',
                        id: 'bHPCwcn7cGns',
                        uri: '/gdc/md/yowwuctu6c5lkxql3itj3nz4ec54ax89/obj/16206',
                        title: 'Email Click Rate',
                        format: '#,##0.0%'
                    }
                ],
                rawData: [
                    [{ id: '2013', name: '2013' }, null, '0.0126946885814334'],
                    [{ id: '2014', name: '2014' }, '0.0126946885814334', '0.0261557203220383'],
                    [{ id: '2015', name: '2015' }, '0.0261557203220383', '0.0348732552824948'],
                    [{ id: '2016', name: '2016' }, '0.0348732552824948', null]
                ],
                isEmpty: false,
                isLoading: false
            };
        });

        it('should get chart data', () => {
            const chartData = getLineFamilyChartData(config, mockData);

            expect(chartData).toBeDefined();
        });

        it('should not sort data', () => {
            const chartData = getLineFamilyChartData(config, mockData);

            expect(chartData.series[0].name).toEqual('Email Click Rate - previous year');
            expect(chartData.series[1].name).toEqual('Email Click Rate');
        });
    });

    describe('getPieChartOptions', () => {
        describe('metricOnly', () => {
            it('should be true for multiple metrics', () => {
                const data = {
                    headers: [
                        {
                            title: 'm1',
                            type: 'metric'
                        },
                        {
                            title: 'm2',
                            type: 'metric'
                        }
                    ]
                };
                expect(getPieChartOptions({}, data).metricsOnly).toEqual(true);
            });

            it('should be true for single metric', () => {
                const data = {
                    headers: [
                        {
                            title: 'm1',
                            type: 'metric'
                        }
                    ]
                };
                expect(getPieChartOptions({}, data).metricsOnly).toEqual(true);
            });

            it('should be false for one metric and one attribute', () => {
                const data = {
                    headers: [
                        {
                            title: 'm1',
                            type: 'metric'
                        }, {
                            title: 'att1',
                            type: 'attrLabel'
                        }
                    ]
                };
                expect(getPieChartOptions({}, data).metricsOnly).toEqual(false);
            });
        });

        describe('tooltip', () => {
            it('should handle tooltip generation if no metric present', () => {
                const data = {
                    headers: [
                        {
                            title: 'att1',
                            type: 'attrLabel'
                        }
                    ]
                };

                const tooltip = getPieChartOptions({}, data).actions.tooltip({
                    y: 1234,
                    format: '##'
                });

                expect(tooltip).toMatchSnapshot();
            });
        });
    });
});
