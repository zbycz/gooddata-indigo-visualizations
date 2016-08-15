import React from 'react';

import DefaultSizeVisualization from './DefaultSizeVisualization';

export default function ExampleTable(ComposedVisualization) {
    const onSortChange = (...args) => console.log('Table sorted', args); // eslint-disable-line
    return props => {
        return (
            <div>
                <h2>Table</h2>

                <DefaultSizeVisualization>
                    <ComposedVisualization
                        {...props}
                        onSortChange={onSortChange}
                    />
                </DefaultSizeVisualization>
            </div>
        );
    };
}
