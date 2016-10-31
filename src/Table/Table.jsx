import React, { Component } from 'react';
import Measure from 'react-measure';
import TableVisualization from './TableVisualization';

export default class Table extends Component {

    render() {
        return (
            <Measure>
                {dimensions => (
                    <div className="viz-table-wrap">
                        <TableVisualization
                            {...this.props}
                            containerWidth={dimensions.width}
                            containerHeight={dimensions.height}
                        />
                    </div>
                )}
            </Measure>
        );
    }
}
