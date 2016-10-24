import ReactHighcharts from 'react-highcharts';
import React, { Component, PropTypes } from 'react';
import { cloneDeep, get, pick } from 'lodash';
import cx from 'classnames';

import Legend from './Legend/Legend';
import { initChartPlugins } from './highcharts/chartPlugins';

const Highcharts = ReactHighcharts.Highcharts;
const CHART_TEXT_PADDING = 50;

initChartPlugins(Highcharts, CHART_TEXT_PADDING);

export default class LineFamilyChart extends Component {
    static propTypes = {
        hcOptions: PropTypes.object.isRequired,
        chartOptions: PropTypes.object.isRequired,
        responsiveLegend: PropTypes.bool,
        height: PropTypes.number
    };

    static defaultProps = {
        responsiveLegend: false
    };

    constructor(props) {
        super(props);

        this.afterRender = this.afterRender.bind(this);
        this.setChartRef = this.setChartRef.bind(this);
        this.onLegendItemClick = this.onLegendItemClick.bind(this);
    }

    componentDidMount() {
        // http://stackoverflow.com/questions/18240254/highcharts-width-exceeds-container-div-on-first-load
        setTimeout(() => {
            if (this.chartRef) {
                this.chartRef.getChart().reflow();
            }
        }, 0);
    }

    onLegendItemClick(item, isDisabled) {
        const seriesItem = this.chartRef.chart.series[item.legendIndex];
        if (isDisabled) {
            seriesItem.show();
        } else {
            seriesItem.hide();
        }
    }

    setChartRef(chartRef) {
        this.chartRef = chartRef;
    }

    getSeries() {
        return this.props.hcOptions.series.map(s => {
            return pick(s, ['name', 'color', 'legendIndex']);
        });
    }

    createChartConfig(chartConfig) {
        const config = cloneDeep(chartConfig);

        config.yAxis.title.style = {
            ...config.yAxis.title.style,
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        };

        if (this.hasFixedHeight()) {
            config.chart.height = this.props.height;
        }

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

    isStacking() {
        return !!this.props.chartOptions.stacking; // can be null
    }

    hasLegend() {
        const { chartOptions } = this.props;
        const seriesLength = get(chartOptions, 'data.series', []).length;

        return seriesLength > 1 || this.isStacking();
    }

    hasFixedHeight() {
        const { responsiveLegend } = this.props;
        return this.isStacking() || responsiveLegend;
    }

    renderLegend() {
        if (!this.hasLegend()) {
            return false;
        }

        const { chartOptions, responsiveLegend, height } = this.props;

        const legendProps = {
            isResponsive: responsiveLegend,
            isStacking: this.isStacking(),
            chartType: chartOptions.type,
            series: this.getSeries(),
            onItemClick: this.onLegendItemClick,
            height
        };

        return (
            <Legend {...legendProps} />
        );
    }

    renderHighcharts() {
        return (
            <div className="viz-line-family-chart">
                <ReactHighcharts
                    domProps={{ className: 'viz-react-highchart-wrap' }}
                    ref={this.setChartRef}
                    config={this.createChartConfig(this.props.hcOptions)}
                    callback={this.afterRender}
                />
            </div>
        );
    }

    render() {
        const { responsiveLegend } = this.props;
        const isStacking = this.isStacking();

        const flexRow = isStacking || responsiveLegend;

        const classes = cx(
            'viz-line-family-chart-wrap',
            flexRow ? 'flex-row' : 'flex-column',
            responsiveLegend ? 'responsive-legend' : 'non-responsive-legend'
        );

        const reverse = !responsiveLegend && !isStacking;

        return (
            <div className={classes}>
                {reverse && this.renderLegend()}
                {this.renderHighcharts()}
                {!reverse && this.renderLegend()}
            </div>
        );
    }
}
