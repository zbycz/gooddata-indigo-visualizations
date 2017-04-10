import React from 'react';
import { storiesOf } from '@kadira/storybook';

import PieChartTransformation from '../src/Chart/PieChartTransformation';
import * as TestData from './test_data/test_data';
import wrap from './utils/wrap';

storiesOf('Pie Chart')
    .add('Basic', () => (
        wrap(
            <PieChartTransformation
                config={{
                    legend: {
                        enabled: true,
                        position: 'bottom',
                        responsive: false
                    }
                }}
                data={TestData.pieChart}
            />
        )
    ));
