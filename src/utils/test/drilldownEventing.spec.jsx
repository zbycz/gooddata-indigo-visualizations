import {
    enableDrillablePoints,
    getClickableElementNameByChartType,
    chartClick,
    cellClick
} from '../drilldownEventing';
import { BAR_CHART, COLUMN_CHART, LINE_CHART, PIE_CHART, TABLE } from '../../VisualizationTypes';

describe('Drilldown Eventing', () => {
    jest.useFakeTimers();

    it('should enable drilldown to point', () => {
        const point = {};
        const context = [{ header: { id: 'foo' } }];
        const drillableItems = [{ identifier: 'foo' }];
        const res = enableDrillablePoints(drillableItems, point, context);

        expect(res).toMatchObject({
            drilldown: true,
            drillContext: context
        });
    });

    it('should get clickable chart element name', () => {
        const fn = getClickableElementNameByChartType;
        expect(fn(LINE_CHART)).toBe('point');
        expect(fn(COLUMN_CHART)).toBe('bar');
        expect(fn(BAR_CHART)).toBe('bar');
        expect(fn(PIE_CHART)).toBe('slice');
        expect(fn(TABLE)).toBe('cell');
        expect(() => {
            fn('nonsense');
        }).toThrowError();
    });

    it('should call fire event on point click', () => {
        const afm = { is: 'AFM' };
        const target = { dispatchEvent: jest.fn() };
        const event = {
            point: {
                x: 1,
                y: 2,
                drillContext: [
                    {
                        id: 'id',
                        title: 'title',
                        some: 'nonrelevant data'
                    },
                    {
                        id: 'id',
                        value: 'value'
                    },
                    {
                        id: 'id',
                        name: 'name'
                    }
                ],
                some: 'nonrelevant data'
            }
        };

        chartClick(afm, event, target, LINE_CHART);

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: { is: 'AFM' },
            drillContext: {
                type: 'line',
                element: 'point',
                x: 1,
                y: 2,
                intersection: [
                    {
                        id: 'id',
                        title: 'title'
                    },
                    {
                        id: 'id',
                        title: 'value'
                    },
                    {
                        id: 'id',
                        title: 'name'
                    }
                ]
            }
        });
    });

    it('should call fire event on label click', () => {
        const afm = { is: 'AFM' };
        const target = { dispatchEvent: jest.fn() };
        const event = {
            points: [{
                x: 1,
                y: 2,
                drillContext: [
                    {
                        id: 'id',
                        title: 'title',
                        some: 'nonrelevant data'
                    }
                ],
                some: 'nonrelevant data'
            }]
        };

        chartClick(afm, event, target, LINE_CHART);

        jest.runAllTimers();

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: { is: 'AFM' },
            drillContext: {
                type: 'line',
                element: 'label',
                points: [{
                    x: 1,
                    y: 2,
                    intersection: [
                        {
                            id: 'id',
                            title: 'title'
                        }
                    ]

                }]
            }
        });
    });

    it('should call fire event on cell click', () => {
        const afm = { is: 'AFM' };
        const target = { dispatchEvent: jest.fn() };
        const event = {
            columnIndex: 1,
            rowIndex: 2,
            row: ['3'],
            some: 'nonrelevant data'
        };

        cellClick(afm, event, target);

        expect(target.dispatchEvent).toHaveBeenCalled();

        expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
            executionContext: { is: 'AFM' },
            drillContext: {
                type: 'table',
                element: 'cell',
                columnIndex: 1,
                rowIndex: 2,
                row: ['3']
            }
        });
    });
});
