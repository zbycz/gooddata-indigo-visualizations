import React, { Component, PropTypes } from 'react';
import Table from './Table';
import { getSortInfo } from './utils';

export function renderTable(props) {
    return <Table {...props} />;
}

export default class TableTransformation extends Component {

    static propTypes = {
        data: PropTypes.shape({
            headers: PropTypes.arrayOf(PropTypes.object),
            rawData: PropTypes.arrayOf(PropTypes.array)
        }).isRequired,
        tableRenderer: PropTypes.func.isRequired
    };

    static defaultProps = {
        tableRenderer: renderTable
    };

    render() {
        const { data: { headers, rawData }, config } = this.props;
        const { sortBy, sortDir } = getSortInfo(config);
        return this.props.tableRenderer({
            rows: rawData,
            headers,
            sortBy,
            sortDir
        });
    }
}
