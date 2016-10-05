import { getChartType, hideAllLabels } from './helpers';
import { COLUMN_CHART, BAR_CHART } from '../../../../VisualizationTypes';
import autohideColumnLabels from './autohideColumnLabels';
import autohideBarLabels from './autohideBarLabels';

const autohideLabels = Highcharts => {
    Highcharts.Chart.prototype.callbacks.push(chart => {
        const chartType = getChartType(chart);

        const reformatLabels = () => {
            hideAllLabels(chart);
            if (chartType === COLUMN_CHART) {
                autohideColumnLabels(chart);
            }
            if (chartType === BAR_CHART) {
                autohideBarLabels(chart);
            }
        };
        const reformatLabelsQuick = () => {
            if (chartType === COLUMN_CHART) {
                autohideColumnLabels(chart, true);
            }
            if (chartType === BAR_CHART) {
                autohideBarLabels(chart, true);
            }
        };

        reformatLabelsQuick();
        Highcharts.addEvent(chart, 'redraw', reformatLabels);
        Highcharts.addEvent(chart, 'resize', reformatLabelsQuick);
        Highcharts.addEvent(chart, 'init', reformatLabelsQuick);
    });
};

export default autohideLabels;
