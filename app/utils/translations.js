/* eslint no-console: 0 */

import translations from '../translations/en';
import IntlMessageFormat from 'intl-messageformat';

let t = (key = '', context = {}) => {
    try {
        return new IntlMessageFormat(translations[key], 'en-US').format(context);
    } catch (err) {
        console.error(`Can't translate message with key "${key}", error: `, err);
    }

    return key;
};

export { t };
