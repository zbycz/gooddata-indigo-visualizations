import merge from 'lodash/merge';
import get from 'lodash/get';
import {
    DEFAULT_SERIES_LIMIT,
    DEFAULT_CATEGORIES_LIMIT,
    getCommonConfiguration
} from './highcharts/commonConfiguration';

import { getLineConfiguration } from './highcharts/lineConfiguration';
import { getBarConfiguration } from './highcharts/barConfiguration';
import { getColumnConfiguration } from './highcharts/columnConfiguration';
import { getCustomizedConfiguration } from './highcharts/customConfiguration';

// import Status from '../utils/status';
//
// import './plugins/legend_render_plugin';

export function getLineChartConfiguration(chartOptions) {
    return merge({},
        getCommonConfiguration(),
        getLineConfiguration(),
        getCustomizedConfiguration(chartOptions)
    );
}

export function getColumnChartConfiguration(chartOptions) {
    return merge({},
        getCommonConfiguration(),
        getColumnConfiguration(),
        getCustomizedConfiguration(chartOptions)
    );
}

export function getBarChartConfiguration(chartOptions) {
    return merge({},
        getCommonConfiguration(),
        getBarConfiguration(),
        getCustomizedConfiguration(chartOptions)
    );
}

export function isDataOfReasonableSize(chartData, limits) {
    const seriesLimit = get(limits, 'series', DEFAULT_SERIES_LIMIT);
    const categoriesLimit = get(limits, 'categories', DEFAULT_CATEGORIES_LIMIT);

    return chartData.series.length <= seriesLimit &&
        chartData.categories.length <= categoriesLimit;
}

// Setting legend:
// ======
// #<{(|*
//     * Set legend symbol for highcharts series, override drawLegendSymbol fn.
//     * Use highcharts-approved symbols only and series names only
//     * Note: pass opacity for legend items if needed,
//     *       due to different fill opacities in configurations
//     * @param {String} seriesName series for which the legend symbol should be drawn
//                      (Highcharts.seriesTypes)
//     * @param {String} symbolName symbol name to be used to render in legend
//                      (use highcharts-supported)
//     * @param {Number} [opacity] opacity to be used, defaults to 0.6
//     |)}>#
// function setLegendSymbol(hc, seriesName, symbolName, opacity) {
//     hc.seriesTypes[seriesName].prototype.drawLegendSymbol = function(legend) {
//         var legendOptions = legend.options,
//             legendSymbol,
//             renderer = this.chart.renderer,
//             legendItemGroup = this.legendGroup,
//             _RENAME_ME_ = renderer.fontMetrics(legendOptions.itemStyle.fontSize).b,
//             verticalCenter = legend.baseline - Math.round(_RENAME_ME_ * 0.3),
//             radius = 4;
//         this.legendSymbol = legendSymbol = renderer.symbol(
//             symbolName,
//             0,
//             verticalCenter - radius,
//             2 * radius,
//             2 * radius
//         )
//         .add(legendItemGroup);
//         legendSymbol.isMarker = true;
//         legendSymbol.attr({
//             opacity: opacity === undefined ? 0.6 : opacity
//         });
//     };
//     // TODO return legendSymbol
// }
//
// Checking for errors:
// =====
// isDataOfReasonableSize(seriesValues) {
//     return !(this.hasTooManySeries(seriesValues) || this.hasSeriesOverThreshold(seriesValues));
// }
//
// hasTooManySeries(seriesValues) {
//     return seriesValues.length >= DEFAULT_SERIES_LIMIT;
// }
//
// hasSeriesOverThreshold(seriesValues) {
//     // should match with turboThreshold set in config template
//     var pointsPerSerieThreshold = this.configurationTemplate.plotOptions.series.turboThreshold;
//
//     return seriesValues.some(function(seriesItem) {
//         return seriesItem.data.length >= pointsPerSerieThreshold;
//     });
// }
//
// #<{(|*
//     * Checks if the passed data is of a reasonable size.
//     * If not, call error action and return false. Otherwise return true.
//     * @param {Array} seriesValues data series that should be rendered in the chart
//     * @return {Boolean} true if the data meets size requirements, otherwise false
//     |)}>#
// checkDataStatus(seriesValues) {
//     if (this.isDataOfReasonableSize(seriesValues)) {
//         return true;
//     }
//
//     var onError = _.get(this, 'chartOptions.actions.error');
//     if (onError) {
//         onError('DATA_LARGE');
//     }
//
//     return false;
// }
// usage:
// =====
// export const EMPTY_DATA = { categories: [], series: [] };
// var data = chartOptions.data || EMPTY_DATA;
//
// if (!this.checkDataStatus(data.series)) {
