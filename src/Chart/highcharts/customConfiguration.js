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
    const val = parseFloat((this.value * 100).toPrecision(14));
    return `${val}%`;
}

function getShowInPercentConfiguration(chartOptions) {
    const showInPercent = chartOptions.showInPercent;

    return showInPercent ? {
        yAxis: {
            labels: {
                formatter: formatAsPercent
            }
        }
    } : {};
}

const TOOLTIP_MAX_WIDTH = 366;
const TOOLTIP_OFFSET = 23;

const alignTooltip = ({ pointX, boxWidth = 0, chartWidth }) => {
    const minX = -TOOLTIP_OFFSET;
    const maxX = chartWidth + TOOLTIP_OFFSET;

    if ((pointX + TOOLTIP_MAX_WIDTH) / 2 > maxX && (pointX - TOOLTIP_MAX_WIDTH) > minX) {
        return {
            align: 'right',
            x: (pointX - boxWidth) + TOOLTIP_OFFSET
        };
    }

    if ((pointX - TOOLTIP_MAX_WIDTH) / 2 < minX && (pointX + TOOLTIP_MAX_WIDTH) < maxX) {
        return {
            align: 'left',
            x: pointX - TOOLTIP_OFFSET
        };
    }

    return {
        align: 'center',
        x: pointX - (boxWidth / 2)
    };
};

function positionTooltip(chartType, boxWidth, boxHeight, _point) {
    const { x } = alignTooltip(
        {
            pointX: _point.plotX,
            boxWidth,
            chartWidth: this.chart.plotWidth
        }
    );

    return {
        x: this.chart.plotLeft + x,
        // point size + tooltip arrow
        y: (this.chart.plotTop + _point.plotY) - (boxHeight + 14)
    };
}

function formatTooltip(chartType, tooltipCallback) {
    const { chart } = this.series;

    // when brushing, do not show tooltip
    if (chart.mouseIsDown) {
        return false;
    }

    const { align } = alignTooltip(
        {
            // with bar charts, the plotX property doesn't seem to give us the right value
            pointX: chartType !== 'bar' ? this.point.plotX : this.point.tooltipPos[0],
            chartWidth: chart.plotWidth
        }
    );

    return (
        `<div class="hc-tooltip">
            <div class="content">
                ${tooltipCallback(this.point)}
            </div>
            <div class="tail1 ${align}"></div>
            <div class="tail2 ${align}"></div>
        </div>`
    );
}

function formatLabel(value, format) {
    // no labels for missing values
    if (value === null) {
        return null;
    }

    const stripped = stripColors(format || '');
    return escapeAngleBrackets(String(numberFormat(value, stripped)));
}

function labelFormatter() {
    return formatLabel(this.y, get(this, 'point.format'));
}

// check whether series contains only positive values, not consider nulls
function hasOnlyPositiveValues(series, x) {
    return every(series, (seriesItem) => {
        const dataPoint = seriesItem.yData[x];
        return dataPoint !== null && dataPoint >= 0;
    });
}

function stackLabelFormatter() {
    // show labels: always for negative,
    // without negative values or with non-zero total for positive
    const showStackLabel =
        this.isNegative || hasOnlyPositiveValues(this.axis.series, this.x) || this.total !== 0;
    return showStackLabel ?
        formatLabel(this.total, get(this, 'axis.userOptions.defaultFormat')) : null;
}
function getTooltipConfiguration(chartOptions) {
    const tooltipAction = get(chartOptions, 'actions.tooltip');
    const chartType = chartOptions.type;

    return tooltipAction ? {
        tooltip: {
            borderWidth: 0,
            borderRadius: 0,
            shadow: false,
            useHTML: true,
            positioner: partial(positionTooltip, chartType),
            formatter: partial(formatTooltip, chartType, tooltipAction)
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
    const stacking = chartOptions.stacking;

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
    const data = chartOptions.data || EMPTY_DATA;
    const series = getSeries(data.series, chartOptions.colorPalette);
    const categories = map(data.categories, escapeAngleBrackets);

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
    const stacking = chartOptions.stacking;
    const seriesLength = get(chartOptions, 'data.series', []).length;

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

function getZoomableConfiguration(chartOptions) {
    return chartOptions.zoomable ? {
        chart: {
            zoomType: 'x'
        }
    } : {};
}

export function getCustomizedConfiguration(chartOptions) {
    const configurators = [
        getTitleConfiguration,
        getStackingConfiguration,
        getShowInPercentConfiguration,
        getLabelsConfiguration,
        getDataConfiguration,
        getLegendConfiguration,
        getTooltipConfiguration,
        getZoomableConfiguration
    ];

    const commonData = configurators.reduce((config, configurator) => {
        return merge(config, configurator(chartOptions));
    }, {});

    return merge({}, commonData);
}
