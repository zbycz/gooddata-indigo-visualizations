import React, { Component, PropTypes } from 'react';
import { getPieChartOptions, getPieFamilyChartData } from './chartCreators';
import { getPieChartConfiguration } from './highChartsCreators';

import PieChart from './PieChart';

function renderPieChartTransformation(props) {
    return <PieChart {...props} />;
}

export default class PieChartTransformation extends Component {
    static propTypes = {
        data: PropTypes.shape({
            rawData: PropTypes.arrayOf(PropTypes.array)
        }).isRequired,
        responsiveLegend: PropTypes.bool,
        height: PropTypes.number,
        afterRender: PropTypes.func,
        pieChartRenderer: PropTypes.func.isRequired
    };

    static defaultProps = {
        afterRender: () => {},
        pieChartRenderer: renderPieChartTransformation
    };

    render() {
        const {
            data,
            responsiveLegend,
            height,
            afterRender
        } = this.props;

        const chartOptions = getPieChartOptions({
            type: 'pie',
            height
        }, data);

        chartOptions.data = getPieFamilyChartData(chartOptions, data);

        const hcOptions = getPieChartConfiguration(chartOptions);

        return this.props.pieChartRenderer({
            hcOptions,
            responsiveLegend,
            chartOptions,
            height,
            afterRender
        });
    }
}
