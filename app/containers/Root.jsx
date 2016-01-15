import * as React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../../node_modules/goodstrap/packages/Header/ReactHeader';
import Dashboard from './../components/Dashboard.jsx';

import * as AppContextActions from '../actions/AppContextActions';

import * as BootstrapService from '../services/BootstrapService';

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
                <div className="app-root">
                    <Header
                        branding={branding}
                        projectTitle={BootstrapService.getProjectTitle(this.props.appState)}
                        menuItems={BootstrapService.getMenuItems(this.props.appState)}
                        accountMenuItems={BootstrapService.getAccountMenuItems(this.props.appState)}
                        userName={BootstrapService.getUserFullName(this.props.appState)}
                        onLogout={onLogout}
                        onMenuItemClick={onMenuItemClick}
                    />
                    <Dashboard />
                </div>
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
