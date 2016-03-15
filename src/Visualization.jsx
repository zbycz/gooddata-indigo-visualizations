import React, { Component, PropTypes } from 'react';
import includes from 'lodash/includes';

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

import './styles/chart.scss';

import LineFamilyChart from './LineFamilyChart';
import Table from './Table';
import DataTooLarge from './DataTooLarge';

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
        config: PropTypes.object.isRequired,
        data: PropTypes.shape({
            headers: PropTypes.arrayOf(PropTypes.object),
            rawData: PropTypes.arrayOf(PropTypes.array)
        }).isRequired,

        lineFamilyChartRenderer: PropTypes.func.isRequired,
        tableRenderer: PropTypes.func.isRequired
    };

    static defaultProps = {
        lineFamilyChartRenderer: renderLineFamilyChart,
        tableRenderer: renderTable
    };

    renderLineFamily() {
        let { config, data } = this.props;

        let lineConfig = transformConfigToLine(config);
        let chartOptions = getLineFamilyChartOptions(lineConfig, data);
        chartOptions.data = getLineFamilyChartData(lineConfig, data);

        if (!isDataOfReasonableSize(chartOptions.data)) {
            return <DataTooLarge />;
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
        let { headers, rawData } = this.props.data;

        return this.props.tableRenderer({
            rows: rawData,
            headers
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
