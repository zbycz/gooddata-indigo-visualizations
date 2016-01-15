import { fromJS } from 'immutable';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { IntlProvider } from 'react-intl';

import translations from '../../../translations/en';

import MetricBucketItem from '../MetricBucketItem';
import { bucketItem } from '../../../models/bucket_item';
import { decoratedBucket } from '../../../models/bucket';

let {
    renderIntoDocument,
    findRenderedDOMComponentWithClass,
    scryRenderedDOMComponentsWithClass,
    Simulate: {
        click
    }
} = ReactTestUtils;

let methods = ['onToggleCollapse'];

describe('MetricBucketItem', () => {
    let bucket, item, catalogue, callbacks;

    function render(_item) {
        return renderIntoDocument(
            <IntlProvider locale="en" messages={translations}>
                <MetricBucketItem
                    bucketItem={_item}
                    onToggleCollapse={callbacks.onToggleCollapse}
                    attributesLoader={() => {}}
                />
            </IntlProvider>
        );
    }

    beforeEach(() => {
        item = bucketItem({ attribute: 'fact.spend_analysis.cart_additions' });

        catalogue = fromJS([{
            id: 'fact.spend_analysis.cart_additions',
            identifier: 'fact.spend_analysis.cart_additions',
            isAvailable: true,
            summary: '',
            title: 'Cart Additions',
            type: 'fact',
            uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15418'
        }]);

        bucket = decoratedBucket(fromJS({ keyName: 'metrics', items: [item] }), catalogue);

        callbacks = methods.reduce((memo, name) => {
            memo[name] = sinon.spy();
            return memo;
        }, {});
    });

    it('should render metric title in header', () => {
        let config = render(bucket.getIn(['items', 0])),
            header = findRenderedDOMComponentWithClass(config, 's-title');

        expect(header.textContent).to.be(bucket.getIn(['items', 0]).get('metricTitle'));
    });

    it('should not render content when item is collapsed', () => {
        let config = render(bucket.getIn(['items', 0])),
            content = scryRenderedDOMComponentsWithClass(config, 'adi-metric-bucket-item-configuration');

        expect(content.length).to.be(0);
    });

    it('should render content when item is expanded', () => {
        let config = render(bucket.getIn(['items', 0]).set('collapsed', false)),
            content = scryRenderedDOMComponentsWithClass(config, 'adi-metric-bucket-item-configuration');

        expect(content.length).to.be(1);
    });

    it('triggers onToggleCollapse when user expands header', () => {
        let config = render(bucket.getIn(['items', 0])),
            select = findRenderedDOMComponentWithClass(config, 's-bucket-item-header');

        click(select);
        expect(callbacks.onToggleCollapse).to.be.calledWith(item, false);
    });

    it('triggers onToggleCollapse when user collapses header', () => {
        let config = render(bucket.getIn(['items', 0]).set('collapsed', false)),
            select = findRenderedDOMComponentWithClass(config, 's-bucket-item-header');

        click(select);
        expect(callbacks.onToggleCollapse).to.be.calledWith(item, true);
    });
});
