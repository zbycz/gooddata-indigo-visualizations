import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import TableTransformation from '../TableTransformation';
import { data, config } from '../../test/fixtures';

const {
    renderIntoDocument
} = ReactTestUtils;


describe('TableTransformation', () => {
    function createComponent(customProps = {}) {
        const defaultProps = {
            onDataTooLarge: () => {},
            config,
            data
        };
        const props = { ...defaultProps, ...customProps };
        return <TableTransformation {...props} />;
    }

    it('should use custom renderer', () => {
        const tableRenderer = sinon.stub().returns(<div />);
        renderIntoDocument(createComponent({ tableRenderer }));
        expect(tableRenderer).to.be.calledOnce();
    });

    it('should pass containerHeight if height is set in props', () => {
        const tableRenderer = sinon.stub().returns(<div />);
        renderIntoDocument(createComponent({ tableRenderer, height: 255 }));
        expect(tableRenderer).to.be.calledOnce();
        expect(tableRenderer.getCall(0).args[0].containerHeight).to.equal(255);
    });
});
