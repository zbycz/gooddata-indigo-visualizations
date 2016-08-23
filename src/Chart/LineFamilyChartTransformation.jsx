import React, { Component, PropTypes } from 'react';
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

import { LINE_CHART, BAR_CHART, COLUMN_CHART } from '../VisualizationTypes';
import LineFamilyChart from './LineFamilyChart';

export function renderLineFamilyChart(props) {
    return <LineFamilyChart {...props} />;
}

export default class LineFamilyChartTransformation extends Component {
    static propTypes = {
        config: PropTypes.shape({
            buckets: PropTypes.object.isRequired,
            type: PropTypes.string.isRequired
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

        lineFamilyChartRenderer: PropTypes.func.isRequired,
        onDataTooLarge: PropTypes.func
    };

    static defaultProps = {
        lineFamilyChartRenderer: renderLineFamilyChart
    };

    componentWillMount() {
        this.createChartOptions(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.createChartOptions(nextProps);
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

        const type = this.props.config.type;
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

        if (this.props.height) {
            hcOptions.chart.height = this.props.height;
        }

        if (!type) {
            invariant(`Unknown visualization type: ${type}`);
        }

        return this.props.lineFamilyChartRenderer({ chartOptions, hcOptions });
    }
}
