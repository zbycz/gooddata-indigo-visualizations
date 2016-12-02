import { flatMap } from 'lodash';
import { BAR_CHART } from '../../../VisualizationTypes';
import { getChartType, getVisibleSeries, isStacked } from '../helpers';

const setWhiteColor = (point) => {
    // eslint-disable-next-line no-param-reassign
    point.dataLabel.element.childNodes[0].style.fill = '#fff';
    // eslint-disable-next-line no-param-reassign
    point.dataLabel.element.childNodes[0].style['text-shadow'] = 'rgb(0, 0, 0) 0px 0px 1px';
};

const setBlackColor = (point) => {
    // eslint-disable-next-line no-param-reassign
    point.dataLabel.element.childNodes[0].style.fill = '#000';
    // eslint-disable-next-line no-param-reassign
    point.dataLabel.element.childNodes[0].style['text-shadow'] = 'none';
};

function setLabelsColor(chart) {
    const points = flatMap(getVisibleSeries(chart), series => series.points)
        .filter(point => (point.dataLabel && point.graphic));

    return points.forEach((point) => {
        const labelRect =
            point.dataLabel.element.childNodes[0].getBoundingClientRect();
        const barRect = point.graphic.element.getBoundingClientRect();

        if (labelRect.left < barRect.right) {
            setWhiteColor(point);
        } else {
            setBlackColor(point);
        }
    });
}

export function extendDataLabelColors(Highcharts) {
    Highcharts.Chart.prototype.callbacks.push((chart) => {
        const type = getChartType(chart);

        const changeLabelColor = () => {
            if (type === BAR_CHART && !isStacked(chart)) {
                setTimeout(() => {
                    setLabelsColor(chart);
                }, 500);
            }
        };

        changeLabelColor();
        Highcharts.addEvent(chart, 'redraw', changeLabelColor);
    });
}
