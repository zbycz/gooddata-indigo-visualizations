import { getSortInfo } from '../src/utils';

describe('Utils', function() {
    describe('getSortInfo', function() {
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
    });
});
