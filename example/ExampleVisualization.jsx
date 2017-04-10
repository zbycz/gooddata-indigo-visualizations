import React, { PropTypes } from 'react';

import ExampleChart from './ExampleChart';
import ExampleTable from './ExampleTable';
import Visualization from '../src/Visualization';
import LineFamilyChart from '../src/Chart/LineFamilyChart';
import ResponsiveTable from '../src/Table/ResponsiveTable';
import PieChart from '../src/Chart/PieChart';
import Table from '../src/Table/Table';

function ExampleVisualization(props) {
    const TableRenderer = props.isResponsive ? ResponsiveTable : Table;

    // eslint-disable-next-line new-cap
    const chartRenderer = ExampleChart(LineFamilyChart, props.height);
    const pieRenderer = ExampleChart(PieChart, props.height);

    return (
        <Visualization
            lineFamilyChartRenderer={chartRenderer}
            pieChartRenderer={pieRenderer}
            tableRenderer={ExampleTable(TableRenderer)} // eslint-disable-line new-cap
            {...props}
        />
    );
}

ExampleVisualization.propTypes = {
    isResponsive: PropTypes.bool,
    height: PropTypes.number
};

ExampleVisualization.defaultProps = {
    isResponsive: false,
    height: 300
};

export default ExampleVisualization;
