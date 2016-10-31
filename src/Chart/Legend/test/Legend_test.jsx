import React from 'react';
import { render } from 'enzyme';
import { BAR_CHART } from '../../../VisualizationTypes';
import Legend, { FLUID_LEGEND_THRESHOLD } from '../Legend';
import withIntl from '../../../utils/with_intl';

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
            chartType: BAR_CHART,
            legendLayout: 'vertical',
            series,
            onItemClick: () => {},
            ...userProps
        };

        const Wrapped = withIntl(Legend);

        return render(<Wrapped {...props} />);
    }

    it('should render StaticLegend on desktop', () => {
        window.innerWidth = FLUID_LEGEND_THRESHOLD + 10;

        const legend = createComponent();
        expect(legend.find('.viz-static-legend-wrap')).to.have.length(1);
    });

    it('should render fluid legend on mobile', () => {
        window.innerWidth = FLUID_LEGEND_THRESHOLD - 10;

        const legend = createComponent({ isResponsive: true });
        expect(legend.find('.viz-fluid-legend-wrap')).to.have.length(1);
    });
});
