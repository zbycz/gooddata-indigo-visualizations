import React from 'react';

export default function DefaultSizeVisualization(props) {
    return (
        <div style={{ width: 640 }}>
            {props.children}
        </div>
    );
}
