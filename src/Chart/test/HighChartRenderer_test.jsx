import React from 'react';
import { shallow } from 'enzyme';

import HighChartRenderer from '../HighChartRenderer';
import Chart from '../Chart';
import Legend from '../Legend/Legend';
import { LEFT } from '../Legend/PositionTypes';
import { BAR_CHART } from '../../VisualizationTypes';

function createComponent(customProps) {
    const props = {
        hcOptions: {
            yAxis: {
                title: {}
            }
        },
        chartOptions: {
            type: BAR_CHART
        },
        legend: {
            enabled: false,
            items: [],
            onItemClick: () => {}
        },
        ...customProps
    };
    return shallow(<HighChartRenderer {...props} />);
}

describe('HighChartRenderer', () => {
    it('should render chart without legend', () => {
        const wrapper = createComponent();
        expect(wrapper.find(Chart)).to.have.length(1);
        expect(wrapper.find(Legend)).to.have.length(0);
    });

    it('should render legend if enabled', () => {
        const wrapper = createComponent({
            legend: {
                enabled: true,
                items: [
                    {
                        legendIndex: 0,
                        name: 'test',
                        color: 'rgb(0, 0, 0)'
                    }
                ],
                position: LEFT,
                onItemClick: () => {}
            }
        });
        expect(wrapper.find(Chart)).to.have.length(1);
        expect(wrapper.find(Legend)).to.have.length(1);
    });
});
