import React from 'react';

import Catalogue from '../containers/Catalogue';
import EditorHeader from './EditorHeader';
import EditorMain from './EditorMain';

export default function(props) {
    return (
        <div className="adi-editor">
            <EditorHeader {...props} />
            <Catalogue />
            <EditorMain {...props}/>
        </div>
    );
}
