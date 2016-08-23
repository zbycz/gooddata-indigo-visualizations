import { string } from 'js-utils';
import { findIndex, isArray, isObject, clamp } from 'lodash';
import cx from 'classnames';

import {
    colors2Object,
    numberFormat
} from 'gdc-numberjs/lib/number';

import { ASC, DESC } from './Sort';

const HEADER_PADDING = 8;
const MOBILE_SORT_TOOLTIP_OFFSET = 20;

const ALIGN_LEFT = 'left';
const ALIGN_RIGHT = 'right';

const FULLSCREEN_TOOLTIP_VIEWPORT_THRESHOLD = 480;

const simplifyText = string.simplifyText;

function getCssClass(value, prefix = '') {
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

export function getColumnAlign(column) {
    return (column.type === 'metric') ? ALIGN_RIGHT : ALIGN_LEFT;
}

function fullscreenTooltipEnabled() {
    return window.innerWidth <= FULLSCREEN_TOOLTIP_VIEWPORT_THRESHOLD;
}

export function calculateArrowPositions(column, tableScrollX, tableWrapRef) {
    if (!fullscreenTooltipEnabled()) {
        return null;
    }
    const tableWrapRect = tableWrapRef.getBoundingClientRect();
    const isLeftAligned = column.align === ALIGN_LEFT;

    // diff between table position and fixed tooltip left offset
    const offsetLeft = tableWrapRect.left - MOBILE_SORT_TOOLTIP_OFFSET;

    // prevent arrow to show outside the table
    const min = offsetLeft + HEADER_PADDING;
    const max = tableWrapRect.right - MOBILE_SORT_TOOLTIP_OFFSET - HEADER_PADDING;

    const left = ((column.width * column.index) - tableScrollX)
        + (isLeftAligned ? HEADER_PADDING : (column.width - HEADER_PADDING))
        + offsetLeft;
    return {
        left: `${clamp(left, min, max)}px`
    };
}

export function getTooltipSortAlignPoints(columnAlign) {
    const isLeftAligned = columnAlign === ALIGN_LEFT;
    // y has always offset
    const getPoints = (x, y = -HEADER_PADDING) => ({ x, y });

    // last align point is used when header cell is not fully visible (scroll)

    // TODO Known issue - wrong tooltip alignment when
    // distance between table left side and window is more than cca 20px,
    // header cell is not fully visible (is scrolled)
    const alignPoints = isLeftAligned ? [
        { align: 'bl tl', offset: getPoints(HEADER_PADDING) },
        { align: 'bl tc', offset: getPoints(HEADER_PADDING) },
        { align: 'bl tr', offset: getPoints(HEADER_PADDING) },
        { align: 'br tl', offset: getPoints(-HEADER_PADDING) }
    ] : [
        { align: 'br tr', offset: getPoints(-HEADER_PADDING) },
        { align: 'br tc', offset: getPoints(-HEADER_PADDING) },
        { align: 'br tl', offset: getPoints(-HEADER_PADDING) },
        { align: 'bl tr', offset: getPoints(HEADER_PADDING) }
    ];
    return alignPoints;
}

export function getCellClassNames(rowIndex, columnKey, isSorted) {
    return cx({
        'gd-cell-ordered': isSorted
    }, `s-cell-${rowIndex}-${columnKey}`);
}

export function getHeaderClassNames(column) {
    return cx('gd-table-header-ordering', getCssClass(column.id, 's-id-'));
}

export function getStyledLabel(column, content) {
    if (column.type !== 'metric') {
        return { style: {}, label: content };
    }

    const { label, color } = colors2Object(
        numberFormat(content === null ? '' : content, column.format)
    );

    const style = color ? { color } : {};

    return { style, label };
}

export function getHeaderSortClassName(sortDir) {
    return cx({
        'gd-table-arrow-up': sortDir === ASC,
        'gd-table-arrow-down': sortDir === DESC
    });
}

export function getNextSortDir(column, currentSortDir) {
    if (!currentSortDir) {
        return column.type === 'metric' ? DESC : ASC;
    }
    return currentSortDir === ASC ? DESC : ASC;
}
