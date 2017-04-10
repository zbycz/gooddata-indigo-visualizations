import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { range } from 'lodash';

import TableTransformation from '../src/Table/TableTransformation';
import ResponsiveTable from '../src/Table/ResponsiveTable';
import IntlWrapper from './utils/IntlWrapper';
import * as TestConfig from './test_data/test_config';
import * as TestData from './test_data/test_data';
import '../src/styles/table.scss';

function generateData(columns, rows) {
    const headers = range(columns)
        .map((i) => {
            return {
                type: 'attrLabel',
                id: i,
                title: `Column ${i}`
            };
        });
    const rawData = range(rows)
        .map(() => {
            return range(columns);
        });

    return {
        headers,
        rawData
    };
}

storiesOf('Table')
    .add('Fixed dimensions', () => (
        <div>
            <TableTransformation
                config={TestConfig.table}
                data={TestData.stackedBar}
                onSortChange={action('Sort changed')}
                width={600}
                height={400}
            />
        </div>
    ))
    .add('Fill parent', () => (
        <div style={{ width: '100%', height: 500 }}>
            <TableTransformation
                config={TestConfig.table}
                data={TestData.stackedBar}
                onSortChange={action('Sort changed')}
            />
        </div>
    ))
    .add('Sticky header', () => (
        <div style={{ width: '100%', height: 600 }}>
            <TableTransformation
                config={{
                    ...TestConfig.table,
                    stickyHeader: 0
                }}
                data={TestData.stackedBar}
                height={400}
            />
            <div style={{ height: 800 }} />
        </div>
    ))
    .add('Vertical scroll', () => (
        <div>
            <TableTransformation
                config={TestConfig.table}
                data={generateData(20, 20)}
                width={600}
                height={400}
            />
        </div>
    ))
    .add('Show more/Show less', () => (
        <div>
            <IntlWrapper>
                <TableTransformation
                    tableRenderer={props => (<ResponsiveTable {...props} />)}
                    config={{
                        ...TestConfig.table,
                        onMore: action('More clicked'),
                        onLess: action('Less clicked')
                    }}
                    data={generateData(20, 20)}
                    height={400}
                />
            </IntlWrapper>
        </div>
    ));
