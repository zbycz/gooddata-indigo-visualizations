import Highcharts from 'highcharts';
import React, { Component, PropTypes } from 'react';
import { cloneDeep, get, pick } from 'lodash';
import cx from 'classnames';

import Chart from './Chart';
import Legend from './Legend/Legend';
import { initChartPlugins } from './highcharts/chartPlugins';
import { hideDataLabels } from './highcharts/helpers';

const CHART_TEXT_PADDING = 50;

initChartPlugins(Highcharts, CHART_TEXT_PADDING);

export default class LineFamilyChart extends Component {
    static propTypes = {
        hcOptions: PropTypes.object.isRequired,
        chartOptions: PropTypes.object.isRequired,
        responsiveLegend: PropTypes.bool,
        height: PropTypes.number,
        afterRender: PropTypes.func
    };

    static defaultProps = {
        responsiveLegend: false,
        height: null,
        afterRender: () => {}
    };

    constructor(props) {
        super(props);

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
            hideDataLabels(seriesItem.points);
            seriesItem.hide();
        }
    }

    setChartRef(chartRef) {
        this.chartRef = chartRef;
    }

    getSeries() {
        return this.props.hcOptions.series.map((s) => {
            return pick(s, ['name', 'color', 'legendIndex']);
        });
    }

    getStaticLegendLayout() {
        return this.props.chartOptions.legendLayout;
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

    hasLegend() {
        const { chartOptions } = this.props;
        const seriesLength = get(chartOptions, 'data.series', []).length;

        return seriesLength > 1 || !!chartOptions.stacking;
    }


    hasFixedHeight() {
        const { responsiveLegend } = this.props;
        return this.getStaticLegendLayout() === 'vertical' || responsiveLegend;
    }

    renderLegend() {
        if (!this.hasLegend()) {
            return false;
        }

        const { chartOptions, responsiveLegend, height } = this.props;

        const legendProps = {
            isResponsive: responsiveLegend,
            legendLayout: this.getStaticLegendLayout(),
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
                <Chart
                    domProps={{ className: 'viz-react-highchart-wrap' }}
                    ref={this.setChartRef}
                    config={this.createChartConfig(this.props.hcOptions)}
                    callback={this.props.afterRender}
                />
            </div>
        );
    }

    render() {
        const { responsiveLegend } = this.props;

        const flexRow = this.getStaticLegendLayout() === 'vertical' || responsiveLegend;

        const classes = cx(
            'viz-line-family-chart-wrap',
            flexRow ? 'flex-row' : 'flex-column',
            responsiveLegend ? 'responsive-legend' : 'non-responsive-legend'
        );

        const reverse = !responsiveLegend && this.getStaticLegendLayout() === 'horizontal';

        return (
            <div className={classes}>
                {reverse && this.renderLegend()}
                {this.renderHighcharts()}
                {!reverse && this.renderLegend()}
            </div>
        );
    }
}
