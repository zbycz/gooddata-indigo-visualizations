import { List, Record, fromJS } from 'immutable';
import md5 from 'md5';

import translations from '../translations/en';

import { AGGREGATION_FUNCTIONS } from '../models/aggregation_function';

let bucketItemBase = {
    collapsed: true,
    isMetric: false,
    attribute: null
};

export function bucketItem(props) {
    return fromJS(Object.assign({}, bucketItemBase, props));
}

let DecoratedBucketItem = Record(Object.assign({}, bucketItemBase, {
    original: null,
    dimension: null,
    granularity: null,
    aggregation: null,
    metricTitle: null,
    metricAxisLabel: null,
    where: null,
    uri: null,
    expression: null,
    format: null,
    hash: null,
    execIdentifier: null
}));

function getAttribute(item, catalogue) {
    let attribute = item.get('attribute');
    if (attribute === 'dimensions') {
        return fromJS({
            identifier: 'date_dimensions',
            title: 'Date',
            type: 'date',
            summary: translations['dashboard.catalogue_item.common_date_description']
        });
    }

    return catalogue.find(ci => ci.get('id') === attribute);
}

function getDimension(item, dimensions) {
    if (item.getIn(['attribute', 'type']) !== 'date') {
        return null;
    }

    let dimensionId = item.get('dimension');

    return dimensions.find(dimension =>
        dimension.get('isAvailable') && (dimension.get('id') === dimensionId || !dimensionId));
}

function getGranularity(item) {
    if (item.getIn(['attribute', 'type']) !== 'date') {
        return null;
    }

    let dimension = item.get('dimension'),
        granularityDateType = item.get('granularity');

    return dimension ?
        dimension.get('attributes')
            .findLast(granularity =>
                !granularityDateType || granularity.get('dateType') === granularityDateType) || null :
        null;
}

function getAggregation(item) {
    let attribute = item.get('attribute'),
        funcs = AGGREGATION_FUNCTIONS.filter(func => func.applicableTo === attribute.get('type'));

    return funcs.length ? item.get('aggregation') || funcs[0].functionName : null;
}

function getMetricTitle(item) {
    let title = item.getIn(['attribute', 'title']),
        aggregation = item.get('aggregation');

    if (aggregation) {
        title = translations[`aggregations.metric_title.${aggregation}`].replace('{title}', title);
    }
    if (item.get('showInPercent')) {
        title = `% ${title}`;
    }

    return title;
}

function getMetricAxisLabel(item) {
    var metricTitle = item.get('metricTitle'),
        filters = (item.get('filters') || List())
            .filterNot(filter => filter.get('allSelected'))
            .map(filter => filter.get('title'))
            .join(', ');

    return metricTitle + (filters ? ` (${filters})` : '');
}

function getWhereClause(item) {
    return (item.get('filters') || List())
        .map(filter => filter.get('expression'))
        .filter(filter => !!filter)
        .join(' AND ');
}

function getUri(item) {
    if (item.getIn(['attribute', 'type']) === 'date') {
        return item.getIn(['granularity', 'uri']);
    }

    return item.getIn(['attribute', 'uri']);
}

function getExpression(item) {
    let aggregation = item.get('aggregation'),
        identifier = item.getIn(['attribute', 'id']),
        where = item.get('where');

    return 'SELECT ' + (aggregation ? `${aggregation}({${identifier}})` : `{${identifier}}`) +
        (where ? ` WHERE ${where}` : '');
}

function getFormat(item) {
    return item.get('format') || '#,##0.00';
}

function calcHash(expression, title, format) {
    return md5(`${expression}#${title}#${format}`);
}

function getHash(item) {
    let expression = item.get('expression'),
        title = item.get('metricAxisLabel'),
        format = item.get('format');

    return calcHash(expression, title, format);
}

// used for 'metric' bucket items
function getBaseMetricExecIdentifier(item) {
    let identifier = item.getIn(['attribute', 'id']),
        where = item.get('where');

    if (where) {
        let hash = item.get('hash');
        return `${identifier}.generated.filtered_base.${hash}`;
    }

    return identifier;
}

// used for 'attribute' and 'fact' bucket items
function getSimpleMetricExecIdentifier(item) {
    let aggregation = item.get('aggregation') || '',
        identifier = item.getIn(['attribute', 'id']),
        hash = item.get('hash'),
        prefix = item.get('where') ? 'filtered_' : '';

    return `${identifier}.generated.${prefix}${aggregation.toLowerCase()}.${hash}`;
}

function getExecIdentifier(item, contributionCategory) {
    let type = item.getIn(['attribute', 'type']);

    if (type === 'date') {
        return item.getIn(['granularity', 'dfIdentifier']);
    }

    let execIdentifier = (type === 'metric' ? getBaseMetricExecIdentifier(item) : getSimpleMetricExecIdentifier(item));

    if (item.get('showInPercent')) {
        let identifier = item.getIn(['attribute', 'id']),
            contributionUri = contributionCategory && contributionCategory.get('uri'),
            expression = `SELECT (SELECT {${execIdentifier}}) / (SELECT {${execIdentifier}} BY ALL [${contributionUri}])`,
            title = item.get('metricAxisLabel'),
            format = '#,##0.00%',
            hash = calcHash(expression, title, format);

        return `${identifier}.generated.percent.${hash}`;
    }

    return execIdentifier;
}

export function decoratedBucketItem(item, catalogue, dimensions, categories) {
    return new DecoratedBucketItem(item.withMutations(mutable =>
        mutable
            .set('original', item)
            .set('attribute', getAttribute(item, catalogue)) // order of mutations is important!
            .set('dimension', getDimension(mutable, dimensions))
            .set('granularity', getGranularity(mutable))
            .set('aggregation', getAggregation(mutable))
            .set('metricTitle', getMetricTitle(mutable))
            .set('metricAxisLabel', getMetricAxisLabel(mutable))
            .set('where', getWhereClause(mutable))
            .set('uri', getUri(mutable))
            .set('expression', getExpression(mutable))
            .set('format', getFormat(item))
            .set('hash', getHash(mutable))
            .set('execIdentifier', getExecIdentifier(mutable, categories ? categories.first() : null))
    ));
}
