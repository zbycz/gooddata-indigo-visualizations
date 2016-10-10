import {
    isStacked,
    getVisibleSeries,
    getHiddenSeries,
    getDataPoints,
    showDataLabels,
    hideDataLabels,
    toNeighbors,
    getPointPositions,
    rectanglesAreOverlapping,
    hideAllLabels
} from '../../helpers';

import { BAR_CHART } from '../../../../VisualizationTypes';

// some data labels may not be rendered (too many points)
const getRenderedPointsRects = (points) => {
    return points.filter((point) => point.dataLabel)
        .map((point) => getPointPositions(point, BAR_CHART));
};

const toggleStackedChartLabels = (visiblePoints, hiddenPoints) => {
    const renderedPointsRects = getRenderedPointsRects(visiblePoints);

    const isIntersecting = renderedPointsRects
        .some((point) => point.label.height + (2 * point.labelPadding) > point.shape.height);

    if (isIntersecting) {
        hideDataLabels(visiblePoints);
    } else {
        renderedPointsRects.forEach((point) => {
            if (point.label.width + (2 * point.labelPadding) > point.shape.width) {
                point.hide();
            } else {
                point.show();
            }
        });
    }

    hideDataLabels(hiddenPoints);
};

const toggleNonStackedChartLabels = (visiblePoints, hiddenPoints) => {
    const neighbors = toNeighbors(getRenderedPointsRects(visiblePoints));

    const isIntersecting = neighbors.some(([firstPoint, nextPoint]) => {
        return rectanglesAreOverlapping(firstPoint.label, nextPoint.label)
            || rectanglesAreOverlapping(firstPoint.label, nextPoint.shape)
            || rectanglesAreOverlapping(firstPoint.shape, nextPoint.label);
    });

    if (isIntersecting) {
        hideDataLabels(visiblePoints);
    } else {
        showDataLabels(visiblePoints);
    }

    hideDataLabels(hiddenPoints);
};


const toggleLabels = (chart) => {
    const visibleSeries = getVisibleSeries(chart);
    const hiddenSeries = getHiddenSeries(chart);
    const visiblePoints = getDataPoints(visibleSeries);
    const hiddenPoints = getDataPoints(hiddenSeries);

    if (isStacked(chart)) {
        toggleStackedChartLabels(visiblePoints, hiddenPoints);
    } else {
        toggleNonStackedChartLabels(visiblePoints, hiddenPoints);
    }

    return chart;
};

export default function autohideBarLabels(chart, quick = false) {
    const timeout = quick ? 0 : 500;
    setTimeout(() => toggleLabels(chart), timeout);
}
