import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';
import { reduce } from 'lodash';
import translations from '../translations/en';

const intlOptions = {
    locale: 'en',
    messages: reduce(translations, (result, value, index) => {
        return {
            ...result,
            [`visualizations.${index}`]: value
        };
    }, {})
};

export default function withIntl(WrappedComponent) {
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
