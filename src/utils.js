import { string } from 'js-utils';

const simplifyText = string.simplifyText;

export function getCssClass(value, prefix = '') {
    return prefix + simplifyText(value);
}
