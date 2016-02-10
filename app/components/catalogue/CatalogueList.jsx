'use strict';

import { pick } from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';

import CatalogueListItem, { LIST_ITEM_HEIGHT } from './CatalogueListItem';
import LoadingCatalogueListItem from './LoadingCatalogueListItem';
import Spinner from './Spinner';
import NoData from './CatalogueEmpty';
import List from './List';

const FOOTER_HEIGHT = 30;

export default class CatalogueList extends Component {
    static propTypes = {
        search: PropTypes.string.isRequired,
        items: PropTypes.array.isRequired,
        unavailableItemsCount: PropTypes.number.isRequired,
        itemsCount: PropTypes.number.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isLoadingAvailability: PropTypes.bool.isRequired,
        isItemLoading: PropTypes.func.isRequired,
        onDragStart: PropTypes.func.isRequired,
        onDragStop: PropTypes.func.isRequired,
        onShowBubble: PropTypes.func.isRequired,
        onRangeChange: PropTypes.func.isRequired,
        end: PropTypes.number
    };

    static defaultProps = {
        isItemLoading: item => !item
    };

    constructor() {
        super();

        this.state = { listHeight: null };
    }

    componentDidMount() {
        this.onWindowResized = () => {
            this.setState({ listHeight: null });
        };
        window.addEventListener('resize', this.onWindowResized);
        this.updateListHeight(this.props);
    }

    componentWillReceiveProps(nextProps) {
        let startedLoading = this.props.isLoadingAvailability !== nextProps.isLoadingAvailability;
        let unavailableChanged = this.props.unavailableItemsCount !== nextProps.unavailableItemsCount;

        if (startedLoading || unavailableChanged) {
            this.updateListHeight(nextProps);
        }
    }

    componentDidUpdate() {
        if (this.state.listHeight === null) {
            this.updateListHeight(this.props);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResized);
    }

    updateListHeight(props) {
        let node = ReactDOM.findDOMNode(this);
        let referentialNode = node.parentNode;
        let height = referentialNode.offsetHeight;
        let pxToSubtract = (props.isLoadingAvailability || props.unavailableItemsCount) ? FOOTER_HEIGHT : 0;
        this.setState({ listHeight: Math.max(height - pxToSubtract, 0) });
    }


    _renderAvailabilitySpinner() {
        if (this.props.isLoadingAvailability) {
            return (
                <footer className="availability-spinner">
                    <div>
                        <Spinner />
                        <FormattedMessage id="catalogue.loading_availability" />&hellip;
                    </div>
                </footer>
            );
        }
    }

    _renderUnavailableCount() {
        let { isLoadingAvailability, unavailableItemsCount } = this.props;

        if (!isLoadingAvailability && unavailableItemsCount) {
            let message = <FormattedMessage id="catalogue.unavailable_items_matched" count={unavailableItemsCount} />;

            return <footer><div className="s-unavailable-items-matched">{message}</div></footer>;
        }
    }

    _getWrappedItems() {
        return this.props.items.map(item => {
            let props = pick(this.props, [
                'search',
                'onDragStart',
                'onDragStop',
                'onShowBubble'
            ]);

            let id = (item.get('type') === 'date') ? 'date' : item.get('identifier');

            return Object.assign(props, {
                id,
                item,
                available: item.get('isAvailable')
            });
        });
    }

    render() {
        if (this.props.isLoading) {
            return <Spinner />;
        }

        if (this.props.search && this.props.itemsCount === 0) {
            return <NoData {...pick(this.props, ['search', 'unavailableItemsCount'])} />;
        }

        let availabilitySpinner = this._renderAvailabilitySpinner(),
            unavailableCount = this._renderUnavailableCount();

        return (
            <div className="catalogue-list">
                <List
                    items={this._getWrappedItems()}
                    itemsCount={this.props.itemsCount}
                    itemHeight={LIST_ITEM_HEIGHT}
                    height={this.state.listHeight}
                    listItemClass={CatalogueListItem}
                    loadingListItemClass={LoadingCatalogueListItem}
                    search={this.props.search}
                    onDragStart={this.props.onDragStart}
                    onDragStop={this.props.onDragStop}
                    onShowBubble={this.props.onShowBubble}
                    onRangeChange={this.props.onRangeChange}
                    isItemLoading={this.props.isItemLoading}
                    paging
                />
                {availabilitySpinner}
                {unavailableCount}
            </div>
        );
    }
}
