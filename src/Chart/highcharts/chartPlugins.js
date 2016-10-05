import { debounce } from 'lodash';
import autohideLabels from './plugins/autohideLabels/autohideLabels';

const LEGEND_TEXT_PADDING = 10;

const getUsableContWidth = (chart, chartTextPadding) =>
    chart.renderTo.getBoundingClientRect().width - chartTextPadding;

const getFittingLegendWidth = (chart, chartTextPadding) => {
    const widthByContainer = getUsableContWidth(chart, chartTextPadding);
    const widthByLegend = chart.legend.legendWidth - LEGEND_TEXT_PADDING;
    const plotWidth = chart.plotWidth;

    const legendIsOnRight = chart.legendLayout === 'vertical';
    const chartEnlarges = chart.oldContainerWidth < widthByContainer;

    const widerWidth = Math.max(plotWidth, widthByContainer);
    const tinierWidth = Math.min(plotWidth, widthByContainer);
    const widthByResize = chartEnlarges ? widerWidth : tinierWidth;

    return legendIsOnRight ? widthByLegend : widthByResize;
};

const resizeLegend = (chart, chartTextPadding) => {
    if (chart.legend) {
        const fittingLegendWidth = getFittingLegendWidth(chart, chartTextPadding);

        chart.legend.itemStyle.width = fittingLegendWidth; // eslint-disable-line
        chart.isDirtyLegend = true; // eslint-disable-line
        chart.isDirtyBox = true; // eslint-disable-line
        chart.series.forEach(series => {
            chart.legend.destroyItem(series);
        });
        chart.redraw();
        chart.legend.render();
    }
};

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

const xAxisHorizontal = (chartType) => chartType === 'bar';

const extendInitChart = (Highcharts, chartTextPadding) => {
    Highcharts.wrap(Highcharts.Chart.prototype, 'init', function(proceed, options, callback) { // eslint-disable-line
        const chart = this;
        const widthByContainer = `${getUsableContWidth(options.chart)}px`;

        options.legend.itemStyle.width = widthByContainer; // eslint-disable-line
        chart.resizeYAxisLabel = debounce(resizeYAxisLabel, 500);
        chart.resizeLegend = debounce(resizeLegend, 500);
        proceed.call(chart, options, callback);

        chart.legendLayout = options.legend.layout;

        if (chart.legendLayout === 'vertical') {
            chart.resizeLegend(chart, chartTextPadding);
        }

        chart.oldContainerWidth = widthByContainer;
    });
};

const extendInitAxis = (Highcharts, chartTextPadding) => {
    Highcharts.wrap(Highcharts.Axis.prototype, 'init', function(proceed, chart, options) { // eslint-disable-line
        chart.chartType = chart.options.chart.type; // eslint-disable-line

        if (options.title) {
            if (!xAxisHorizontal(chart.chartType)) {
                options.title.style.width = `${chart.chartHeight - chartTextPadding}px`; // eslint-disable-line
            } else {
                options.title.style.width = `${chart.plotWidth}px`; // eslint-disable-line
            }
        }
        proceed.call(this, chart, options);
    });
};

const extendReflowChart = (Highcharts, chartTextPadding) => {
    Highcharts.wrap(Highcharts.Chart.prototype, 'reflow', function(proceed, resizeEvent) { // eslint-disable-line
        const chart = this;

        Highcharts.each(chart.xAxis, axis => {
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
        Highcharts.each(chart.yAxis, axis => {
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

export function initChartPlugins(Highcharts, chartTextPadding) {
    extendInitChart(Highcharts, chartTextPadding);
    extendInitAxis(Highcharts, chartTextPadding);
    extendReflowChart(Highcharts, chartTextPadding);
    autohideLabels(Highcharts);
}
