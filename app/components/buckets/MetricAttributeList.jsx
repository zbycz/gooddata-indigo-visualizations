import React from 'react';
import InfiniteList from 'react-infinite-list';

import MetricAttributeListItem from './MetricAttributeListItem';

export default class MetricAttributeList extends React.Component {
    static propTypes = {
        items: React.PropTypes.array.isRequired,
        onSelect: React.PropTypes.func,
        onShowBubble: React.PropTypes.func,
        onHideBubble: React.PropTypes.func
    };

    static defaultProps = {
        items: []
    };

    getSelectableItems() {
        return this.props.items.map(item => ({
            item,
            onSelect: this.props.onSelect,
            onShowBubble: this.props.onShowBubble,
            onHideBubble: this.props.onHideBubble,
            id: item.get('identifier')
        }));
    }

    render() {
        return (
            <InfiniteList
                className="gd-infinite-list"
                {...this.props}
                items={this.getSelectableItems()}
                listItemClass={MetricAttributeListItem}
            />
        );
    }
}
