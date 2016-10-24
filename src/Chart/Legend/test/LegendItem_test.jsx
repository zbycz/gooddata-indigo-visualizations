import React from 'react';
import {
    renderIntoDocument,
    findRenderedDOMComponentWithClass,
    Simulate
} from 'react-addons-test-utils';
import LegendItem from '../LegendItem';

describe('LegendItem', () => {
    it('should render item', () => {
        const props = {
            item: {
                name: 'Foo',
                color: 'red',
                isVisible: true
            },
            chartType: 'bar',
            onItemClick: sinon.spy()
        };
        const component = renderIntoDocument(<LegendItem {...props} />);
        const node = findRenderedDOMComponentWithClass(component, 'series-item');
        expect(node.textContent).to.eql('Foo');

        Simulate.click(node);
        expect(props.onItemClick).to.be.calledOnce();
    });
});
