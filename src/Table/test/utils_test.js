import { getSortInfo } from '../utils';

describe('Utils', () => {
    describe('getSortInfo', () => {
        let config;

        beforeEach(() => {
            config = {
                buckets: {
                    categories: [
                        { category: { } },
                        { category: { sort: 'asc' } }
                    ],
                    measures: [
                        { measure: {} },
                        { measure: { sort: 'desc' } }
                    ]
                }
            };
        });

        it('should get sort for category', () => {
            const sortInfo = getSortInfo(config);

            expect(sortInfo.sortBy).to.eql(1);
            expect(sortInfo.sortDir).to.eql('asc');
        });

        it('should get sort for measure', () => {
            config.buckets.categories[1].category = {};
            const sortInfo = getSortInfo(config);

            expect(sortInfo.sortBy).to.eql(3);
            expect(sortInfo.sortDir).to.eql('desc');
        });

        it('should handle missing config', () => {
            const sortInfo = getSortInfo();

            expect(sortInfo).to.eql({});
        });

        it('should handle missing categories', () => {
            delete config.buckets.categories;
            const sortInfo = getSortInfo(config);

            expect(sortInfo.sortBy).to.eql(1);
            expect(sortInfo.sortDir).to.eql('desc');
        });

        it('should handle sort object in measure', () => {
            const sortInfo = getSortInfo({
                buckets: {
                    categories: [],
                    measures: [
                        { measure: {} },
                        { measure: { sort: { direction: 'asc' } } }
                    ]
                }
            });

            expect(sortInfo.sortBy).to.eql(1);
            expect(sortInfo.sortDir).to.eql('asc');
        });

        it('should handle sort for measure with pop', () => {
            const sortInfo = getSortInfo({
                buckets: {
                    categories: [],
                    measures: [
                        { measure: {} },
                        { measure: { showPoP: true, sort: { direction: 'asc' } } }
                    ]
                }
            });

            expect(sortInfo.sortBy).to.eql(2);
            expect(sortInfo.sortDir).to.eql('asc');
        });

        it('should handle sort for pop measure', () => {
            const sortInfo = getSortInfo({
                buckets: {
                    categories: [],
                    measures: [
                        { measure: {} },
                        { measure: { showPoP: true, sort: { direction: 'asc', sortByPoP: true } } }
                    ]
                }
            });

            expect(sortInfo.sortBy).to.eql(1);
            expect(sortInfo.sortDir).to.eql('asc');
        });
    });
});
