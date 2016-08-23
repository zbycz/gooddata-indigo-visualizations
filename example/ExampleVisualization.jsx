import React, { PropTypes } from 'react';

import ExampleChart from './ExampleChart';
import ExampleTable from './ExampleTable';
import Visualization from '../src/Visualization';
import LineFamilyChart from '../src/Chart/LineFamilyChart';
import ResponsiveTable from '../src/Table/ResponsiveTable';
import Table from '../src/Table/Table';

function ExampleVisualization(props) {
    const TableRenderer = props.isResponsive ? ResponsiveTable : Table;

    return (
        <Visualization
            lineFamilyChartRenderer={ExampleChart(LineFamilyChart)} // eslint-disable-line new-cap
            tableRenderer={ExampleTable(TableRenderer)} // eslint-disable-line new-cap
            {...props}
        />
    );
}

ExampleVisualization.propTypes = {
    isResponsive: PropTypes.bool
};

export default ExampleVisualization;
