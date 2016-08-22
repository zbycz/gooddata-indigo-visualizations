import React, { Component, PropTypes } from 'react';
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
        onSortChange: PropTypes.func
    };

    static defaultProps = {
        config: {},
        tableRenderer: renderTable
    };

    render() {
        const { data: { headers, rawData }, config, height, onSortChange } = this.props;
        const { sortBy, sortDir } = getSortInfo(config);

        const tableConfig = {
            rows: rawData,
            headers,
            sortBy,
            sortDir,
            ...pick(config, ['rowsPerPage', 'onMore', 'onLess', 'sortInTooltip', 'stickyHeader']),
            onSortChange
        };

        if (height) {
            tableConfig.containerHeight = height;
        }

        return this.props.tableRenderer(tableConfig);
    }
}
