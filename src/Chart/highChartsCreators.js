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
import { getPieConfiguration } from './highcharts/pieConfiguration';

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

export function getPieChartConfiguration(chartOptions) {
    return merge({},
        getCommonConfiguration(),
        getPieConfiguration(),
        getCustomizedConfiguration(chartOptions)
    );
}
