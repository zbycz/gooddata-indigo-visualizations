import 'fixed-data-table/dist/fixed-data-table.css';

import React, { Component, PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import Dimensions from 'react-dimensions';

import {
    colors2Object,
    numberFormat
} from 'gdc-numberjs/lib/number';

import { getCssClass } from './utils';

const MIN_COLUMN_WIDTH = 100;
const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 480;
const DEFAULT_ROW_HEIGHT = 24;
const DEFAULT_HEADER_HEIGHT = 24;

function getHeaderClassName(column) {
    return getCssClass(column.id, 's-id-');
}

function getCellClassName(row, column) {
    return `s-cell-${row}-${column}`;
}

function getCellClassNames(column, rowKey, cellKey) {
    return getCellClassName(rowKey, cellKey);
}

export class TableVisualization extends Component {
    static propTypes = {
        containerWidth: PropTypes.number.isRequired,
        containerHeight: PropTypes.number.isRequired,
        rows: PropTypes.array.isRequired,
        headers: PropTypes.array.isRequired
    };

    static defaultProps = {
        rows: [],
        headers: []
    };

    getHeaderRenderer(column) {
        return props => {
            let headerClasses = getHeaderClassName(column);

            return (
                <Cell {...props} className={headerClasses}>{column.title}</Cell>
            );
        };
    }

    getCellRenderer(column) {
        return props => {
            let { rowIndex, columnKey } = props;

            let content = this.props.rows[rowIndex][columnKey];
            let classes = getCellClassNames(column, rowIndex, columnKey);

            let { style, label } = this.getStyledLabel(column, content);

            return (
                <Cell {...props}>
                    <span className={classes} style={style}>{label}</span>
                </Cell>
            );
        };
    }

    getStyledLabel(column, content) {
        if (column.type !== 'metric') {
            return { style: {}, label: content };
        }

        let { label, color } = colors2Object(
            numberFormat(content === null ? '' : content, column.format)
        );

        let style = color ? { color } : {};

        return { style, label };
    }

    renderColumns(columnWidth) {
        return this.props.headers.map((column, index) => {
            let align = (column.type === 'metric') ? 'right' : 'left';

            return (
                <Column
                    key={`${index}.${column.id}`}
                    width={columnWidth}
                    align={align}
                    columnKey={index}
                    header={this.getHeaderRenderer(column, index)}
                    cell={this.getCellRenderer(column)}
                    allowCellsRecycling
                />
            );
        });
    }

    render() {
        let { headers, containerWidth, containerHeight } = this.props;
        let columnWidth = Math.max(containerWidth / headers.length, MIN_COLUMN_WIDTH);

        return (
            <Table
                headerHeight={DEFAULT_HEADER_HEIGHT}
                rowHeight={DEFAULT_ROW_HEIGHT}
                rowsCount={this.props.rows.length}
                width={containerWidth || DEFAULT_WIDTH}
                height={containerHeight || DEFAULT_HEIGHT}
            >
                {this.renderColumns(columnWidth)}
            </Table>
        );
    }

}

export default Dimensions()(TableVisualization); // eslint-disable-line new-cap
