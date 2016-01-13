import '../styles/dashboard';
import '../styles/dashboard_edit';
import React, { Component } from 'react';
import CataloguePanel from './CataloguePanel.jsx';
import EditorHeader from './EditorHeader.jsx';
import EditorMain from './EditorMain.jsx';

export default class Editor extends Component {
    render() {
        return (
            <div className="adi-editor">
                <EditorHeader />
                <CataloguePanel />
                <EditorMain />
            </div>
        );
    }
}
