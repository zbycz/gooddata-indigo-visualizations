import React from 'react';

import Editor from './Editor';

export default function(props) {
    return (
        <div className="adi-dashboard">
            <Editor {...props}/>
        </div>
    );
}
