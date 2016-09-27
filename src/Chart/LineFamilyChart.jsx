import ReactHighcharts from 'react-highcharts';
import React, { Component, PropTypes } from 'react';
import { cloneDeep } from 'lodash';

import { initChartPlugins } from './highcharts/chartPlugins';

const Highcharts = ReactHighcharts.Highcharts;
const CHART_TEXT_PADDING = 50;

initChartPlugins(Highcharts, CHART_TEXT_PADDING);

export default class LineFamilyChart extends Component {
    static propTypes = {
        hcOptions: PropTypes.object.isRequired,
        chartOptions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.afterRender = this.afterRender.bind(this);
    }

    createChartConfig(chartConfig) {
        const config = cloneDeep(chartConfig);

        config.yAxis.title.style = {
            ...config.yAxis.title.style,
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        };
        config.legend.itemStyle = {
            ...config.legend.itemStyle,
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        };
        return config;
    }

    afterRender(chart) {
        if (!this.props.chartOptions.zoomable) {
            // do not trap mouse events, for details @see
            // https://stackoverflow.com/questions/11618075/highcharts-stop-chart-from-trapping-mouse-events-or-capture-mouse-click-on-the
            chart.container.onclick = null; //eslint-disable-line
            chart.container.onmousedown = null; //eslint-disable-line
        }
    }

    render() {
        return (
            <ReactHighcharts
                ref={ref => (this.chart = ref)}
                config={this.createChartConfig(this.props.hcOptions)}
                callback={this.afterRender}
            />
        );
    }
}
