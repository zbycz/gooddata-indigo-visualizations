import * as React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import RootDom from '../components/RootDom.jsx';

import * as AppContextActions from '../actions/AppContextActions';

import * as BootstrapService from '../services/bootstrap_service';

class Root extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        appState: PropTypes.object.isRequired
    };

    componentWillMount() {
        this.props.dispatch(AppContextActions.bootstrap(window));
    }

    onMenuItemClick(item) {
        if (item.key === 'logout') {
            this.onLogoutRequest();
        }
    }

    onLogoutRequest() {
        this.props.dispatch(AppContextActions.logoutRequested());
    }

    render() {
        if (this.props.appState.get('bootstrapData')) {
            var branding = BootstrapService.getBranding(this.props.appState);
            branding = branding ? branding.toJS() : branding;
            var onLogout = this.onLogoutRequest.bind(this);
            var onMenuItemClick = this.onMenuItemClick.bind(this);

            return (
                <RootDom
                    appState={this.props.appState}
                    branding={branding}
                    onLogout={onLogout}
                    onMenuItemClick={onMenuItemClick}
                />
            );
        }

        return <div className="gd-loading-equalizer gd-loading-equalizer-fade">Loading…</div>;
    }
}

function mapStateToProps(state) {
    let appState = state.get('appState');
    return { appState };
}

export default connect(mapStateToProps)(Root);
