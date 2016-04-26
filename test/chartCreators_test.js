import {
    propertiesToHeaders,
    getIndices,
    isMetricNamesInSeries,
    getLegendLayout,
    getCategoryAxisLabel,
    getMetricAxisLabel,
    showInPercent,
    generateTooltipFn,
    getLineFamilyChartData
} from '../src/chartCreators';

import {
    _transformMetrics
} from '../src/transformation';

describe('chartCreators', () => {
    let config, mockData, mockHeaders;
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
        mockData = _transformMetrics({ headers: [
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
        ], rawData: [] });
        mockHeaders = mockData.headers;
    });

    describe('propertiesToHeaders', () => {
        it('converts vis ctrl properties to header format', () => {
            const res = propertiesToHeaders(config, mockHeaders);
            expect(res.x).to.eql({
                type: 'attrLabel',
                id: 'healthdata_finish.aci81lMifn6q',
                uri: '/gdc/md/zro9kxjp2hejksfug8qemqwx6d92c940/obj/2577',
                title: 'Quarter/Year (Health Data_finish)'
            });
            expect(res.y).to.eql({
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
                .to.eql({ category: 0, series: 1, metric: 2 });
        });
    });

    describe('isMetricNamesInSeries', () => {
        it('works', () => {
            expect(isMetricNamesInSeries(config, mockHeaders)).to.be(true);
            config.y = 'metricNames';
            config.color = 'metricValues';
            expect(isMetricNamesInSeries(config, mockHeaders)).to.be(false);
        });
    });

    describe('getLegendLayout', () => {
        it('works', () => {
            expect(getLegendLayout(config, mockHeaders)).to.be('horizontal');
            config.y = 'metricNames';
            config.color = 'metricValues';
            expect(getLegendLayout(config, mockHeaders)).to.be('vertical');
        });
    });

    describe('getCategoryAxisLabel', () => {
        it('works', () => {
            expect(getCategoryAxisLabel(config, mockHeaders))
                .to.be('Quarter/Year (Health Data_finish)');
            mockHeaders[0].title = undefined;
            expect(getCategoryAxisLabel(config, mockHeaders)).to.be('');
        });
    });

    describe('getMetricAxisLabel', () => {
        it('works', () => {
            expect(getMetricAxisLabel(config, mockHeaders)).to.be('Average kilometers');
            mockHeaders[1].metrics = [];
            expect(getMetricAxisLabel(config, mockHeaders)).to.be('Average kilometers');
        });
    });

    describe('showInPercent', () => {
        it('works', () => {
            expect(showInPercent(config, mockHeaders)).to.be(false);
            mockHeaders[2].format = '#,##0.00 %';
            expect(showInPercent(config, mockHeaders)).to.be(true);
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

                expect(tooltip.includes('&lt;series&gt;')).to.be(true);
            });

            it('should escape other html chars and have output properly escaped', () => {
                const tooltip = generatedTooltip({
                    y: 1,
                    series: {
                        name: '"&\'&lt;'
                    }
                });

                expect(tooltip.includes('&quot;&amp;&#39;&lt;')).to.be(true);
            });

            it('should unescape brackets and htmlescape category', () => {
                const tooltip = generatedTooltip({
                    y: 1,
                    category: '&gt;"&\'&lt;',
                    series: {
                        name: 'series'
                    }
                });

                expect(tooltip.includes('&gt;&quot;&amp;&#39;&lt;')).to.be(true);
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
                        title: 'Email Click Rate - previous year', format: '#,##0.0%'
                    }, {
                        type: 'metric',
                        id: 'bHPCwcn7cGns',
                        uri: '/gdc/md/yowwuctu6c5lkxql3itj3nz4ec54ax89/obj/16206',
                        title: 'Email Click Rate',
                        format: '#,##0.0%'
                    }
                ],
                rawData: [
                    ['2013', null, '0.0126946885814334'],
                    ['2014', '0.0126946885814334', '0.0261557203220383'],
                    ['2015', '0.0261557203220383', '0.0348732552824948'],
                    ['2016', '0.0348732552824948', null]
                ],
                isEmpty: false,
                isLoading: false
            };
        });

        it('should get chart data', () => {
            const chartData = getLineFamilyChartData(config, mockData);

            expect(chartData).to.be.ok();
        });

        it('should not sort data', () => {
            const chartData = getLineFamilyChartData(config, mockData);

            expect(chartData.series[0].name).to.eql('Email Click Rate - previous year');
            expect(chartData.series[1].name).to.eql('Email Click Rate');
        });
    });
});
