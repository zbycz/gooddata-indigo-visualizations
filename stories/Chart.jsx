import React from 'react';
import { storiesOf } from '@kadira/storybook';

import LineFamilyChartTransformation from '../src/Chart/LineFamilyChartTransformation';
import { FLUID_LEGEND_THRESHOLD } from '../src/Chart/Legend/Legend';
import * as TestConfig from './test_data/test_config';
import * as TestData from './test_data/test_data';
import IntlWrapper from './utils/IntlWrapper';
import wrap from './utils/wrap';

import barChartWithPagedLegend from './test_data/bar_chart_with_paged_legend';

import '../src/styles/charts.scss';

storiesOf('Chart')
    .add('Legend top', () => (
        wrap(
            <LineFamilyChartTransformation
                config={{
                    ...TestConfig.barChart2Series,
                    legend: {
                        enabled: true,
                        position: 'top',
                        responsive: false
                    }
                }}
                data={TestData.barChart2Series}
            />
        )
    ))
    .add('Legend bottom', () => (
        wrap(
            <LineFamilyChartTransformation
                config={{
                    ...TestConfig.barChart2Series,
                    legend: {
                        enabled: true,
                        position: 'bottom',
                        responsive: false
                    }
                }}
                data={TestData.barChart2Series}
            />
        )
    ))
    .add('Legend left', () => (
        wrap(
            <LineFamilyChartTransformation
                config={{
                    ...TestConfig.barChart2Series,
                    legend: {
                        enabled: true,
                        position: 'left',
                        responsive: false
                    }
                }}
                data={TestData.barChart2Series}
            />
        )
    ))
    .add('Legend right', () => (
        wrap(
            <LineFamilyChartTransformation
                config={{
                    ...TestConfig.barChart2Series,
                    legend: {
                        enabled: true,
                        position: 'right',
                        responsive: false
                    }
                }}
                data={TestData.barChart2Series}
            />
        )
    ))
    .add('Legend right with paging', () => (
        wrap(
            <LineFamilyChartTransformation
                config={{
                    ...barChartWithPagedLegend.config,
                    legend: {
                        enabled: true,
                        position: 'right',
                        responsive: false
                    }
                }}
                data={barChartWithPagedLegend.data}
            />
        )
    ))
    .add('Legend with mobile paging', () => (
        <IntlWrapper>
            <div>
                Resize window to {FLUID_LEGEND_THRESHOLD}px or less
                <div style={{ minHeight: '300px', width: '100%', border: '1px solid pink' }}>
                    <LineFamilyChartTransformation
                        config={{
                            ...barChartWithPagedLegend.config,
                            legend: {
                                enabled: true,
                                position: 'right',
                                responsive: true
                            }
                        }}
                        height={300}
                        data={barChartWithPagedLegend.data}
                    />
                </div>
            </div>
        </IntlWrapper>
    ))
    .add('Custom color pallete', () => (
        wrap(
            <LineFamilyChartTransformation
                config={{
                    ...TestConfig.barChart2Series,
                    legend: {
                        enabled: false
                    },
                    colors: [
                        '#980F5F',
                        '#872D62',
                        '#69525F',
                        '#764361',
                        '#A50061'
                    ]
                }}
                data={TestData.barChart2Series}
            />
        )
    ))
    .add('Fill parent', () => (
        <IntlWrapper>
            <div style={{ height: 500, width: '100%' }}>
                <LineFamilyChartTransformation
                    config={{
                        ...TestConfig.barChart2Series,
                        legend: {
                            enabled: true,
                            position: 'right',
                            responsive: false
                        }
                    }}
                    data={TestData.barChart2Series}
                />
            </div>
        </IntlWrapper>
    ))
    .add('Fill parent without legend', () => (
        <IntlWrapper>
            <div style={{ height: 500, width: '100%' }}>
                <LineFamilyChartTransformation
                    config={{
                        ...TestConfig.stackedBar,
                        legend: {
                            enabled: true
                        }
                    }}
                    data={TestData.stackedBar}
                />
            </div>
        </IntlWrapper>
    ));
