import React, { PropTypes, Component } from 'react';
import InfiniteList from 'react-infinite-list';

export default class List extends Component {
    static propTypes = {
        height: PropTypes.number
    };

    render() {
        let infiniteList = this.props.height ? <InfiniteList {...this.props} /> : null;

        return (
            <div className="adi-catalogue-list s-catalogue-loaded">{infiniteList}</div>
        );
    }
}
