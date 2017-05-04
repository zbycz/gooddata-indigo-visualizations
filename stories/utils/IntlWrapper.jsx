import React, { PropTypes, PureComponent } from 'react';
import { IntlProvider } from 'react-intl';

import translations from '../../src/translations/en';

export default class IntlWrap extends PureComponent {
    static propTypes = {
        children: PropTypes.node.isRequired
    };

    render() {
        return (
            <IntlProvider
                locale="en"
                messages={translations}
            >
                {this.props.children}
            </IntlProvider>
        );
    }
}
