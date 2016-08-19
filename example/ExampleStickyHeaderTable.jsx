import React, { Component } from 'react';
import Visualization from '../src/Visualization';
import DefaultSizeVisualization from './DefaultSizeVisualization';
import Table from '../src/Table/ResponsiveTable';
import ExampleTable from './ExampleTable';

export default class ExampleStickyHeaderTable extends Component {

    render() {
        const props = {
            data: this.props.data,
            config: {
                ...this.props.config,
                stickyHeader: 0,
                sortInTooltip: true
            },
            onSortChange: (...args) => console.log('Table sorted', args) // eslint-disable-line
        };

        return (
            <div>
                <h2>Mobile Sticky Table</h2>
                <DefaultSizeVisualization>
                    <Visualization
                        {...props}
                        rowsPerPage={8}
                        tableRenderer={ExampleTable(Table)} // eslint-disable-line new-cap
                    />
                </DefaultSizeVisualization>
            </div>
        );
    }
}
