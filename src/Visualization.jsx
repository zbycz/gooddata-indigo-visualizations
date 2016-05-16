import React, { Component, PropTypes } from 'react';
import includes from 'lodash/includes';
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

import { getSortInfo } from './utils';

import './styles/chart.scss';

import LineFamilyChart from './LineFamilyChart';
import Table from './Table';

function isLineFamily(visType) {
    return includes(['column', 'line', 'bar'], visType);
}

export function renderLineFamilyChart(props) {
    return <LineFamilyChart {...props} />;
}
export function renderTable(props) {
    return <Table {...props} />;
}

export default class extends Component {
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

        lineFamilyChartRenderer: PropTypes.func.isRequired,
        tableRenderer: PropTypes.func.isRequired,
        onDataTooLarge: PropTypes.func
    };

    static defaultProps = {
        lineFamilyChartRenderer: renderLineFamilyChart,
        tableRenderer: renderTable
    };

    componentWillMount() {
        this.createChartOptions(this.props);
    }

    componentWillUpdate(nextProps) {
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

    renderLineFamily() {
        const config = this.props.config;
        const chartOptions = this.chartOptions;

        if (this.state.dataTooLarge) {
            return null;
        }

        let visType = config.type,
            hcOptions;

        if (visType === 'column') {
            hcOptions = getColumnChartConfiguration(chartOptions);
        } else if (visType === 'bar') {
            hcOptions = getBarChartConfiguration(chartOptions);
        } else if (visType === 'line') {
            hcOptions = getLineChartConfiguration(chartOptions);
        }

        return this.props.lineFamilyChartRenderer({ chartOptions, hcOptions });
    }

    renderTable() {
        let { data: { headers, rawData }, config } = this.props;
        let { sortBy, sortDir } = getSortInfo(config);

        return this.props.tableRenderer({
            rows: rawData,
            headers,
            sortBy,
            sortDir
        });
    }

    render() {
        let visType = this.props.config.type,
            component;

        if (isLineFamily(visType)) {
            component = this.renderLineFamily();
        } else if (visType === 'table') {
            component = this.renderTable();
        }

        return component;
    }
}
