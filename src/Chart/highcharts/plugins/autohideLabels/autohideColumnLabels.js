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
    hideAllLabels,
    toNeighbors,
    showDataLabels,
    hideDataLabels,
    getPointPositions,
    rectanglesAreOverlapping
} from '../../helpers';

import { COLUMN_CHART } from '../../../../VisualizationTypes';

const areLabelsIntersecting = (firstPointPositions, nextPointPositions) => {
    const isIntersectingOnX = (firstPointPositions.labelRight > nextPointPositions.labelLeft);
    const isIntersectingOnY =
        (
            (nextPointPositions.labelTop < firstPointPositions.labelBottom) &&
            (nextPointPositions.labelTop > firstPointPositions.labelTop)
        ) ||
        (
            (nextPointPositions.labelBottom > firstPointPositions.labelTop) &&
            (nextPointPositions.labelBottom < firstPointPositions.labelBottom)
        );
    const isFirstLabelIntersectingWithNextShape =
        (firstPointPositions.labelRight > nextPointPositions.shapeLeft) &&
        (firstPointPositions.labelBottom > nextPointPositions.shapeTop);
    const isSecondLabelIntersectingWithFirstShape =
        (nextPointPositions.labelLeft < firstPointPositions.shapeRight) &&
        (nextPointPositions.labelBottom > firstPointPositions.shapeTop);

    return (
        (isIntersectingOnX && isIntersectingOnY) ||
        isFirstLabelIntersectingWithNextShape ||
        isSecondLabelIntersectingWithFirstShape
    );
};

const toggleNonStackedChartLabels = chart => {
    const visibleSeries = getVisibleSeries(chart);
    const hiddenSeries = getHiddenSeries(chart);
    const visiblePoints = getDataPoints(visibleSeries);
    const hiddenPoints = getDataPoints(hiddenSeries);
    const foundIntersection = toNeighbors(
        // some data labels may not be rendered (too many points)
        visiblePoints.filter((point) => point.dataLabel)
    )
        .some(([firstPoint, nextPoint]) =>
            areLabelsIntersecting(
                getPointPositions(firstPoint, COLUMN_CHART),
                getPointPositions(nextPoint, COLUMN_CHART)
            )
        );

    if (foundIntersection) {
        hideDataLabels(visiblePoints);
        return;
    }

    showDataLabels(visiblePoints);
    hideDataLabels(hiddenPoints);
};

const toggleStackedChartLabels = chart => {
    const visibleSeries = getVisibleSeries(chart);
    const hiddenSeries = getHiddenSeries(chart);
    const visiblePoints = getDataPoints(visibleSeries);
    const hiddenPoints = getDataPoints(hiddenSeries);

    const toggleLabel = point => {
        const { dataLabel } = point;
        if (dataLabel) {
            const pointProperties = getPointPositions(point, COLUMN_CHART);
            const isOverlappingHeight = pointProperties.labelHeight > pointProperties.shapeHeight;
            if (isOverlappingHeight) {
                dataLabel.hide();
            } else {
                dataLabel.show();
            }
        }
    };

    const isOverlappingWidth = visiblePoints.some(point => {
        const { dataLabel } = point;
        if (dataLabel) {
            const pointProperties = getPointPositions(point, COLUMN_CHART);
            return pointProperties.labelWidth > pointProperties.shapeWidth;
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

const toggleStackedLabels = chart => {
    const dlg = chart.yAxis[0].stackTotalGroup;
    const dlgNodes = dlg.element.childNodes;
    const dlgNodesBCR = sortBy(map(dlgNodes, node => node.getBoundingClientRect()), 'left');
    const visibleSeries = getVisibleSeries(chart);
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
            if (rectanglesAreOverlapping(currentLabelBCR, nextLabelBCR)) {
                return true;
            }
            if (nextShapePositions &&
                rectanglesAreOverlapping(currentLabelBCR, nextShapePositions)) {
                return true;
            }
            if (currentShapePositions &&
                rectanglesAreOverlapping(nextLabelBCR, currentShapePositions)) {
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
    if (isStackedChart) {
        toggleStackedChartLabels(chart);
    } else {
        toggleNonStackedChartLabels(chart);
    }

    if (hasLabelsStacked) {
        toggleStackedLabels(chart);
    }
};

export default function autohideColumnLabels(chart, quick = false) {
    const timeout = quick ? 0 : 500;
    setTimeout(() => toggleLabels(chart), timeout);
}
