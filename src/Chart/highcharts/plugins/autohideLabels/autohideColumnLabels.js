import {
    map,
    sortBy,
    zip,
    groupBy,
    minBy,
    maxBy
} from 'lodash';

import {
    getVisibleSeries,
    getHiddenSeries,
    getDataPoints,
    isStacked,
    areLabelsStacked,
    toNeighbors,
    showDataLabels,
    hideDataLabels,
    getPointPositions,
    rectanglesAreOverlapping
} from '../../helpers';

const toggleNonStackedChartLabels = (visiblePoints, hiddenPoints) => {
    const foundIntersection = toNeighbors(
        // some data labels may not be rendered (too many points)
        visiblePoints.filter((point) => point.dataLabel))
        .some(([first, next]) => {
            const firstPoint = getPointPositions(first);
            const nextPoint = getPointPositions(next);
            return rectanglesAreOverlapping(firstPoint.label, nextPoint.label, firstPoint.labelPadding)
                || rectanglesAreOverlapping(firstPoint.label, nextPoint.shape, firstPoint.labelPadding)
                || rectanglesAreOverlapping(firstPoint.shape, nextPoint.label, firstPoint.labelPadding);
        });

    if (foundIntersection) {
        hideDataLabels(visiblePoints);
    } else {
        showDataLabels(visiblePoints);
    }
    hideDataLabels(hiddenPoints);
};

const toggleStackedChartLabels = (visiblePoints, hiddenPoints) => {
    // hideDataLabels(visiblePoints);
    const toggleLabel = point => {
        const { dataLabel } = point;
        if (dataLabel) {
            const pointProperties = getPointPositions(point);
            const labelHeight = pointProperties.label.height + (2 * pointProperties.labelPadding);
            const isOverlappingHeight = labelHeight > pointProperties.shape.height;
            const toggle = isOverlappingHeight ? pointProperties.hide : pointProperties.show;
            toggle();
        }
    };

    const isOverlappingWidth = visiblePoints.some(point => {
        const { dataLabel } = point;
        if (dataLabel) {
            const pointProperties = getPointPositions(point);
            const labelWidth = pointProperties.label.width + (2 * pointProperties.labelPadding);
            return labelWidth > pointProperties.shape.width;
        }
        return false;
    });

    if (isOverlappingWidth) {
        hideDataLabels(visiblePoints);
    } else {
        visiblePoints.forEach(toggleLabel);
    }

    hideDataLabels(hiddenPoints);
};

function toggleStackedLabels() {
    const dlg = this.yAxis[0].stackTotalGroup;
    const visibleSeries = getVisibleSeries(this);
    if (!visibleSeries.length) {
        dlg.hide();
        return;
    }

    const dlgNodes = dlg.element.childNodes;
    const dlgNodesBCR = sortBy(map(dlgNodes, node => node.getBoundingClientRect()), 'left');
    const shapesBCR = map(
        groupBy(getDataPoints(visibleSeries), point => point.category), pointGroup => {
            const pointsBCR = pointGroup
                .filter(point => point.graphic)
                .map(point => point.graphic.element.getBoundingClientRect());
            const topElement = minBy(pointsBCR, point => point.top);
            const bottomElement = maxBy(pointsBCR, point => point.bottom);

            if (!(topElement && bottomElement)) {
                return null;
            }

            if (topElement === bottomElement) {
                return topElement;
            }

            return {
                top: topElement.top,
                left: topElement.left,
                right: topElement.right,
                width: topElement.width,
                height: bottomElement.bottom - topElement.top,
                bottom: bottomElement.bottom
            };
        });

    const neighbors = zip(toNeighbors(dlgNodesBCR), toNeighbors(shapesBCR));
    const foundIntersection = neighbors
        .some(([[currentLabelBCR, nextLabelBCR], [currentShapePositions, nextShapePositions]]) => {
            if (rectanglesAreOverlapping(currentLabelBCR, nextLabelBCR, 2)) {
                return true;
            }
            if (nextShapePositions &&
                rectanglesAreOverlapping(currentLabelBCR, nextShapePositions, 2)) {
                return true;
            }
            if (currentShapePositions &&
                rectanglesAreOverlapping(nextLabelBCR, currentShapePositions, 2)) {
                return true;
            }
            return false;
        });

    if (foundIntersection) {
        dlg.hide();
    } else {
        dlg.show();
    }
};


const toggleLabels = (chart) => {
    const isStackedChart = isStacked(chart);
    const hasLabelsStacked = areLabelsStacked(chart);
    const visibleSeries = getVisibleSeries(chart);
    const hiddenSeries = getHiddenSeries(chart);
    const visiblePoints = getDataPoints(visibleSeries);
    const hiddenPoints = getDataPoints(hiddenSeries);

    if (isStackedChart) {
        toggleStackedChartLabels(visiblePoints, hiddenPoints);
    } else {
        toggleNonStackedChartLabels(visiblePoints, hiddenPoints);
    }
    if (hasLabelsStacked) {
        toggleStackedLabels.call(chart);
    }
};

export default function autohideColumnLabels(chart, quick = false) {
    const timeout = quick ? 0 : 1000;
    setTimeout(() => toggleLabels(chart), timeout);
}
