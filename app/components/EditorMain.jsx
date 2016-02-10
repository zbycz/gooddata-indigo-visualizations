import React, { Component } from 'react';

import Buckets from '../containers/Buckets';

export default class EditorMain extends Component {
    static propTypes = {
        log: React.PropTypes.func
    };

    render() {
        return (
            <div className="adi-editor-main">
                <Buckets log={this.props.log}/>
            </div>
        );
    }
}
