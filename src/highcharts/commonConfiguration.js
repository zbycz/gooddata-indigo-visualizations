import cloneDeep from 'lodash/cloneDeep';

export const DEFAULT_SERIES_LIMIT = 1000;
export const DEFAULT_CATEGORIES_LIMIT = 365;
export const MAX_POINT_WIDTH = 100;

const BASE_TEMPLATE = {
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

export function getCommonConfiguration() {
    return cloneDeep(BASE_TEMPLATE);
}
