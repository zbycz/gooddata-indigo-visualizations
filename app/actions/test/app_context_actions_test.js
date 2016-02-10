import Promise from 'bluebird';
import $ from 'jquery';

import { bootstrap } from '../app_context_actions';
import initialState from '../../reducers/initial_state';
import * as StatePaths from '../../constants/StatePaths';

function getBootstrapData() {
    return {
        bootstrapResource: {
            current: {
                featureFlags: {
                    enableCsvUploader: false
                },
                project: {
                    meta: {
                        title: 'Project Foo'
                    }
                }
            }
        }
    };
}

function getWindow() {
    let mockWindow = $('<div style="width: 200px; height:300px;"/>');
    mockWindow.devicePixelRatio = 2.0;
    return mockWindow;
}

function enableFeatureFlag(state) {
    return state.setIn(['appState', ...StatePaths.FEATURE_FLAGS, 'enableCsvUploader'], true);
}

describe('App Context Actions', () => {
    describe('bootstrap', () => {
        describe('loading datasets', () => {
            it('should not load datasets by default', done => {
                let getState = sinon.stub().returns(initialState);
                let dispatch = sinon.stub();
                let loadBootstrap = sinon.stub()
                    .returns(Promise.resolve(getBootstrapData()));

                let action = bootstrap(getWindow(), 'project-id-123', loadBootstrap);

                action(dispatch, getState).then(() => {
                    expect(loadBootstrap).to.be.calledWith('project-id-123');

                    expect(dispatch).to.be.calledWith({ type: 'BOOTSTRAP' });

                    done();
                });
            });

            it('should load datasets if featureFlagEnabled', done => {
                let getState = sinon.stub().returns(enableFeatureFlag(initialState));
                let dispatch = sinon.stub();
                let loadBootstrap = sinon.stub()
                    .returns(Promise.resolve(getBootstrapData()));

                let action = bootstrap(getWindow(), 'project-id-123', loadBootstrap);

                action(dispatch, getState).then(() => {
                    expect(loadBootstrap).to.be.calledWith('project-id-123');

                    expect(dispatch).to.be.calledWith({ type: 'BOOTSTRAP' });

                    // @TODO Test datasets were loaded

                    done();
                });
            });
        });
    });
});
