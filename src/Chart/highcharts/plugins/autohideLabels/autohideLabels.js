import { debounce } from 'lodash';

import { getChartType, hideAllLabels } from '../../helpers';
import { COLUMN_CHART, BAR_CHART } from '../../../../VisualizationTypes';
import autohideColumnLabels from './autohideColumnLabels';
import autohideBarLabels from './autohideBarLabels';

const autohideLabels = Highcharts => {
    Highcharts.Chart.prototype.callbacks.push(chart => {
        const chartType = getChartType(chart);
        const reformatLabels = () => {
            if (chartType === COLUMN_CHART) {
                autohideColumnLabels(chart);
            }
            if (chartType === BAR_CHART) {
                autohideBarLabels(chart);
            }
        };
        hideAllLabels(chart);
        reformatLabels();

        /*
         Highcharts fires 'redraw' event several times for one change, we try here
         to reduce number of calls of 'reformatLabels' for better performance.
         */
        Highcharts.addEvent(chart, 'redraw', debounce(reformatLabels, 500));
    });
};

export default autohideLabels;
