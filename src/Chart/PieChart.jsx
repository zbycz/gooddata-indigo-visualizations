import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import { pick, cloneDeep } from 'lodash';

import Chart from './Chart';
import Legend from './Legend/Legend';

export default class PieChart extends Component {
    static propTypes = {
        hcOptions: PropTypes.object.isRequired,
        chartOptions: PropTypes.object.isRequired,
        responsiveLegend: PropTypes.bool,
        height: PropTypes.number
    };

    static defaultProps = {
        responsiveLegend: false,
        height: null
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

    onLegendItemClick(item) {
        const seriesItem = this.chartRef.chart.series[0].data[item.legendIndex];
        seriesItem.setVisible();
    }

    getStaticLegendLayout() {
        return this.props.chartOptions.legendLayout;
    }

    getSeries() {
        return this.props.hcOptions.series[0].data.map((s) => {
            return pick(s, ['name', 'color', 'legendIndex']);
        });
    }

    setChartRef(chartRef) {
        this.chartRef = chartRef;
    }

    hasLegend() {
        return (this.props.chartOptions.data.series[0].data.length > 1);
    }

    hasFixedHeight() {
        const { responsiveLegend } = this.props;
        return this.getStaticLegendLayout() === 'vertical' || responsiveLegend;
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
