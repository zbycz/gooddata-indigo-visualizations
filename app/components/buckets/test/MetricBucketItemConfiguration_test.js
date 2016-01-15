import { fromJS } from 'immutable';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { IntlProvider } from 'react-intl';

import translations from '../../../translations/en';

import MetricBucketItemConfiguration from '../MetricBucketItemConfiguration';
import { bucketItem } from '../../../models/bucket_item';
import { decoratedBucket } from '../../../models/bucket';

let {
    renderIntoDocument,
    findRenderedDOMComponentWithClass,
    Simulate: {
        change,
        mouseEnter
    }
} = ReactTestUtils;

let methods = [
    'onSetAttributeAggregation',
    'onChangeShowInPercent',
    'onChangeShowPoP',
    'onAddAttributeFilter',
    'onShowBubble'
];

describe('MetricBucketItemConfiguration', () => {
    let bucket, item, catalogue, callbacks;

    function createAttributesLoader(attributes, isLoading) {
        return function() {
            return {
                then(callback) {
                    if (!isLoading) {
                        callback(attributes);
                    }
                }
            };
        };
    }

    function render(_item, attributesLoader = createAttributesLoader([], false)) {
        return renderIntoDocument(
            <IntlProvider locale="en" messages={translations}>
                <MetricBucketItemConfiguration
                    bucketItem={_item}
                    attributesLoader={attributesLoader}
                    onSetAttributeAggregation={callbacks.onSetAttributeAggregation}
                    onChangeShowInPercent={callbacks.onChangeShowInPercent}
                    onChangeShowPoP={callbacks.onChangeShowPoP}
                    onAddAttributeFilter={callbacks.onAddAttributeFilter}
                    onShowBubble={callbacks.onShowBubble}
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

    it('triggers onSetAttributeAggregation when user selects aggregation', () => {
        let config = render(bucket.getIn(['items', 0])),
            select = findRenderedDOMComponentWithClass(config, 's-fact-aggregation-switch');

        change(select, { target: { value: 'AVG' } });
        expect(callbacks.onSetAttributeAggregation).to.be.calledWith(item, 'AVG');
    });

    it('triggers onShowCatalogueBubble when mouse moves over icon', () => {
        let config = render(bucket.getIn(['items', 0]));

        mouseEnter(findRenderedDOMComponentWithClass(config, 'inlineBubbleHelp'));

        expect(callbacks.onShowBubble).calledWith(catalogue.get(0));
    });

    it('triggers onChangeShowInPercent when user clicks checkbox', () => {
        let config = render(bucket.getIn(['items', 0])),
            checkbox = findRenderedDOMComponentWithClass(config, 's-show-in-percent');

        change(checkbox, { 'target': { 'checked': true } });
        expect(callbacks.onChangeShowInPercent).calledWith(item, true);

        change(checkbox, { 'target': { 'checked': false } });
        expect(callbacks.onChangeShowInPercent).calledWith(item, false);
    });

    it('triggers onChangeShowPoP when user clicks checkbox', () => {
        let config = render(bucket.getIn(['items', 0])),
            checkbox = findRenderedDOMComponentWithClass(config, 's-show-pop');

        change(checkbox, { 'target': { 'checked': true } });
        expect(callbacks.onChangeShowPoP).calledWith(item, true);

        change(checkbox, { 'target': { 'checked': false } });
        expect(callbacks.onChangeShowPoP).calledWith(item, false);
    });
});
