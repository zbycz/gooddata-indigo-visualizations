import {
    parseValue,
    getMeasureHeader,
    getAttributeHeader
} from '../common';

describe('Common utils', () => {
    describe('parseValue', () => {
        it('should parse string to float', () => {
            expect(parseValue('12345')).toEqual(12345);
            expect(parseValue('1.2345')).toEqual(1.2345);
            expect(parseValue('1.2345678901e-05')).toEqual(0.000012345678901);
        });

        it('should return null when value is string', () => {
            expect(parseValue('test')).toEqual(null);
        });
    });

    describe('getMeasureHeader', () => {
        const emptyAfm = {
            measures: [],
            attributes: []
        };

        const afm = {
            measures: [{
                id: 'measureId_1',
                definition: {
                    baseObject: {
                        id: 'measureUri_1'
                    }
                }
            }, {
                id: 'measureId_2',
                definition: {
                    baseObject: {
                        lookupId: 'measureId_1'
                    }
                }
            }, {
                id: 'measureId_3',
                definition: {
                    baseObject: {
                        lookupId: 'measureId_X'
                    }
                }
            }, {
                id: 'measureId_4',
                definition: {
                    baseObject: {
                        lookupId: 'measureId_2'
                    }
                }
            }]
        };

        it('should create header from measure with URI, which is available within measure', () => {
            const measure = {
                id: 'measureId_1',
                uri: 'measureUri_1'
            };

            expect(getMeasureHeader(measure, afm)).toEqual({ identifier: '', uri: measure.uri });
        });

        it('should create header from measure with identifier, which is available within measure', () => {
            const measure = {
                id: 'measureId_1',
                identifier: 'measureIdentifier_1'
            };

            expect(getMeasureHeader(measure, afm)).toEqual({ identifier: measure.identifier, uri: '' });
        });

        it('should create header from measure with both URI and identifier available within measure', () => {
            const measure = {
                id: 'measureId_1',
                identifier: 'measureIdentifier_1',
                uri: 'measureUri_1'
            };

            expect(getMeasureHeader(measure, afm)).toEqual({ identifier: measure.identifier, uri: measure.uri });
        });

        it('should create empty header, when AFM is not provided', () => {
            const measure = {
                id: 'measureId_1'
            };

            expect(getMeasureHeader(measure, emptyAfm)).toEqual({ identifier: '', uri: '' });
        });

        it('should create empty header, when measure is not found withing AFM', () => {
            const measure = {
                id: 'measureId_X'
            };

            expect(getMeasureHeader(measure, emptyAfm)).toEqual({ identifier: '', uri: '' });
        });

        it('should create header containing URI, if measure is found within AFM', () => {
            const measure = {
                id: 'measureId_1'
            };

            expect(getMeasureHeader(measure, afm)).toEqual({ identifier: '', uri: 'measureUri_1' });
        });

        it('should create header containing URI, if measure is found within AFM through lookupId', () => {
            const measure = {
                id: 'measureId_2'
            };

            expect(getMeasureHeader(measure, afm)).toEqual({ identifier: '', uri: 'measureUri_1' });
        });

        it('should create header containing URI, if measure is recursively found within AFM through lookupId', () => {
            const measure = {
                id: 'measureId_4'
            };

            expect(getMeasureHeader(measure, afm)).toEqual({ identifier: '', uri: 'measureUri_1' });
        });

        it('should create empty header, when measure is found withing AFM, but parent measure is not found via lookupId', () => {
            const measure = {
                id: 'measureId_3'
            };

            expect(getMeasureHeader(measure, afm)).toEqual({ identifier: '', uri: '' });
        });
    });

    describe('getAttributeHeader', () => {
        it('should create header from attribute', () => {
            const attribute = {
                id: 'attributeId_1',
                uri: 'attributeUri_1'
            };

            expect(getAttributeHeader(attribute)).toEqual({ identifier: attribute.id, uri: attribute.uri });
        });
    });
});
