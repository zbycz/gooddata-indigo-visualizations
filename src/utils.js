import { string } from 'js-utils';
import { findIndex, isArray, isObject } from 'lodash';

const simplifyText = string.simplifyText;

export function getCssClass(value, prefix = '') {
    return prefix + simplifyText(value);
}

function findFirstSort(items, typeName) {
    if (!isArray(items) || !typeName) return null;

    const array = items.map(item => item[typeName]);
    let index = findIndex(array, item => !!item.sort);
    if (index === -1) { return null; }

    const item = array[index];

    if (isObject(item.sort)) { // measure only
        if (item.showPoP && !item.sort.sortByPoP) {
            index++;
        }
    } else if (item.showPoP) {
        // TODO: backward compatibility, remove if branch after CL-9654 will be released
        index++;
    }

    return { index, item };
}

const buildSortInfo = (sortBy, sortDir) => ({ sortBy, sortDir });

export function getSortInfo(config) {
    if (!config) { return {}; }

    const { buckets } = config;
    let sort = findFirstSort(buckets.categories, 'category');
    if (sort) {
        return buildSortInfo(sort.index, sort.item.sort);
    }

    sort = findFirstSort(buckets.measures, 'measure');
    if (sort) {
        const categoriesCount = isArray(buckets.categories) && buckets.categories.length;
        const index = sort.index + categoriesCount;

        // TODO: backward compatibility, remove "sort.item.sort" after CL-9654 will be released
        return buildSortInfo(index, sort.item.sort.direction || sort.item.sort);
    }

    return {};
}
