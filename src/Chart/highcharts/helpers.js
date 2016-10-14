import {
    flatten,
    flatMap,
    get,
    map,
    zip,
    unzip,
    initial,
    tail,
    isEmpty
} from 'lodash';

import { BAR_CHART, COLUMN_CHART } from '../../VisualizationTypes';

// https://silentmatt.com/rectangle-intersection/
export const rectanglesAreOverlapping = (r1, r2, padding = 0) =>
    r1.left - padding < r2.right + padding &&
    r1.right + padding > r2.left - padding &&
    r1.top - padding < r2.bottom + padding &&
    r1.bottom + padding > r2.top - padding;

export const toNeighbors = (array) => zip(initial(array), tail(array));
export const getVisibleSeries = (chart) => chart.series && chart.series.filter(s => s.visible);
export const getHiddenSeries = (chart) => chart.series && chart.series.filter(s => !s.visible);
export const getDataPoints = (series) => flatten(unzip(map(series, s => s.points)));
export const getChartType = (chart) => get(chart, 'options.chart.type');
export const isStacked = (chart) => {
    const chartType = getChartType(chart);
    if (get(chart, `userOptions.plotOptions.${chartType}.stacking`, false) &&
        chart.axes.some(axis => !isEmpty(axis.stacks))) {
        return true;
    }

    if (get(chart, 'userOptions.plotOptions.series.stacking', false) &&
        chart.axes.some(axis => !isEmpty(axis.stacks))) {
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

export const getPointPositions = (point) => {
    const { dataLabel, graphic } = point;
    const labelRect = dataLabel.element.getBoundingClientRect();
    const shapeRect = graphic.element.getBoundingClientRect();
    return {
        shape: shapeRect,
        label: labelRect,
        labelPadding: dataLabel.padding,
        show: () => dataLabel.show(),
        hide: () => dataLabel.hide()
    };
};
