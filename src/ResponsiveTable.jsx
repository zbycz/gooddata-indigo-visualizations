import React, { Component, PropTypes } from 'react';
import TableVisualization, { DEFAULT_HEADER_HEIGHT, DEFAULT_ROW_HEIGHT } from './Table';
import TableControls from './TableControls';
import { bindAll, noop } from 'lodash';

export const HEIGHT_PADDING = 20;

export default class ResponsiveTable extends Component {
    static propTypes = {
        rowsPerPage: PropTypes.number.isRequired,
        rows: PropTypes.array.isRequired,
        onMore: PropTypes.func,
        onLess: PropTypes.func
    };

    static defaultProps = {
        onMore: noop,
        onLess: noop
    };

    constructor() {
        super();

        this.state = {
            page: 1
        };

        bindAll(this, ['onMore', 'onLess', 'setTableRef']);
    }

    onMore() {
        const page = this.state.page + 1;

        this.setState({ page });

        this.props.onMore({ rows: this.getRowCount(page) });
    }

    onLess() {
        this.setState({ page: 1 });

        this.props.onLess({ rows: this.getRowCount(1) });

        const header = this.table.getBoundingClientRect();
        window.scrollTo(window.pageXOffset, window.pageYOffset + header.top);
    }

    getRowCount(page) {
        return Math.min(this.props.rows.length, this.props.rowsPerPage * page);
    }

    getContainerMaxHeight() {
        return (this.props.rows.length * DEFAULT_ROW_HEIGHT) +
            DEFAULT_HEADER_HEIGHT + HEIGHT_PADDING;
    }

    setTableRef(table) {
        this.table = table;
    }

    isMoreButtonVisible() {
        return this.props.rows.length > this.props.rowsPerPage;
    }

    isMoreButtonDisabled() {
        return this.props.rows.length <= this.props.rowsPerPage * this.state.page;
    }

    isLessButtonVisible() {
        return this.state.page > 1;
    }

    render() {
        const props = this.props;

        const newProps = {
            ...props,
            rows: props.rows.slice(0, this.getRowCount(this.state.page)),
            containerHeight: 0,
            containerMaxHeight: this.getContainerMaxHeight(),
            hasHiddenRows: !this.isMoreButtonDisabled()
        };

        return (
            <div className="gdc-indigo-responsive-table" ref={this.setTableRef}>
                <TableVisualization {...newProps} />
                <TableControls
                    {...props}
                    onMore={this.onMore}
                    onLess={this.onLess}
                    isMoreButtonDisabled={this.isMoreButtonDisabled()}
                    isMoreButtonVisible={this.isMoreButtonVisible()}
                    isLessButtonVisible={this.isLessButtonVisible()}
                />
            </div>
        );
    }
}
