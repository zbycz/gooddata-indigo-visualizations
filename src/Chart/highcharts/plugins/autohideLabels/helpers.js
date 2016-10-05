import {
    flatten,
    flatMap,
    get,
    map,
    zip,
    unzip,
    initial,
    tail
} from 'lodash';

import { BAR_CHART, COLUMN_CHART } from '../../../../VisualizationTypes';

// https://silentmatt.com/rectangle-intersection/
export const rectanglesAreOverlapping = (r1, r2) =>
r1.left < r2.right && r1.right > r2.left && r1.top < r2.bottom && r1.bottom > r2.top;

export const toNeighbors = (array) => zip(initial(array), tail(array));
export const getVisibleSeries = (chart) => chart.series && chart.series.filter(s => s.visible);
export const getHiddenSeries = (chart) => chart.series && chart.series.filter(s => !s.visible);
export const getDataPoints = (series) => flatten(unzip(map(series, s => s.points)));
export const getChartType = (chart) => get(chart, 'options.chart.type');
export const isStacked = (chart) => {
    const chartType = getChartType(chart);
    if (get(chart, `userOptions.plotOptions.${chartType}.stacking`, false) &&
        chart.series.length > 1) {
        return true;
    }

    if (get(chart, 'userOptions.plotOptions.series.stacking', false) &&
        chart.series.length > 1) {
        return true;
    }

    return false;
};
export const areLabelsStacked = (chart) =>
    (get(chart, 'userOptions.yAxis.stackLabels.enabled', false) && isStacked(chart));

export const hideAllLabels = ({ series }) => flatMap(series, s => s.points)
    .filter(point => point.dataLabel)
    .forEach(point => point.dataLabel.hide());


export const hideDataLabels = (points) => {
    points.forEach(point => point.dataLabel && point.dataLabel.hide());
};
export const showDataLabels = (points) => {
    points.forEach(point => point.dataLabel && point.dataLabel.show());
};

export const getPointPositions = (point, visualizationType) => {
    const { dataLabel, shapeArgs } = point;

    // TODO unify bar types & use bounding client rect as bellow
    if (visualizationType === COLUMN_CHART) {
        return {
            labelTop: dataLabel.y,
            labelBottom: dataLabel.y + Math.ceil(dataLabel.height),
            labelLeft: dataLabel.x + dataLabel.padding,
            labelRight: (dataLabel.x + Math.ceil(dataLabel.width)) - dataLabel.padding,
            labelWidth: Math.ceil(dataLabel.width),
            labelHeight: Math.ceil(dataLabel.height),
            shapeTop: shapeArgs.y,
            shapeBottom: shapeArgs.y + Math.ceil(shapeArgs.height),
            shapeLeft: shapeArgs.x,
            shapeRight: shapeArgs.x + Math.ceil(shapeArgs.width),
            shapeWidth: Math.ceil(shapeArgs.width),
            shapeHeight: Math.ceil(shapeArgs.height)
        };
    }

    if (visualizationType === BAR_CHART) {
        const labelRect = point.dataLabel.element.getBoundingClientRect();
        const shapeRect = point.graphic.element.getBoundingClientRect();
        return {
            shape: shapeRect,
            label: labelRect,
            labelPadding: point.dataLabel.padding,
            show: () => point.dataLabel.show(),
            hide: () => point.dataLabel.hide()
        };
    }

    return null;
};
