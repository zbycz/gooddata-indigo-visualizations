import ReactDOM from 'react-dom';

import Visualization from '../src/Visualization';
import testConfig from './test_config';
import testData from './test_data';

ReactDOM.render(
    <Visualization config={testConfig} data={testData[1]} />,
    document.getElementById('viz-example')
);
