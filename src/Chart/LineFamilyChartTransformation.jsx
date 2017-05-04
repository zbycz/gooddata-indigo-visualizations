import React, { Component, PropTypes } from 'react';
import { get, pick } from 'lodash';
import invariant from 'invariant';
import {
    transformConfigToLine
} from './chartConfigCreators';

import {
    getLineFamilyChartData,
    getLineFamilyChartOptions
} from './chartCreators';

import {
    getLineChartConfiguration,
    getColumnChartConfiguration,
    getBarChartConfiguration,
    isDataOfReasonableSize
} from './highChartsCreators';

import { hideDataLabels } from './highcharts/helpers';

import { LINE_CHART, BAR_CHART, COLUMN_CHART } from '../VisualizationTypes';
import HighChartRenderer from './HighChartRenderer';

export function renderLineFamilyChart(props) {
    return <HighChartRenderer {...props} />;
}

export default class LineFamilyChartTransformation extends Component {
    static propTypes = {
        config: PropTypes.shape({
            buckets: PropTypes.object.isRequired,
            type: PropTypes.string.isRequired,
            legend: PropTypes.shape({
                enabled: PropTypes.bool
            }),
            colors: PropTypes.arrayOf(PropTypes.string)
        }).isRequired,
        limits: PropTypes.shape({
            series: PropTypes.number,
            categories: PropTypes.number
        }),
        data: PropTypes.shape({
            headers: PropTypes.arrayOf(PropTypes.object),
            rawData: PropTypes.arrayOf(PropTypes.array)
        }).isRequired,
        height: PropTypes.number,
        width: PropTypes.number,

        afterRender: PropTypes.func,
        lineFamilyChartRenderer: PropTypes.func.isRequired,
        onDataTooLarge: PropTypes.func
    };

    static defaultProps = {
        lineFamilyChartRenderer: renderLineFamilyChart,
        afterRender: () => {}
    };

    constructor(props) {
        super(props);

        this.onLegendItemClick = this.onLegendItemClick.bind(this);
    }

    componentWillMount() {
        this.createChartOptions(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.createChartOptions(nextProps);
    }

    onLegendItemClick(chartRef, item, isDisabled) {
        const seriesItem = chartRef.chart.series[item.legendIndex];
        if (isDisabled) {
            seriesItem.show();
        } else {
            hideDataLabels(seriesItem.points);
            seriesItem.hide();
        }
    }

    getLegendItems(hcOptions) {
        return hcOptions.series.map((s) => {
            return pick(s, ['name', 'color', 'legendIndex']);
        });
    }

    hasLegend(chartOptions, legend) {
        const seriesLength = get(chartOptions, 'data.series', []).length;

        return legend.enabled && (
            seriesLength > 1 || !!chartOptions.stacking
        );
    }

    createChartOptions(props) {
        const { config, data, onDataTooLarge, limits } = props;
        const lineConfig = transformConfigToLine(config);
        this.chartOptions = getLineFamilyChartOptions(lineConfig, data);
        this.chartOptions.data = getLineFamilyChartData(lineConfig, data);

        if (!isDataOfReasonableSize(this.chartOptions.data, limits)) {
            if (!onDataTooLarge) {
                invariant(onDataTooLarge, 'Visualization\'s onDataTooLarge callback is missing.');
            }

            onDataTooLarge();
            this.setState({ dataTooLarge: true });
        } else {
            this.setState({ dataTooLarge: false });
        }
    }

    render() {
        if (this.state.dataTooLarge) {
            return null;
        }

        const { height, width, config } = this.props;
        const { type, legend } = config;
        const chartOptions = this.chartOptions;

        let hcOptions;
        if (type === COLUMN_CHART) {
            hcOptions = getColumnChartConfiguration(chartOptions);
        }
        if (type === BAR_CHART) {
            hcOptions = getBarChartConfiguration(chartOptions);
        }
        if (type === LINE_CHART) {
            hcOptions = getLineChartConfiguration(chartOptions);
        }

        if (!type) {
            invariant(`Unknown visualization type: ${type}`);
        }

        return this.props.lineFamilyChartRenderer({
            chartOptions,
            hcOptions,
            height,
            width,
            afterRender: this.props.afterRender,
            legend: {
                ...legend,
                enabled: this.hasLegend(chartOptions, legend),
                items: this.getLegendItems(hcOptions),
                onItemClick: this.onLegendItemClick
            }
        });
    }
}
