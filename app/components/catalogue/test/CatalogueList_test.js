import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { IntlProvider } from 'react-intl';
import translations from '../../../translations/en';
import { fromJS } from 'immutable';

import CatalogueList from '../CatalogueList';
import NoData from '../CatalogueEmpty';
import List from '../List';


let { renderIntoDocument, findRenderedComponentWithType, findRenderedDOMComponentWithClass } = ReactTestUtils;

describe('Catalogue list', () => {
    const items = [
        fromJS({
            identifier: 'sample_header',
            isGroupHeader: true,
            type: 'header'
        }),
        fromJS({
            identifier: 'sample_date',
            title: 'Some title',
            type: 'date',
            isAvailable: true,
            summary: 'Some interesting summary'
        })
    ];
    const catalogueListProps = {
        search: '',
        items,
        unavailableItemsCount: 0,
        itemsCount: items.length,
        isLoading: false,
        isLoadingAvailability: false,
        isItemLoading: () => false,
        onDragStart: () => {},
        onDragStop: () => {},
        onMouseOver: () => {},
        onMouseOut: () => {},
        onRangeChange: () => {},
        end: 0
    };

    function render(props) {
        return renderIntoDocument(
            <IntlProvider locale="en" messages={translations}>
                <CatalogueList {...props} />
            </IntlProvider>
        );
    }

    it('should render spinner when loading data', () => {
        const props = { ...catalogueListProps, isLoading: true };
        const component = render(props);
        findRenderedDOMComponentWithClass(component, 'gd-spinner');
    });

    it('should render CatalogueEmpty when there is no data', () => {
        const props = { ...catalogueListProps, search: 'some query', items: [], itemsCount: 0 };
        const component = render(props);
        findRenderedComponentWithType(component, NoData);
    });

    it('should render list of items', () => {
        const component = render(catalogueListProps);
        findRenderedComponentWithType(component, List);
    });
});
