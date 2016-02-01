import React, { Component, PropTypes } from 'react';
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
    isDataOfReasonableSize
} from './highChartsCreators';

import ReactHighcharts from 'react-highcharts/bundle/highcharts';
import './styles/chart.scss';

export default class extends Component {
    static propTypes = {
        config: PropTypes.object.required,
        data: PropTypes.shape({
            isLoaded: PropTypes.bool.required,
            isLoading: PropTypes.bool.required,
            isLoadError: PropTypes.bool.required,
            headers: PropTypes.arrayOf(PropTypes.object),
            rawData: PropTypes.arrayOf(PropTypes.array)
        })
    };

    render() {
        let { config, data } = this.props;
        let chartOptions,
            hcOptions,
            component;
        if (config.visualizationType === 'column' ||
            config.visualizationType === 'line' ||
            config.visualizationType === 'bar') {
            let lineConfig = transformConfigToLine(config);
            chartOptions = getLineFamilyChartOptions(lineConfig, data);
            chartOptions.data = getLineFamilyChartData(lineConfig, data);

            if (!isDataOfReasonableSize(chartOptions.data)) {
                return <div>Too big</div>;
            }

            if (config.visualizationType === 'column') {
                hcOptions = getColumnChartConfiguration(chartOptions);
            } else if (config.visualizationType === 'line') {
                hcOptions = getLineChartConfiguration(chartOptions);
            }
            component = <ReactHighcharts config={hcOptions} />;
        }

        return (<div className="indigo-component">
            <h2>Chart</h2>
            {component}
            <h2>ChartOptions</h2>
            <pre>
                {JSON.stringify(chartOptions, null, 2)}
            </pre>
            <h2>hcOptions</h2>
            <pre>
                {JSON.stringify(hcOptions, null, 2)}
            </pre>
        </div>);
    }
}
