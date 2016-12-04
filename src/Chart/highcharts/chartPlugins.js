import { debounce } from 'lodash';
import autohideLabels from './plugins/autohideLabels/autohideLabels';
import { extendDataLabelColors } from './plugins/dataLabelsColors';

const getUsableContWidth = (chart, chartTextPadding) =>
    chart.renderTo.getBoundingClientRect().width - chartTextPadding;

const resizeYAxisLabel = (axis, chartTextPadding) => {
    if (axis.chart && axis.axisTitle) {
        const chart = axis.chart;
        const currentWidth = parseInt(axis.options.title.style.width.replace(/\D/, ''), 10);
        const newWidth = chart.plotHeight - chartTextPadding;

        if (currentWidth !== newWidth) {
            const title = axis.options.title;
            title.style.width = `${newWidth}px`;
            axis.setTitle(title);
        }
    }
};

const extendInitChart = (Highcharts) => {
    Highcharts.wrap(Highcharts.Chart.prototype, 'init', function(proceed, options, callback) { // eslint-disable-line
        const chart = this;
        const widthByContainer = `${getUsableContWidth(options.chart)}px`;

        chart.resizeYAxisLabel = debounce(resizeYAxisLabel, 500);

        proceed.call(chart, options, callback);

        chart.oldContainerWidth = widthByContainer;
    });
};

const extendInitAxis = (Highcharts, chartTextPadding) => {
    Highcharts.wrap(Highcharts.Axis.prototype, 'init', function(proceed, chart, options) { // eslint-disable-line
        chart.chartType = chart.options.chart.type; // eslint-disable-line

        if (options.title) {
            options.title.style.width = (options.title.rotation === 0) // eslint-disable-line
                ? `${chart.plotWidth - chartTextPadding}px` // axis title is horizontal
                : `${chart.plotHeight}px`; // axis title is vertical i.e. rotation === 270
        }
        proceed.call(this, chart, options);
    });
};

const extendReflowChart = (Highcharts, chartTextPadding) => {
    Highcharts.wrap(Highcharts.Chart.prototype, 'reflow', function(proceed, resizeEvent) { // eslint-disable-line
        const chart = this;

        Highcharts.each(chart.xAxis, (axis) => {
            if (axis.options.title) {
                const currentWidth = parseInt(axis.options.title.style.width.replace(/\D/, ''), 10);
                const newWidth = chart.plotWidth - chartTextPadding;

                if (currentWidth !== newWidth) {
                    const title = axis.options.title;
                    title.style.width = `${newWidth}px`;
                    axis.setTitle(title);
                }
            }
        });
        Highcharts.each(chart.yAxis, (axis) => {
            if (axis.options.title) {
                chart.resizeYAxisLabel(axis, chartTextPadding);
            }
        });

        proceed.call(chart, resizeEvent);

        chart.oldContainerWidth = chart.oldContainerWidth || getUsableContWidth(chart);
        if (chart.legend.itemStyle) {
            chart.resizeLegend(chart, chartTextPadding);
        }
        chart.oldContainerWidth = getUsableContWidth(chart);
    });
};

const extendRenderStackTotals = (Highcharts) => {
    Highcharts.wrap(Highcharts.Axis.prototype, 'renderStackTotals', function(proceed) { // eslint-disable-line
        const axis = this;
        const { chart, stackTotalGroup } = axis;
        const { renderer } = chart;
        /* We override renderStackTotals method to render "stack-labels" directly with desired
         * visibility to prevent blinking of data labels while resizing. In Highcharts it's
         * by default:
         *     visibility: VISIBLE,
         */
        const defaultVisibility = chart.userOptions.stackLabelsVisibility || 'visible';

        if (!stackTotalGroup) {
            axis.stackTotalGroup =
                renderer.g('stack-labels')
                    .attr({
                        visibility: defaultVisibility,
                        zIndex: 6
                    })
                    .add();
        }
        proceed.call(this);
    });
};

export function initChartPlugins(Highcharts, chartTextPadding) {
    extendInitChart(Highcharts, chartTextPadding);
    extendInitAxis(Highcharts, chartTextPadding);
    extendReflowChart(Highcharts, chartTextPadding);
    extendRenderStackTotals(Highcharts);
    autohideLabels(Highcharts);
    extendDataLabelColors(Highcharts);
}
