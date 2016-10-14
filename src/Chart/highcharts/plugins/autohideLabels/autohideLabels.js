import { getChartType, hideAllLabels } from '../../helpers';
import { COLUMN_CHART, BAR_CHART } from '../../../../VisualizationTypes';
import autohideColumnLabels from './autohideColumnLabels';
import autohideBarLabels from './autohideBarLabels';

const autohideLabels = Highcharts => {
    Highcharts.Chart.prototype.callbacks.push(chart => {
        const chartType = getChartType(chart);
        const reformatLabels = () => {
            if (chartType === COLUMN_CHART) {
                autohideColumnLabels(chart, false);
            }
            if (chartType === BAR_CHART) {
                autohideBarLabels(chart, false);
            }
        };

        hideAllLabels(chart);
        reformatLabels();
        Highcharts.addEvent(chart, 'redraw', reformatLabels);
    });
};

export default autohideLabels;
