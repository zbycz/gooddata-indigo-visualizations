import { isArray, has } from 'lodash';

export function parseValue(value) {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? null : parsedValue;
}

export function getMeasureHeader(item, afm = {}) {
    const { id, uri = '', identifier = '' } = item;

    const header = {
        identifier: '',
        uri: ''
    };

    if (uri.length || identifier.length) {
        header.identifier = identifier;
        header.uri = uri;

        return header;
    }


    if (isArray(afm.measures)) {
        const afmMeasure = afm.measures.find(measure => measure.id === id);

        if (has(afmMeasure, ['definition', 'baseObject', 'lookupId'])) {
            const lookupId = afmMeasure.definition.baseObject.lookupId;
            return getMeasureHeader({ id: lookupId }, afm);
        }

        if (has(afmMeasure, ['definition', 'baseObject', 'id'])) {
            header.uri = afmMeasure.definition.baseObject.id;
        }
    }

    return header;
}

export const getAttributeHeader = header => ({
    identifier: header.id,
    uri: header.uri
});
