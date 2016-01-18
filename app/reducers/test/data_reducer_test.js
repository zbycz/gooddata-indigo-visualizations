import { Map, fromJS } from 'immutable';

import * as Actions from '../../constants/Actions';
import dataReducer from '../data_reducer';

describe('Data Reducer tests', () => {
    describe(`${Actions.CATALOGUE_UPDATE} test`, () => {
        it('should set all fields in state correctly', () => {
            // Arrange
            let expectedState = {
                data: {
                    catalogue: {
                        isLoading: true
                    }
                }
            };

            // Act
            let result = dataReducer(Map(), { type: Actions.CATALOGUE_UPDATE });

            // Assert
            expect(result.toJS()).to.eql(expectedState);
        });
    });

    describe(`${Actions.CATALOGUE_SET_ACTIVE_DATASET_ID} test`, () => {
        it('should set all fields in state correctly', () => {
            // Arrange
            let activeDatasetId = 'whatever-dataset-id';
            let expectedState = {
                data: {
                    catalogue: {
                        activeDatasetId
                    }
                }
            };

            // Act
            let result = dataReducer(Map(), {
                type: Actions.CATALOGUE_SET_ACTIVE_DATASET_ID,
                datasetId: activeDatasetId
            });

            // Assert
            expect(result.toJS()).to.eql(expectedState);
        });
    });

    describe(`${Actions.CATALOGUE_UPDATED} test`, () => {
        it('should set all fields in state correctly', () => {
            // Arrange
            let fact = {
                title: 'whatever-title',
                summary: 'whatever-summary',
                identifier: 'whatever-identifier',
                uri: 'whatever-uri',
                type: 'fact',
                id: 'whatever-identifier',
                isAvailable: true
            };
            let totals = { available: 1 };
            let expectedState = {
                data: {
                    catalogue: {
                        totals,
                        items: [fact],
                        isLoading: false
                    }
                }
            };

            // Act
            let result = dataReducer(Map(), {
                type: Actions.CATALOGUE_UPDATED,
                items: [fact],
                totals
            });

            // Assert
            expect(result.toJS()).to.eql(expectedState);
        });
    });

    describe(`${Actions.CATALOGUE_SET_ACTIVE_FILTER_INDEX} test`, () => {
        it('should set all fields in state correctly', () => {
            // Arrange
            let activeFilterIndex = 'whatever-index';
            let expectedState = {
                data: {
                    catalogue: {
                        activeFilterIndex
                    }
                }
            };

            // Act
            let result = dataReducer(Map(), {
                type: Actions.CATALOGUE_SET_ACTIVE_FILTER_INDEX,
                index: activeFilterIndex
            });

            // Assert
            expect(result.toJS()).to.eql(expectedState);
        });
    });

    describe(`${Actions.CATALOGUE_SET_QUERY} test`, () => {
        it('should set all fields in state correctly', () => {
            // Arrange
            let query = 'whatever-query';
            let expectedState = {
                data: {
                    catalogue: {
                        query
                    }
                }
            };

            // Act
            let result = dataReducer(Map(), {
                type: Actions.CATALOGUE_SET_QUERY,
                query
            });

            // Assert
            expect(result.toJS()).to.eql(expectedState);
        });
    });

    describe(`${Actions.ITEM_DETAIL_DATA} test`, () => {
        it('should set all fields in state correctly', () => {
            // Arrange
            let identifier = 'whatever-identifier';
            let state = {
                data: {
                    catalogue: {
                        items: [
                            { identifier: 'other-identifier' },
                            { identifier }
                        ]
                    }
                }
            };
            let detail = { whatever: 'whatever-value' };
            let expectedState = {
                data: {
                    catalogue: {
                        items: [
                            { identifier: 'other-identifier' },
                            { identifier, details: detail }
                        ]
                    }
                }
            };

            // Act
            let result = dataReducer(fromJS(state), {
                type: Actions.ITEM_DETAIL_DATA,
                itemId: identifier,
                detail
            });

            // Assert
            expect(result.toJS()).to.eql(expectedState);
        });
    });

    describe(`${Actions.DATASETS_DATA} test`, () => {
        it('should set all fields in state correctly', () => {
            // Arrange
            let datasets = [{ whatever: 'whatever-value-1' }, { whatever: 'whatever-value-2' }];
            let expectedState = {
                data: {
                    datasets
                }
            };

            // Act
            let result = dataReducer(Map(), {
                type: Actions.DATASETS_DATA,
                datasets
            });

            // Assert
            expect(result.toJS()).to.eql(expectedState);
        });
    });
});
