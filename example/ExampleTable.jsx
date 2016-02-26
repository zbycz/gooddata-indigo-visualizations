import React from 'react';

import DefaultSizeVisualization from './DefaultSizeVisualization';

export default function ExampleTable(ComposedVisualization) {
    return props => {
        return (
            <div>
                <h2>Table</h2>

                <DefaultSizeVisualization>
                    <ComposedVisualization {...props} />
                </DefaultSizeVisualization>
            </div>
        );
    };
}
