import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';
import { translation } from 'js-utils';

import translations from '../translations/en';

const defaultIntlOptions = {
    locale: 'en',
    messages: translation.flattenMessages({ visualizations: translations })
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
