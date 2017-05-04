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

        it('should pass custom colors', () => {
            const configWithColors = {
                ...config,
                colors: [
                    'rgb(247,0,255)',
                    'rgb(0,0,0)'
                ]
            };
            const lineConfig = transformConfigToLine(configWithColors);
            expect(lineConfig.colorPalette).to.eql([
                'rgb(247,0,255)',
                'rgb(0,0,0)'
            ]);
        });

        it('converts object with stack', () => {
            const lineConfig = transformConfigToLine(Object.assign({}, config));
            expect(lineConfig).to.eql({
                type: 'column',
                x: '',
                y: '/metricValues',
                color: '/gdc/md/project/obj/2',
                stacking: 'normal',
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
                where: {},
                orderBy: []
            });
        });
    });
});
