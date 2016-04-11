import merge from 'lodash/merge';
import get from 'lodash/get';
import map from 'lodash/map';
import partial from 'lodash/partial';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';
import cloneDeep from 'lodash/cloneDeep';
import every from 'lodash/every';

import {
    stripColors,
    numberFormat
} from 'gdc-numberjs/lib/number';

const LEGEND_OPTIONS = {
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

const EMPTY_DATA = { categories: [], series: [] };

export const DEFAULT_COLOR_PALETTE = [
    'rgba(7,1,2, 0.4)',
    'rgba(77,133,255, 0.4)',
    'rgba(57,191,73, 0.4)',
    'rgba(255,159,0, 0.4)',
    'rgba(213,60,56, 0.4)',
    'rgba(137,77,148, 0.4)'
];

const escapeAngleBrackets = str => str && str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

function getTitleConfiguration(chartOptions) {
    return {
        yAxis: {
            title: {
                text: escapeAngleBrackets(get(chartOptions, 'title.y', ''))
            }
        },
        xAxis: {
            title: {
                text: escapeAngleBrackets(get(chartOptions, 'title.x', ''))
            }
        }
    };
}

function formatAsPercent() {
    return parseFloat((this.value * 100).toPrecision(14)) + '%';
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

function positionTooltip(chartType, boxWidth, boxHeight, _point) {
    // point.source requires patched highcharts
    // used to correctly position tooltip above bars in bar chart
    //
    // const originalPoint = _point.source;
    const point = cloneDeep(_point);

    // if (originalPoint && originalPoint.shapeType === 'rect') {
    //     if (chartType === 'bar') {
    //         point.plotY = this.chart.plotHeight -
    //         (originalPoint.shapeArgs.x + originalPoint.shapeArgs.width / 2);
    //     } else {
    //         point.plotX = originalPoint.shapeArgs.x + originalPoint.shapeArgs.width / 2;
    //     }
    // }

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
                enabled: true,
                formatter: stackLabelFormatter
            }
        }
    } : {};
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
        series = getSeries(data.series, chartOptions.colorPalette),
        categories = map(data.categories, escapeAngleBrackets);

    return {
        series,
        xAxis: {
            labels: {
                enabled: !isEmpty(compact(categories))
            },
            categories
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
        legend: LEGEND_OPTIONS[chartOptions.legendLayout]
    };
}

export function getCustomizedConfiguration(chartOptions) {
    const configurators = [
        getTitleConfiguration,
        getStackingConfiguration,
        getShowInPercentConfiguration,
        getLabelsConfiguration,
        getDataConfiguration,
        getLegendConfiguration,
        getTooltipConfiguration
    ];

    const commonData = configurators.reduce((config, configurator) => {
        return merge(config, configurator(chartOptions));
    }, {});

    return merge({}, commonData);
}
