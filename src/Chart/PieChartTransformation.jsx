import React, { Component, PropTypes } from 'react';
import { pick } from 'lodash';

import { getPieChartOptions, getPieFamilyChartData } from './chartCreators';
import { getPieChartConfiguration } from './highChartsCreators';
import { PIE_CHART } from '../VisualizationTypes';
import HighChartRenderer from './HighChartRenderer';

function renderPieChartTransformation(props) {
    return <HighChartRenderer {...props} />;
}

export default class PieChartTransformation extends Component {
    static propTypes = {
        config: PropTypes.shape({
            legend: PropTypes.shape({
                enabled: PropTypes.bool
            })
        }).isRequired,
        data: PropTypes.shape({
            rawData: PropTypes.arrayOf(PropTypes.array)
        }).isRequired,
        height: PropTypes.number,
        width: PropTypes.number,
        afterRender: PropTypes.func,
        pieChartRenderer: PropTypes.func.isRequired
    };

    static defaultProps = {
        afterRender: () => {},
        pieChartRenderer: renderPieChartTransformation
    };

    constructor(props) {
        super(props);

        this.onLegendItemClick = this.onLegendItemClick.bind(this);
    }

    onLegendItemClick(chartRef, item) {
        const seriesItem = chartRef.chart.series[0].data[item.legendIndex];
        seriesItem.setVisible();
    }

    getLegendItems(hcOptions) {
        return hcOptions.series[0].data.map((s) => {
            return pick(s, ['name', 'color', 'legendIndex']);
        });
    }

    hasLegend(chartOptions, legend) {
        return legend.enabled && chartOptions.data.series[0].data.length > 1;
    }

    render() {
        const {
            data,
            config: {
                legend
            },
            height,
            width,
            afterRender
        } = this.props;

        const chartOptions = getPieChartOptions({
            type: PIE_CHART,
            height
        }, data);

        chartOptions.data = getPieFamilyChartData(chartOptions, data);

        const hcOptions = getPieChartConfiguration(chartOptions);

        return this.props.pieChartRenderer({
            chartOptions,
            hcOptions,
            legend: {
                ...legend,
                enabled: this.hasLegend(chartOptions, legend),
                items: this.getLegendItems(hcOptions),
                onItemClick: this.onLegendItemClick
            },
            height,
            width,
            afterRender
        });
    }
}
