import { getChartType } from '../../helpers';
import { COLUMN_CHART, BAR_CHART } from '../../../../VisualizationTypes';
import autohideColumnLabels from './autohideColumnLabels';
import autohideBarLabels from './autohideBarLabels';

const autohideLabels = Highcharts => {
    Highcharts.Chart.prototype.callbacks.push(chart => {
        const chartType = getChartType(chart);

        const reformatLabels = () => {
            // hideAllLabels(chart);
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

        const hideSeriesLabels = (event) => {
            console.log('legend item clicked', this, event);
        };

        console.log(chart);

        reformatLabelsQuick();
        Highcharts.addEvent(chart, 'redraw', reformatLabels);
        Highcharts.addEvent(chart, 'resize', reformatLabelsQuick);
        Highcharts.addEvent(chart, 'init', reformatLabelsQuick);
        Highcharts.addEvent(chart.series, 'legendItemClick', hideSeriesLabels);
    });
};

export default autohideLabels;
