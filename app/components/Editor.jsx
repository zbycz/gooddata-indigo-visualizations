import React from 'react';

import Catalogue from '../containers/Catalogue';
import EditorHeader from './EditorHeader';
import EditorMain from './EditorMain';

export default function() {
    return (
        <div className="adi-editor">
            <EditorHeader {...this.props} />
            <Catalogue />
            <EditorMain {...this.props}/>
        </div>
    );
}
