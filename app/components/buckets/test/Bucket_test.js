import { fromJS } from 'immutable';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { IntlProvider } from 'react-intl';

import translations from '../../../translations/en';

import Bucket from '../Bucket';
import { bucketItem } from '../../../models/bucket_item';
import { decoratedBucket } from '../../../models/bucket';

let {
    renderIntoDocument,
    scryRenderedDOMComponentsWithClass,
    Simulate: {
        click
    }
} = ReactTestUtils;

let methods = ['onToggleCollapse'];

describe('Bucket', () => {
    let bucket, catalogue, callbacks;

    function render(_bucket) {
        return renderIntoDocument(
            <IntlProvider locale="en" messages={translations}>
                <Bucket
                    bucket={_bucket}
                    onToggleCollapse={callbacks.onToggleCollapse}
                    visualizationType="column"
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

        bucket = decoratedBucket(fromJS({ keyName: 'metrics', items: [
            bucketItem({ attribute: 'aaeFKXFYiCc0' }),
            bucketItem({ attribute: 'fact.spend_analysis.cart_additions' })
        ] }), catalogue);

        callbacks = methods.reduce((memo, name) => {
            memo[name] = sinon.spy();
            return memo;
        }, {});
    });

    it('renders bucket items', () => {
        let config = render(bucket),
            items = scryRenderedDOMComponentsWithClass(config, 's-bucket-item');

        expect(items.length).to.be(2);
    });

    it('triggers onToggleCollapse when user expands header', () => {
        let config = render(bucket),
            select = scryRenderedDOMComponentsWithClass(config, 's-bucket-item-header')[0];

        click(select);
        expect(callbacks.onToggleCollapse).to.be.calledWith(bucket.getIn(['items', 0, 'original']), false);
    });
});
