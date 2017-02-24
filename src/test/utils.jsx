import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';

import translations from '../translations/en';

const defaultIntlOptions = {
    locale: 'en',
    messages: translations
};

export function withIntl(WrappedComponent, intlOptions = defaultIntlOptions) {
    return class extends Component {
        render() {
            return (
                <IntlProvider {...intlOptions}>
                    <WrappedComponent {...this.props} />
                </IntlProvider>
            );
        }
    };
}
