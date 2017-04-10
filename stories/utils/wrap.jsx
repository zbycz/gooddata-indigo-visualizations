import React from 'react';
import IntlWrapper from './IntlWrapper';

export default function wrap(component, height = 600, width = 600) {
    return (
        <IntlWrapper>
            <div style={{ height, width, border: '1px solid pink', margin: 10 }}>
                {component}
            </div>
        </IntlWrapper>
    );
}
