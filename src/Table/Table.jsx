import React, { Component } from 'react';
import Dimensions from 'react-dimensions';
import TableVisualization from './TableVisualization';

export default class Table extends Component {

    render() {
        const Wrapped = Dimensions()(TableVisualization); // eslint-disable-line new-cap

        return (
            <div className="viz-table-wrap">
                <Wrapped {...this.props} />
            </div>
        );
    }
}
