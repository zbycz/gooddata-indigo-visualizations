import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

export default class Error extends Component {
    static propTypes = {
        errors: PropTypes.array.isRequired
    };

    renderNoError() {
        return (
            <FormattedMessage id="error.no_error" />
        );
    }

    renderError(error) {
        return error.errorMessage;
    }

    render() {
        const errors = this.props.errors;

        return (
            <div className="main-error">
                <div className="explorer-message">
                    <div className="explorer-message-title">Error</div>
                    <div className="explorer-message-icon"></div>
                    <div className="explorer-message-content s-error-message">
                        {errors.length > 0 ? this.renderError(errors[errors.length - 1]) : this.renderNoError()}
                    </div>
                </div>
            </div>
        );
    }
}
