import { fromJS } from 'immutable';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { IntlProvider } from 'react-intl';

import translations from '../../../translations/en';

import BucketItem from '../BucketItem';
import { bucketItem } from '../../../models/bucket_item';
import { decoratedBucket } from '../../../models/bucket';

let {
    renderIntoDocument,
    findRenderedDOMComponentWithClass,
    scryRenderedDOMComponentsWithClass
} = ReactTestUtils;

describe('BucketItem', () => {
    let bucket, catalogue;

    function render(_item) {
        return renderIntoDocument(
            <IntlProvider locale="en" messages={translations}>
                <BucketItem
                    bucketItem={_item}
                />
            </IntlProvider>
        );
    }

    beforeEach(() => {
        catalogue = fromJS([{
            id: 'fact.spend_analysis.cart_additions',
            identifier: 'fact.spend_analysis.cart_additions',
            isAvailable: true,
            summary: '',
            title: 'Cart Additions',
            type: 'fact',
            uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15418'
        }, {
            expression: 'SELECT SUM([/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15417])',
            format: '[>=1000000000]$#,,,.0 B;[<=-1000000000]-$#,,,.0 B;[>=1000000]$#,,.0 M;[<=-1000000]-$#,,.0 M;[>=1000]$#,.0 K;[<=-1000]-$#,.0 K;$#,##0',
            id: 'aaeFKXFYiCc0',
            identifier: 'aaeFKXFYiCc0',
            isAvailable: true,
            summary: '',
            title: 'Awareness',
            type: 'metric',
            uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/16212'
        }]);

        bucket = decoratedBucket(fromJS({ keyName: 'categories', items: [
            bucketItem({ attribute: 'aaeFKXFYiCc0' }),
            bucketItem({ attribute: 'fact.spend_analysis.cart_additions' })
        ] }), catalogue)
            .setIn(['items', 0, 'isMetric'], true);
    });

    it('renders metric as expandable', () => {
        let config = render(bucket.getIn(['items', 0]));
        findRenderedDOMComponentWithClass(config, 'collapsed');
    });

    it('renders non-metric as non-expandable', () => {
        let config = render(bucket.getIn(['items', 1]));
        expect(scryRenderedDOMComponentsWithClass(config, 'collapsed').length).to.be(0);
    });
});
