import React from 'react';

import ExampleChart from './ExampleChart';
import ExampleTable from './ExampleTable';
import Visualization from '../src/Visualization';
import LineFamilyChart from '../src/LineFamilyChart';
import Table from '../src/Table';

export default function ExampleVisualization(props) {
    return (
        <Visualization
            lineFamilyChartRenderer={ExampleChart(LineFamilyChart)} // eslint-disable-line new-cap
            tableRenderer={ExampleTable(Table)} // eslint-disable-line new-cap
            {...props}
        />
    );
}
