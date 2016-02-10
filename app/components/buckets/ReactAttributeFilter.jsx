'use strict';

import React, { PropTypes } from 'react';

import AttributeItem from './AttributeItem';
import ReactInvertableList from 'List/ReactInvertableList';
import LoadingListItem from '../shared/LoadingListItem';
import LoadingList from '../shared/LoadingList';
import NoResultsList from '../shared/NoResultsList';

const MIN_ITEMS_PER_PAGE = 12;
const ITEM_HEIGHT = 28;

export default class ReactAttributeFilter extends React.Component {
    static propTypes = {
        filteredItemsCount: PropTypes.number
    };

    getHeight() {
        let listItemCount = Math.min(MIN_ITEMS_PER_PAGE, this.props.filteredItemsCount),
            height = listItemCount * ITEM_HEIGHT,
            isMinimumSize = listItemCount === MIN_ITEMS_PER_PAGE;

        if (isMinimumSize) {
            let halfItem = ITEM_HEIGHT / 2;
            height -= halfItem;
        }

        return Math.round(height);
    }

    render() {
        return (
            <ReactInvertableList
                {...this.props}
                height={this.getHeight()}
                itemHeight={ITEM_HEIGHT}
                getItemKey={item => item.get('id')}
                isItemLoading={item => !item}
                loadingListItemClass={LoadingListItem}
                isLoadingClass={LoadingList}
                listItemClass={AttributeItem}
                noItemsFoundClass={NoResultsList}
                paging
            />
        );
    }
}
