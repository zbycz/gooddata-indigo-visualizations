import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';

import Table from './Table';
import { getSortInfo } from './utils';

export function renderTable(props) {
    return <Table {...props} />;
}

export default class TableTransformation extends Component {

    static propTypes = {
        config: PropTypes.object,
        data: PropTypes.shape({
            headers: PropTypes.arrayOf(PropTypes.object),
            rawData: PropTypes.arrayOf(PropTypes.array)
        }).isRequired,
        tableRenderer: PropTypes.func.isRequired,
        height: PropTypes.number,
        width: PropTypes.number,
        onSortChange: PropTypes.func,
        afterRender: PropTypes.func
    };

    static defaultProps = {
        config: {},
        tableRenderer: renderTable,
        afterRender: () => {}
    };

    render() {
        const { data: { headers, rawData }, config, height, width, onSortChange } = this.props;
        const { sortBy, sortDir } = getSortInfo(config);

        const tableProps = {
            rows: rawData,
            headers,
            sortBy,
            sortDir,
            ...pick(config, ['rowsPerPage', 'onMore', 'onLess', 'sortInTooltip', 'stickyHeader']),
            onSortChange,
            afterRender: this.props.afterRender
        };

        if (height) {
            tableProps.containerHeight = height;
        }

        if (width) {
            tableProps.containerWidth = width;
        }

        return this.props.tableRenderer(tableProps);
    }
}
