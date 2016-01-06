import configureMockStore from 'redux-mock-store';
import reduxThunk from 'redux-thunk';
import * as Actions from '../AppContextActions';
import * as ActionNames from '../../constants/Actions';
import $ from 'jquery';
import sdk from 'sdk';

const mockStoreComposer = configureMockStore([reduxThunk]);

describe('AppContextActions', () => {
    let xhrAjaxStub;

    beforeEach(() => {
        xhrAjaxStub = sinon.stub(sdk.xhr, 'ajax');
    });

    afterEach(() => {
        xhrAjaxStub.restore();
    });

    describe('bootstrap', () => {
        it('Should create correct bootstrap async action', done => {
            // Arrange & Assert
            var mockBootstrapData = {
                whatever: 'Whatever'
            };
            var mockWindow = $("<div style='width: 200px; height:300px;'></div>");
            mockWindow.devicePixelRatio = 2.0;
            var action = Actions.bootstrap(mockWindow);
            var expectedActions = [{
                type: ActionNames.BOOTSTRAP
            }, {
                type: ActionNames.BOOTSTRAP_DATA,
                windowInfo: {
                    viewport: `200x300`,
                    pixelRatio: 2.0,
                    isMobileDevice: false
                },
                bootstrapData: mockBootstrapData
            }];
            xhrAjaxStub.returns(mockBootstrapData);
            var mockStore = mockStoreComposer({}, expectedActions, done);

            // Act
            mockStore.dispatch(action);
        });
    });
});
