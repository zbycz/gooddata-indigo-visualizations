import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import TableTransformation from '../src/TableTransformation';
import { data, config } from './fixtures';

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
});
