import { fromJS } from 'immutable';
import * as StatePaths from '../../constants/StatePaths';
import catalogueItemsSelector from '../catalogue_items_selector';

const attributeFilter = { types: ['attribute'] };
const metricFilter = { types: ['metrics'] };
const dimension = { title: 'Founded' };

const getState = () => {
    return fromJS({
        data: {
            catalogue: {
                items: [],
                filters: [{
                    types: []
                }],
                activeFilterIndex: 0
            },
            dimensions: {}
        }
    });
};

describe('catalogueItemsSelector', () => {
    it('returns empty array by default', () => {
        expect(catalogueItemsSelector(getState()).toArray()).to.eql([]);
    });

    it('returns items with data header', () => {
        let state = getState()
            .setIn(StatePaths.CATALOGUE_ITEMS, fromJS(['foo']));

        let catalogueItems = catalogueItemsSelector(state);

        expect(catalogueItems.size).to.be(2);
        expect(catalogueItems.get(0).get('isGroupHeader')).to.be(true);
        expect(catalogueItems.get(1)).to.be('foo');
    });

    describe('date visibility', () => {
        const expectEmptyItems = items => expect(items.size).to.be(0);

        it('should be visible with dimensions and attributes filter', () => {
            let state = getState();

            state = state.setIn(StatePaths.DIMENSIONS, fromJS({ dimensions: [dimension] }));
            state = state.setIn(StatePaths.CATALOGUE_FILTERS, fromJS([attributeFilter]));

            let catalogueItems = catalogueItemsSelector(state);

            expect(catalogueItems.size).to.be(1);
            expect(catalogueItems.get(0).get('title')).to.be('Date');
        });

        it('should be hidden if there are not available dimensions', () => {
            let state = getState();

            state = state.setIn(StatePaths.DIMENSIONS, fromJS({ unavailable: [dimension] }));
            state = state.setIn(StatePaths.CATALOGUE_FILTERS, fromJS([attributeFilter]));

            expectEmptyItems(catalogueItemsSelector(state));
        });

        it('should be hidden if attributes are filtered out', () => {
            let state = getState();

            state = state.setIn(StatePaths.DIMENSIONS, fromJS({ dimensions: [dimension] }));
            state = state.setIn(StatePaths.CATALOGUE_FILTERS, fromJS([metricFilter]));

            expectEmptyItems(catalogueItemsSelector(state));
        });

        it('should be hidden while searching', () => {
            let state = getState();

            state = state.setIn(StatePaths.DIMENSIONS, fromJS({ dimensions: [dimension] }));
            state = state.setIn(StatePaths.CATALOGUE_FILTERS, fromJS([attributeFilter]));
            state = state.setIn(StatePaths.CATALOGUE_QUERY, 'Hello, World!');

            expectEmptyItems(catalogueItemsSelector(state));
        });
    });
});
