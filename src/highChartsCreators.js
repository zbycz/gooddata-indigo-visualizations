// Copyright (C) 2007-2016, GoodData(R) Corporation. All rights reserved.
/* eslint-disable no-use-before-define */
import get from 'lodash/get';
import merge from 'lodash/merge';
import partial from 'lodash/partial';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';
import cloneDeep from 'lodash/cloneDeep';
import every from 'lodash/every';

import {
    stripColors,
    numberFormat
} from 'gdc-numberjs/lib/number';

// import Status from '../utils/status';
//
// import './plugins/legend_render_plugin';

export const DEFAULT_SERIES_LIMIT = 1000;
export const DEFAULT_CATEGORIES_LIMIT = 365;
export const EMPTY_DATA = { categories: [], series: [] };

const CONFIG_TEMPLATE = {
    credits: {
        enabled: false
    },
    title: {
        // setting title to empty string prevents it from being shown
        text: ''
    },
    series: [],
    legend: {
        align: 'right',
        verticalAlign: 'top',
        floating: false,
        x: -10,
        y: -15,
        symbolPadding: 0,
        symbolWidth: 14,
        itemStyle: {
            paddingTop: '2px',
            paddingBottom: '5px',
            font: '12px Avenir, "Helvetica Neue", Arial, sans-serif',
            color: '#6D7680',
            textDecoration: 'none',
            textOverflow: 'ellipsis',
            cursr: 'default'
        },
        itemHoverStyle: {
            color: '#6D7680',
            cursor: 'default'
        },
        borderRadius: 0,
        borderWidth: 0
    },
    yAxis: {
        gridLineColor: '#ebebeb',
        labels: {
            style: {
                color: '#94a1ad',
                font: '12px Avenir, "Helvetica Neue", Arial, sans-serif'
            }
        },
        title: {
            margin: 20,
            style: {
                color: '#6D7680',
                font: '14px Avenir, "Helvetica Neue", Arial, sans-serif'
            }
        }
    },
    xAxis: {
        lineColor: '#d5d5d5',

        // hide ticks on x axis
        minorTickLength: 0,
        tickLength: 0,

        // padding of maximum value
        maxPadding: 0.05,

        labels: {
            style: {
                color: '#94a1ad',
                font: '12px Avenir, "Helvetica Neue", Arial, sans-serif'
            }
        },
        title: {
            margin: 20,
            style: {
                color: '#6D7680',
                font: '14px Avenir, "Helvetica Neue", Arial, sans-serif'
            }
        }
    },
    plotOptions: {
        series: {
            enableMouseTracking: true, // !Status.exportMode,
            turboThreshold: DEFAULT_CATEGORIES_LIMIT
        }
    }
};

export const DEFAULT_COLOR_PALETTE = [
    'rgba(7,1,2, 0.4)',
    'rgba(77,133,255, 0.4)',
    'rgba(57,191,73, 0.4)',
    'rgba(255,159,0, 0.4)',
    'rgba(213,60,56, 0.4)',
    'rgba(137,77,148, 0.4)'
];

export function getCommonChartConfiguration() { // chartOptions) {
    return merge({}, CONFIG_TEMPLATE); // TODO create config
}


const LINE_WIDTH = 3;

const LINE_LEGEND_OPTIONS = {
    horizontal: {
        enabled: true,
        layout: 'horizontal'
    },
    vertical: {
        enabled: true,
        layout: 'vertical',
        width: 140,
        itemWidth: 140,
        itemStyle: {
            width: 120
        }
    }
};

const cancelLegendItemClick = {
    legendItemClick: () => false
};

const escapeAngleBrackets = str => str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');


const LINE_CONFIG_TEMPLATE = {
    plotOptions: {
        series: {
            marker: {
                symbol: 'circle',
                radius: 4.5
            },
            lineWidth: LINE_WIDTH,
            fillOpacity: 0.3,
            states: {
                hover: {
                    lineWidth: LINE_WIDTH
                }
            },
            dataLabels: {
                style: {
                    fontWeight: 'normal'
                }
            }
        },
        column: {
            events: cancelLegendItemClick,
            dataLabels: {}
        },
        bar: {
            events: cancelLegendItemClick
        },
        line: {
            events: cancelLegendItemClick
        }
    },
    xAxis: {
        categories: [],
        labels: {
            autoRotation: [-90]
        }
    },
    yAxis: {
        stackLabels: {
            enabled: true
        }
    }
};

const MAX_POINT_WIDTH = 100;

const COLUMN_CONFIG_TEMPLATE = {
    chart: {
        type: 'column'
    },
    plotOptions: {
        column: {
            dataLabels: { enabled: true, crop: false, overflow: 'none' },
            maxPointWidth: MAX_POINT_WIDTH
        },
        series: {
            states: {
                hover: {
                    enabled: false
                }
            }
        }
    }
};

function getStackingConfiguration(chartOptions) {
    var stacking = chartOptions.stacking;

    return stacking ? {
        plotOptions: {
            series: {
                stacking
            }
        },
        yAxis: {
            stackLabels: {
                formatter: stackLabelFormatter
            }
        }
    } : {};
}

function getTitleConfiguration(chartOptions) {
    return {
        yAxis: {
            title: {
                text: get(chartOptions, 'title.y', '')
            }
        },
        xAxis: {
            title: {
                text: get(chartOptions, 'title.x', '')
            }
        }
    };
}

