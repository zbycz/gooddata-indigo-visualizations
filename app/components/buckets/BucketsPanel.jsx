import React, { Component } from 'react';
import { List } from 'immutable';

import Bucket from './Bucket';

export default class BucketsPanel extends Component {
    static propTypes = {
        buckets: React.PropTypes.object,
        catalogue: React.PropTypes.object,
        onToggleCollapse: React.PropTypes.func,
        onShowBubble: React.PropTypes.func
    };

    static defaultProps = {
        buckets: List()
    };

    render() {
        let props = this.props;
        return (
            <div className="adi-bucket-list">
                {props.buckets.map(bucket =>
                    bucket.get('enabled') ?
                        <Bucket {...props} key={bucket.get('keyName')} bucket={bucket} /> : false
                )}
            </div>
        );
    }
}
