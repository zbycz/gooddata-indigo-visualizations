import { set, debounce, cloneDeep } from 'lodash';
import invariant from 'invariant';
import CustomEvent from 'custom-event';
import { BAR_CHART, COLUMN_CHART, LINE_CHART, PIE_CHART, TABLE } from '../VisualizationTypes';

export const isDrillable = (drillableItems, header) =>
    drillableItems.some(drillableItem =>
        drillableItem.identifier === header.identifier ||
        drillableItem.uri === header.uri
    );

export function enableDrillablePoint(drillableItems, data, context) {
    const point = cloneDeep(data);

    const pointIsDrillable = context.some(item =>
        isDrillable(drillableItems, item)
    );

    set(point, 'drilldown', pointIsDrillable);
    set(point, 'drillContext', context);

    return point;
}

export function getClickableElementNameByChartType(type) {
    switch (type) {
        case LINE_CHART:
            return 'point';
        case COLUMN_CHART:
        case BAR_CHART:
            return 'bar';
        case PIE_CHART:
            return 'slice';
        case TABLE:
            return 'cell';
        default:
            return invariant(false, `Unknown visualization type: ${type}`);
    }
}

function fireEvent(data, target) {
    target.dispatchEvent(new CustomEvent('drill', {
        detail: data,
        bubbles: true
    }));
}

function normalizeIntersectionElements(intersection) {
    return intersection.map(({ id, title, value, name, uri, identifier }) => {
        return {
            id,
            title: title || value || name,
            header: {
                uri,
                identifier
            }
        };
    });
}

function composeDrillContextGroup({ points }, chartType) {
    return {
        type: chartType,
        element: 'label',
        points: points.map((p) => {
            return {
                x: p.x,
                y: p.y,
                intersection: normalizeIntersectionElements(p.drillContext)
            };
        })
    };
}

function composeDrillContextPoint({ point }, chartType) {
    return {
        type: chartType,
        element: getClickableElementNameByChartType(chartType),
        x: point.x,
        y: point.y,
        intersection: normalizeIntersectionElements(point.drillContext)
    };
}

const chartClickDebounced = debounce((afm, event, target, chartType) => {
    const { points } = event;
    const isGroupClick = !!points;

    const data = {
        executionContext: afm,
        drillContext: isGroupClick ?
            composeDrillContextGroup(event, chartType) : composeDrillContextPoint(event, chartType)
    };

    fireEvent(data, target);
});

export const chartClick = (...props) => chartClickDebounced(...props);

export const cellClick = (afm, event, target) => {
    const { columnIndex, rowIndex, row, intersection } = event;
    const data = {
        executionContext: afm,
        drillContext: {
            type: TABLE,
            element: getClickableElementNameByChartType(TABLE),
            columnIndex,
            rowIndex,
            row,
            intersection: normalizeIntersectionElements(intersection)
        }
    };

    fireEvent(data, target);
};
