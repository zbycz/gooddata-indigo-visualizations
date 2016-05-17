import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import LineFamilyChartTransformation from '../src/LineFamilyChartTransformation';
import { data, config } from './fixtures';

const {
    renderIntoDocument
} = ReactTestUtils;


describe('LineFamilyChartTransformation', () => {
    function createComponent(customProps = {}) {
        const defaultProps = {
            onDataTooLarge: () => {},
            config,
            data
        };
        const props = { ...defaultProps, ...customProps };
        return <LineFamilyChartTransformation {...props} />;
    }

    it('should use custom renderer', () => {
        const lineFamilyChartRenderer = sinon.stub().returns(<div />);
        renderIntoDocument(createComponent({ lineFamilyChartRenderer }));
        expect(lineFamilyChartRenderer).to.be.calledOnce();
    });

    describe('onDataTooLarge', () => {
        function renderToNode(node, props = {}) {
            return ReactDOM.render(createComponent(props), node);
        }

        it('should be invoked if data series is over limit', () => {
            const onDataTooLarge = sinon.spy();
            const props = {
                onDataTooLarge,
                limits: {
                    series: 1
                }
            };
            renderIntoDocument(createComponent(props));
            expect(onDataTooLarge).to.be.calledOnce();
        });

        it('should be invoked if data categories is over limit', () => {
            const onDataTooLarge = sinon.spy();
            const props = {
                onDataTooLarge,
                limits: {
                    categories: 1
                }
            };
            renderIntoDocument(createComponent(props));
            expect(onDataTooLarge).to.be.calledOnce();
        });

        it('should be invoked on component mount', () => {
            const onDataTooLarge = sinon.spy();
            const props = {
                onDataTooLarge,
                limits: {
                    series: 1
                }
            };
            const component = renderIntoDocument(createComponent(props));
            const node = ReactDOM.findDOMNode(component);
            expect(node).to.equal(null);
            expect(onDataTooLarge).to.be.calledOnce();
        });

        it('should be invoked on props change', () => {
            // 1) create mount node for single component container
            const mountNode = document.createElement('div');

            // 2) Show data
            let component = renderToNode(mountNode);
            let node = ReactDOM.findDOMNode(component);
            expect(node).to.be.ok();

            const onDataTooLarge = sinon.spy();
            const props = {
                onDataTooLarge,
                limits: {
                    series: 1
                }
            };

            // 3) Render nothing and trigger callback
            component = renderToNode(mountNode, props); // re-render
            node = ReactDOM.findDOMNode(component);
            expect(node).to.equal(null);
            expect(onDataTooLarge).to.be.calledOnce();

            // 4) Show data again
            component = renderToNode(mountNode); // re-render
            node = ReactDOM.findDOMNode(component);
            expect(node).to.be.ok();
        });
    });
});
