import * as React from 'react';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import RootDom from '../components/RootDom.jsx';
import Error from '../components/Error.jsx';

import { bootstrap, logoutRequested } from '../actions/app_context_actions';

import { isBootstrapLoaded, getBranding } from '../services/bootstrap_service';
import { isError } from '../services/error_service';
import logger from '../services/logger_service';

class Root extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        appState: PropTypes.object.isRequired,
        projectId: PropTypes.string.isRequired
    };

    componentWillMount() {
        this.props.dispatch(bootstrap(window, this.props.projectId));
    }

    onMenuItemClick(item) {
        if (item.key === 'logout') {
            this.onLogoutRequest();
        }
    }

    onLogoutRequest() {
        this.props.dispatch(logoutRequested());
    }

    render() {
        if (isError(this.props.appState)) {
            return (
                <Error errors={this.props.appState.get('errors').toArray()} />
            );
        }

        if (isBootstrapLoaded(this.props.appState)) {
            var branding = getBranding(this.props.appState);
            var onLogout = this.onLogoutRequest.bind(this);
            var onMenuItemClick = this.onMenuItemClick.bind(this);

            return (
                <RootDom
                    appState={this.props.appState}
                    branding={branding.toJS()}
                    onLogout={onLogout}
                    onMenuItemClick={onMenuItemClick}
                    log={logger.log.bind(logger)}
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
