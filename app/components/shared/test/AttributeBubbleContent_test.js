import { fromJS } from 'immutable';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import AttributeBubbleContent from '../AttributeBubbleContent';
import { IntlProvider } from 'react-intl';

import translations from '../../../translations/en';

let {
    renderIntoDocument,
    scryRenderedDOMComponentsWithClass,
    findRenderedDOMComponentWithClass,
    findRenderedDOMComponentWithTag
} = ReactTestUtils;

describe('AttributeBubbleContent', () => {
    let elements = fromJS([{ title: 'element1' }, { title: 'element2' }]);

    function render(attrElements, totalElementsCount) {
        return renderIntoDocument(
            <IntlProvider locale="en" messages={translations}>
                <AttributeBubbleContent elements={attrElements} totalElementsCount={totalElementsCount}/>
            </IntlProvider>
        );
    }

    it('renders elements if provided', () => {
        let tags = scryRenderedDOMComponentsWithClass(render(elements), 's-attribute-element');
        expect(tags).to.have.length(2);
        elements.forEach((element, idx) => {
            expect(tags[idx].textContent).to.contain(element.get('title'));
        });
    });

    it('renders total elements text', () => {
        let more = findRenderedDOMComponentWithClass(render(elements, 5), 'adi-attr-elements-more');
        expect(more.textContent).to.contain(' 3 ');
    });

    it('renders loading if no elements provided', () => {
        let loading = findRenderedDOMComponentWithTag(render(null), 'p');
        expect(loading.textContent).to.contain('Loading');
    });
});
