import React from 'react';
import { shallow } from 'enzyme';
import { BAR } from '../../../VisualizationTypes';
import Legend, { FLUID_LEGEND_THRESHOLD } from '../Legend';
import StaticLegend from '../StaticLegend';

describe('Legend', () => {
    const series = [
        {
            name: 'series1',
            color: '#333333'
        },
        {
            name: 'series2',
            color: '#222222'
        },
        {
            name: 'series3',
            color: '#111111'
        },
        {
            name: 'series4',
            color: '#000000'
        }
    ];

    function createComponent(userProps = {}) {
        const props = {
            chartType: BAR,
            series,
            onItemClick: () => {},
            ...userProps
        };
        return shallow(<Legend {...props} />);
    }

    it('should render StaticLegend on desktop', () => {
        window.innerWidth = FLUID_LEGEND_THRESHOLD + 10;

        const legend = createComponent();
        expect(legend.find(StaticLegend)).to.have.length(1);
    });

    it('should render fluid legend on mobile', () => {
        window.innerWidth = FLUID_LEGEND_THRESHOLD - 10;

        const legend = createComponent({ isResponsive: true });
        expect(legend.find('div.viz-fluid-legend-wrap')).to.have.length(1);
    });
});
