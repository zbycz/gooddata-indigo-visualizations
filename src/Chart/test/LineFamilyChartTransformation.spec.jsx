import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import { shallow } from 'enzyme';
import LineFamilyChartTransformation from '../LineFamilyChartTransformation';
import { data, config } from '../../test/fixtures';
import { TOP } from '../Legend/PositionTypes';
import HighChartRenderer from '../HighChartRenderer';

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
    const defaultProps = {
        onDataTooLarge: () => {},
        config,
        data
    };

    function createComponent(customProps = {}) {
        const props = { ...defaultProps, ...customProps };
        return <LineFamilyChartTransformation {...props} />;
    }

    it('should use custom renderer', () => {
        const lineFamilyChartRenderer = jest.fn().mockReturnValue(<div />);
        renderIntoDocument(createComponent({ lineFamilyChartRenderer }));
        expect(lineFamilyChartRenderer).toHaveBeenCalled();
    });

    it('should always disable legend for single series', () => {
        const lineFamilyChartRenderer = jest.fn().mockReturnValue(<div />);
        renderIntoDocument(createComponent({
            lineFamilyChartRenderer,
            data: SINGLE_SERIES_DATA,
            config: {
                ...SINGLE_SERIES_CONFIG,
                legend: {
                    enabled: true,
                    position: TOP
                }
            }
        }));
        const passedProps = lineFamilyChartRenderer.mock.calls[0][0];
        expect(passedProps.legend.enabled).toEqual(false);
    });

    describe('onDataTooLarge', () => {
        it('should be invoked if data series is over limit', () => {
            const onDataTooLarge = jest.fn();
            const props = {
                onDataTooLarge,
                limits: {
                    series: 1
                }
            };
            renderIntoDocument(createComponent(props));
            expect(onDataTooLarge).toHaveBeenCalled();
        });

        it('should be invoked if data categories is over limit', () => {
            const onDataTooLarge = jest.fn();
            const props = {
                onDataTooLarge,
                limits: {
                    categories: 1
                }
            };
            renderIntoDocument(createComponent(props));
            expect(onDataTooLarge).toHaveBeenCalled();
        });

        it('should be invoked on component mount', () => {
            const onDataTooLarge = jest.fn();
            const props = {
                onDataTooLarge,
                limits: {
                    series: 1
                }
            };
            const wrapper = shallow(createComponent(props));
            expect(wrapper.find(HighChartRenderer)).toHaveLength(0);
            expect(onDataTooLarge).toHaveBeenCalled();
        });

        it('should be invoked on props change', () => {
            const onDataTooLarge = jest.fn();
            const props = {
                onDataTooLarge,
                limits: {
                    series: 1
                }
            };
            const wrapper = shallow(createComponent());
            expect(wrapper.find(HighChartRenderer)).toHaveLength(1);

            wrapper.setProps(props);
            expect(wrapper.find(HighChartRenderer)).toHaveLength(0);
            expect(onDataTooLarge).toHaveBeenCalled();

            wrapper.setProps({
                ...defaultProps,
                limits: null
            });
            expect(wrapper.find(HighChartRenderer)).toHaveLength(1);
        });
    });
});
