import React from 'react';

export default function SourceListing(props) {
    let style = {
        width: 1024,
        maxHeight: 300,
        overflow: 'scroll',
        backgroundColor: '#f7f7f7',
        border: '1px solid #d8d8d8'
    };

    return (
        <pre style={style}>{props.children}</pre>
    );
}
