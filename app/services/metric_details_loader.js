/* eslint no-param-reassign: 0 */

import _ from 'lodash';
import { xhr } from 'gooddata';
import { t } from '../utils/translations';

const EMPTY_VALUE = t('empty_value');

// time_macro taken from
// #contains_time_macro in bear.git/common/lib/Stock/MD/Fingerprint.pm:128
//
// NOTE: stripped off of the 'Yesterday' as we validated it would interpret it
//       as a metric identifier and not a macro

const PARENS = _.escapeRegExp('{}[]');

const RE_TOKENS = {
    text: new RegExp(`^[^${PARENS}]+`),
    time_macro: /^\{(This|Previous|Next|Last|Today)\}/i,
    identifier: /^\{.*?\}/,
    uri: /^\[.*?\]/
};

function tokenizeExpression(expr) {
    let tokens = [];

    while (expr.length) {
        let match;

        for (let type of Object.keys(RE_TOKENS)) {
            let re = RE_TOKENS[type];
            match = expr.match(re);

            if (match) {
                let [value] = match;
                tokens.push({ type, value });
                expr = expr.substr(value.length);
                break;
            }
        }

        if (!match) {
            throw new Error(`Unable to match token, rest of output is: "${expr}"`);
        }
    }

    return tokens;
}

function fetchMetadataTitle(uri) {
    return xhr.ajax(uri).then((res) => {
        var meta = _.first(_.values(res)).meta;

        return _.pick(meta, ['title', 'category']);
    });
}

function fetchAttrElementTitle(uri) {
    var uriChunks = uri.match(/(.+)\/elements\?id=(.*)/),
        attrUri = uriChunks[1],
        elementIds = uriChunks[2];

    return xhr.ajax(attrUri)
        .then((attrRes) => {
            var elementsLink = attrRes.attribute.content.displayForms[0].links.elements;
            return xhr.ajax(`${elementsLink}?id=${elementIds}`);
        })
        .then((attrElementsRes) => {
            return {
                title: attrElementsRes.attributeElements.elements[0].title || `(${EMPTY_VALUE})`,
                category: 'attribute_element'
            };
        });
}

function fetchTitle(uri) {
    if (_.includes(uri, '/elements?id=')) {
        return fetchAttrElementTitle(uri);
    }

    return fetchMetadataTitle(uri);
}

function fetchTokenTitles(tokens) {
    let cachedTitleFetcher = _.memoize(fetchTitle);

    var fetchedTokens = tokens.map((token) => {
        let { type, value } = token;

        if (type === 'uri') {
            let uri = _.trim(value, '[]');
            return cachedTitleFetcher(uri);
        }

        if (type === 'text') {
            return { title: value };
        }

        let title = (type === 'time_macro') ? _.trim(value, '{}') : value;
        return { title, category: type };
    });

    return Promise.all(fetchedTokens);
}

export default function loadMetricMaql(metric) {
    var maql = metric.expression;
    var tokens = tokenizeExpression(maql);
    return fetchTokenTitles(tokens);
}
