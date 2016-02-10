import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { IntlProvider } from 'react-intl';
import translations from '../../translations/en';

import Error from '../Error.jsx';

let { renderIntoDocument, findRenderedDOMComponentWithClass } = ReactTestUtils;

describe('Error component', () => {
    function render(errors) {
        return renderIntoDocument(
            <IntlProvider locale="en" messages={translations}>
                <Error errors={errors} />
            </IntlProvider>
        );
    }
    it('should render no error when there is no error', () => {
        const component = render([]);
        const errorElement = findRenderedDOMComponentWithClass(component, 's-error-message');

        expect(errorElement.textContent).to.contain('No error');
    });

    it('should render last error in array', () => {
        const errorString = 'Project `oescfln0tk5yuu3vstgc3w6zjny8hg2` not found.';
        const component = render([
            { errorMessage: 'Some error' },
            { errorString }
        ]);

        const errorElement = findRenderedDOMComponentWithClass(component, 's-error-message');
        const errorMessage = errorElement.textContent;

        expect(errorMessage).to.contain(errorMessage);
    });
});
