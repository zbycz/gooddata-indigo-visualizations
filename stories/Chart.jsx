import React from 'react';
import { storiesOf } from '@kadira/storybook';

import LineFamilyChartTransformation from '../src/Chart/LineFamilyChartTransformation';
import { FLUID_LEGEND_THRESHOLD } from '../src/Chart/Legend/Legend';
import * as TestConfig from './test_data/test_config';
import * as TestData from './test_data/test_data';
import IntlWrapper from './utils/IntlWrapper';
import wrap from './utils/wrap';
import { createMock } from './utils/mockGenerator';

import barChartWithPagedLegend from './test_data/bar_chart_with_paged_legend';

import '../src/styles/charts.scss';

function createLineChart(legendPosition) {
    const mock = createMock('line', [
        {
            title: 'x',
            fn: x => x
        }, {
            title: '2x',
            fn: x => 2 * x
        }, {
            title: 'x^2',
            fn: x => x * x
        }, {
            title: 'log(x)',
            fn: x => Math.log(x)
        }
    ], 20);

    return (
        <LineFamilyChartTransformation
            config={{
                ...mock.config,
                legend: {
                    enabled: true,
                    position: legendPosition,
                    responsive: false
                }
            }}
            data={mock.data}
        />
    );
}

storiesOf('Chart')
    .add('Legend positions', () => {
        return (
            <div>
                {wrap(createLineChart('top'))}
                {wrap(createLineChart('bottom'))}
                {wrap(createLineChart('left'))}
                {wrap(createLineChart('right'))}
            </div>
        );
    })
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
    .add('Responsive width', () => (
        <IntlWrapper>
            <div>
                <div style={{ height: 500, width: '100%', marginBottom: 30, border: '1px solid pink' }}>
                    {createLineChart('top')}
                </div>
                <div style={{ height: 500, width: '100%', marginBottom: 30, border: '1px solid pink' }}>
                    {createLineChart('bottom')}
                </div>
                <div style={{ height: 500, width: '100%', marginBottom: 30, border: '1px solid pink' }}>
                    {createLineChart('left')}
                </div>
                <div style={{ height: 500, width: '100%', marginBottom: 30, border: '1px solid pink' }}>
                    {createLineChart('right')}
                </div>
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
                            enabled: false
                        }
                    }}
                    data={TestData.stackedBar}
                />
            </div>
        </IntlWrapper>
    ));
