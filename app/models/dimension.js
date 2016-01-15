import { List, Record } from 'immutable';
import { last } from 'lodash';

import translations from '../translations/en';
import { indexBy } from '../utils/immutable';
import { GRANULARITY_OPTIONS } from '../models/granularity';

function getParenthesisedGroups(str) {
    let nesting = 0,
        groupStart = -1,
        groups = [];

    for (let i = 0; i < str.length; i++) {
        if (str[i] === '(') {
            if (nesting === 0) {
                groupStart = i + 1;
            }

            nesting++;
        } else if (str[i] === ')') {
            nesting--;

            if (nesting === 0) {
                groups.push(str.substr(groupStart, i - groupStart));
                groupStart = -1;
            }
        }
    }

    // push unclosed last group to the result
    if (groupStart !== -1) {
        groups.push(str.substr(groupStart, str.length - groupStart));
    }

    return groups;
}

function extractDateDimensionTitle(title) {
    return last(getParenthesisedGroups(title)) || title;
}

let dimensionBase = {
    title: null,
    summary: null,
    identifier: null,
    uri: null,
    attributes: null,
    type: null,
    id: null,
    isAvailable: true
};

let DecoratedDimension = Record(Object.assign({}, dimensionBase, {
    attributeTitle: null,
    availabilityTitle: null,
    isDisabled: null,
    attributes: null
}));

export function decoratedDimension(dimension) {
    let attributesById = indexBy(dimension.get('attributes'), 'dateType');

    return new DecoratedDimension(
        dimension
            .set('attributeTitle', extractDateDimensionTitle(dimension.get('title')))
            .set('availabilityTitle',
                translations[
                    dimension.get('isAvailable') ? 'date.dimension.available' : 'date.dimension.unavailable'
                ]
            )
            .set('isDisabled', !dimension.get('isAvailable'))
            .set('attributes', List(GRANULARITY_OPTIONS.map(
                    option => {
                        let attribute = attributesById.get(option.dateType);
                        return attribute ? attribute.set('label', option.label) : null;
                    }
                )).filter(attribute => !!attribute)
            )
    );
}

export function decoratedDimensions(dimensions) {
    return (dimensions.get('dimensions') || List())
        .concat(
            (dimensions.get('unavailable') || List())
                .map(unavailable => unavailable.set('isAvailable', false))
        )
        .map(dimension => decoratedDimension(dimension));
}
