import React from 'react';
import IntlWrapper from './IntlWrapper';

const GEMINI_SCREENSHOT_CLASS = 'gemini-screenshot';

export function screenshotWrap(component) {
    return (
        <div className={GEMINI_SCREENSHOT_CLASS}>{component}</div>
    );
}

export function wrap(component, height = 600, width = 600) {
    return (
        <IntlWrapper>
            <div style={{ height, width, border: '1px solid pink', margin: 10 }}>
                {component}
            </div>
        </IntlWrapper>
    );
}
