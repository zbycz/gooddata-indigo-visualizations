import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { partial, assign } from 'lodash';
import { translation } from 'js-utils';
import 'goodstrap/packages/theme-indigo.scss';

import translations from '../src/translations/en';

import './example.scss';

import ExampleVisualization from './ExampleVisualization';
import ExampleStickyHeaderTable from './ExampleStickyHeaderTable';

import * as TestConfig from './test_config';
import * as TestData from './test_data';

const onMoreLess = (what, { rows }) => {
    console.log(`Clicked '${what}', ${rows} rows`); // eslint-disable-line no-console
};

const onMore = partial(onMoreLess, 'Show More');
const onLess = partial(onMoreLess, 'Show Less');

ReactDOM.render(
    <IntlProvider
        locale="en"
        messages={translation.flattenMessages({ visualizations: translations })}
    >
        <div>
            <h1>Examples</h1>
            <ExampleVisualization
                config={TestConfig.barChart2Series}
                data={TestData.barChart2Series}
            />
            <ExampleVisualization config={TestConfig.stackedBar} data={TestData.stackedBar} />
            <ExampleVisualization config={TestConfig.bar} data={TestData.barChart2Series} />
            <ExampleVisualization
                isResponsive
                config={assign({}, TestConfig.table, { onMore, onLess, sortInTooltip: true })}
                data={TestData.stackedBar}
            />
            <ExampleVisualization config={TestConfig.table} data={TestData.stackedBar} />
            <ExampleStickyHeaderTable config={TestConfig.table} data={TestData.stackedBar} />
            <div style={{ height: 600 }} />
        </div>
    </IntlProvider>,
    document.getElementById('viz-example')
);
