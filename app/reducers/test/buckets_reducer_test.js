import { fromJS } from 'immutable';

import * as Actions from '../../constants/Actions';
import * as Paths from '../../constants/StatePaths';
import bucketsReducer from '../buckets_reducer';
import { INITIAL_MODEL } from '../../models/bucket';


describe('Buckets Reducer tests', () => {
    let state;

    function reduce(type, payload) {
        state = bucketsReducer(state, { type, payload });
    }

    describe(`${Actions.BUCKETS_SELECT_VISUALIZATION_TYPE} test`, () => {
        beforeEach(() => {
            state = fromJS({
                data: {
                    visualizationType: 'bar',
                    buckets: INITIAL_MODEL
                }
            });
        });

        it('should set the specified visualization type', () => {
            reduce(Actions.BUCKETS_SELECT_VISUALIZATION_TYPE, 'column');
            expect(state.getIn(Paths.VISUALIZATION_TYPE)).to.be('column');
        });

        it('should configure buckets according to specified visualization', () => {
            reduce(Actions.BUCKETS_SELECT_VISUALIZATION_TYPE, 'table');
            expect(state.getIn(Paths.BUCKETS.concat([1, 'itemsLimit']))).to.be(20);
            expect(state.getIn(Paths.BUCKETS.concat([3, 'enabled']))).to.be(false);

            reduce(Actions.BUCKETS_SELECT_VISUALIZATION_TYPE, 'column');
            expect(state.getIn(Paths.BUCKETS.concat([1, 'itemsLimit']))).to.be(1);
            expect(state.getIn(Paths.BUCKETS.concat([3, 'enabled']))).to.be(true);
        });
    });

    describe('bucket item actions', () => {
        let item;

        beforeEach(() => {
            state = fromJS({
                data: {
                    visualizationType: 'bar',
                    buckets: [{
                        keyName: 'metrics',
                        items: [{
                            collapsed: true
                        }, {
                            collapsed: true
                        }]
                    }]
                }
            });

            item = state.getIn(Paths.BUCKETS.concat([0, 'items', 0]));
        });

        describe(`${Actions.BUCKETS_SET_BUCKET_ITEM_COLLAPSED} test`, () => {
            it('should set collapsed state of bucket item', () => {
                reduce(Actions.BUCKETS_SET_BUCKET_ITEM_COLLAPSED, { item, collapsed: false });
                expect(state.getIn(Paths.BUCKETS.concat([0, 'items', 0, 'collapsed']))).to.be(false);

                item = state.getIn(Paths.BUCKETS.concat([0, 'items', 0]));

                reduce(Actions.BUCKETS_SET_BUCKET_ITEM_COLLAPSED, { item, collapsed: true });
                expect(state.getIn(Paths.BUCKETS.concat([0, 'items', 0, 'collapsed']))).to.be(true);
            });

            it('should collapse other bucket items', () => {
                reduce(Actions.BUCKETS_SET_BUCKET_ITEM_COLLAPSED, { item, collapsed: false });
                expect(state.getIn(Paths.BUCKETS.concat([0, 'items', 0, 'collapsed']))).to.be(false);

                item = state.getIn(Paths.BUCKETS.concat([0, 'items', 1]));

                reduce(Actions.BUCKETS_SET_BUCKET_ITEM_COLLAPSED, { item, collapsed: false });
                expect(state.getIn(Paths.BUCKETS.concat([0, 'items', 0, 'collapsed']))).to.be(true);
            });
        });

        describe(`${Actions.BUCKETS_SET_BUCKET_ITEM_AGGREGATION} test`, () => {
            it('should set aggregation of bucket item', () => {
                reduce(Actions.BUCKETS_SET_BUCKET_ITEM_AGGREGATION, { item, value: 'abc' });
                expect(state.getIn(Paths.BUCKETS.concat([0, 'items', 0, 'aggregation']))).to.be('abc');
            });
        });

        describe(`${Actions.BUCKETS_SET_BUCKET_ITEM_SHOW_IN_PERCENT} test`, () => {
            it('should set showInPercent of bucket item', () => {
                reduce(Actions.BUCKETS_SET_BUCKET_ITEM_SHOW_IN_PERCENT, { item, value: true });
                expect(state.getIn(Paths.BUCKETS.concat([0, 'items', 0, 'showInPercent']))).to.be(true);
            });
        });

        describe(`${Actions.BUCKETS_SET_BUCKET_ITEM_SHOW_POP} test`, () => {
            it('should set showPoP of bucket item', () => {
                reduce(Actions.BUCKETS_SET_BUCKET_ITEM_SHOW_POP, { item, value: true });
                expect(state.getIn(Paths.BUCKETS.concat([0, 'items', 0, 'showPoP']))).to.be(true);
            });
        });

        describe(`${Actions.BUCKETS_SET_BUCKET_ITEM_DIMENSION} test`, () => {
            it('should set dimension of bucket item', () => {
                reduce(Actions.BUCKETS_SET_BUCKET_ITEM_DIMENSION, { item, value: 'abc' });
                expect(state.getIn(Paths.BUCKETS.concat([0, 'items', 0, 'dimension']))).to.be('abc');
            });
        });

        describe(`${Actions.BUCKETS_SET_BUCKET_ITEM_GRANULARITY} test`, () => {
            it('should set granularity of bucket item', () => {
                reduce(Actions.BUCKETS_SET_BUCKET_ITEM_GRANULARITY, { item, value: 'abc' });
                expect(state.getIn(Paths.BUCKETS.concat([0, 'items', 0, 'granularity']))).to.be('abc');
            });
        });
    });
});
