import { fromJS } from 'immutable';
import md5 from 'md5';

import { bucketItem, decoratedBucketItem } from '../bucket_item';

describe('Decorated Bucket Item', () => {
    var catalogue, dimensions, categories, item, decorated;

    function createBucketItem(id) {
        return bucketItem({ attribute: id });
    }

    function createDecoratedBucketItem(_item) {
        return decoratedBucketItem(_item, catalogue, dimensions, categories);
    }

    function calcHash(expression, title, format) {
        return md5(`${expression}#${title}#${format}`);
    }

    beforeEach(() => {
        catalogue = fromJS([{
            dateType: undefined,
            dfIdentifier: 'label.account_details.retail_company',
            dfUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15366',
            dimensionUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15125',
            elementsUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15366/elements',
            granularity: 'attr.account_details.retail_company',
            id: 'attr.account_details.retail_company',
            identifier: 'attr.account_details.retail_company',
            isAvailable: true,
            summary: '',
            title: 'Account ID',
            type: 'attribute',
            uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15365'
        }, {
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
        dimensions = fromJS([{
            attributes: [{
                dateType: 'GDC.time.date',
                dfIdentifier: 'date.date.mmddyyyy',
                dfUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15203',
                dimensionUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15174',
                elementsUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15203/elements',
                granularity: 'date.date',
                identifier: 'date.date',
                summary: 'Date',
                title: 'Date (Date)',
                uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15200',
                label: 'Date'
            }, {
                dateType: 'GDC.time.week',
                dfIdentifier: 'date.aa281lMifn6q',
                dfUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15259',
                dimensionUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15174',
                elementsUri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15259/elements',
                granularity: 'date.euweek',
                identifier: 'date.euweek',
                summary: 'Week/Year based on EU Weeks (Mon-Sun).',
                title: 'Week (Mon-Sun)/Year (Date)',
                uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15254',
                label: 'Week (Mon-Sun)'
            }],
            id: 'date.dim_date',
            identifier: 'date.dim_date',
            isAvailable: true,
            summary: 'Date dimension (Date)',
            title: 'Date dimension (Date)',
            type: 'dimension',
            uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15174',
            attributeTitle: '',
            availabilityTitle: '',
            isDisabled: false
        }]);

        categories = fromJS([
            createDecoratedBucketItem(bucketItem({ attribute: 'dimensions' }))
        ]);
    });

    describe('basic tests', () => {
        beforeEach(() => {
            item = createBucketItem('aaeFKXFYiCc0');
            decorated = createDecoratedBucketItem(item);
        });

        describe('raw item', () => {
            it('should be collapsed', () => {
                expect(item.get('collapsed')).to.be(true);
            });
        });

        describe('decorated item', () => {
            it('should point to original object', () => {
                expect(decorated.get('original')).to.equal(item);
            });

            it('attribute should be set to catalogue item', () => {
                expect(decorated.get('attribute')).to.equal(catalogue.get(2));
            });
        });
    });

    describe('metric', () => {
        beforeEach(() => {
            item = createBucketItem('aaeFKXFYiCc0');
            decorated = createDecoratedBucketItem(item);
        });

        it('aggregation should be set to null', () => {
            expect(decorated.get('aggregation')).to.be(null);
        });

        it('metricTitle should be set to title', () => {
            expect(decorated.get('metricTitle')).to.be(decorated.getIn(['attribute', 'title']));
        });

        it('expression should be correctly set', () => {
            expect(decorated.get('expression')).to.be('SELECT {aaeFKXFYiCc0}');
        });

        it('execIdentifier should be correctly set', () => {
            expect(decorated.get('execIdentifier')).to.be('aaeFKXFYiCc0');
        });

        it('execIdentifier should be correctly set when showInPercent is set', () => {
            item = item.set('showInPercent', true);
            decorated = createDecoratedBucketItem(item);

            expect(decorated.get('execIdentifier')).to.be(
                'aaeFKXFYiCc0.generated.percent.0f1c725e3b61a429ce33bfa41df1600a');
        });
    });

    describe('attribute based metric', () => {
        beforeEach(() => {
            item = createBucketItem('attr.account_details.retail_company');
            decorated = createDecoratedBucketItem(item);
        });

        it('aggregation should be set to COUNT by default', () => {
            expect(decorated.get('aggregation')).to.be('COUNT');
        });

        it('metricTitle should be correctly set', () => {
            expect(decorated.get('metricTitle')).to.be('Count of Account ID');
        });

        it('expression should be correctly set', () => {
            expect(decorated.get('expression')).to.be('SELECT COUNT({attr.account_details.retail_company})');
        });

        it('execIdentifier should be correctly set', () => {
            expect(decorated.get('execIdentifier'))
                .to.be('attr.account_details.retail_company.generated.count.' +
                    calcHash(decorated.get('expression'), decorated.get('metricAxisLabel'), decorated.get('format')));
        });
    });

    describe('fact based metric', () => {
        beforeEach(() => {
            item = createBucketItem('fact.spend_analysis.cart_additions');
            decorated = createDecoratedBucketItem(item);
        });

        it('aggregation should be set to SUM by default', () => {
            expect(decorated.get('aggregation')).to.be('SUM');
        });

        it('metricTitle should be correctly set', () => {
            expect(decorated.get('metricTitle')).to.be('Sum of Cart Additions');
        });

        it('expression should be correctly set', () => {
            expect(decorated.get('expression')).to.be('SELECT SUM({fact.spend_analysis.cart_additions})');
        });

        it('execIdentifier should be correctly set', () => {
            expect(decorated.get('execIdentifier'))
                .to.be('fact.spend_analysis.cart_additions.generated.sum.' +
                    calcHash(decorated.get('expression'), decorated.get('metricAxisLabel'), decorated.get('format')));
        });
    });

    describe('date metric', () => {
        beforeEach(() => {
            item = createBucketItem('dimensions');
            decorated = createDecoratedBucketItem(item);
        });

        it('dimension should be correctly set', () => {
            expect(decorated.get('dimension')).to.eql(dimensions.get(0));
        });

        it('granularity should be correctly set', () => {
            expect(decorated.get('granularity')).to.eql(dimensions.getIn([0, 'attributes', 1]));

            item = item.set('granularity', 'GDC.time.date');
            decorated = createDecoratedBucketItem(item);

            expect(decorated.get('granularity')).to.eql(dimensions.getIn([0, 'attributes', 0]));
        });

        it('execIdentifier should be correctly set', () => {
            expect(decorated.get('execIdentifier')).to.eql(dimensions.getIn([0, 'attributes', 1, 'dfIdentifier']));
        });
    });
});
