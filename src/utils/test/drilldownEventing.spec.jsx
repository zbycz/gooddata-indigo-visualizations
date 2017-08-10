import {
    enableDrillablePoint,
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
        const res = enableDrillablePoint(drillableItems, point, context);

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
                        identifier: 'identifier1',
                        uri: 'uri1',
                        some: 'nonrelevant data'
                    },
                    {
                        id: 'id',
                        value: 'value',
                        identifier: 'identifier2',
                        uri: 'uri2'
                    },
                    {
                        id: 'id',
                        name: 'name',
                        identifier: 'identifier3',
                        uri: 'uri3'
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
                        title: 'title',
                        header: {
                            identifier: 'identifier1',
                            uri: 'uri1'
                        }
                    },
                    {
                        id: 'id',
                        title: 'value',
                        header: {
                            identifier: 'identifier2',
                            uri: 'uri2'
                        }
                    },
                    {
                        id: 'id',
                        title: 'name',
                        header: {
                            identifier: 'identifier3',
                            uri: 'uri3'
                        }
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
                        identifier: 'identifier1',
                        uri: 'uri1',
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
                            title: 'title',
                            header: {
                                identifier: 'identifier1',
                                uri: 'uri1'
                            }
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
            intersection: [{
                title: 'title1',
                id: 'id1',
                identifier: 'identifier1',
                uri: 'uri1',
                some: 'irrelevant data'
            }],
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
                row: ['3'],
                intersection: [{
                    id: 'id1',
                    title: 'title1',
                    header: {
                        identifier: 'identifier1',
                        uri: 'uri1'
                    }
                }]
            }
        });
    });
});
