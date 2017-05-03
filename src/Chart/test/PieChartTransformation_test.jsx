import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import { shallow } from 'enzyme';
import PieChartTransformation from '../PieChartTransformation';
import HighChartRenderer from '../HighChartRenderer';
import { TOP } from '../Legend/PositionTypes';
import { data, config } from '../../test/fixtures';


const SINGLE_DATA_METRIC_DATA = {
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

const SINGLE_DATA_METRIC_CONFIG = {
    type: 'pie',
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

describe('PieChartTransformation', () => {
    function createComponent(customProps = {}) {
        const defaultProps = {
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
        return <PieChartTransformation {...props} />;
    }

    it('should use custom renderer', () => {
        const pieChartRenderer = sinon.stub().returns(<div />);
        renderIntoDocument(createComponent({ pieChartRenderer }));
        expect(pieChartRenderer).to.be.calledOnce();
    });

    it('should always disable legend for serie with one value', () => {
        const pieChartRenderer = sinon.stub().returns(<div />);
        renderIntoDocument(createComponent({
            pieChartRenderer,
            data: SINGLE_DATA_METRIC_DATA,
            config: {
                ...SINGLE_DATA_METRIC_CONFIG,
                legend: {
                    enabled: true,
                    position: TOP
                }
            }
        }));
        const calls = pieChartRenderer.getCalls();
        const passedProps = calls[0].args[0];
        expect(passedProps.legend.enabled).to.eql(false);
    });

    it('should render HighChartRenderer', () => {
        const wrapper = shallow(createComponent());
        expect(wrapper.find(HighChartRenderer)).to.have.length(1);
    });
});
