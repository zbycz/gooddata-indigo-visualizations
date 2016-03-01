import React from 'react';
import ReactDOM from 'react-dom';

import ExampleVisualization from './ExampleVisualization';
import * as TestConfig from './test_config';
import * as TestData from './test_data';

ReactDOM.render(
    <div>
        <h1>Examples</h1>

        <ExampleVisualization config={TestConfig.barChart2Series} data={TestData.barChart2Series} />
        <ExampleVisualization config={TestConfig.stackedBar} data={TestData.stackedBar} />
        <ExampleVisualization config={TestConfig.bar} data={TestData.barChart2Series} />
        <ExampleVisualization config={TestConfig.table} data={TestData.stackedBar} />
    </div>,
    document.getElementById('viz-example')
);
