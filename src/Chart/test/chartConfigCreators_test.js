import { transformConfigToLine } from '../chartConfigCreators';

describe('chartConfigCreators', () => {
    describe('transformConfigToLine', () => {
        const category = {
            type: 'attribute',
            collection: 'stack',
            displayForm: '/gdc/md/project/obj/2'
        };

        const config = {
            type: 'column',
            buckets: {
                measures: [
                    {
                        measure: {
                            type: 'metric',
                            objectUri: '/gdc/md/project/obj/1'
                        }
                    }
                ],
                categories: [
                    { category }
                ],
                filters: []
            }
        };

        it('converts object with stack', () => {
            const lineConfig = transformConfigToLine(Object.assign({}, config));
            expect(lineConfig).to.eql({
                type: 'column',
                x: '',
                y: '/metricValues',
                color: '/gdc/md/project/obj/2',
                stacking: 'normal',
                zoomable: false,
                where: {},
                orderBy: []
            });
        });

        it('converts object without stack', () => {
            const withoutStackConfig = Object.assign({}, config);
            withoutStackConfig.buckets.categories[0].category = Object.assign(
                {}, category, { collection: 'attribute' }
            );

            const lineConfig = transformConfigToLine(withoutStackConfig);
            expect(lineConfig).to.eql({
                type: 'column',
                x: '/gdc/md/project/obj/2',
                y: '/metricValues',
                color: '/metricGroup',
                stacking: null,
                zoomable: false,
                where: {},
                orderBy: []
            });
        });

        it('passes zoomable to the config', () => {
            const configWithZoomable = {
                ...config,
                zoomable: true
            };

            const lineConfig = transformConfigToLine(configWithZoomable);
            expect(lineConfig.zoomable).to.equal(true);
        });
    });
});
