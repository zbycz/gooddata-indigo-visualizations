import {
    requestCatalogue,
    datasetsRequested,
    catalogueItemDetailRequested,
    catalogueRequested,
    setCatalogueQuery,
    setCatalogueFilter,
    setCatalogueActiveDataset
} from '../data_actions';

import { fromJS } from 'immutable';
import { set } from 'lodash';

describe('Data related actions', () => {
    describe('catalogue filtering', () => {
        const state = fromJS({
            appState: {
                bootstrapData: {
                    project: {
                        id: 'xyz-foo'
                    }
                }
            },

            data: {
                catalogue: {
                    filters: [{
                        types: ['attribute']
                    }],
                    activeFilterIndex: 0,
                    catalogueQuery: 'search string',
                    activeDatasetId: 'my-dataset'
                }
            }
        });

        let loadCatalogueItems, dispatch, getState;

        beforeEach(() => {
            loadCatalogueItems = sinon.stub().returns(Promise.resolve({
                catalog: ['item 0', 'item 1'],
                totals: { total: 2 }
            }));

            dispatch = sinon.stub();
            getState = sinon.stub().returns(state);
        });

        afterEach(() => {
            loadCatalogueItems.reset();
            dispatch.reset();
            getState.reset();
        });

        describe('requestCatalogue', () => {
            it('should load catalogue items', done => {
                requestCatalogue(dispatch, getState, loadCatalogueItems).then(() => {
                    expect(dispatch).to.be.calledWith({
                        type: 'CATALOGUE_UPDATE'
                    });

                    expect(dispatch).to.be.calledWith({
                        type: 'CATALOGUE_UPDATED',
                        items: ['item 0', 'item 1'],
                        totals: { total: 2 }
                    });

                    done();
                });
            });
        });

        describe('setCatalogueQuery', () => {
            it('should send action with query and reload items', () => {
                let action = setCatalogueQuery('search query', loadCatalogueItems);

                action(dispatch, getState);

                expect(dispatch).to.be.calledWith({
                    type: 'CATALOGUE_SET_QUERY',
                    query: 'search query'
                });
            });
        });

        describe('setCatalogueFilter', () => {
            it('should send action with filter index and reload items', () => {
                let action = setCatalogueFilter(1, loadCatalogueItems);

                action(dispatch, getState);

                expect(dispatch).to.be.calledWith({
                    type: 'CATALOGUE_SET_ACTIVE_FILTER_INDEX',
                    index: 1
                });

                expect(loadCatalogueItems).to.be.calledOnce();
            });
        });

        describe('setCatalogueActiveDataset', () => {
            it('should send action with active dataset id and reload items', () => {
                let action = setCatalogueActiveDataset('my.dataset.id', loadCatalogueItems);

                action(dispatch, getState);

                expect(dispatch).to.be.calledWith({
                    type: 'CATALOGUE_SET_ACTIVE_DATASET_ID',
                    datasetId: 'my.dataset.id'
                });

                expect(loadCatalogueItems).to.be.calledOnce();
            });
        });

        describe('catalogueRequested', () => {
            it('loads catalog and date dimensions', done => {
                let loadCatalogue = sinon.stub().returns(Promise.resolve({
                    catalog: {
                        catalog: ['item 0', 'item 1'],
                        totals: { total: 2 }
                    },
                    dateDimensions: ['dim 0', 'dim 1']
                }));

                let action = catalogueRequested('xyz-foo', loadCatalogue);

                action(dispatch, getState).then(() => {
                    expect(dispatch).to.be.calledWith({ type: 'CATALOGUE_UPDATE' });

                    expect(dispatch).to.be.calledWith({
                        type: 'DATE_DIMENSIONS_DATA',
                        dateDimensions: ['dim 0', 'dim 1']
                    });

                    expect(dispatch).to.be.calledWith({
                        type: 'CATALOGUE_UPDATED',
                        items: ['item 0', 'item 1'],
                        totals: { total: 2 }
                    });

                    done();
                });
            });
        });
    });

    describe('catalogueItemDetailRequested', () => {
        const item = { identifier: 'obj-123' };
        const details = { data: 'item details' };

        it('loads item details from server', done => {
            let loadDetails = sinon.stub().returns(Promise.resolve(details));

            let dispatch = sinon.stub();

            let action = catalogueItemDetailRequested(item, 'xyz-foo', loadDetails);

            action(dispatch).then(() => {
                expect(dispatch).to.be.calledWith({ type: 'ITEM_DETAIL_REQUEST' });

                expect(loadDetails).to.be.calledWith(item, 'xyz-foo');

                expect(dispatch).to.be.calledWith({
                    type: 'ITEM_DETAIL_DATA',
                    detail: details,
                    itemId: item.identifier
                });

                done();
            });
        });
    });

    describe('datasetsRequested', () => {
        const state = fromJS(set({}, 'appState.bootstrapData.accountSetting.links.self', '/profile/me'));

        it('loads datasets from server', done => {
            let loadDatasets = sinon.stub().returns(Promise.resolve([
                { author: '/profile/me' },
                { author: '/profile/me' },
                { author: '/profile/someone-else' }
            ]));

            let dispatch = sinon.stub();
            let getState = sinon.stub().returns(state);

            let action = datasetsRequested('xyz-foo', loadDatasets);

            action(dispatch, getState).then(() => {
                expect(loadDatasets).to.be.calledWith('xyz-foo');

                expect(dispatch).to.be.calledWith({
                    type: 'DATASETS_DATA',
                    datasets: {
                        user: [
                            { author: '/profile/me' },
                            { author: '/profile/me' }
                        ],
                        shared: [
                            { author: '/profile/someone-else' }
                        ]
                    }
                });

                done();
            });
        });
    });
});
