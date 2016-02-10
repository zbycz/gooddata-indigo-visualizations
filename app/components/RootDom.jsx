import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import * as BootstrapService from '../services/bootstrap_service';
import Dashboard from './Dashboard.jsx';
import Header from '../../node_modules/goodstrap/packages/Header/ReactHeader';

function onProjectSelect(project) {
    let uri = `${window.location.pathname}#/${project.hash}/reportId/edit`;
    window.location = uri;
}

class RootDom extends Component {
    static propTypes = {
        appState: PropTypes.object.isRequired,
        branding: PropTypes.object.isRequired,
        onLogout: PropTypes.func.isRequired,
        onMenuItemClick: PropTypes.func.isRequired,
        intl: PropTypes.object.isRequired,
        log: PropTypes.func
    };

    render() {
        let intl = this.props.intl;

        return (
            <div className="app-root">
                <Header
                    profileUri={BootstrapService.getUserUri(this.props.appState)}
                    branding={this.props.branding}
                    project={{ title: BootstrapService.getProjectTitle(this.props.appState) }}
                    menuItems={BootstrapService.getLocalizedMenuItems(this.props.appState, intl).toJS()}
                    accountMenuItems={BootstrapService.getLocalizedAccountMenuItems(this.props.appState, intl).toJS()}
                    userName={BootstrapService.getUserFullName(this.props.appState)}
                    onLogout={this.props.onLogout}
                    onMenuItemClick={this.props.onMenuItemClick}
                    onProjectSelect={onProjectSelect}
                />
                <Dashboard log={this.props.log}/>
            </div>
        );
    }
}

export default injectIntl(RootDom);
