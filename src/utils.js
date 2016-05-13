import { string } from 'js-utils';
import { isArray, findIndex } from 'lodash';

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

    if (item.showPoP) { ++index; }

    return { index, item };
}

function buildSortInfo(index, direction) {
    return {
        sortBy: index,
        sortDir: direction
    };
}

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

        return buildSortInfo(index, sort.item.sort);
    }

    return {};
}
