import { fromJS, List } from 'immutable';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { IntlProvider } from 'react-intl';

import translations from '../../../translations/en';

import SimpleBucketItem from '../SimpleBucketItem';
import { bucketItem } from '../../../models/bucket_item';
import { decoratedBucket } from '../../../models/bucket';
import { decoratedDimension } from '../../../models/dimension';

let {
    renderIntoDocument,
    findRenderedDOMComponentWithClass,
    scryRenderedDOMComponentsWithClass,
    Simulate: {
        change
    }
} = ReactTestUtils;

let methods = [
    'onSelectDimension',
    'onSelectGranularity'
];

describe('SimpleBucketItem', () => {
    let bucket, catalogue, dimensions, callbacks;

    function render(_item) {
        return renderIntoDocument(
            <IntlProvider locale="en" messages={translations}>
                <SimpleBucketItem
                    bucketItem={_item}
                    dimensions={dimensions}
                    onSelectDimension={callbacks.onSelectDimension}
                    onSelectGranularity={callbacks.onSelectGranularity}
                    onShowBubble={() => {}}
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
        }]);

        dimensions = List([decoratedDimension(fromJS({
            attributes: [{
                dateType: 'GDC.time.week',
                dfIdentifier: 'date.aa281lMifn6q',
                dfUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15259',
                dimensionUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15174',
                elementsUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15259/elements',
                granularity: 'date.euweek',
                identifier: 'date.euweek',
                summary: 'Week/Year based on EU Weeks (Mon-Sun).',
                title: 'Week (Mon-Sun)/Year (Date)',
                uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15254'
            }, {
                dateType: 'GDC.time.date',
                dfIdentifier: 'date.date.mmddyyyy',
                dfUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15203',
                dimensionUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15174',
                elementsUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15203/elements',
                granularity: 'date.date',
                identifier: 'date.date',
                summary: 'Date',
                title: 'Date (Date)',
                uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15200'
            }],
            id: 'date.dim_date',
            identifier: 'date.dim_date',
            isAvailable: true,
            summary: 'Date dimension (Date)',
            title: 'Date dimension (Date)',
            type: 'dimension',
            uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15174'
        })), decoratedDimension(fromJS({
            attributes: [],
            id: 'birthday.dim_date',
            identifier: 'birthday.dim_date',
            isAvailable: true,
            summary: 'Birthday (Date)',
            title: 'Birthday (Date)',
            type: 'dimension',
            uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15174'
        }))]);

        bucket = decoratedBucket(fromJS({ keyName: 'categories', items: [
            bucketItem({ attribute: 'dimensions' }),
            bucketItem({ attribute: 'fact.spend_analysis.cart_additions' })
        ] }), catalogue, dimensions);

        callbacks = methods.reduce((memo, name) => {
            memo[name] = sinon.spy();
            return memo;
        }, {});
    });

    describe('date metric', () => {
        it('renders dimensions as options in select', () => {
            let config = render(bucket.getIn(['items', 0])),
                select = findRenderedDOMComponentWithClass(config, 's-date-dimension-switch'),
                optGroup = select.children[0];

            expect(optGroup.children.length).to.be(2);
            dimensions.forEach((dimension, idx) => {
                let child = optGroup.children[idx];
                expect(child.value).to.be(dimension.get('id'));
                expect(child.textContent).to.be(dimension.get('attributeTitle'));
            });
        });

        it('renders granularities as options in select', () => {
            let config = render(bucket.getIn(['items', 0])),
                select = findRenderedDOMComponentWithClass(config, 's-date-granularity-switch');

            expect(select.children.length).to.be(2);
            dimensions.getIn([0, 'attributes']).forEach((granularity, idx) => {
                let child = select.children[idx];
                expect(child.value).to.be(granularity.get('dateType'));
                expect(child.textContent).to.be(granularity.get('label'));
            });
        });

        it('triggers onSelectDimension when user selects dimension', () => {
            let config = render(bucket.getIn(['items', 0])),
                select = findRenderedDOMComponentWithClass(config, 's-date-dimension-switch');

            change(select, { target: { value: 'date.dim_date' } });
            expect(callbacks.onSelectDimension)
                .to.be.calledWith(bucket.getIn(['items', 0]).get('original'), 'date.dim_date');
        });


        it('triggers onSelectGranularity when user selects granularity', () => {
            let config = render(bucket.getIn(['items', 0])),
                select = findRenderedDOMComponentWithClass(config, 's-date-granularity-switch');

            change(select, { target: { value: 'GDC.time.date' } });
            expect(callbacks.onSelectGranularity)
                .to.be.calledWith(bucket.getIn(['items', 0]).get('original'), 'GDC.time.date');
        });
    });

    describe('fact metric', () => {
        it('renders only header', () => {
            let config = render(bucket.getIn(['items', 1])),
                content = scryRenderedDOMComponentsWithClass(config, 'date-granularity');

            expect(content.length).to.be(0);
        });
    });
});
