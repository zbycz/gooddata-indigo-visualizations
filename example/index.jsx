import ReactDOM from 'react-dom';
import React from 'react';

import Visualization from '../src/Visualization';
import * as TestConfig from './test_config';
import * as TestData from './test_data';

ReactDOM.render(
    <div>
        <Visualization config={TestConfig.barChart2Series} data={TestData.barChart2Series} />
        <Visualization config={TestConfig.stackedBar} data={TestData.stackedBar} />
    </div>,
    document.getElementById('viz-example')
);
