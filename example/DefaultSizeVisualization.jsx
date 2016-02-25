import React from 'react';

export default function DefaultSizeVisualization(props) {
    return (
        <div style={{ width: 640, height: 480 }}>
            {props.children}
        </div>
    );
}
