import {
    isStacked,
    getVisibleSeries,
    getDataPoints,
    showDataLabels,
    hideDataLabels,
    showDataLabel,
    hideDataLabel,
    hasDataLabel,
    toNeighbors,
    isIntersecting,
    getDataLabelAttributes,
    getShapeAttributes
} from '../../helpers';

const toggleStackedChartLabels = (visiblePoints) => {
    const intersectionFound = visiblePoints
        .filter(hasDataLabel)
        .some((point) => {
            const { dataLabel, shapeArgs } = point;

            if (dataLabel && shapeArgs) {
                const dataLabelAttr = getDataLabelAttributes(point);
                const shapeAttr = getShapeAttributes(point);
                return dataLabelAttr.height + (2 * dataLabel.padding) > shapeAttr.height;
            }
            return false;
        });

    if (intersectionFound) {
        hideDataLabels(visiblePoints);
    } else {
        visiblePoints.filter(hasDataLabel).forEach((point) => {
            const { dataLabel, shapeArgs } = point;
            if (dataLabel && shapeArgs) {
                const dataLabelAttr = getDataLabelAttributes(point);
                const shapeAttr = getShapeAttributes(point);
                const labelWidth = dataLabelAttr.width + (2 * dataLabel.padding);
                const foundIntersection = labelWidth > shapeAttr.width;
                return foundIntersection ? hideDataLabel(point) : showDataLabel(point);
            }
            return null;
        });
    }
};

const toggleNonStackedChartLabels = (points, shouldCheckShapeIntersection = false) => {
    const neighbors = toNeighbors(points);
    const intersectionFound = neighbors.some(([firstPoint, nextPoint]) => {
        const firstDataLabelAttr = getDataLabelAttributes(firstPoint);
        const nextDataLabelAttr = getDataLabelAttributes(nextPoint);

        if (shouldCheckShapeIntersection) {
            const firstShapeAttr = getShapeAttributes(firstPoint);
            const nextShapeAttr = getShapeAttributes(nextPoint);

            return isIntersecting(firstDataLabelAttr, nextDataLabelAttr) ||
                isIntersecting(firstDataLabelAttr, nextShapeAttr) ||
                isIntersecting(firstShapeAttr, nextDataLabelAttr);
        }

        return isIntersecting(firstDataLabelAttr, nextDataLabelAttr);
    });

    if (intersectionFound) {
        hideDataLabels(points);
    } else {
        showDataLabels(points);
    }
};


const autohideBarLabels = (chart) => {
    const visibleSeries = getVisibleSeries(chart);
    const visiblePoints = getDataPoints(visibleSeries);

    if (isStacked(chart)) {
        toggleStackedChartLabels(visiblePoints);
    } else {
        toggleNonStackedChartLabels(visiblePoints, true);
    }
};

export default autohideBarLabels;
