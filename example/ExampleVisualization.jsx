import React from 'react';

import ExampleChart from './ExampleChart';
import ExampleTable from './ExampleTable';
import Visualization from '../src/Visualization';
import LineFamilyChart from '../src/LineFamilyChart';
import ResponsiveTable from '../src/ResponsiveTable';
import Table from '../src/Table';

export default function ExampleVisualization(props) {
    const TableRenderer = props.isResponsive ? ResponsiveTable : Table;

    return (
        <Visualization
            lineFamilyChartRenderer={ExampleChart(LineFamilyChart)} // eslint-disable-line new-cap
            tableRenderer={ExampleTable(TableRenderer)} // eslint-disable-line new-cap
            {...props}
        />
    );
}
