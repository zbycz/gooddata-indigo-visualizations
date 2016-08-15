import React from 'react';
import {
    renderIntoDocument,
    findRenderedDOMComponentWithClass,
    scryRenderedDOMComponentsWithClass,
    Simulate
} from 'react-addons-test-utils';

import { TableSortBubbleContent } from '../TableSortBubbleContent';
import { ASC, DESC } from '../Sort';
import { withIntl } from '../../test/utils';

describe('TableSortBubbleContent', () => {
    function createBubble(customProps = {}) {
        const props = {
            title: 'Foo',
            ...customProps
        };
        const WrappedBubble = withIntl(TableSortBubbleContent);
        return renderIntoDocument(
            <WrappedBubble {...props} />
        );
    }

    it('should render 2 sort buttons', () => {
        const bubble = createBubble();
        const buttons = scryRenderedDOMComponentsWithClass(bubble, 'button');
        expect(buttons.length).to.eql(2);
    });

    it('should trigger sort callback on button click & close', () => {
        const props = {
            onSortChange: sinon.spy(),
            onClose: sinon.spy()
        };
        const bubble = createBubble(props);

        const buttonAsc = findRenderedDOMComponentWithClass(bubble, 'button-sort-asc');
        Simulate.click(buttonAsc);
        expect(props.onSortChange.args[0][0]).to.eql(ASC);

        const buttonDesc = findRenderedDOMComponentWithClass(bubble, 'button-sort-desc');
        Simulate.click(buttonDesc);
        expect(props.onSortChange.args[1][0]).to.eql(DESC);

        expect(props.onClose).to.be.calledTwice();
    });

    it('should trigger close callback on cross button click', () => {
        const props = {
            onClose: sinon.spy()
        };
        const bubble = createBubble(props);
        const closeButton = findRenderedDOMComponentWithClass(bubble, 'close-button');
        Simulate.click(closeButton);

        expect(props.onClose).to.be.calledOnce();
    });
});
