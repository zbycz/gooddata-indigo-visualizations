import cloneDeep from 'lodash/cloneDeep';

const LINE_WIDTH = 3;

const cancelLegendItemClick = {
    legendItemClick: () => false
};

const LINE_TEMPLATE = {
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

export function getLineConfiguration() {
    return cloneDeep(LINE_TEMPLATE);
}
