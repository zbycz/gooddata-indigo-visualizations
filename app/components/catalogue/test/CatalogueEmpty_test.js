import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { IntlProvider } from 'react-intl';
import translations from '../../../translations/en';

import CatalogueEmpty from '../CatalogueEmpty';

let { renderIntoDocument, findRenderedDOMComponentWithClass } = ReactTestUtils;

describe('Catalogue empty message', () => {
    function render(query, unavailableItemsCount = 0) {
        return renderIntoDocument(
            <IntlProvider locale="en" messages={translations}>
                <CatalogueEmpty search={query} unavailableItemsCount={unavailableItemsCount} />
            </IntlProvider>
        );
    }
    const queryString = 'some query';

    it('should render not found string', () => {
        const component = render(queryString);
        const notFoundElement = findRenderedDOMComponentWithClass(component, 's-not-matching-message');
        const notFoundString = notFoundElement.textContent;

        expect(notFoundString).to.contain(queryString);
        expect(notFoundString).to.contain('No data matching');
    });

    it('should not show unavailable items count', () => {
        const component = render(queryString);

        expect(() => {
            findRenderedDOMComponentWithClass(component, 's-unavailable-items-matched');
        }).to.throwException();
    });

    it('should show how many items are unavailable', () => {
        const unavailableCount = 2;
        const component = render(queryString, unavailableCount);

        const tag = findRenderedDOMComponentWithClass(component, 's-unavailable-items-matched');

        expect(tag.textContent).to.contain('2 unrelated data items hidden');
    });
});
