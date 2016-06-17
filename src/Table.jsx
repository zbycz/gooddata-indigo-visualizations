import 'fixed-data-table/dist/fixed-data-table.css';
import './styles/table.scss';

import React, { Component, PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import Dimensions from 'react-dimensions';
import classNames from 'classnames';
import { noop } from 'lodash';

import {
    colors2Object,
    numberFormat
} from 'gdc-numberjs/lib/number';

import { getCssClass } from './utils';

const MIN_COLUMN_WIDTH = 100;
const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 480;
const DEFAULT_ROW_HEIGHT = 30;
const DEFAULT_HEADER_HEIGHT = 26;

const SORT_DIR_ASC = 'asc';
const SORT_DIR_DESC = 'desc';

function getHeaderClassName(column) {
    return classNames('gd-table-header-ordering', getCssClass(column.id, 's-id-'));
}

function getHeaderSortClassName(sortDir) {
    return classNames({
        'gd-table-arrow-up': sortDir === SORT_DIR_ASC,
        'gd-table-arrow-down': sortDir === SORT_DIR_DESC
    });
}

function getCellClassNames(rowIndex, columnKey, isSorted) {
    return classNames({
        'gd-cell-ordered': isSorted
    }, `s-cell-${rowIndex}-${columnKey}`);
}

export class TableVisualization extends Component {
    static propTypes = {
        containerWidth: PropTypes.number.isRequired,
        containerHeight: PropTypes.number,
        containerMaxHeight: PropTypes.number,
        rows: PropTypes.array.isRequired,
        headers: PropTypes.array.isRequired,
        sortDir: PropTypes.string,
        sortBy: PropTypes.number,
        onSortChange: PropTypes.func
    };

    static defaultProps = {
        rows: [],
        headers: [],
        onSortChange: noop
    };

    constructor() {
        super();
        this.state = { hintSortBy: null };
    }

    getNextSortDir(column, currentSortDir) {
        if (!currentSortDir) {
            return column.type === 'metric' ? SORT_DIR_DESC : SORT_DIR_ASC;
        }
        return currentSortDir === SORT_DIR_ASC ? SORT_DIR_DESC : SORT_DIR_ASC;
    }

    getHeaderRenderer(column, index) {
        const { sortBy, sortDir } = this.props;
        const { hintSortBy } = this.state;

        const dir = (sortBy === index ? sortDir : null);
        const nextDir = this.getNextSortDir(column, dir);

        const headerClasses = getHeaderClassName(column);
        const sortDirClasses = getHeaderSortClassName(hintSortBy === index ? nextDir : dir);

        const onClick = () => this.props.onSortChange(column, index, nextDir);
        const onMouseEnter = () => this.setState({ hintSortBy: index });
        const onMouseLeave = () => this.setState({ hintSortBy: null });

        return props => (
            <Cell
                {...props}
                className={headerClasses}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <span className="gd-table-header-title">{column.title}</span>
                <span className={sortDirClasses} />
            </Cell>
        );
    }

    getCellRenderer(column, index) {
        const { sortBy } = this.props;
        const isSorted = sortBy === index;
        return props => {
            let { rowIndex, columnKey } = props;

            let content = this.props.rows[rowIndex][columnKey];
            let classes = getCellClassNames(rowIndex, columnKey, isSorted);

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
                    cell={this.getCellRenderer(column, index)}
                    allowCellsRecycling
                />
            );
        });
    }

    render() {
        let { headers, containerWidth, containerHeight, containerMaxHeight } = this.props;
        let columnWidth = Math.max(containerWidth / headers.length, MIN_COLUMN_WIDTH);

        const height = !!containerMaxHeight ? undefined : containerHeight || DEFAULT_HEIGHT;

        return (
            <div className="indigo-table-component">
                <div className="indigo-table-component-content">
                    <Table
                        headerHeight={DEFAULT_HEADER_HEIGHT}
                        rowHeight={DEFAULT_ROW_HEIGHT}
                        rowsCount={this.props.rows.length}
                        width={containerWidth || DEFAULT_WIDTH}
                        maxHeight={containerMaxHeight}
                        height={height}
                    >
                        {this.renderColumns(columnWidth)}
                    </Table>
                </div>
            </div>
        );
    }

}

export default Dimensions()(TableVisualization); // eslint-disable-line new-cap