function getShowInPercentConfiguration(chartOptions) {
    var showInPercent = chartOptions.showInPercent;

    return showInPercent ? {
        yAxis: {
            labels: {
                formatter: formatAsPercent
            }
        }
    } : {};
}

function getTooltipConfiguration(chartOptions) {
    var tooltipAction = get(chartOptions, 'actions.tooltip'),
        chartType = chartOptions.type;

    return tooltipAction ? {
        tooltip: {
            borderWidth: 0,
            borderRadius: 0,
            shadow: false,
            useHTML: true,
            positioner: partial(positionTooltip, chartType),
            formatter: partial(formatTooltip, tooltipAction)
        }
    } : {};
}

function getLabelsConfiguration(chartOptions) {
    return {
        plotOptions: {
            bar: {
                dataLabels: {
                    formatter: labelFormatter
                }
            },
            column: {
                dataLabels: {
                    formatter: labelFormatter
                }
            }
        },
        yAxis: {
            defaultFormat: get(chartOptions, 'title.yFormat')
        }
    };
}


function getSeries(series, colorPalette = []) {
    return series.map((seriesItem, index) => {
        const item = cloneDeep(seriesItem);
        item.color = colorPalette[index % colorPalette.length];
        // Escaping is handled by highcharts so we don't want to provide escaped input.
        // With one exception, though. Highcharts supports defining styles via
        // for example <b>...</b> and parses that from series name.
        // So to avoid this parsing, escape only < and > to &lt; and &gt;
        // which is understood by highcharts correctly
        item.name = item.name && escapeAngleBrackets(item.name);

        return item;
    });
}

function getDataConfiguration(chartOptions) {
    var data = chartOptions.data || EMPTY_DATA,
        series = getSeries(data.series, chartOptions.colorPalette);

    return {
        series,
        xAxis: {
            labels: {
                enabled: !isEmpty(compact(data.categories))
            },
            categories: data.categories
        }
    };
}

function getLegendConfiguration(chartOptions) {
    var stacking = chartOptions.stacking,
        seriesLength = get(chartOptions, 'data.series', []).length;

    if (seriesLength <= 1 && !stacking) {
        return {
            legend: {
                enabled: false
            }
        };
    }

    return {
        legend: LINE_LEGEND_OPTIONS[chartOptions.legendLayout]
    };
}

function formatAsPercent() {
    return parseFloat((this.value * 100).toPrecision(14)) + '%';
}

function positionTooltip(chartType, boxWidth, boxHeight, _point) {
    // point.source requires patched highcharts
    // used to correctly position tooltip above bars in bar chart
    const originalPoint = _point.source,
        point = cloneDeep(_point);

    if (originalPoint && originalPoint.shapeType === 'rect') {
        if (chartType === 'bar') {
            point.plotY = this.chart.plotHeight -
            (originalPoint.shapeArgs.x + originalPoint.shapeArgs.width / 2);
        } else {
            point.plotX = originalPoint.shapeArgs.x + originalPoint.shapeArgs.width / 2;
        }
    }

    return {
        x: this.chart.plotLeft + point.plotX - boxWidth / 2,
        // point size + tooltip arrow
        y: this.chart.plotTop + point.plotY - boxHeight - 14
    };
}

function formatTooltip(tooltipCallback) {
    // when brushing, do not show tooltip
    if (this.series.chart.mouseIsDown) {
        return false;
    }

    return '<div class="hc-tooltip"><div class="content">' +
        tooltipCallback(this.point) +
        '</div><div class="tail1"></div><div class="tail2"></div>';
}

function _labelFormatter(value, format) {
    // no labels for missing values
    if (value === null) {
        return null;
    }

    var stripped = stripColors(format || '');
    return String(numberFormat(value, stripped));
}
function labelFormatter() {
    return _labelFormatter(this.y, get(this, 'point.format'));
}

// check whether series contains only positive values, not consider nulls
function hasOnlyPositiveValues(series, x) {
    return every(series, function(seriesItem) {
        var dataPoint = seriesItem.yData[x];
        return dataPoint !== null && dataPoint >= 0;
    });
}


function stackLabelFormatter() {
    // show labels: always for negative,
    // without negative values or with non-zero total for positive
    var showStackLabel =
        this.isNegative || hasOnlyPositiveValues(this.axis.series, this.x) || this.total !== 0;
    return showStackLabel ?
        _labelFormatter(this.total, get(this, 'axis.userOptions.defaultFormat')) : null;
}

export function getLineChartConfiguration(chartOptions) {
    let configurators = [
        getCommonChartConfiguration,
        getTitleConfiguration,
        getStackingConfiguration,
        getShowInPercentConfiguration,
        getTooltipConfiguration,
        getLabelsConfiguration,
        getDataConfiguration,
        getLegendConfiguration
    ];

    let commonData = configurators.reduce((config, configurator) => {
        return merge(config, configurator(chartOptions));
    }, {});

    return merge({}, LINE_CONFIG_TEMPLATE, commonData);
}

export function getColumnChartConfiguration(chartOptions) {
    var lineData = getLineChartConfiguration(chartOptions);
    return merge({}, COLUMN_CONFIG_TEMPLATE, lineData);
}

export function isDataOfReasonableSize(chartData) {
    return chartData.series.length <= DEFAULT_SERIES_LIMIT &&
        chartData.categories.length <= DEFAULT_CATEGORIES_LIMIT;
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
