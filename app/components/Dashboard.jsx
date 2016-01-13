import '../styles/dashboard';
import '../styles/dashboard_edit';
import React, { Component } from 'react';
import Editor from './Editor.jsx';

export default class Dashboard extends Component {
    render() {
        return (
            <div className="adi-dashboard">
                <Editor />
            </div>
        );
    }
}
