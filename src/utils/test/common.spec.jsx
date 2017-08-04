import {
    parseValue
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
});
