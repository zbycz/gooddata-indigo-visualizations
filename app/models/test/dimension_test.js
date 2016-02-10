import { fromJS } from 'immutable';

import { decoratedDimension } from '../dimension';
import { GRANULARITY_OPTIONS } from '../granularity';

describe('Decorated Dimension', () => {
    var dimension, decorated;

    beforeEach(() => {
        dimension = fromJS({
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
        });
    });

    beforeEach(() => {
        decorated = decoratedDimension(dimension);
    });

    it('attributeTitle should be correctly set', () => {
        expect(decorated.get('attributeTitle')).to.be('Date');
    });

    it('availabilityTitle should be correctly set', () => {
        expect(decorated.get('availabilityTitle')).to.be('Related');

        dimension = dimension.set('isAvailable', false);
        decorated = decoratedDimension(dimension);

        expect(decorated.get('availabilityTitle')).to.be('Unrelated');
    });

    it('isDisabled should be correctly set', () => {
        expect(decorated.get('isDisabled')).to.be(false);

        dimension = dimension.set('isAvailable', false);
        decorated = decoratedDimension(dimension);

        expect(decorated.get('isDisabled')).to.be(true);
    });

    function expectAttribute(attribute, option) {
        expect(attribute.get('dateType')).to.be(option.dateType);
        expect(attribute.get('label')).to.be(option.label);
    }

    it('attributes should be correctly set', () => {
        expect(decorated.get('attributes').size).to.be(2);
        expectAttribute(decorated.getIn(['attributes', 0]), GRANULARITY_OPTIONS[0]);
        expectAttribute(decorated.getIn(['attributes', 1]), GRANULARITY_OPTIONS[1]);
    });
});
