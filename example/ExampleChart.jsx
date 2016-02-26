import React from 'react';

import DefaultSizeVisualization from './DefaultSizeVisualization';
import SourceListing from './SourceListing';

export default function ExampleChart(ComposedVisualization) {
    return props => {
        return (
            <div className="indigo-component">
                <h2>Chart</h2>

                <DefaultSizeVisualization>
                    <ComposedVisualization {...props} />
                </DefaultSizeVisualization>

                <h3>Chart Options</h3>
                <SourceListing>
                    {JSON.stringify(props.chartOptions, null, 2)}
                </SourceListing>

                <h3>Highcharts Options</h3>
                <SourceListing>
                    {JSON.stringify(props.hcOptions, null, 2)}
                </SourceListing>
            </div>
        );
    };
}
