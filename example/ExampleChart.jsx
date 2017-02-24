import React, { PropTypes } from 'react';

import DefaultSizeVisualization from './DefaultSizeVisualization';
import SourceListing from './SourceListing';

export default function ExampleChart(ComposedVisualization) {
    const component = (props) => {
        return (
            <div className="indigo-component">
                <h2>Chart</h2>

                <DefaultSizeVisualization>
                    <ComposedVisualization {...props} />
                </DefaultSizeVisualization>

                <div className="flex-row">
                    <div className="flex-half">
                        <h3>Chart Options</h3>
                        <SourceListing>
                            {JSON.stringify(props.chartOptions, null, 2)}
                        </SourceListing>
                    </div>

                    <div className="flex-half">
                        <h3>Highcharts Options</h3>
                        <SourceListing>
                            {JSON.stringify(props.hcOptions, null, 2)}
                        </SourceListing>
                    </div>
                </div>
            </div>
        );
    };

    component.propTypes = {
        chartOptions: PropTypes.object.isRequired,
        hcOptions: PropTypes.object.isRequired
    };

    return component;
}
