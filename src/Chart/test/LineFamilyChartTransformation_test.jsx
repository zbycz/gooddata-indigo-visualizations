/* eslint react/no-render-return-value: 0 */
/* eslint react/no-find-dom-node: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { renderIntoDocument } from 'react-addons-test-utils';
import LineFamilyChartTransformation from '../LineFamilyChartTransformation';
import { TOP } from '../Legend/PositionTypes';
import { data, config } from '../../test/fixtures';

const SINGLE_SERIES_DATA = {
    isLoaded: true,
    isLoading: false,
    headers: [
        {
            id: 'm1',
            title: 'Metric',
            type: 'metric',
            uri: '/gdc/m1',
            format: '#,##0'
        },
        {
            id: 'date',
            title: 'Date',
            type: 'attrLabel',
            uri: '/gdc/date'
        }
    ],
    rawData: [
        [
            '2010',
            '1324'
        ]
    ]
};

const SINGLE_SERIES_CONFIG = {
    type: 'bar',
    buckets: {
        measures: [
            {
                measure: {
                    type: 'metric',
                    objectUri: '/gdc/m1',
                    metricAttributeFilters: [],
                    showInPercent: false,
                    showPoP: false,
                    format: '#,##0',
                    sorts: []
                }
            }
        ],
        categories: [
            {
                category: {
                    type: 'date',
                    collection: 'attribute',
                    displayForm: '/gdc/date',
                    dateFilterSettings: {
                        granularity: 'GDC.time.year'
                    }
                }
            }
        ]
    }
};

describe('LineFamilyChartTransformation', () => {
    function createComponent(customProps = {}) {
        const defaultProps = {
            onDataTooLarge: () => {},
            config: {
                ...config,
                legend: {
                    enabled: true,
                    position: TOP
                }
            },
            data
        };
        const props = { ...defaultProps, ...customProps };
        return <LineFamilyChartTransformation {...props} />;
    }

    it('should use custom renderer', () => {
        const lineFamilyChartRenderer = sinon.stub().returns(<div />);
        renderIntoDocument(createComponent({ lineFamilyChartRenderer }));
        expect(lineFamilyChartRenderer).to.be.calledOnce();
    });

    it('should always disable legend for single series', () => {
        const lineFamilyChartRenderer = sinon.stub().returns(<div />);
        renderIntoDocument(createComponent({
            lineFamilyChartRenderer,
            data: SINGLE_SERIES_DATA,
            config: {
                ...SINGLE_SERIES_CONFIG,
                legend: {
                    enabled: true,
                    position: TOP
                }
            },

        }));
        const calls = lineFamilyChartRenderer.getCalls();
        const passedProps = calls[0].args[0];
        expect(passedProps.legend.enabled).to.eql(false);
    });

    describe('onDataTooLarge', () => {
        function renderToNode(node, props = {}) {
            return ReactDOM.render(createComponent(props), node);
        }

        it('should be invoked if data series is over limit', () => {
            const onDataTooLarge = sinon.spy();
            const props = {
                onDataTooLarge,
                limits: {
                    series: 1
                }
            };
            renderIntoDocument(createComponent(props));
            expect(onDataTooLarge).to.be.calledOnce();
        });

        it('should be invoked if data categories is over limit', () => {
            const onDataTooLarge = sinon.spy();
            const props = {
                onDataTooLarge,
                limits: {
                    categories: 1
                }
            };
            renderIntoDocument(createComponent(props));
            expect(onDataTooLarge).to.be.calledOnce();
        });

        it('should be invoked on component mount', () => {
            const onDataTooLarge = sinon.spy();
            const props = {
                onDataTooLarge,
                limits: {
                    series: 1
                }
            };
            const component = renderIntoDocument(createComponent(props));
            const node = ReactDOM.findDOMNode(component);
            expect(node).to.equal(null);
            expect(onDataTooLarge).to.be.calledOnce();
        });

        it('should be invoked on props change', () => {
            // FIXME I am very ugly testcase
            // and I demand to be rewritten with Enzyme!

            // 1) create mount node for single component container
            const mountNode = document.createElement('div');

            // 2) Show data
            let component = renderToNode(mountNode);
            let node = ReactDOM.findDOMNode(component);
            expect(node).to.be.ok();

            const onDataTooLarge = sinon.spy();
            const props = {
                onDataTooLarge,
                limits: {
                    series: 1
                }
            };

            // 3) Render nothing and trigger callback
            component = renderToNode(mountNode, props); // re-render
            node = ReactDOM.findDOMNode(component);
            expect(node).to.equal(null);
            expect(onDataTooLarge).to.be.calledOnce();

            // 4) Show data again
            component = renderToNode(mountNode); // re-render
            node = ReactDOM.findDOMNode(component);
            expect(node).to.be.ok();
        });
    });
});
