import Highcharts from 'highcharts';
import React, { PureComponent, PropTypes } from 'react';
import { cloneDeep } from 'lodash';
import cx from 'classnames';

import Chart from './Chart';
import Legend from './Legend/Legend';
import { initChartPlugins } from './highcharts/chartPlugins';
import { TOP, LEFT, BOTTOM, RIGHT } from './Legend/PositionTypes';

const CHART_TEXT_PADDING = 50;

initChartPlugins(Highcharts, CHART_TEXT_PADDING);

export default class HighChartRenderer extends PureComponent {
    static propTypes = {
        hcOptions: PropTypes.object.isRequired,
        chartOptions: PropTypes.object.isRequired,
        afterRender: PropTypes.func,
        height: PropTypes.number,
        legend: PropTypes.shape({
            enabled: PropTypes.bool,
            position: PropTypes.string,
            responsive: PropTypes.bool,
            items: PropTypes.arrayOf(PropTypes.shape({
                legendIndex: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                color: PropTypes.string.isRequired
            })).isRequired,
            onItemClick: PropTypes.func.isRequired
        })
    };

    static defaultProps = {
        afterRender: () => {},
        height: null,
        legend: {
            enabled: true,
            responsive: false,
            position: RIGHT
        }
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
                const chart = this.chartRef.getChart();

                chart.container.style.height = this.props.height || '100%';
                chart.container.style.position = this.props.height ? 'relative' : 'absolute';

                chart.reflow();
            }
        }, 0);
    }

    onLegendItemClick(item, isDisabled) {
        return this.props.legend.onItemClick(this.chartRef, item, isDisabled);
    }

    setChartRef(chartRef) {
        this.chartRef = chartRef;
    }

    getFlexDirection() {
        const { legend } = this.props;

        if (legend.position === TOP || legend.position === BOTTOM) {
            return 'column';
        }

        return 'row';
    }

    createChartConfig(chartConfig) {
        const config = cloneDeep(chartConfig);

        config.yAxis.title.style = {
            ...config.yAxis.title.style,
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        };

        if (this.props.height) {
            // fixed chart height is used in Dashboard mobile view
            // with minHeight of the container (legend overlaps)
            config.chart.height = this.props.height;
        }

        return config;
    }

    renderLegend() {
        const { chartOptions, legend, height } = this.props;
        const { items } = legend;

        if (!legend.enabled) {
            return false;
        }

        const legendProps = {
            position: legend.position,
            responsive: legend.responsive,
            chartType: chartOptions.type,
            series: items,
            onItemClick: this.onLegendItemClick,
            height
        };

        return (
            <Legend {...legendProps} />
        );
    }

    renderHighcharts() {
        const style = { flex: '1 1 auto', position: 'relative' };
        return (
            <Chart
                domProps={{ className: 'viz-react-highchart-wrap', style }}
                ref={this.setChartRef}
                config={this.createChartConfig(this.props.hcOptions)}
                callback={this.props.afterRender}
            />
        );
    }

    render() {
        const { legend } = this.props;

        const classes = cx(
            'viz-line-family-chart-wrap',
            legend.responsive ? 'responsive-legend' : 'non-responsive-legend',
            {
                [`flex-direction-${this.getFlexDirection()}`]: true
            }
        );

        const renderLegendFirst = !legend.responsive && (
            legend.position === TOP || legend.position === LEFT
        );

        return (
            <div className={classes}>
                {renderLegendFirst && this.renderLegend()}
                {this.renderHighcharts()}
                {!renderLegendFirst && this.renderLegend()}
            </div>
        );
    }
}
